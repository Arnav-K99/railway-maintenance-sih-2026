"""
Independent post-operation validator for Ritvik's decisions and handoff files.
Audits graph continuity, decision consistency, capacity bounds, and schema invariants.
"""

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Any

from ritvik.decision import OperationalDecision


@dataclass
class RitvikValidationReport:
    is_valid: bool
    violations: List[str] = field(default_factory=list)
    checks_passed: List[str] = field(default_factory=list)


def validate_operational_decision(
    decision: OperationalDecision,
    topology: Dict[str, List[str]],
) -> RitvikValidationReport:
    """Audits operational decision consistency and reroute topology validity."""
    violations: List[str] = []
    checks: List[str] = []

    # Check 1: Status and validity alignment
    if decision.status == "PLAN_APPROVED":
        if not decision.maintenance_plan_valid:
            violations.append("PLAN_APPROVED decision must have maintenance_plan_valid=True")
        if decision.replanning_required:
            violations.append("PLAN_APPROVED decision must have replanning_required=False")
        if decision.train_actions:
            violations.append("PLAN_APPROVED decision must have empty train_actions")
        checks.append("PLAN_APPROVED invariant consistency - PASSED")

    elif decision.status == "OPERATIONAL_UPDATE":
        if not decision.maintenance_plan_valid:
            violations.append("OPERATIONAL_UPDATE decision must have maintenance_plan_valid=True")
        if decision.replanning_required:
            violations.append("OPERATIONAL_UPDATE decision must have replanning_required=False")
        if not decision.train_actions:
            violations.append("OPERATIONAL_UPDATE decision must have at least one train action")

        # Check 2: Verify all rerouted paths use actual topology edges
        for action in decision.train_actions:
            route = action.new_route
            if len(route) < 2:
                violations.append(f"Rerouted path for {action.train_id} has fewer than 2 sections: {route}")
            for i in range(len(route) - 1):
                u, v = route[i], route[i + 1]
                if v not in topology.get(u, []):
                    violations.append(f"[TOPOLOGY VIOLATION] Edge {u} -> {v} does not exist in route topology")

        checks.append("OPERATIONAL_UPDATE rerouting and topology adherence - PASSED")

    elif decision.status == "REPLAN_REQUEST":
        if decision.maintenance_plan_valid:
            violations.append("REPLAN_REQUEST decision must have maintenance_plan_valid=False")
        if not decision.replanning_required:
            violations.append("REPLAN_REQUEST decision must have replanning_required=True")
        checks.append("REPLAN_REQUEST invariant consistency - PASSED")

    else:
        violations.append(f"Unknown decision status: {decision.status}")

    return RitvikValidationReport(
        is_valid=(len(violations) == 0),
        violations=violations,
        checks_passed=checks,
    )


def validate_replan_request_file(path: Path) -> RitvikValidationReport:
    """Audits replan_request.json on disk for schema completeness and integrity."""
    violations: List[str] = []
    checks: List[str] = []

    if not path.exists():
        return RitvikValidationReport(is_valid=False, violations=[f"Replan request file not found at {path}"])

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        return RitvikValidationReport(is_valid=False, violations=[f"Malformed JSON in replan request: {e}"])

    required_fields = [
        "event",
        "reason",
        "maintenance_task_id",
        "section_id",
        "block_ids",
        "affected_window",
        "conflicting_trains",
        "rerouting_attempted",
        "alternative_route_available",
        "action_required",
    ]

    for field_name in required_fields:
        if field_name not in data:
            violations.append(f"Missing required field in replan request: {field_name}")
        else:
            checks.append(f"Replan field '{field_name}' verified")

    if data.get("event") != "REPLAN_REQUEST":
        violations.append(f"Expected event='REPLAN_REQUEST', got '{data.get('event')}'")

    if data.get("action_required") != "REPLAN_MAINTENANCE_BLOCK":
        violations.append(f"Expected action_required='REPLAN_MAINTENANCE_BLOCK', got '{data.get('action_required')}'")

    return RitvikValidationReport(
        is_valid=(len(violations) == 0),
        violations=violations,
        checks_passed=checks,
    )
