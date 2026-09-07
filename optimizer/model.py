"""
CP-SAT mathematical optimization model for Arnav's Railway Maintenance Optimizer.
Formulates exact constraints:
- C001 (Duration / Multi-block)
- C002 (Train conflict prevention)
- C003 (Infrastructure availability)
- C004 (Team availability & staffing)
- C005 (Deadlines)
- C006 (Bundling compatibility)
- C007 (Block simultaneous capacity)
- S001 (Single placement)
- S007 (Global team non-overlap)
- S008 (Minimum overlap)
- S009 (Maximum combined duration)
- S010 (Bundling eligibility)
"""

from typing import Dict, List, Set, Tuple, Optional
from ortools.sat.python import cp_model
from optimizer.data_loader import Task, DatasetBundle, Team
from optimizer.candidate_generation import CandidatePlacement
from optimizer.bundling import can_bundle_tasks, check_possession_sharing_compatibility
from optimizer.config import OptimizerConfig


class MaintenanceCPModel:
    """Encapsulates the CP-SAT model and decision variables."""

    def __init__(self, config: OptimizerConfig):
        self.config = config
        self.model = cp_model.CpModel()

        # Decision variables
        self.x: Dict[Tuple[str, str], cp_model.IntVar] = {}  # (task_id, cand_id) -> BoolVar
        self.u: Dict[str, cp_model.IntVar] = {}              # task_id -> BoolVar (deferred)
        self.y: Dict[Tuple[str, str, str], cp_model.IntVar] = {}  # (task_id, cand_id, team_id) -> BoolVar

        # Bundling indicator variables
        self.bundle_pairs: Dict[Tuple[str, str], cp_model.IntVar] = {}

        # Team interval tracking
        self.team_intervals: Dict[str, List[cp_model.IntervalVar]] = {}

        # Mappings for post-solve extraction
        self.cand_map: Dict[Tuple[str, str], CandidatePlacement] = {}
        self.task_map: Dict[str, Task] = {}

    def build_model(
        self,
        tasks: Dict[str, Task],
        candidates_by_task: Dict[str, List[CandidatePlacement]],
        bundle: DatasetBundle,
    ) -> None:
        """Constructs all decision variables and constraints."""
        self.task_map = tasks

        # Track block usages: block_id -> list of (task_id, cand_id)
        block_usage: Dict[str, List[Tuple[str, str]]] = {}

        # 1. Create task selection and candidate placement variables (S001)
        for tid, task in tasks.items():
            self.u[tid] = self.model.NewBoolVar(f"defer_{tid}")
            cands = candidates_by_task.get(tid, [])
            cand_vars: List[cp_model.IntVar] = []

            for cand in cands:
                key = (tid, cand.candidate_id)
                x_var = self.model.NewBoolVar(f"x_{tid}_{cand.candidate_id}")
                self.x[key] = x_var
                self.cand_map[key] = cand
                cand_vars.append(x_var)

                # Register block usages
                for bid in cand.block_ids:
                    block_usage.setdefault(bid, []).append(key)

                # Team assignment variables (C004, S005, S006, S007)
                duration = cand.execution_end_minute - cand.execution_start_minute
                for team_id in cand.eligible_teams:
                    team = bundle.teams[team_id]
                    y_key = (tid, cand.candidate_id, team_id)
                    y_var = self.model.NewBoolVar(f"y_{tid}_{cand.candidate_id}_{team_id}")
                    self.y[y_key] = y_var

                    # Team interval variable (optional, active only when y_var is true)
                    interval_var = self.model.NewOptionalIntervalVar(
                        cand.execution_start_minute,
                        duration,
                        cand.execution_end_minute,
                        y_var,
                        f"interval_{tid}_{team_id}",
                    )
                    self.team_intervals.setdefault(team_id, []).append(interval_var)

                # Staffing requirement: sum of assigned team capacity >= required_team_size
                # If any single team suffices:
                eligible_single = [m for m in cand.eligible_teams if bundle.teams[m].team_size >= task.required_team_size]
                if eligible_single:
                    # Exactly one qualified team is assigned if candidate is selected
                    self.model.Add(
                        sum(self.y[(tid, cand.candidate_id, m)] for m in eligible_single) == x_var
                    )
                else:
                    # Multi-team joint assignment
                    self.model.Add(
                        sum(
                            self.y[(tid, cand.candidate_id, m)] * bundle.teams[m].team_size
                            for m in cand.eligible_teams
                        ) >= task.required_team_size * x_var
                    )
                    for m in cand.eligible_teams:
                        self.model.Add(self.y[(tid, cand.candidate_id, m)] <= x_var)

            # Single placement constraint: exactly one candidate placement OR deferred (S001)
            self.model.Add(sum(cand_vars) + self.u[tid] == 1)

        # 2. Block simultaneous task capacity constraints (C007)
        for bid, placement_keys in block_usage.items():
            block = bundle.blocks[bid]
            max_simult = block.max_simultaneous_tasks
            self.model.Add(sum(self.x[k] for k in placement_keys) <= max_simult)

        # 3. Bundling compatibility & minimum overlap constraints (C006, S008, S009, S010)
        # Check all pairs of candidates contending for the same block
        for bid, placement_keys in block_usage.items():
            n = len(placement_keys)
            for i in range(n):
                k1 = placement_keys[i]
                t1 = tasks[k1[0]]
                c1 = self.cand_map[k1]

                for j in range(i + 1, n):
                    k2 = placement_keys[j]
                    if k1[0] == k2[0]:
                        # Same task in different candidates cannot be both chosen (handled by S001)
                        continue

                    t2 = tasks[k2[0]]
                    c2 = self.cand_map[k2]

                    is_compat, sharing_type, reason = check_possession_sharing_compatibility(
                        t1, c1, t2, c2, bundle,
                        default_min_overlap=self.config.default_min_overlap_minutes,
                        default_max_combined=self.config.default_max_combined_duration,
                    )

                    if not is_compat:
                        # Incompatible pair, can_bundle==No, or invalid partial overlap: at most one can be scheduled (C006, S008, S011)
                        self.model.Add(self.x[k1] + self.x[k2] <= 1)
                    elif sharing_type == "concurrent":
                        # Compatible concurrent pair: activate bundling synergy bonus variable (C012)
                        pair_key = tuple(sorted([k1[0], k2[0]]))
                        if pair_key not in self.bundle_pairs:
                            b_var = self.model.NewBoolVar(f"bundle_{pair_key[0]}_{pair_key[1]}")
                            self.bundle_pairs[pair_key] = b_var
                            self.model.Add(b_var <= self.x[k1])
                            self.model.Add(b_var <= self.x[k2])
                            self.model.Add(b_var >= self.x[k1] + self.x[k2] - 1)
                    # If sharing_type == "serial": both can run sequentially without mutual exclusion

        # 4. Global team non-overlap constraints (S007)
        for team_id, intervals in self.team_intervals.items():
            if len(intervals) > 1:
                self.model.AddNoOverlap(intervals)
