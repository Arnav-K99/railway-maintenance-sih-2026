"""
Preprocessing module for Arnav's Railway Maintenance Optimizer.
Constructs valid multi-block possession chains, applies conflict pruning,
and computes operational metrics.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Set, Tuple, Optional
from optimizer.data_loader import DatasetBundle, Block, TrainBlockConflict


@dataclass(frozen=True)
class BlockPossession:
    """A single or multi-block maintenance possession window."""
    possession_id: str
    date: str
    section_id: str
    corridor_id: str
    block_ids: Tuple[str, ...]
    start_minute: int
    end_minute: int
    total_duration_minutes: int
    night_preference: bool
    max_simultaneous_tasks: int
    has_train_conflict: bool
    track_available: bool
    freight_demand_index: float
    passenger_impact: float


@dataclass
class PreprocessedData:
    """Indexed possessions and quick-lookup tables for candidate generation."""
    # Indexed by (date, section_id)
    possessions_by_date_section: Dict[Tuple[str, str], List[BlockPossession]] = field(default_factory=dict)
    
    # Fast set of blocked block_ids due to train conflict
    conflicted_blocks: Set[str] = field(default_factory=set)
    
    # Fast set of track unavailable block_ids
    unavailable_blocks: Set[str] = field(default_factory=set)

    # All generated valid possessions indexed by possession_id
    all_possessions: Dict[str, BlockPossession] = field(default_factory=dict)


def preprocess_possessions(bundle: DatasetBundle) -> PreprocessedData:
    """
    Constructs 1-block, 2-block, and 3-block candidate possessions across the 14-day horizon.
    Enforces C002 (no train conflicts) and C003 (track available) during generation.
    """
    prep = PreprocessedData()

    # 1. Identify conflicted blocks (C002: Hard Train Conflict)
    for block_id, conflict_list in bundle.conflicts_by_block.items():
        if conflict_list:
            prep.conflicted_blocks.add(block_id)

    # 2. Identify track unavailable blocks (C003)
    for block_id, block in bundle.blocks.items():
        if not block.track_available:
            prep.unavailable_blocks.add(block_id)

    # 3. Build 1-block, 2-block, and 3-block possessions
    for (date, section_id), daily_blocks in bundle.blocks_by_date_section.items():
        corridor_id = bundle.section_to_corridor.get(section_id, daily_blocks[0].corridor_id)
        
        # Freight demand index lookup (C009)
        gf = bundle.goods_forecast.get((date, corridor_id))
        freight_index = gf.freight_demand_index if gf else 1.0

        n_blocks = len(daily_blocks)

        for i in range(n_blocks):
            # Chain length 1 (120 minutes)
            b1 = daily_blocks[i]
            _add_possession_if_valid(prep, (b1,), date, section_id, corridor_id, freight_index, bundle)

            # Chain length 2 (240 minutes, consecutive)
            if i + 1 < n_blocks:
                b2 = daily_blocks[i + 1]
                if b2.start_minute == b1.end_minute:  # Enforce contiguity (S002)
                    _add_possession_if_valid(prep, (b1, b2), date, section_id, corridor_id, freight_index, bundle)

            # Chain length 3 (360 minutes, consecutive)
            if i + 2 < n_blocks:
                b2 = daily_blocks[i + 1]
                b3 = daily_blocks[i + 2]
                if b2.start_minute == b1.end_minute and b3.start_minute == b2.end_minute:  # Enforce contiguity (S002)
                    _add_possession_if_valid(prep, (b1, b2, b3), date, section_id, corridor_id, freight_index, bundle)

    return prep


def _add_possession_if_valid(
    prep: PreprocessedData,
    blocks: Tuple[Block, ...],
    date: str,
    section_id: str,
    corridor_id: str,
    freight_index: float,
    bundle: DatasetBundle,
) -> None:
    """Helper to evaluate and register a candidate possession."""
    block_ids = tuple(b.block_id for b in blocks)
    possession_id = "+".join(block_ids)

    # Check track availability across all blocks in chain (C003)
    track_available = all(not (bid in prep.unavailable_blocks) for bid in block_ids)

    # Check train conflicts across all blocks in chain (C002)
    has_train_conflict = any(bid in prep.conflicted_blocks for bid in block_ids)

    # Only create possessions that satisfy hard infrastructure availability and no hard train conflict
    if not track_available or has_train_conflict:
        return

    start_minute = blocks[0].start_minute
    end_minute = blocks[-1].end_minute
    total_duration = sum(b.duration_minutes for b in blocks)
    night_pref = any(b.night_preference for b in blocks)
    max_simultaneous = min(b.max_simultaneous_tasks for b in blocks)

    # Passenger impact proxy from non-conflicting passenger train activity (C008)
    # Formulated from trains.csv on the same section and date operating within or adjacent (+/- 60 min)
    # to the possession window, weighted by passenger load %, capacity, and priority class.
    passenger_impact = 0.0
    sec_trains = bundle.trains_by_date_section.get((date, section_id), [])
    for tr in sec_trains:
        if tr.train_type in {"EMU", "Superfast", "Passenger", "Express"}:
            if not (tr.departure_minute < start_minute - 60 or tr.arrival_minute > end_minute + 60):
                train_score = (tr.passenger_load_percent / 100.0) * (tr.passenger_capacity / 1000.0) * (5 - tr.priority_class)
                passenger_impact += train_score

    possession = BlockPossession(
        possession_id=possession_id,
        date=date,
        section_id=section_id,
        corridor_id=corridor_id,
        block_ids=block_ids,
        start_minute=start_minute,
        end_minute=end_minute,
        total_duration_minutes=total_duration,
        night_preference=night_pref,
        max_simultaneous_tasks=max_simultaneous,
        has_train_conflict=has_train_conflict,
        track_available=track_available,
        freight_demand_index=freight_index,
        passenger_impact=passenger_impact,
    )

    prep.all_possessions[possession_id] = possession
    prep.possessions_by_date_section.setdefault((date, section_id), []).append(possession)
