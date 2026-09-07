"""
Decision engine for Ritvik.
Synthesizes conflict reports and rerouting feasibility results into one of three
canonical operational decisions: PLAN_APPROVED, OPERATIONAL_UPDATE, or REPLAN_REQUEST.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any

from ritvik.conflict_detector import ConflictReport
from ritvik.rerouting import RerouteResult
from ritvik.data_loader import ScheduledMaintenance


@dataclass
class TrainAction:
    train_id: str
    action: str  # "REROUTED"
    new_route: List[str]
    delay_estimate_minutes: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "train_id": self.train_id,
            "action": self.action,
            "new_route": self.new_route,
        }


@dataclass
class OperationalDecision:
    status: str  # "PLAN_APPROVED", "OPERATIONAL_UPDATE", "REPLAN_REQUEST"
    maintenance_plan_valid: bool
    maintenance_task_id: str
    section_id: str
    date: str
    block_ids: List[str]
    train_actions: List[TrainAction] = field(default_factory=list)
    replanning_required: bool = False
    replan_reason: Optional[str] = None
    replan_request_file: Optional[str] = None
    details: str = ""

    def to_dict(self) -> Dict[str, Any]:
        d: Dict[str, Any] = {
            "status": self.status,
            "maintenance_plan_valid": self.maintenance_plan_valid,
            "maintenance_task_id": self.maintenance_task_id,
            "block_ids": self.block_ids,
            "train_actions": [ta.to_dict() for ta in self.train_actions],
            "replanning_required": self.replanning_required,
        }
        if self.replanning_required and self.replan_request_file:
            d["replan_request_file"] = self.replan_request_file
        return d


class DecisionEngine:
    """Applies railway operational rules to formulate final dispatch and replanning decisions."""

    @staticmethod
    def evaluate(
        maint: ScheduledMaintenance,
        conflict_report: ConflictReport,
        reroute_results: List[RerouteResult],
    ) -> OperationalDecision:
        """
        Formulates operational decision based on the 4 core cases:
        - CASE 1: No conflict -> PLAN_APPROVED
        - CASE 2: Conflict resolved by train rerouting -> OPERATIONAL_UPDATE (plan valid)
        - CASE 3: Conflict exists, rerouting impossible -> REPLAN_REQUEST (plan invalid)
        - CASE 4: Block itself unavailable -> REPLAN_REQUEST (plan invalid)
        """
        # CASE 1: No conflict detected
        if not conflict_report.has_conflict:
            return OperationalDecision(
                status="PLAN_APPROVED",
                maintenance_plan_valid=True,
                maintenance_task_id=maint.task_id,
                section_id=maint.section_id,
                date=maint.date,
                block_ids=maint.block_ids,
                train_actions=[],
                replanning_required=False,
                details="Maintenance possession is safe to execute; zero conflicting train movements.",
            )

        # CASE 4: Block itself became unavailable
        if conflict_report.conflict_type == "BLOCK_UNAVAILABLE":
            return OperationalDecision(
                status="REPLAN_REQUEST",
                maintenance_plan_valid=False,
                maintenance_task_id=maint.task_id,
                section_id=maint.section_id,
                date=maint.date,
                block_ids=conflict_report.affected_blocks or maint.block_ids,
                train_actions=[],
                replanning_required=True,
                replan_reason="BLOCK_UNAVAILABLE",
                replan_request_file="replan_request.json",
                details=f"Track block physical closure: {conflict_report.details}",
            )

        # CASE 2 & 3: Train movement conflicts (NEW_TRAIN_CONFLICT / TRAIN_CONFLICT)
        if not reroute_results:
            return OperationalDecision(
                status="REPLAN_REQUEST",
                maintenance_plan_valid=False,
                maintenance_task_id=maint.task_id,
                section_id=maint.section_id,
                date=maint.date,
                block_ids=maint.block_ids,
                train_actions=[],
                replanning_required=True,
                replan_reason="NEW_TRAIN_CONFLICT",
                replan_request_file="replan_request.json",
                details="Conflicting train detected and no rerouting attempts were feasible.",
            )

        all_rerouted = all(r.route_found and r.alternative_route is not None for r in reroute_results)

        if all_rerouted:
            # CASE 2: All conflicting trains successfully rerouted
            actions = [
                TrainAction(
                    train_id=r.train_id,
                    action="REROUTED",
                    new_route=r.alternative_route,  # type: ignore
                    delay_estimate_minutes=int(r.route_cost),
                )
                for r in reroute_results
            ]
            return OperationalDecision(
                status="OPERATIONAL_UPDATE",
                maintenance_plan_valid=True,
                maintenance_task_id=maint.task_id,
                section_id=maint.section_id,
                date=maint.date,
                block_ids=maint.block_ids,
                train_actions=actions,
                replanning_required=False,
                details=f"Conflict resolved via train rerouting: {', '.join(a.train_id for a in actions)} diverted to alternate routes.",
            )
        else:
            # CASE 3: Rerouting failed for at least one conflicting train
            failed_trains = [r.train_id for r in reroute_results if not r.route_found]
            reasons = [r.reason for r in reroute_results if not r.route_found]
            return OperationalDecision(
                status="REPLAN_REQUEST",
                maintenance_plan_valid=False,
                maintenance_task_id=maint.task_id,
                section_id=maint.section_id,
                date=maint.date,
                block_ids=maint.block_ids,
                train_actions=[],
                replanning_required=True,
                replan_reason="NEW_TRAIN_CONFLICT",
                replan_request_file="replan_request.json",
                details=f"Rerouting failed for {', '.join(failed_trains)}: {'; '.join(reasons)}",
            )
