"""
Objective function builder for Arnav's Railway Maintenance Optimizer.
Combines:
- C011 (Neev risk prioritization)
- C012 (Bundling synergy bonus)
- C010 (Night maintenance preference)
- C008 (Passenger impact penalty)
- C009 (Freight congestion penalty)
- Operational possession cost and delay penalty
All weights are explicitly pulled from OptimizerConfig without hidden constants.
"""

from typing import Dict
from optimizer.model import MaintenanceCPModel
from optimizer.config import OptimizerConfig
from optimizer.priority import compute_all_priorities


def build_objective(
    cp_model: MaintenanceCPModel,
    config: OptimizerConfig,
) -> None:
    """
    Constructs and sets the CP-SAT maximization objective function.
    Scale factor is applied to convert float weights to integer CP-SAT coefficients.
    """
    scale = config.score_scaling_factor
    priorities = compute_all_priorities(cp_model.task_map, config)

    objective_terms = []

    # 1. Scheduled Task Rewards & Deferral Penalties (C011)
    for tid, task in cp_model.task_map.items():
        p_val = priorities.get(tid, 50.0)
        p_int = int(round(p_val * scale))
        defer_penalty_int = int(round(p_val * config.deferral_penalty_scale * scale))

        # Reward for scheduling
        for (t_id, c_id), x_var in cp_model.x.items():
            if t_id == tid:
                objective_terms.append(p_int * x_var)

        # Penalty for deferring
        if tid in cp_model.u:
            objective_terms.append(-defer_penalty_int * cp_model.u[tid])

    # 2. Candidate Placement Operational Bonuses & Penalties (C008, C009, C010)
    for key, x_var in cp_model.x.items():
        cand = cp_model.cand_map[key]
        task = cp_model.task_map[key[0]]

        # Night preference bonus (C010)
        if cand.is_night:
            night_bonus_int = int(round(config.weight_night_bonus * scale))
            objective_terms.append(night_bonus_int * x_var)

        # Possession cost (fewer possessions preferred)
        possession_cost_int = int(round(config.weight_possession_cost * len(cand.block_ids) * scale))
        objective_terms.append(-possession_cost_int * x_var)

        # Passenger impact penalty (C008)
        if cand.passenger_impact > 0:
            pass_penalty_int = int(round(config.weight_passenger_penalty * cand.passenger_impact * scale))
            objective_terms.append(-pass_penalty_int * x_var)

        # Freight congestion penalty (C009)
        if cand.freight_demand_index > 1.0:
            freight_penalty_int = int(round(config.weight_freight_penalty * cand.freight_demand_index * scale))
            objective_terms.append(-freight_penalty_int * x_var)

        # Delay penalty from preferred start minute
        delay = abs(cand.execution_start_minute - task.preferred_start_minute)
        if delay > 0:
            delay_penalty_int = int(round(config.weight_delay_penalty * min(delay, 240) * scale))
            objective_terms.append(-delay_penalty_int * x_var)

    # 3. Bundling Synergy Bonus (C012)
    bundling_bonus_int = int(round(config.weight_bundling_bonus * scale))
    for pair_key, b_var in cp_model.bundle_pairs.items():
        objective_terms.append(bundling_bonus_int * b_var)

    # Set the global maximization objective in CP-SAT
    cp_model.model.Maximize(sum(objective_terms))
