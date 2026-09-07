"""
Unit tests for Ritvik's ConflictDetector.
"""

import pytest
from ritvik.data_loader import ScheduledMaintenance, TrainMovement, OperationalEvent
from ritvik.conflict_detector import ConflictDetector


@pytest.fixture
def sample_maintenance():
    return ScheduledMaintenance(
        task_id="TASK-TEST-001",
        asset_id="AST-001",
        department="Track / Civil Engineering",
        corridor_id="COR-001",
        section_id="SEC-0004",
        date="2026-09-07",
        start_minute=100,
        end_minute=300,
        duration_minutes=200,
        block_ids=["BLK-001", "BLK-002"],
        assigned_teams=["TEAM-001"],
    )


def test_no_conflict_outside_window(sample_maintenance):
    detector = ConflictDetector()

    # Train completes before maintenance starts (0-90 vs 100-300)
    train_early = TrainMovement(
        train_id="TRN-001",
        train_type="Express",
        corridor_id="COR-001",
        section_id="SEC-0004",
        date="2026-09-07",
        arrival_minute=0,
        departure_minute=90,
    )
    # Train arrives after maintenance ends (350-400 vs 100-300)
    train_late = TrainMovement(
        train_id="TRN-002",
        train_type="Express",
        corridor_id="COR-001",
        section_id="SEC-0004",
        date="2026-09-07",
        arrival_minute=350,
        departure_minute=400,
    )

    report = detector.detect_conflicts(sample_maintenance, [train_early, train_late], [])
    assert not report.has_conflict
    assert report.conflict_type == "NONE"
    assert len(report.conflicting_trains) == 0


def test_conflict_on_direct_overlap(sample_maintenance):
    detector = ConflictDetector()

    # Train overlaps during 150-250 min
    train_overlap = TrainMovement(
        train_id="TRN-003",
        train_type="Superfast",
        corridor_id="COR-001",
        section_id="SEC-0004",
        date="2026-09-07",
        arrival_minute=150,
        departure_minute=250,
    )

    report = detector.detect_conflicts(sample_maintenance, [train_overlap], [])
    assert report.has_conflict
    assert report.conflict_type == "NEW_TRAIN_CONFLICT"
    assert len(report.conflicting_trains) == 1
    assert report.conflicting_trains[0].train_id == "TRN-003"
    assert report.overlap_window == (150, 250)


def test_conflict_on_event_new_train(sample_maintenance):
    detector = ConflictDetector()

    evt = OperationalEvent(
        event_id="EVT-TEST-01",
        event_type="NEW_TRAIN",
        train_id="TRN-SIM-01",
        section_id="SEC-0004",
        arrival_minute=200,
        departure_minute=260,
        date="2026-09-07",
    )

    report = detector.detect_conflicts(sample_maintenance, [], [evt])
    assert report.has_conflict
    assert report.conflict_type == "NEW_TRAIN_CONFLICT"
    assert len(report.conflicting_trains) == 1
    assert report.conflicting_trains[0].train_id == "TRN-SIM-01"
    assert report.overlap_window == (200, 260)


def test_conflict_on_block_unavailable(sample_maintenance):
    detector = ConflictDetector()

    evt = OperationalEvent(
        event_id="EVT-TEST-02",
        event_type="BLOCK_UNAVAILABLE",
        block_id="BLK-001",
        section_id="SEC-0004",
        date="2026-09-07",
        reason="Broken rail defect",
    )

    report = detector.detect_conflicts(sample_maintenance, [], [evt])
    assert report.has_conflict
    assert report.conflict_type == "BLOCK_UNAVAILABLE"
    assert "BLK-001" in report.affected_blocks
