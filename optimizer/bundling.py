"""
Bundling and concurrency logic for Arnav's Railway Maintenance Optimizer.
Evaluates department compatibility (C006), maximum duration (S009),
minimum overlap (S008), and bundling eligibility (S010).
"""

from typing import Dict, Tuple, Optional
from optimizer.data_loader import Task, BundlingRule, DatasetBundle
from optimizer.candidate_generation import CandidatePlacement


def check_possession_sharing_compatibility(
    task_1: Task,
    cand_1: CandidatePlacement,
    task_2: Task,
    cand_2: CandidatePlacement,
    bundle: DatasetBundle,
    default_min_overlap: int = 30,
    default_max_combined: int = 360,
) -> Tuple[bool, str, Optional[str]]:
    """
    Evaluates whether two tasks can share a block possession, strictly distinguishing:
    1. Concurrent sharing (intervals overlap by >= minimum_overlap_minutes)
    2. Serial sharing (intervals do not overlap at all)

    Returns:
      (is_compatible: bool, sharing_type: str, reason: Optional[str])
      where sharing_type is one of:
      - 'concurrent': valid concurrent bundle
      - 'serial': valid non-overlapping serial sharing
      - 'invalid_partial_overlap': overlap > 0 but < minimum_overlap_minutes
      - 'incompatible': departments incompatible, can_bundle == No, or capacity exceeded
    """
    # 1. Bundling eligibility flag (S010)
    # Tasks with can_bundle == No cannot share a possession with another task
    if not task_1.can_bundle:
        return False, "incompatible", f"Task {task_1.task_id} has can_bundle == No"
    if not task_2.can_bundle:
        return False, "incompatible", f"Task {task_2.task_id} has can_bundle == No"

    # 2. Must be in the exact same section (C006, S004)
    if cand_1.section_id != cand_2.section_id:
        return False, "incompatible", "Tasks in different sections cannot share a possession"

    # 3. Department compatibility lookup (C006)
    # Incompatible departments cannot share a possession even serially unless rules permit
    pair = (task_1.department, task_2.department)
    rule: Optional[BundlingRule] = bundle.bundling_rules.get(pair)

    if rule is None:
        return False, "incompatible", f"No bundling rule for department pair {pair}"

    compat = rule.compatible.lower()
    if compat == "no":
        return False, "incompatible", f"Departments {pair} are incompatible per bundling rules"

    max_combined = rule.max_combined_duration_minutes or default_max_combined
    min_overlap = rule.minimum_overlap_minutes or default_min_overlap

    # 4. Check temporal overlap within possession (S008 vs S011)
    s1, e1 = cand_1.execution_start_minute, cand_1.execution_end_minute
    s2, e2 = cand_2.execution_start_minute, cand_2.execution_end_minute

    overlap_start = max(s1, s2)
    overlap_end = min(e1, e2)
    overlap_minutes = max(0, overlap_end - overlap_start)

    if overlap_minutes > 0:
        # CONCURRENT CASE: Must satisfy minimum overlap and maximum combined span
        if overlap_minutes < min_overlap:
            return False, "invalid_partial_overlap", f"Overlap ({overlap_minutes}m) < required minimum ({min_overlap}m)"

        combined_span = max(e1, e2) - min(s1, s2)
        if combined_span > max_combined:
            return False, "incompatible", f"Combined span ({combined_span}m) > max allowed ({max_combined}m)"

        return True, "concurrent", None

    else:
        # SERIAL CASE: No overlap (e1 <= s2 or e2 <= s1)
        # Check combined duration fits within the shared possession capacity (S011)
        poss_dur_1 = cand_1.possession_end_minute - cand_1.possession_start_minute
        poss_dur_2 = cand_2.possession_end_minute - cand_2.possession_start_minute
        shared_poss_duration = min(poss_dur_1, poss_dur_2)

        total_task_dur = task_1.required_duration_minutes + task_2.required_duration_minutes
        if total_task_dur > shared_poss_duration:
            return False, "incompatible", f"Combined duration ({total_task_dur}m) > shared possession duration ({shared_poss_duration}m)"

        return True, "serial", None


def can_bundle_tasks(
    task_1: Task,
    cand_1: CandidatePlacement,
    task_2: Task,
    cand_2: CandidatePlacement,
    bundle: DatasetBundle,
    default_min_overlap: int = 30,
    default_max_combined: int = 360,
) -> Tuple[bool, Optional[str]]:
    """
    Convenience wrapper returning whether two placements can share a possession (concurrent or serial).
    """
    is_compat, sharing_type, reason = check_possession_sharing_compatibility(
        task_1, cand_1, task_2, cand_2, bundle,
        default_min_overlap=default_min_overlap,
        default_max_combined=default_max_combined,
    )
    return is_compat, reason
