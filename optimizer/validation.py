"""
Pre-solve validation module for the Railway Maintenance Optimizer.
Verifies referential integrity, domain bounds, and constraints across input data.
"""

from typing import Dict, List, Any
from optimizer.data_loader import DatasetBundle


class PreSolveValidationError(Exception):
    """Raised when critical pre-solve validation fails."""
    pass


def validate_input_dataset(bundle: DatasetBundle, strict: bool = True) -> Dict[str, Any]:
    """
    Validates input dataset integrity before candidate generation or solving.
    Returns a comprehensive validation dictionary.
    """
    errors: List[str] = []
    warnings: List[str] = []

    # 1. Check entity counts
    if len(bundle.tasks) == 0:
        errors.append("No maintenance tasks loaded.")
    if len(bundle.blocks) == 0:
        errors.append("No maintenance blocks loaded.")
    if len(bundle.teams) == 0:
        errors.append("No maintenance teams loaded.")
    if len(bundle.corridors_sections) == 0:
        errors.append("No corridors/sections loaded.")

    # 2. Check task referential integrity & domain bounds
    task_dates = set()
    for tid, task in bundle.tasks.items():
        task_dates.add(task.task_date)
        
        # Section existence & corridor match
        if task.section_id not in bundle.corridors_sections:
            errors.append(f"Task {tid} references unknown section {task.section_id}")
        else:
            expected_corridor = bundle.section_to_corridor[task.section_id]
            if task.corridor_id != expected_corridor:
                errors.append(
                    f"Task {tid} corridor mismatch: task has {task.corridor_id}, section maps to {expected_corridor}"
                )

        # Risk score bounds (Neev canonical risk: 0-100)
        if not (0.0 <= task.risk_score <= 100.0):
            errors.append(f"Task {tid} has invalid Neev risk score: {task.risk_score}")

        # Duration bounds (rail blocks are 120m, max supported is 3 blocks = 360m)
        if task.required_duration_minutes <= 0 or task.required_duration_minutes > 360:
            errors.append(f"Task {tid} has out-of-bounds duration: {task.required_duration_minutes}")

        # Deadline coherence
        if task.deadline < task.task_date:
            errors.append(f"Task {tid} deadline {task.deadline} is before task_date {task.task_date}")

        # Department team availability check
        if task.department not in bundle.teams_by_department:
            errors.append(f"Task {tid} department '{task.department}' has no registered teams.")

    # 3. Check block integrity
    for bid, block in bundle.blocks.items():
        if block.section_id not in bundle.corridors_sections:
            errors.append(f"Block {bid} references unknown section {block.section_id}")
        if block.duration_minutes != 120:
            warnings.append(f"Block {bid} has non-standard duration: {block.duration_minutes}")
        if block.start_minute < 0 or block.end_minute > 1440:
            errors.append(f"Block {bid} has invalid time interval: {block.start_minute}-{block.end_minute}")

    # 4. Check train conflict integrity
    for (trn_id, blk_id), conflict in bundle.conflicts.items():
        if trn_id not in bundle.trains:
            errors.append(f"Conflict references unknown train {trn_id}")
        if blk_id not in bundle.blocks:
            errors.append(f"Conflict references unknown block {blk_id}")

    # 5. Check team shift coverage
    for team_id, team in bundle.teams.items():
        if team.shift_start_minute < 0 or team.shift_end_minute > 1440:
            errors.append(f"Team {team_id} has invalid shift: {team.shift_start_minute}-{team.shift_end_minute}")
        if team.team_size <= 0:
            errors.append(f"Team {team_id} has non-positive team size: {team.team_size}")

    # 6. Check bundling rules coverage
    departments = list(bundle.teams_by_department.keys())
    for d1 in departments:
        for d2 in departments:
            if (d1, d2) not in bundle.bundling_rules:
                warnings.append(f"No bundling rule defined for department pair ({d1}, {d2})")

    report = {
        "status": "PASS" if len(errors) == 0 else "FAIL",
        "tasks_checked": len(bundle.tasks),
        "blocks_checked": len(bundle.blocks),
        "trains_checked": len(bundle.trains),
        "conflicts_checked": len(bundle.conflicts),
        "teams_checked": len(bundle.teams),
        "sections_checked": len(bundle.corridors_sections),
        "errors_count": len(errors),
        "warnings_count": len(warnings),
        "errors": errors[:20],
        "warnings": warnings[:20],
    }

    if strict and errors:
        raise PreSolveValidationError(f"Pre-solve validation failed with {len(errors)} errors: {errors[:5]}")

    return report
