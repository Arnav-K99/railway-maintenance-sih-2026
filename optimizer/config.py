"""
Configuration and constraint mapping for Arnav's Railway Maintenance Optimizer.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Any


# ---------------------------------------------------------------------------
# Explicit Constraint Mapping (constraints.csv + derived structural rules)
# ---------------------------------------------------------------------------
CONSTRAINT_REGISTRY: Dict[str, Dict[str, str]] = {
    # Explicit Hard Constraints from constraints.csv
    "C001": {
        "class": "Hard",
        "group": "Duration",
        "description": "Block duration must cover every assigned task",
        "implementation": "Multi-block chaining (1, 2, or 3 consecutive 120-min blocks) >= required_duration_minutes",
    },
    "C002": {
        "class": "Hard",
        "group": "Train conflict",
        "description": "Blocked section cannot be occupied by a train during the block",
        "implementation": "Blocks with train-block conflicts for prohibited trains cannot be scheduled",
    },
    "C003": {
        "class": "Hard",
        "group": "Infrastructure",
        "description": "Track must be available",
        "implementation": "Only blocks with track_available == 'Yes' are eligible",
    },
    "C004": {
        "class": "Hard",
        "group": "Team",
        "description": "Assigned team must be available for the full task",
        "implementation": "Assigned team's shift covers task interval, department matches, and total team size >= required_team_size",
    },
    "C005": {
        "class": "Hard",
        "group": "Deadline",
        "description": "Task must be completed before its deadline",
        "implementation": "Possession date <= task.deadline and block start time allows completion before deadline end",
    },
    "C006": {
        "class": "Hard",
        "group": "Bundling",
        "description": "Incompatible departments cannot be bundled",
        "implementation": "Bundled task pairs must be compatible per bundling_rules.csv",
    },
    "C007": {
        "class": "Hard",
        "group": "Capacity",
        "description": "Maximum simultaneous task capacity cannot be exceeded",
        "implementation": "Number of concurrent tasks sharing a block <= block.max_simultaneous_tasks",
    },

    # Explicit Soft Constraints from constraints.csv
    "C008": {
        "class": "Soft",
        "group": "Passenger impact",
        "description": "Prefer low passenger-load periods",
        "implementation": "Objective penalizes scheduling during high passenger load train activity adjacent to or within the block window (+/- 60 min buffer) using trains.csv passenger load proxy",
    },
    "C009": {
        "class": "Soft",
        "group": "Congestion",
        "description": "Prefer lower predicted congestion",
        "implementation": "Objective penalizes scheduling during high freight demand / congestion index periods",
    },
    "C010": {
        "class": "Soft",
        "group": "Operational preference",
        "description": "Prefer night maintenance where practical",
        "implementation": "Objective adds reward bonus for scheduling in blocks with night_preference == 'Yes'",
    },
    "C011": {
        "class": "Soft",
        "group": "Maintenance priority",
        "description": "Prioritize critical/high-risk assets",
        "implementation": "Objective prioritizes tasks weighted heavily by Neev canonical risk_score",
    },
    "C012": {
        "class": "Soft",
        "group": "Bundling efficiency",
        "description": "Prefer bundling compatible tasks",
        "implementation": "Objective provides synergy bonus when compatible tasks share a block possession",
    },

    # Derived Structural / Formulation Constraints
    "S001": {
        "class": "Structural",
        "group": "Single Placement",
        "description": "At most one candidate possession placement per scheduled task",
        "implementation": "sum(x[t, c]) <= 1; u[t] = 1 - sum(x[t, c])",
    },
    "S002": {
        "class": "Structural",
        "group": "Contiguity",
        "description": "Multi-block possessions must consist of contiguous consecutive blocks",
        "implementation": "Chained blocks must share the same section_id, date, and adjacent intervals (start[k+1] == end[k])",
    },
    "S003": {
        "class": "Structural",
        "group": "Earliest Start",
        "description": "Task cannot be executed before its task_date",
        "implementation": "Candidate possession date >= task.task_date",
    },
    "S004": {
        "class": "Structural",
        "group": "Section Match",
        "description": "Candidate blocks must match the task's assigned section_id",
        "implementation": "Candidate generation strictly filters on task.section_id == block.section_id",
    },
    "S005": {
        "class": "Structural",
        "group": "Shift Window",
        "description": "Task execution interval must fall within the assigned team's shift window",
        "implementation": "team.shift_start_minute <= task.start_minute and task.end_minute <= team.shift_end_minute",
    },
    "S006": {
        "class": "Structural",
        "group": "Skill Match",
        "description": "Assigned team's department must match the task's department",
        "implementation": "team.department == task.department",
    },
    "S007": {
        "class": "Structural",
        "group": "Global Team Non-Overlap",
        "description": "A team cannot be scheduled for overlapping task execution intervals anywhere in the network",
        "implementation": "Enforced via CP-SAT AddNoOverlap on team execution intervals across all sections and tasks",
    },
    "S008": {
        "class": "Structural",
        "group": "Bundling Minimum Overlap",
        "description": "Concurrent bundled tasks sharing a possession must overlap by at least minimum_overlap_minutes",
        "implementation": "Overlap duration >= bundling_rules.minimum_overlap_minutes (>= 30 min)",
    },
    "S009": {
        "class": "Structural",
        "group": "Bundling Maximum Duration",
        "description": "Combined duration of bundled tasks cannot exceed max_combined_duration_minutes",
        "implementation": "Max combined span <= bundling_rules.max_combined_duration_minutes (240, 300, or 360 min)",
    },
    "S010": {
        "class": "Structural",
        "group": "Bundling Eligibility",
        "description": "Tasks with can_bundle == 'No' cannot be bundled with any other task",
        "implementation": "Bundling is only considered if both tasks have can_bundle == 'Yes'",
    },
    "S011": {
        "class": "Structural",
        "group": "Serial Possession Sharing",
        "description": "Serial tasks sharing a possession must not overlap and must satisfy department compatibility",
        "implementation": "Incompatible departments cannot share a possession even serially; overlap == 0 and sum of durations <= possession duration",
    },
}


@dataclass
class OptimizerConfig:
    """Configurable weights and settings for the optimizer."""

    # Data paths
    data_dir: Path = Path("Arnav_Optimizer_Clean_Dataset")
    output_dir: Path = Path(".")
    output_csv: str = "optimized_block_plan.csv"
    output_json: str = "optimized_block_plan.json"
    output_deferred: str = "deferred_tasks.csv"
    output_metrics: str = "optimization_metrics.json"

    # Objective weights (transparent, configurable, no magic numbers)
    weight_risk: float = 20.0             # Weight for Neev risk score (0-100) (C011)
    weight_urgency: float = 10.0          # Weight for deadline proximity (days remaining relative to current planning date)
    weight_delay_penalty: float = 0.05    # Penalty per minute delay from preferred_start
    weight_bundling_bonus: float = 100.0  # Reward per concurrent bundled pair sharing a block (C012)
    weight_night_bonus: float = 25.0      # Bonus for scheduling in night-preferred blocks (C010)
    weight_passenger_penalty: float = 1.0 # Penalty per passenger impact score (C008 proxy from trains.csv)
    weight_freight_penalty: float = 1.0   # Penalty per freight demand index (C009)
    weight_possession_cost: float = 15.0  # Cost per block possession consumed
    deferral_penalty_scale: float = 2.5   # Multiplier on task priority as deferral penalty

    # Bundling parameters
    default_min_overlap_minutes: int = 30
    default_max_combined_duration: int = 360

    # Scalability parameters
    max_daily_candidate_pool: int = 700   # Maximum daily candidate pool for CP-SAT tractability (~5x network team capacity)

    # Solver parameters
    solver_time_limit_seconds: float = 10.0
    num_workers: int = 8
    log_search_progress: bool = False
    
    # Scale multiplier for integer arithmetic in CP-SAT
    score_scaling_factor: int = 100

    def get_constraint_info(self, constraint_id: str) -> Dict[str, str]:
        """Returns metadata for a given constraint ID."""
        return CONSTRAINT_REGISTRY.get(constraint_id, {
            "class": "Unknown",
            "group": "Unknown",
            "description": "Unknown constraint",
            "implementation": "N/A"
        })
