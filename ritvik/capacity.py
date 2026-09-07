"""
Capacity analysis engine for Ritvik.
Evaluates section movement capacity, active train load, and throughput headroom
for proposed train rerouting and new operational movements.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any

from ritvik.config import RitvikConfig
from ritvik.data_loader import TrainMovement, OperationalEvent


@dataclass
class CapacityAnalysis:
    section_id: str
    capacity: int
    current_movements: int
    new_movements: int
    remaining_capacity: int
    additional_movement_feasible: bool
    details: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "section_id": self.section_id,
            "capacity": self.capacity,
            "current_movements": self.current_movements,
            "new_movements": self.new_movements,
            "remaining_capacity": self.remaining_capacity,
            "additional_movement_feasible": self.additional_movement_feasible,
            "details": self.details,
        }


class CapacityEvaluator:
    """Evaluates section throughput capacity and determines headroom for additional movements."""

    def __init__(self, config: RitvikConfig):
        self.config = config

    def get_section_capacity(self, section_id: str, events: Optional[List[OperationalEvent]] = None, date: Optional[str] = None) -> int:
        """Computes current effective capacity for a section, including dynamic event adjustments."""
        base_cap = self.config.section_capacities.get(section_id, self.config.default_section_capacity)
        if not events:
            return base_cap

        delta = 0
        for evt in events:
            if evt.section_id == section_id and (date is None or evt.date == date):
                if evt.event_type in {"CAPACITY_INCREASE", "CAPACITY_REDUCTION"} and evt.capacity_delta is not None:
                    delta += evt.capacity_delta

        return max(0, base_cap + delta)

    def evaluate_section_capacity(
        self,
        section_id: str,
        date: str,
        start_minute: int,
        end_minute: int,
        existing_trains: List[TrainMovement],
        events: List[OperationalEvent],
        additional_movements_needed: int = 1,
        time_buffer_minutes: int = 60,
    ) -> CapacityAnalysis:
        """
        Calculates current train movements in the section during the given time window,
        determines remaining capacity, and decides whether additional movements are feasible.
        """
        effective_capacity = self.get_section_capacity(section_id, events, date)

        w_start = max(0, start_minute - time_buffer_minutes)
        w_end = min(1440, end_minute + time_buffer_minutes)

        # Count active baseline trains in this window
        baseline_count = 0
        for tr in existing_trains:
            if tr.section_id == section_id and tr.date == date:
                if tr.departure_minute > w_start and tr.arrival_minute < w_end:
                    baseline_count += 1

        # Count event-introduced trains
        event_train_count = 0
        for evt in events:
            if evt.event_type in {"NEW_TRAIN", "TRAIN_REROUTED"}:
                if evt.section_id == section_id and evt.date == date:
                    if evt.arrival_minute is not None and evt.departure_minute is not None:
                        if evt.departure_minute > w_start and evt.arrival_minute < w_end:
                            event_train_count += 1

        current_movements = baseline_count + event_train_count
        remaining_capacity = max(0, effective_capacity - current_movements)
        feasible = remaining_capacity >= additional_movements_needed

        if not feasible:
            details = f"Capacity exhausted on {section_id}: {current_movements}/{effective_capacity} slots occupied, needs {additional_movements_needed} slots"
        else:
            details = f"Capacity sufficient on {section_id}: {remaining_capacity}/{effective_capacity} slots remaining"

        return CapacityAnalysis(
            section_id=section_id,
            capacity=effective_capacity,
            current_movements=current_movements,
            new_movements=additional_movements_needed,
            remaining_capacity=remaining_capacity,
            additional_movement_feasible=feasible,
            details=details,
        )
