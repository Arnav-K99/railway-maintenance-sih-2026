"""
Unit tests for optimizer.validator (Independent Post-Solve Validator)
"""

from pathlib import Path
import tempfile
import csv
from optimizer.data_loader import load_dataset
from optimizer.preprocessing import preprocess_possessions
from optimizer.solver import solve_day_batch, OptimizationResult, DeferredTaskRecord
from optimizer.output import write_optimization_outputs
from optimizer.validator import validate_schedule
from optimizer.config import OptimizerConfig
from optimizer.priority import compute_task_priority


def test_independent_validator_passes():
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)
    config = OptimizerConfig(solver_time_limit_seconds=10.0, num_workers=4)

    # Take first 25 tasks of Day 1
    sample_tasks = dict(list(bundle.tasks.items())[:25])

    scheduled, deferred_reasons, obj, status = solve_day_batch(
        sample_tasks, "2026-09-03", prep, bundle, config
    )

    deferred = {}
    for tid, t in sample_tasks.items():
        if tid not in scheduled:
            deferred[tid] = DeferredTaskRecord(
                task_id=tid,
                asset_id=t.asset_id,
                department=t.department,
                section_id=t.section_id,
                corridor_id=t.corridor_id,
                task_date=t.task_date,
                deadline=t.deadline,
                risk_score=t.risk_score,
                risk_level=t.risk_level,
                failure_probability_30d=t.failure_probability_30d,
                priority_score=compute_task_priority(t, config, current_date="2026-09-03"),
                required_duration_minutes=t.required_duration_minutes,
                required_team_size=t.required_team_size,
                deferral_reason=deferred_reasons.get(tid, "solver_objective_outranked"),
            )

    result = OptimizationResult(
        scheduled_tasks=scheduled,
        deferred_tasks=deferred,
        solver_status=status,
        wall_time_seconds=1.0,
        objective_value=obj,
        total_tasks_considered=len(sample_tasks),
        total_scheduled=len(scheduled),
        total_deferred=len(deferred),
    )

    with tempfile.TemporaryDirectory() as tmpdir:
        out_dir = Path(tmpdir)
        paths = write_optimization_outputs(result, config, out_dir)

        # Run independent validator on the files
        original_tasks = bundle.tasks
        try:
            bundle.tasks = sample_tasks
            report = validate_schedule(paths["csv"], paths["deferred"], bundle)
            assert report.is_valid is True
            assert len(report.violations) == 0
            assert len(report.checks_passed) > 0
        finally:
            bundle.tasks = original_tasks


def test_independent_validator_detects_corrupted_risk():
    """Verifies that if risk scores or fields in plan CSV do not match canonical Neev CSV, validator fails."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)
    config = OptimizerConfig(solver_time_limit_seconds=5.0, num_workers=2)

    sample_tasks = dict(list(bundle.tasks.items())[:10])
    scheduled, deferred_reasons, obj, status = solve_day_batch(
        sample_tasks, "2026-09-03", prep, bundle, config
    )

    deferred = {}
    for tid, t in sample_tasks.items():
        if tid not in scheduled:
            deferred[tid] = DeferredTaskRecord(
                task_id=tid,
                asset_id=t.asset_id,
                department=t.department,
                section_id=t.section_id,
                corridor_id=t.corridor_id,
                task_date=t.task_date,
                deadline=t.deadline,
                risk_score=t.risk_score,
                risk_level=t.risk_level,
                failure_probability_30d=t.failure_probability_30d,
                priority_score=compute_task_priority(t, config),
                required_duration_minutes=t.required_duration_minutes,
                required_team_size=t.required_team_size,
                deferral_reason=deferred_reasons.get(tid, "solver_objective_outranked"),
            )

    result = OptimizationResult(
        scheduled_tasks=scheduled,
        deferred_tasks=deferred,
        solver_status=status,
        wall_time_seconds=1.0,
        objective_value=obj,
        total_tasks_considered=len(sample_tasks),
        total_scheduled=len(scheduled),
        total_deferred=len(deferred),
    )

    with tempfile.TemporaryDirectory() as tmpdir:
        out_dir = Path(tmpdir)
        paths = write_optimization_outputs(result, config, out_dir)

        # Corrupt the risk score in the CSV
        rows = []
        with open(paths["csv"], "r", encoding="utf-8") as f:
            r = csv.DictReader(f)
            fieldnames = r.fieldnames
            for row in r:
                row["risk_score"] = "1.23"  # Artificial corruption
                rows.append(row)

        with open(paths["csv"], "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=fieldnames)
            w.writeheader()
            w.writerows(rows)

        original_tasks = bundle.tasks
        try:
            bundle.tasks = sample_tasks
            report = validate_schedule(paths["csv"], paths["deferred"], bundle)
            assert report.is_valid is False
            assert any("RISK VIOLATION" in v or "NEEV CONCORDANCE VIOLATION" in v for v in report.violations)
        finally:
            bundle.tasks = original_tasks
