"""
Unit tests for optimizer.data_loader and Neev integration
"""

from pathlib import Path
import pytest
import csv
from optimizer.data_loader import load_dataset, Task
from optimizer.preprocessing import preprocess_possessions


def test_load_authoritative_dataset():
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)

    assert len(bundle.tasks) == 30000
    assert len(bundle.blocks) == 33600
    assert len(bundle.teams) == 39
    assert len(bundle.trains) == 12000
    assert len(bundle.conflicts) == 12912
    assert len(bundle.bundling_rules) == 16  # 10 unique pairs, bidirectional indexing
    assert len(bundle.corridors_sections) == 200
    assert len(bundle.neev_predictions) == 30000
    assert len(bundle.trains_by_date_section) > 0


def test_task_types_and_bounds():
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)

    sample_task = bundle.tasks["TASK-000001"]
    assert sample_task.task_id == "TASK-000001"
    assert sample_task.asset_id.startswith("AST-")
    assert 0.0 <= sample_task.risk_score <= 100.0
    assert sample_task.risk_level.upper() in {"CRITICAL", "HIGH", "MEDIUM", "LOW"}
    assert 0.0 <= sample_task.failure_probability_30d <= 1.0
    assert sample_task.required_duration_minutes > 0
    assert sample_task.required_team_size > 0
    assert sample_task.deadline >= sample_task.task_date


def test_neev_join_1_to_1():
    """Verifies that 100% of tasks match 1:1 with Neev predictions on asset_id."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)

    assert len(bundle.tasks) == len(bundle.neev_predictions)
    for tid, task in list(bundle.tasks.items())[:100]:
        neev = bundle.neev_predictions[task.asset_id]
        assert task.risk_score == neev.risk_score
        assert task.risk_level == neev.risk_level
        assert task.failure_probability_30d == neev.failure_probability_30d


def test_missing_neev_prediction_raises_error(tmp_path):
    """Verifies that if any task has an asset_id missing from Neev predictions, validation fails."""
    # Create minimal mock directory with mismatched asset_id
    mock_dir = tmp_path / "mock_data"
    mock_dir.mkdir()

    # Write minimal corridors_sections
    with open(mock_dir / "corridors_sections.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["section_id", "corridor_id", "corridor_name", "section_name", "region"])
        w.writerow(["SEC-0001", "COR-001", "C1", "S1", "R1"])

    # Write bundling_rules
    with open(mock_dir / "bundling_rules.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["department_1", "department_2", "compatible", "max_combined_duration_minutes", "same_section_required", "minimum_overlap_minutes"])

    # Write teams
    with open(mock_dir / "teams.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["team_id", "department", "team_name", "team_size", "shift_start_minute", "shift_end_minute", "availability_percent"])

    # Write blocks
    with open(mock_dir / "blocks.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["block_id", "date", "corridor_id", "section_id", "start_minute", "end_minute", "duration_minutes", "track_available", "block_type", "night_preference", "max_simultaneous_tasks"])

    # Write trains
    with open(mock_dir / "trains.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["train_id", "train_type", "corridor_id", "section_id", "date", "arrival_minute", "departure_minute", "priority_class", "passenger_load_percent", "passenger_capacity", "delay_probability_percent", "scheduled_speed_kmph"])

    # Write train_block_conflicts
    with open(mock_dir / "train_block_conflicts.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["train_id", "block_id", "conflict_type", "priority_class", "passenger_load_percent"])

    # Write weather
    with open(mock_dir / "weather.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["date", "region", "rainfall_forecast_mm", "temperature_c", "humidity_percent"])

    # Write goods_forecast
    with open(mock_dir / "goods_forecast.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["date", "corridor_id", "corridor_name", "freight_demand_index", "expected_freight_trains"])

    # Write neev_predictions with AST-001
    with open(mock_dir / "neev_predictions_for_optimizer.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["observation_date", "asset_id", "department", "asset_type", "corridor_id", "section_id", "failure_probability_30d", "risk_score", "risk_level", "forecast_30d_degradation", "actual_failure_within_30d", "actual_degradation_30d"])
        w.writerow(["2026-09-03", "AST-001", "Track / Civil Engineering", "Rail", "COR-001", "SEC-0001", "0.85", "85.0", "Critical", "0.20", "1", "0.22"])

    # Write maintenance_tasks with UNKNOWN AST-999
    with open(mock_dir / "maintenance_tasks.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["task_id", "asset_id", "department", "maintenance_type", "corridor_id", "section_id", "task_date", "deadline", "risk_score", "priority_score", "required_duration_minutes", "required_team_size", "preferred_start_minute", "max_delay_tolerance_minutes", "can_bundle", "source_task_date", "source_deadline", "source_risk"])
        w.writerow(["TASK-001", "AST-999", "Track / Civil Engineering", "Rail", "COR-001", "SEC-0001", "2026-09-03", "2026-09-05", "85.0", "50.0", "60", "4", "0", "30", "Yes", "2026-09-03", "2026-09-05", "neev"])

    with pytest.raises(ValueError, match=r"\[NEEV JOIN ERROR\]"):
        load_dataset(mock_dir)


def test_passenger_impact_proxy_calculation():
    """Verifies that C008 passenger impact proxy produces meaningful non-zero scores during daytime train hours."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)

    # SEC-0001 on 2026-09-03 has Superfast TRN-05369 running near 701-706 min
    possessions = prep.possessions_by_date_section.get(("2026-09-03", "SEC-0001"), [])
    daytime_possessions = [p for p in possessions if 600 <= p.start_minute <= 840]

    assert len(daytime_possessions) > 0
    # Daytime possessions near TRN-05369 must have positive passenger impact
    assert any(p.passenger_impact > 0.0 for p in daytime_possessions)
