"""
Priority calculation module for Arnav's Railway Maintenance Optimizer.
Calculates composite operational priority using Neev's canonical risk_score
as the foundational risk signal, combined with deadline urgency and delay sensitivity.
"""

from datetime import datetime
from typing import Dict
from optimizer.data_loader import Task
from optimizer.config import OptimizerConfig


def parse_date(date_str: str) -> datetime:
    """Parses standard ISO YYYY-MM-DD date."""
    return datetime.strptime(date_str[:10], "%Y-%m-%d")


def compute_task_priority(
    task: Task,
    config: OptimizerConfig,
    current_date: str = None,
) -> float:
    """
    Computes composite priority score for a maintenance task.
    Enforces C011 (Prioritize critical/high-risk assets) with configurable weights.
    
    Components:
    1. Canonical Risk: task.risk_score (0-100) from Neev handoff
    2. Dynamic Deadline Urgency: Urgency strictly increases as current planning date approaches deadline
    3. Delay Sensitivity: Higher priority if delay tolerance is narrow
    """
    # 1. Canonical Neev Risk (Foundational signal)
    risk_part = config.weight_risk * float(task.risk_score)

    # 2. Dynamic Deadline Urgency relative to current planning date
    d_date = parse_date(task.deadline)
    if current_date is not None:
        ref_date = parse_date(current_date)
    else:
        ref_date = parse_date(task.task_date)

    days_remaining = (d_date - ref_date).days
    # If remaining days is 0 (deadline today) or negative (overdue), gets maximum urgency index 15.0
    # As days_remaining decreases, urgency_index strictly increases
    urgency_index = max(1.0, 15.0 - max(0.0, float(days_remaining)))
    urgency_part = config.weight_urgency * urgency_index

    # 3. Delay Sensitivity (tolerance 15 to 60 min)
    delay_sensitivity = max(0.0, 60.0 - float(task.max_delay_tolerance_minutes))
    delay_part = config.weight_delay_penalty * delay_sensitivity

    composite_priority = risk_part + urgency_part + delay_part
    return composite_priority


def compute_all_priorities(
    tasks: Dict[str, Task],
    config: OptimizerConfig,
    current_date: str = None,
) -> Dict[str, float]:
    """Computes composite priority for all tasks in the dataset."""
    return {tid: compute_task_priority(t, config, current_date=current_date) for tid, t in tasks.items()}
