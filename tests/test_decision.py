"""
Unit tests for Ritvik's DecisionEngine.
"""

from ritvik.data_loader import ScheduledMaintenance, TrainMovement
from ritvik.conflict_detector import ConflictReport
from ritvik.rerouting import RerouteResult
from ritvik.decision import DecisionEngine


def get_mock_maint():
    return ScheduledMaintenance(
        task_id="TASK-001",
        asset_id="AST-001",
        department="Track",
        corridor_id="COR-01",
        section_id="SEC-0004",
        date="2026-09-07",
        start_minute=100,
        end_minute=300,
        duration_minutes=200,
        block_ids=["BLK-01", "BLK-02"],
        assigned_teams=["TEAM-01"],
    )


def test_decision_case1_plan_approved():
    maint = get_mock_maint()
    conflict_report = ConflictReport(
        has_conflict=False,
        conflict_type="NONE",
        maintenance_task=maint,
    )

    decision = DecisionEngine.evaluate(maint, conflict_report, [])
    assert decision.status == "PLAN_APPROVED"
    assert decision.maintenance_plan_valid is True
    assert decision.replanning_required is False
    assert len(decision.train_actions) == 0


def test_decision_case2_operational_update():
    maint = get_mock_maint()
    conflict_report = ConflictReport(
        has_conflict=True,
        conflict_type="NEW_TRAIN_CONFLICT",
        maintenance_task=maint,
        conflicting_trains=[TrainMovement("TRN-01", "Exp", "COR-01", "SEC-0004", "2026-09-07", 120, 160)],
    )

    reroute_res = [
        RerouteResult(
            train_id="TRN-01",
            original_route=["SEC-0004"],
            alternative_route=["SEC-0004", "SEC-0007", "SEC-0009"],
            route_found=True,
            route_cost=20.0,
            reason="Feasible bypass found",
        )
    ]

    decision = DecisionEngine.evaluate(maint, conflict_report, reroute_res)
    assert decision.status == "OPERATIONAL_UPDATE"
    assert decision.maintenance_plan_valid is True
    assert decision.replanning_required is False
    assert len(decision.train_actions) == 1
    assert decision.train_actions[0].train_id == "TRN-01"
    assert decision.train_actions[0].action == "REROUTED"
    assert decision.train_actions[0].new_route == ["SEC-0004", "SEC-0007", "SEC-0009"]


def test_decision_case3_replan_request_reroute_failed():
    maint = get_mock_maint()
    conflict_report = ConflictReport(
        has_conflict=True,
        conflict_type="NEW_TRAIN_CONFLICT",
        maintenance_task=maint,
        conflicting_trains=[TrainMovement("TRN-01", "Exp", "COR-01", "SEC-0004", "2026-09-07", 120, 160)],
    )

    reroute_res = [
        RerouteResult(
            train_id="TRN-01",
            original_route=["SEC-0004"],
            alternative_route=None,
            route_found=False,
            route_cost=0.0,
            reason="Capacity exhausted on all bypass routes",
        )
    ]

    decision = DecisionEngine.evaluate(maint, conflict_report, reroute_res)
    assert decision.status == "REPLAN_REQUEST"
    assert decision.maintenance_plan_valid is False
    assert decision.replanning_required is True
    assert decision.replan_reason == "NEW_TRAIN_CONFLICT"
    assert decision.replan_request_file == "replan_request.json"


def test_decision_case4_replan_request_block_unavailable():
    maint = get_mock_maint()
    conflict_report = ConflictReport(
        has_conflict=True,
        conflict_type="BLOCK_UNAVAILABLE",
        maintenance_task=maint,
        affected_blocks=["BLK-01"],
        details="Emergency rail fracture",
    )

    decision = DecisionEngine.evaluate(maint, conflict_report, [])
    assert decision.status == "REPLAN_REQUEST"
    assert decision.maintenance_plan_valid is False
    assert decision.replanning_required is True
    assert decision.replan_reason == "BLOCK_UNAVAILABLE"
