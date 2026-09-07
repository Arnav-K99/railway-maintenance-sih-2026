"""
Unit tests for optimizer.candidate_generation
"""

from pathlib import Path
from optimizer.data_loader import load_dataset, Task
from optimizer.preprocessing import preprocess_possessions
from optimizer.candidate_generation import generate_candidates_for_task


def make_test_task(dur: int) -> Task:
    return Task(
        task_id=f"TEST-{dur}M",
        asset_id="AST-120001",
        department="Track / Civil Engineering",
        maintenance_type="Rail Inspection",
        corridor_id="COR-010",
        section_id="SEC-0092",
        task_date="2026-09-03",
        deadline="2026-09-04",
        risk_score=75.0,
        risk_level="High",
        failure_probability_30d=0.75,
        forecast_30d_degradation=0.15,
        priority_score=75.0,
        required_duration_minutes=dur,
        required_team_size=4,
        preferred_start_minute=60,
        max_delay_tolerance_minutes=30,
        can_bundle=True,
        source_task_date="2026-09-03",
        source_deadline="2026-09-04",
        source_risk="neev",
    )


def test_candidate_generation_multiblock_chains():
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)

    # 1. 1-block task (duration 60m)
    t_1blk = make_test_task(60)
    cands_1, reason_1 = generate_candidates_for_task(t_1blk, prep, bundle)
    assert len(cands_1) > 0
    assert all(len(c.block_ids) == 1 for c in cands_1)

    # 2. 2-block task (duration 180m)
    t_2blk = make_test_task(180)
    cands_2, reason_2 = generate_candidates_for_task(t_2blk, prep, bundle)
    assert len(cands_2) > 0
    assert all(len(c.block_ids) == 2 for c in cands_2)

    # 3. 3-block task (duration 270m)
    t_3blk = make_test_task(270)
    cands_3, reason_3 = generate_candidates_for_task(t_3blk, prep, bundle)
    assert len(cands_3) > 0
    assert all(len(c.block_ids) == 3 for c in cands_3)


def test_task_execution_offsets():
    """Verifies that candidate generation produces multiple distinct execution offsets within a possession."""
    data_dir = Path("Arnav_Optimizer_Clean_Dataset")
    bundle = load_dataset(data_dir)
    prep = preprocess_possessions(bundle)

    # Task with duration 60m in 120m block has 60m slack -> generates multiple offsets (0, 60, etc.)
    t = make_test_task(60)
    cands, reason = generate_candidates_for_task(t, prep, bundle)
    assert len(cands) > 0

    # Group candidates by possession
    by_poss = {}
    for c in cands:
        by_poss.setdefault(c.possession_id, []).append(c)

    # Check that at least one possession has multiple timing offset options
    poss_with_multiple_offsets = [p_id for p_id, clist in by_poss.items() if len(clist) > 1]
    assert len(poss_with_multiple_offsets) > 0

    sample_poss = by_poss[poss_with_multiple_offsets[0]]
    offsets = [c.timing_offset_minutes for c in sample_poss]
    assert 0 in offsets
    assert any(off > 0 for off in offsets)

    # Check timing invariant: execution must fall within possession
    for c in cands:
        assert c.possession_start_minute <= c.execution_start_minute
        assert c.execution_end_minute <= c.possession_end_minute
        assert c.execution_end_minute - c.execution_start_minute == 60
