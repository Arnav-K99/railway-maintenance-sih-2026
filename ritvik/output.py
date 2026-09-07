"""
Output serialization module for Ritvik.
Generates ritvik_operational_decision.json (for Aditya) and replan_request.json (for Arnav).
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional

from ritvik.decision import OperationalDecision
from ritvik.conflict_detector import ConflictReport


def serialize_operational_decision(
    decision: OperationalDecision,
    output_path: Path,
) -> Path:
    """Serializes the operational decision for Aditya's backend / UI dashboard."""
    data = decision.to_dict()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    return output_path


def serialize_replan_request(
    decision: OperationalDecision,
    conflict_report: Optional[ConflictReport],
    output_path: Path,
) -> Path:
    """
    Serializes a targeted replan request for Arnav.
    Contains only the affected maintenance task, section, window, and conflicting trains.
    """
    start_time = "00:00"
    end_time = "00:00"
    conflicting_train_ids = []

    if conflict_report and conflict_report.overlap_window:
        s_m, e_m = conflict_report.overlap_window
        start_time = f"{s_m // 60:02d}:{s_m % 60:02d}"
        end_time = f"{e_m // 60:02d}:{e_m % 60:02d}"
        conflicting_train_ids = [t.train_id for t in conflict_report.conflicting_trains]

    data: Dict[str, Any] = {
        "event": "REPLAN_REQUEST",
        "reason": decision.replan_reason or "UNRESOLVED_OPERATIONAL_CONFLICT",
        "maintenance_task_id": decision.maintenance_task_id,
        "section_id": decision.section_id,
        "block_ids": decision.block_ids,
        "affected_window": {
            "start": start_time,
            "end": end_time,
        },
        "conflicting_trains": conflicting_train_ids,
        "rerouting_attempted": True,
        "alternative_route_available": False,
        "action_required": "REPLAN_MAINTENANCE_BLOCK",
        "notes": decision.details,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    return output_path
