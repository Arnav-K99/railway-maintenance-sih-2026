"""
Unit tests for optimizer.bundling: concurrent vs serial possession sharing
"""

from pathlib import Path
from optimizer.data_loader import load_dataset, Task
from optimizer.candidate_generation import CandidatePlacement
from optimizer.bundling import check_possession_sharing_compatibility, can_bundle_tasks


def make_cand(start_m: int, end_m: int, task_id: str, team_id: str) -> CandidatePlacement:
    return CandidatePlacement(
        candidate_id=f"C_{task_id}_{start_m}_{end_m}",
        task_id=task_id,
        possession_id="POSS-1",
        date="2026-09-03",
        section_id="SEC-0001",
        corridor_id="COR-001",
        block_ids=("BLK-000001",),
        execution_start_minute=start_m,
        execution_end_minute=end_m,
        possession_start_minute=0,
        possession_end_minute=120,
        timing_offset_minutes=start_m,
        eligible_teams=(team_id,),
        is_night=False,
        freight_demand_index=1.0,
        passenger_impact=0.0,
    )


def make_task(tid: str, dept: str, dur: int, can_bundle: bool = True) -> Task:
    return Task(
        task_id=tid,
        asset_id=f"AST-{tid}",
        department=dept,
        maintenance_type="Inspection",
        corridor_id="COR-001",
        section_id="SEC-0001",
        task_date="2026-09-03",
        deadline="2026-09-05",
        risk_score=70.0,
        risk_level="High",
        failure_probability_30d=0.70,
        forecast_30d_degradation=0.15,
        priority_score=50.0,
        required_duration_minutes=dur,
        required_team_size=4,
        preferred_start_minute=0,
        max_delay_tolerance_minutes=30,
        can_bundle=can_bundle,
        source_task_date="2026-09-03",
        source_deadline="2026-09-05",
        source_risk="neev",
    )


def test_concurrent_30min_overlap_accepted():
    """30-minute overlap between compatible departments is accepted as concurrent."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)

    t_track = make_task("T1", "Track / Civil Engineering", 60)
    t_trd = make_task("T2", "Electrical / TRD", 60)

    # Overlap: [30, 60] -> exactly 30 minutes
    c1 = make_cand(0, 60, "T1", "TEAM-001")
    c2 = make_cand(30, 90, "T2", "TEAM-013")

    is_compat, stype, reason = check_possession_sharing_compatibility(t_track, c1, t_trd, c2, bundle)
    assert is_compat is True
    assert stype == "concurrent"
    assert reason is None


def test_concurrent_29min_overlap_rejected():
    """29-minute overlap between compatible departments is rejected as invalid partial overlap."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)

    t_track = make_task("T1", "Track / Civil Engineering", 60)
    t_trd = make_task("T2", "Electrical / TRD", 60)

    # Overlap: [31, 60] -> exactly 29 minutes
    c1 = make_cand(0, 60, "T1", "TEAM-001")
    c2 = make_cand(31, 91, "T2", "TEAM-013")

    is_compat, stype, reason = check_possession_sharing_compatibility(t_track, c1, t_trd, c2, bundle)
    assert is_compat is False
    assert stype == "invalid_partial_overlap"
    assert "required minimum" in reason


def test_incompatible_departments_rejected():
    """Incompatible department pairs cannot share a possession concurrently."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    from optimizer.data_loader import BundlingRule

    dept_a = "Security / RPF"
    dept_b = "Commercial / Ticketing"
    bundle.bundling_rules[(dept_a, dept_b)] = BundlingRule(dept_a, dept_b, "No", 240, True, 30)
    bundle.bundling_rules[(dept_b, dept_a)] = BundlingRule(dept_b, dept_a, "No", 240, True, 30)

    t_a = make_task("T1", dept_a, 60)
    t_b = make_task("T2", dept_b, 60)

    c1 = make_cand(0, 60, "T1", "TEAM-001")
    c2 = make_cand(0, 60, "T2", "TEAM-013")

    is_compat, stype, reason = check_possession_sharing_compatibility(t_a, c1, t_b, c2, bundle)
    assert is_compat is False
    assert stype == "incompatible"
    assert "incompatible" in reason.lower()


def test_can_bundle_no_rejected():
    """Tasks with can_bundle == No cannot share a possession."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)

    t_track = make_task("T1", "Track / Civil Engineering", 60, can_bundle=False)
    t_trd = make_task("T2", "Electrical / TRD", 60, can_bundle=True)

    c1 = make_cand(0, 60, "T1", "TEAM-001")
    c2 = make_cand(0, 60, "T2", "TEAM-013")

    is_compat, stype, reason = check_possession_sharing_compatibility(t_track, c1, t_trd, c2, bundle)
    assert is_compat is False
    assert "can_bundle == No" in reason


def test_serial_tasks_sharing_possession():
    """Compatible tasks with non-overlapping intervals (0 min overlap) are accepted as serial."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)

    t_track = make_task("T1", "Track / Civil Engineering", 50)
    t_trd = make_task("T2", "Electrical / TRD", 50)

    # Serial: T1 runs 0-50, T2 runs 60-110 (overlap = 0, sum of durations = 100 <= 120)
    c1 = make_cand(0, 50, "T1", "TEAM-001")
    c2 = make_cand(60, 110, "T2", "TEAM-013")

    is_compat, stype, reason = check_possession_sharing_compatibility(t_track, c1, t_trd, c2, bundle)
    assert is_compat is True
    assert stype == "serial"
    assert reason is None


def test_incompatible_departments_serial_rejected():
    """Incompatible departments cannot bypass compatibility rules merely because they are serial."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    from optimizer.data_loader import BundlingRule

    dept_a = "Security / RPF"
    dept_b = "Commercial / Ticketing"
    bundle.bundling_rules[(dept_a, dept_b)] = BundlingRule(dept_a, dept_b, "No", 240, True, 30)
    bundle.bundling_rules[(dept_b, dept_a)] = BundlingRule(dept_b, dept_a, "No", 240, True, 30)

    t_a = make_task("T1", dept_a, 50)
    t_b = make_task("T2", dept_b, 50)

    # Non-overlapping intervals in same possession
    c1 = make_cand(0, 50, "T1", "TEAM-001")
    c2 = make_cand(60, 110, "T2", "TEAM-013")

    is_compat, stype, reason = check_possession_sharing_compatibility(t_a, c1, t_b, c2, bundle)
    assert is_compat is False
    assert stype == "incompatible"
    assert "incompatible" in reason.lower()
