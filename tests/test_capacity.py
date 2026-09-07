"""
Unit tests for Ritvik's CapacityEvaluator.
"""

from ritvik.config import RitvikConfig
from ritvik.capacity import CapacityEvaluator
from ritvik.data_loader import TrainMovement, OperationalEvent


def test_baseline_capacity_calculation():
    config = RitvikConfig()
    evaluator = CapacityEvaluator(config)

    # SEC-0004 configured capacity is 8
    cap = evaluator.get_section_capacity("SEC-0004")
    assert cap == 8


def test_capacity_adjustment_events():
    config = RitvikConfig()
    evaluator = CapacityEvaluator(config)

    # Base capacity is 8
    # Capacity reduction event: -3
    evt_reduce = OperationalEvent(
        event_id="EVT-CAP-01",
        event_type="CAPACITY_REDUCTION",
        section_id="SEC-0004",
        date="2026-09-07",
        capacity_delta=-3,
    )

    cap = evaluator.get_section_capacity("SEC-0004", events=[evt_reduce], date="2026-09-07")
    assert cap == 5

    # Capacity increase event: +2
    evt_increase = OperationalEvent(
        event_id="EVT-CAP-02",
        event_type="CAPACITY_INCREASE",
        section_id="SEC-0004",
        date="2026-09-07",
        capacity_delta=2,
    )
    cap_inc = evaluator.get_section_capacity("SEC-0004", events=[evt_increase], date="2026-09-07")
    assert cap_inc == 10


def test_evaluate_headroom_feasible():
    config = RitvikConfig()
    evaluator = CapacityEvaluator(config)

    # 2 baseline trains in window (capacity 8)
    trains = [
        TrainMovement("TRN-01", "Express", "COR-01", "SEC-0004", "2026-09-07", 100, 130),
        TrainMovement("TRN-02", "Express", "COR-01", "SEC-0004", "2026-09-07", 140, 170),
    ]

    res = evaluator.evaluate_section_capacity(
        section_id="SEC-0004",
        date="2026-09-07",
        start_minute=100,
        end_minute=200,
        existing_trains=trains,
        events=[],
        additional_movements_needed=1,
    )

    assert res.capacity == 8
    assert res.current_movements == 2
    assert res.remaining_capacity == 6
    assert res.additional_movement_feasible is True


def test_evaluate_capacity_exhausted():
    config = RitvikConfig()
    evaluator = CapacityEvaluator(config)

    # Section with capacity 2, but 2 trains already running
    config.section_capacities["SEC-TIGHT"] = 2
    evaluator = CapacityEvaluator(config)

    trains = [
        TrainMovement("TRN-01", "Express", "COR-01", "SEC-TIGHT", "2026-09-07", 100, 130),
        TrainMovement("TRN-02", "Express", "COR-01", "SEC-TIGHT", "2026-09-07", 120, 150),
    ]

    res = evaluator.evaluate_section_capacity(
        section_id="SEC-TIGHT",
        date="2026-09-07",
        start_minute=100,
        end_minute=200,
        existing_trains=trains,
        events=[],
        additional_movements_needed=1,
    )

    assert res.remaining_capacity == 0
    assert res.additional_movement_feasible is False
