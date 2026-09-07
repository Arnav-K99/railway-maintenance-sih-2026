"""
Route feasibility search and train rerouting engine for Ritvik.
Explores the route topology graph using BFS / shortest path search, validating
edge connectivity, section capacities, and absence of secondary maintenance collisions.
"""

from collections import deque
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any

from ritvik.config import RitvikConfig
from ritvik.capacity import CapacityEvaluator
from ritvik.data_loader import ScheduledMaintenance, TrainMovement, OperationalEvent


@dataclass
class RerouteCandidate:
    path: List[str]
    feasible: bool
    rejection_reason: Optional[str] = None
    route_cost: float = 0.0


@dataclass
class RerouteResult:
    train_id: str
    original_route: List[str]
    alternative_route: Optional[List[str]]
    route_found: bool
    route_cost: float
    reason: str
    inspected_candidates: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "train_id": self.train_id,
            "original_route": self.original_route,
            "alternative_route": self.alternative_route,
            "route_found": self.route_found,
            "route_cost": self.route_cost,
            "reason": self.reason,
            "inspected_candidates": self.inspected_candidates,
        }


class ReroutingEngine:
    """Performs graph search over topology to find conflict-free, capacity-compliant bypass routes."""

    def __init__(self, topology: Dict[str, List[str]], capacity_evaluator: CapacityEvaluator, config: RitvikConfig):
        self.topology = topology
        self.capacity_evaluator = capacity_evaluator
        self.config = config

    def find_all_paths(
        self,
        start_section: str,
        end_section: str,
        max_depth: int = 5,
    ) -> List[List[str]]:
        """Finds all simple paths from start_section to end_section within max_depth hops."""
        paths: List[List[str]] = []
        queue: deque = deque([[start_section]])

        while queue:
            current_path = queue.popleft()
            last_node = current_path[-1]

            if last_node == end_section:
                paths.append(current_path)
                continue

            if len(current_path) > max_depth:
                continue

            for neighbor in self.topology.get(last_node, []):
                if neighbor not in current_path:  # Prevent cycles
                    queue.append(current_path + [neighbor])

        return paths

    def search_alternative_route(
        self,
        train: TrainMovement,
        conflict_section: str,
        destination_section: Optional[str],
        maintenance_plan: Dict[str, ScheduledMaintenance],
        existing_trains: List[TrainMovement],
        events: List[OperationalEvent],
    ) -> RerouteResult:
        """
        Searches for a feasible alternative route that bypasses the conflict.
        If destination_section is not specified, searches for paths to endpoints of the topology.
        """
        # Determine destination section
        dest = destination_section
        if not dest or dest == conflict_section:
            # Look for topology sinks reachable from conflict_section
            reachable = self.topology.get(conflict_section, [])
            if not reachable:
                return RerouteResult(
                    train_id=train.train_id,
                    original_route=[conflict_section],
                    alternative_route=None,
                    route_found=False,
                    route_cost=0.0,
                    reason=f"No outgoing topological edges from conflict section {conflict_section}",
                )
            dest = reachable[0]

        # Find all topological paths from conflict_section to dest
        candidate_paths = self.find_all_paths(conflict_section, dest, max_depth=self.config.max_search_depth)

        # Also search paths bypassing conflict_section if alternate feeder exists
        # E.g., if there are multiple branches from conflict_section
        inspected: List[Dict[str, Any]] = []
        feasible_candidates: List[Tuple[List[str], float]] = []

        for path in candidate_paths:
            # 1. Verify topology edge connectivity strictly (no invented routes)
            is_valid_graph = True
            for i in range(len(path) - 1):
                u, v = path[i], path[i + 1]
                if v not in self.topology.get(u, []):
                    is_valid_graph = False
                    break

            if not is_valid_graph:
                inspected.append({
                    "path": " -> ".join(path),
                    "status": "REJECTED",
                    "reason": "Topological invalidity: edges do not exist in route_topology.json"
                })
                continue

            # 2. Check capacity on each bypass section in path (excluding origin where train already is)
            capacity_ok = True
            rejection_reason = None
            for hop_idx, sec in enumerate(path[1:], start=1):
                # Estimated arrival/departure window on subsequent hops
                hop_arr = train.arrival_minute + (hop_idx * self.config.reroute_time_penalty_per_hop_minutes)
                hop_dep = train.departure_minute + (hop_idx * self.config.reroute_time_penalty_per_hop_minutes)

                cap_analysis = self.capacity_evaluator.evaluate_section_capacity(
                    section_id=sec,
                    date=train.date,
                    start_minute=hop_arr,
                    end_minute=hop_dep,
                    existing_trains=existing_trains,
                    events=events,
                    additional_movements_needed=1,
                )
                if not cap_analysis.additional_movement_feasible:
                    capacity_ok = False
                    rejection_reason = f"Capacity exhausted on {sec} ({cap_analysis.current_movements}/{cap_analysis.capacity} slots occupied)"
                    break

            if not capacity_ok:
                inspected.append({
                    "path": " -> ".join(path),
                    "status": "REJECTED",
                    "reason": rejection_reason,
                })
                continue

            # 3. Check for secondary maintenance collisions on bypass sections
            maintenance_ok = True
            for hop_idx, sec in enumerate(path[1:], start=1):
                hop_arr = train.arrival_minute + (hop_idx * self.config.reroute_time_penalty_per_hop_minutes)
                hop_dep = train.departure_minute + (hop_idx * self.config.reroute_time_penalty_per_hop_minutes)

                for m_id, m in maintenance_plan.items():
                    if m.section_id == sec and m.date == train.date:
                        if hop_dep > m.start_minute and hop_arr < m.end_minute:
                            maintenance_ok = False
                            rejection_reason = f"Collides with scheduled maintenance {m_id} on section {sec} ({m.start_minute}-{m.end_minute} min)"
                            break
                if not maintenance_ok:
                    break

            if not maintenance_ok:
                inspected.append({
                    "path": " -> ".join(path),
                    "status": "REJECTED",
                    "reason": rejection_reason,
                })
                continue

            # 4. Check for physical block closures on bypass sections
            block_closure_ok = True
            for sec in path[1:]:
                for evt in events:
                    if evt.event_type == "BLOCK_UNAVAILABLE" and evt.date == train.date:
                        if evt.section_id == sec:
                            block_closure_ok = False
                            rejection_reason = f"Section {sec} has active block closure ({evt.block_id or sec})"
                            break
                if not block_closure_ok:
                    break

            if not block_closure_ok:
                inspected.append({
                    "path": " -> ".join(path),
                    "status": "REJECTED",
                    "reason": rejection_reason,
                })
                continue

            # Route is feasible! Compute cost
            hops = len(path) - 1
            cost = hops * 10.0 + (hops * self.config.reroute_time_penalty_per_hop_minutes)
            feasible_candidates.append((path, cost))
            inspected.append({
                "path": " -> ".join(path),
                "status": "FEASIBLE",
                "cost": cost,
                "reason": f"Feasible bypass ({hops} hops, capacity available, zero maintenance conflicts)"
            })

        if feasible_candidates:
            # Sort by lowest cost
            feasible_candidates.sort(key=lambda x: x[1])
            best_path, best_cost = feasible_candidates[0]
            return RerouteResult(
                train_id=train.train_id,
                original_route=[conflict_section],
                alternative_route=best_path,
                route_found=True,
                route_cost=best_cost,
                reason="Feasible alternative route found; bypasses maintenance conflict",
                inspected_candidates=inspected,
            )

        return RerouteResult(
            train_id=train.train_id,
            original_route=[conflict_section],
            alternative_route=None,
            route_found=False,
            route_cost=0.0,
            reason="All candidate bypass routes are infeasible due to capacity, secondary maintenance, or track closures",
            inspected_candidates=inspected,
        )
