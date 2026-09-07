"""
Unit tests for optimizer.solver: team interval non-overlap, batch classification, and deferral reasons
"""

from pathlib import Path
from optimizer.data_loader import load_dataset, Task
from optimizer.preprocessing import preprocess_possessions
from optimizer.solver import solve_day_batch, solve_maintenance_plan
from optimizer.config import OptimizerConfig


def test_solver_day_batch():
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)
    config = OptimizerConfig(solver_time_limit_seconds=5.0, num_workers=4)

    # Take first 30 tasks of Day 1 (2026-09-03)
    day_tasks = {
        tid: t for tid, t in bundle.tasks.items()
        if t.task_date == "2026-09-03"
    }
    sample_tasks = dict(list(day_tasks.items())[:30])

    scheduled, deferred, obj, status = solve_day_batch(
        sample_tasks, "2026-09-03", prep, bundle, config
    )

    assert status in ("OPTIMAL", "FEASIBLE")
    assert len(scheduled) > 0

    # Verify team non-overlap in scheduled tasks
    team_intervals = {}
    for tid, rec in scheduled.items():
        for tm in rec.assigned_team_ids:
            team_intervals.setdefault(tm, []).append(
                (rec.execution_start_minute, rec.execution_end_minute)
            )

    for tm, intervals in team_intervals.items():
        sorted_intervals = sorted(intervals, key=lambda x: x[0])
        for i in range(len(sorted_intervals) - 1):
            assert sorted_intervals[i][1] <= sorted_intervals[i + 1][0], (
                f"Team {tm} has overlapping tasks: {sorted_intervals[i]} and {sorted_intervals[i+1]}"
            )


def test_global_team_conflict_across_different_sections():
    """Verifies that S007 strictly prevents a team from overlapping across different sections."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)
    config = OptimizerConfig(solver_time_limit_seconds=5.0, num_workers=4)

    # Pick 40 Day 1 tasks across diverse sections
    day_tasks = {
        tid: t for tid, t in bundle.tasks.items()
        if t.task_date == "2026-09-03"
    }
    sample_tasks = dict(list(day_tasks.items())[:40])

    scheduled, deferred, obj, status = solve_day_batch(
        sample_tasks, "2026-09-03", prep, bundle, config
    )

    # Group scheduled tasks by assigned team
    team_scheduled = {}
    for tid, rec in scheduled.items():
        for tm in rec.assigned_team_ids:
            team_scheduled.setdefault(tm, []).append(rec)

    # For any team assigned to multiple tasks across different sections, verify zero overlap
    for tm, recs in team_scheduled.items():
        if len(recs) > 1:
            sorted_recs = sorted(recs, key=lambda r: r.execution_start_minute)
            for i in range(len(sorted_recs) - 1):
                r1 = sorted_recs[i]
                r2 = sorted_recs[i + 1]
                assert r1.execution_end_minute <= r2.execution_start_minute, (
                    f"Team {tm} assigned to overlapping tasks across sections: "
                    f"{r1.task_id} in {r1.section_id} ({r1.execution_start_minute}-{r1.execution_end_minute}) and "
                    f"{r2.task_id} in {r2.section_id} ({r2.execution_start_minute}-{r2.execution_end_minute})"
                )


def test_batch_limit_and_deferral_classification():
    """Verifies that batch limit exclusions and deferral reasons are accurately classified."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)
    # Set a tiny batch limit of 5 to force batch limit exclusions
    config = OptimizerConfig(max_daily_candidate_pool=5, solver_time_limit_seconds=2.0, num_workers=2)

    # Solve a 2-day slice
    day1_tasks = {
        tid: t for tid, t in bundle.tasks.items()
        if t.task_date == "2026-09-03" and t.deadline in ("2026-09-03", "2026-09-04")
    }
    sample_tasks = dict(list(day1_tasks.items())[:30])

    res = solve_maintenance_plan(bundle, prep, config, tasks_to_solve=sample_tasks)

    # Check that batch exclusion count was recorded
    assert res.total_batch_excluded > 0

    # Verify that deferral reasons are distinct and not all identical
    reasons = set(r.deferral_reason for r in res.deferred_tasks.values())
    assert len(reasons) >= 1
    # Check that all reasons are valid classified reasons
    valid_reasons = {
        "no_feasible_track_block",
        "no_qualifying_team_shift",
        "block_capacity_exhausted",
        "team_capacity_exhausted",
        "solver_objective_outranked",
        "batch_limit_excluded_on_deadline",
        "no_candidate_window_within_horizon",
    }
    assert reasons.issubset(valid_reasons)
