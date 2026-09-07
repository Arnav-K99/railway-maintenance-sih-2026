"""
Unit tests for Ritvik's ReroutingEngine.
"""

from ritvik.config import RitvikConfig
from ritvik.capacity import CapacityEvaluator
from ritvik.rerouting import ReroutingEngine
from ritvik.data_loader import ScheduledMaintenance, TrainMovement, OperationalEvent


def test_find_all_paths_topology():
    topology = {
        "A": ["B", "C"],
        "B": ["D"],
        "C": ["D"],
        "D": [],
    }
    config = RitvikConfig()
    evaluator = CapacityEvaluator(config)
    engine = ReroutingEngine(topology, evaluator, config)

    paths = engine.find_all_paths("A", "D")
    assert len(paths) == 2
    assert ["A", "B", "D"] in paths
    assert ["A", "C", "D"] in paths


def test_search_alternative_route_feasible():
    topology = {
        "SEC-0004": ["SEC-0005", "SEC-0007"],
        "SEC-0005": ["SEC-0008"],
        "SEC-0007": ["SEC-0008"],
        "SEC-0008": [],
    }
    config = RitvikConfig()
    evaluator = CapacityEvaluator(config)
    engine = ReroutingEngine(topology, evaluator, config)

    train = TrainMovement(
        train_id="TRN-01",
        train_type="Express",
        corridor_id="COR-001",
        section_id="SEC-0004",
        date="2026-09-07",
        arrival_minute=100,
        departure_minute=130,
    )

    res = engine.search_alternative_route(
        train=train,
        conflict_section="SEC-0004",
        destination_section="SEC-0008",
        maintenance_plan={},
        existing_trains=[],
        events=[],
    )

    assert res.route_found is True
    assert res.alternative_route in (["SEC-0004", "SEC-0005", "SEC-0008"], ["SEC-0004", "SEC-0007", "SEC-0008"])
    assert res.route_cost > 0.0


def test_search_alternative_route_rejects_capacity_exhausted():
    topology = {
        "SEC-0004": ["SEC-0005", "SEC-0007"],
        "SEC-0005": ["SEC-0008"],
        "SEC-0007": ["SEC-0008"],
        "SEC-0008": [],
    }
    config = RitvikConfig()
    # Force SEC-0005 to have 0 capacity
    config.section_capacities["SEC-0005"] = 0
    config.section_capacities["SEC-0007"] = 6
    evaluator = CapacityEvaluator(config)
    engine = ReroutingEngine(topology, evaluator, config)

    train = TrainMovement(
        train_id="TRN-01",
        train_type="Express",
        corridor_id="COR-001",
        section_id="SEC-0004",
        date="2026-09-07",
        arrival_minute=100,
        departure_minute=130,
    )

    res = engine.search_alternative_route(
        train=train,
        conflict_section="SEC-0004",
        destination_section="SEC-0008",
        maintenance_plan={},
        existing_trains=[],
        events=[],
    )

    assert res.route_found is True
    # Must choose SEC-0007 branch since SEC-0005 is capacity exhausted
    assert res.alternative_route == ["SEC-0004", "SEC-0007", "SEC-0008"]


def test_search_alternative_route_rejects_maintenance_collision():
    topology = {
        "SEC-0004": ["SEC-0005"],
        "SEC-0005": ["SEC-0008"],
        "SEC-0008": [],
    }
    config = RitvikConfig()
    evaluator = CapacityEvaluator(config)
    engine = ReroutingEngine(topology, evaluator, config)

    train = TrainMovement(
        train_id="TRN-01",
        train_type="Express",
        corridor_id="COR-001",
        section_id="SEC-0004",
        date="2026-09-07",
        arrival_minute=100,
        departure_minute=130,
    )

    # Put maintenance on SEC-0005 overlapping the rerouted train's window (100+15 to 130+15 -> 115-145 min)
    maint_on_bypass = ScheduledMaintenance(
        task_id="TASK-BYPASS-01",
        asset_id="AST-BYPASS",
        department="Track",
        corridor_id="COR-001",
        section_id="SEC-0005",
        date="2026-09-07",
        start_minute=100,
        end_minute=200,
        duration_minutes=100,
        block_ids=["BLK-B1"],
        assigned_teams=["TEAM-B1"],
    )

    res = engine.search_alternative_route(
        train=train,
        conflict_section="SEC-0004",
        destination_section="SEC-0008",
        maintenance_plan={"TASK-BYPASS-01": maint_on_bypass},
        existing_trains=[],
        events=[],
    )

    # Since the only path passes through SEC-0005 which has maintenance, it must be rejected!
    assert res.route_found is False
    assert res.alternative_route is None
