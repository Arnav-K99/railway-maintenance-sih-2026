"""
Integration and validation tests for Ritvik's Operations Engine.
"""

from pathlib import Path
from ritvik.config import RitvikConfig
from ritvik.engine import RitvikEngine
from ritvik.validator import validate_operational_decision, validate_replan_request_file
from ritvik.data_loader import OperationalEvent


def test_ritvik_engine_initialization():
    config = RitvikConfig()
    engine = RitvikEngine(config)
    engine.initialize()

    assert len(engine.maintenance_plan) > 0
    assert len(engine.topology) > 0
    assert len(engine.events) > 0
    assert "TASK-000005" in engine.maintenance_plan


def test_scenario_a_rerouting_success(tmp_path):
    config = RitvikConfig(
        output_decision_path=tmp_path / "ritvik_operational_decision.json",
        replan_request_path=tmp_path / "replan_request.json",
    )
    engine = RitvikEngine(config)
    engine.initialize()

    # EVT-001: TRN-SIM-001 in SEC-0004 between min 70-95 on 2026-09-07
    evt_001 = next(e for e in engine.events if e.event_id == "EVT-001")

    # Give SEC-0007 sufficient capacity so bypass path is clear
    config.section_capacities["SEC-0007"] = 8
    # Restrict SEC-0005 so candidate 1 is rejected and candidate 2 selected
    config.section_capacities["SEC-0005"] = 0

    res = engine.process_scenario("TASK-000005", [evt_001], write_outputs=True)
    decision = res["decision"]

    assert decision.status == "OPERATIONAL_UPDATE"
    assert decision.maintenance_plan_valid is True
    assert decision.replanning_required is False
    assert len(decision.train_actions) == 1
    assert decision.train_actions[0].train_id == "TRN-SIM-001"
    assert decision.train_actions[0].action == "REROUTED"

    # Independent validation check
    val_report = validate_operational_decision(decision, engine.topology)
    assert val_report.is_valid is True
    assert len(val_report.violations) == 0


def test_scenario_b_replanning_required_all_routes_blocked(tmp_path):
    config = RitvikConfig(
        output_decision_path=tmp_path / "ritvik_operational_decision.json",
        replan_request_path=tmp_path / "replan_request.json",
    )
    engine = RitvikEngine(config)
    engine.initialize()

    # EVT-001 with all bypass sections having 0 capacity
    evt_001 = next(e for e in engine.events if e.event_id == "EVT-001")
    config.section_capacities["SEC-0005"] = 0
    config.section_capacities["SEC-0007"] = 0

    res = engine.process_scenario("TASK-000005", [evt_001], write_outputs=True)
    decision = res["decision"]

    assert decision.status == "REPLAN_REQUEST"
    assert decision.maintenance_plan_valid is False
    assert decision.replanning_required is True
    assert decision.replan_reason == "NEW_TRAIN_CONFLICT"

    # Validate replan request file on disk
    val_file = validate_replan_request_file(config.replan_request_path)
    assert val_file.is_valid is True
    assert len(val_file.violations) == 0


def test_scenario_b_replanning_required_block_unavailable(tmp_path):
    config = RitvikConfig(
        output_decision_path=tmp_path / "ritvik_operational_decision.json",
        replan_request_path=tmp_path / "replan_request.json",
    )
    engine = RitvikEngine(config)
    engine.initialize()

    # EVT-003: Physical block closure
    evt_003 = next(e for e in engine.events if e.event_id == "EVT-003")

    res = engine.process_scenario("TASK-000005", [evt_003], write_outputs=True)
    decision = res["decision"]

    assert decision.status == "REPLAN_REQUEST"
    assert decision.maintenance_plan_valid is False
    assert decision.replanning_required is True
    assert decision.replan_reason == "BLOCK_UNAVAILABLE"

    # Validate replan request file on disk
    val_file = validate_replan_request_file(config.replan_request_path)
    assert val_file.is_valid is True
    assert len(val_file.violations) == 0
