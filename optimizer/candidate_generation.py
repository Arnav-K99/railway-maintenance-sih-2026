"""
Candidate possession generation for Arnav's Railway Maintenance Optimizer.
Generates structurally feasible candidate possessions for each task based on:
- matching section (S004)
- date window [task_date, deadline] (S003, C005)
- duration coverage [1, 2, or 3 consecutive blocks] (C001, S002)
- track availability (C003)
- no train conflicts (C002)
- team department & shift feasibility (C004, S005, S006)
"""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Dict, List, Set, Tuple, Optional
from optimizer.data_loader import DatasetBundle, Task, Team
from optimizer.preprocessing import BlockPossession, PreprocessedData


@dataclass(frozen=True)
class CandidatePlacement:
    """A feasible placement of a task within a candidate possession window."""
    candidate_id: str
    task_id: str
    possession_id: str
    date: str
    section_id: str
    corridor_id: str
    block_ids: Tuple[str, ...]
    execution_start_minute: int
    execution_end_minute: int
    possession_start_minute: int
    possession_end_minute: int
    timing_offset_minutes: int
    eligible_teams: Tuple[str, ...]
    is_night: bool
    freight_demand_index: float
    passenger_impact: float


@dataclass
class CandidateGenerationResult:
    """Holds candidate placements and any initial deferral reasons."""
    candidates_by_task: Dict[str, List[CandidatePlacement]] = field(default_factory=dict)
    candidates_by_possession: Dict[str, List[CandidatePlacement]] = field(default_factory=dict)
    initial_deferral_reasons: Dict[str, str] = field(default_factory=dict)
    total_candidates: int = 0


def generate_candidates_for_task(
    task: Task,
    prep: PreprocessedData,
    bundle: DatasetBundle,
) -> Tuple[List[CandidatePlacement], Optional[str]]:
    """
    Generates candidate placements for a single task.
    Returns (list_of_candidates, deferral_reason_if_empty).
    """
    duration = task.required_duration_minutes

    # Determine minimum block chain length required (C001)
    if duration <= 120:
        min_blocks = 1
        max_blocks = 1  # Standard 1 block
    elif duration <= 240:
        min_blocks = 2
        max_blocks = 2  # Standard 2 consecutive blocks
    elif duration <= 360:
        min_blocks = 3
        max_blocks = 3  # Standard 3 consecutive blocks
    else:
        return [], "duration_exceeds_max_supported_limit"

    dept_teams = bundle.teams_by_department.get(task.department, [])
    if not dept_teams:
        return [], "no_teams_registered_for_department"

    # Enumerate dates in [task_date, deadline] (S003, C005)
    t_start = datetime.strptime(task.task_date[:10], "%Y-%m-%d")
    t_end = datetime.strptime(task.deadline[:10], "%Y-%m-%d")
    if t_end < t_start:
        return [], "deadline_before_task_date"

    cur_date = t_start
    valid_candidates: List[CandidatePlacement] = []

    while cur_date <= t_end:
        date_str = cur_date.strftime("%Y-%m-%d")
        daily_possessions = prep.possessions_by_date_section.get((date_str, task.section_id), [])

        for poss in daily_possessions:
            # Check duration coverage (C001)
            chain_len = len(poss.block_ids)
            if chain_len < min_blocks:
                continue
            if chain_len > max_blocks:
                continue

            # Calculate slack time available within possession
            slack = poss.end_minute - poss.start_minute - duration
            if slack < 0:
                continue

            # Generate candidate timing offsets within possession
            # Clearly distinguishes possession start/end from task execution start/end
            offsets = {0}
            if slack > 0:
                offsets.add(slack)  # End of possession (enables serial placement before it)
                # Check preferred start offset
                pref = task.preferred_start_minute
                if poss.start_minute <= pref <= poss.end_minute - duration:
                    offsets.add(pref - poss.start_minute)
                # Intermediate 30m / 60m offset if slack allows
                if slack >= 60:
                    offsets.add(30)
                    offsets.add(60)

            for offset in sorted(offsets):
                exec_start = poss.start_minute + offset
                exec_end = exec_start + duration

                if exec_end > poss.end_minute:
                    continue

                # Check team feasibility: find teams whose shift covers [exec_start, exec_end] (C004, S005, S006)
                eligible_team_ids: List[str] = []
                for team in dept_teams:
                    if team.shift_start_minute <= exec_start and exec_end <= team.shift_end_minute:
                        eligible_team_ids.append(team.team_id)

                if not eligible_team_ids:
                    continue

                cand_id = f"CAND-{task.task_id}-{poss.possession_id}-O{offset}"
                cand = CandidatePlacement(
                    candidate_id=cand_id,
                    task_id=task.task_id,
                    possession_id=poss.possession_id,
                    date=date_str,
                    section_id=task.section_id,
                    corridor_id=task.corridor_id,
                    block_ids=poss.block_ids,
                    execution_start_minute=exec_start,
                    execution_end_minute=exec_end,
                    possession_start_minute=poss.start_minute,
                    possession_end_minute=poss.end_minute,
                    timing_offset_minutes=offset,
                    eligible_teams=tuple(eligible_team_ids),
                    is_night=poss.night_preference,
                    freight_demand_index=poss.freight_demand_index,
                    passenger_impact=poss.passenger_impact,
                )
                valid_candidates.append(cand)

        cur_date += timedelta(days=1)

    if not valid_candidates:
        reason = "no_candidate_window_available"
        return [], reason

    return valid_candidates, None


def generate_all_candidates(
    tasks: Dict[str, Task],
    prep: PreprocessedData,
    bundle: DatasetBundle,
) -> CandidateGenerationResult:
    """Generates candidate placements for all tasks in the workload."""
    result = CandidateGenerationResult()

    for tid, task in tasks.items():
        cands, reason = generate_candidates_for_task(task, prep, bundle)
        if cands:
            result.candidates_by_task[tid] = cands
            for c in cands:
                result.candidates_by_possession.setdefault(c.possession_id, []).append(c)
                result.total_candidates += 1
        else:
            result.initial_deferral_reasons[tid] = reason or "no_feasible_candidate_found"

    return result
