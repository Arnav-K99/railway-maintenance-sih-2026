"""
Unit tests for optimizer.priority
"""

from optimizer.data_loader import Task
from optimizer.config import OptimizerConfig
from optimizer.priority import compute_task_priority


def make_dummy_task(risk: float, task_date: str, deadline: str, delay_tol: int) -> Task:
    return Task(
        task_id="TEST-001",
        asset_id="AST-9999",
        department="Track / Civil Engineering",
        maintenance_type="Rail Inspection",
        corridor_id="COR-001",
        section_id="SEC-0001",
        task_date=task_date,
        deadline=deadline,
        risk_score=risk,
        risk_level="Critical" if risk > 80 else "Moderate",
        failure_probability_30d=risk / 100.0,
        forecast_30d_degradation=0.15,
        priority_score=50.0,
        required_duration_minutes=120,
        required_team_size=4,
        preferred_start_minute=60,
        max_delay_tolerance_minutes=delay_tol,
        can_bundle=True,
        source_task_date=task_date,
        source_deadline=deadline,
        source_risk="neev",
    )


def test_priority_scales_with_neev_risk():
    config = OptimizerConfig()
    t_low = make_dummy_task(risk=10.0, task_date="2026-09-03", deadline="2026-09-10", delay_tol=30)
    t_high = make_dummy_task(risk=90.0, task_date="2026-09-03", deadline="2026-09-10", delay_tol=30)

    p_low = compute_task_priority(t_low, config)
    p_high = compute_task_priority(t_high, config)

    assert p_high > p_low
    # Risk weight is 20.0, diff in risk is 80 -> diff in priority must be >= 1500
    assert (p_high - p_low) >= 1500.0


def test_priority_scales_with_deadline_urgency():
    config = OptimizerConfig()
    # Close deadline (1 day away) vs Far deadline (10 days away)
    t_urgent = make_dummy_task(risk=50.0, task_date="2026-09-03", deadline="2026-09-04", delay_tol=30)
    t_relaxed = make_dummy_task(risk=50.0, task_date="2026-09-03", deadline="2026-09-13", delay_tol=30)

    p_urgent = compute_task_priority(t_urgent, config)
    p_relaxed = compute_task_priority(t_relaxed, config)

    assert p_urgent > p_relaxed


def test_deadline_urgency_increases_as_planning_date_approaches():
    """Verifies that as the current planning date approaches deadline, urgency strictly increases."""
    config = OptimizerConfig()
    task = make_dummy_task(risk=60.0, task_date="2026-09-03", deadline="2026-09-07", delay_tol=30)

    # 4 days away
    p_day1 = compute_task_priority(task, config, current_date="2026-09-03")
    # 2 days away
    p_day3 = compute_task_priority(task, config, current_date="2026-09-05")
    # Deadline day (0 days away)
    p_deadline = compute_task_priority(task, config, current_date="2026-09-07")

    assert p_deadline > p_day3 > p_day1
    # Check monotonic progression
    assert p_deadline - p_day3 > 0
    assert p_day3 - p_day1 > 0
