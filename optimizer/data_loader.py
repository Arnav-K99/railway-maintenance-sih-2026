"""
Data loader module for Arnav's Railway Maintenance Optimizer.
Loads, validates, and indexes all authoritative project datasets.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
import csv


@dataclass(frozen=True)
class NeevPrediction:
    asset_id: str
    department: str
    asset_type: str
    corridor_id: str
    section_id: str
    failure_probability_30d: float
    risk_score: float
    risk_level: str
    forecast_30d_degradation: float
    observation_date: str
    actual_failure_within_30d: Optional[int] = None
    actual_degradation_30d: Optional[float] = None


@dataclass(frozen=True)
class Task:
    task_id: str
    asset_id: str
    department: str
    maintenance_type: str
    corridor_id: str
    section_id: str
    task_date: str
    deadline: str
    risk_score: float
    risk_level: str
    failure_probability_30d: float
    forecast_30d_degradation: float
    priority_score: float
    required_duration_minutes: int
    required_team_size: int
    preferred_start_minute: int
    max_delay_tolerance_minutes: int
    can_bundle: bool
    source_task_date: str
    source_deadline: str
    source_risk: str


@dataclass(frozen=True)
class Block:
    block_id: str
    date: str
    corridor_id: str
    section_id: str
    start_minute: int
    end_minute: int
    duration_minutes: int
    track_available: bool
    block_type: str
    night_preference: bool
    max_simultaneous_tasks: int


@dataclass(frozen=True)
class Team:
    team_id: str
    department: str
    team_name: str
    team_size: int
    shift_start_minute: int
    shift_end_minute: int
    availability_percent: float


@dataclass(frozen=True)
class Train:
    train_id: str
    train_type: str
    corridor_id: str
    section_id: str
    date: str
    arrival_minute: int
    departure_minute: int
    priority_class: int
    passenger_load_percent: float
    passenger_capacity: int
    delay_probability_percent: float
    scheduled_speed_kmph: int


@dataclass(frozen=True)
class TrainBlockConflict:
    train_id: str
    block_id: str
    conflict_type: str
    priority_class: int
    passenger_load_percent: float


@dataclass(frozen=True)
class BundlingRule:
    department_1: str
    department_2: str
    compatible: str  # 'Yes', 'Conditional', 'No'
    max_combined_duration_minutes: int
    same_section_required: bool
    minimum_overlap_minutes: int


@dataclass(frozen=True)
class CorridorSection:
    section_id: str
    corridor_id: str
    corridor_name: str
    section_name: str
    region: str


@dataclass(frozen=True)
class WeatherRecord:
    date: str
    region: str
    rainfall_forecast_mm: float
    temperature_c: float
    humidity_percent: float


@dataclass(frozen=True)
class GoodsForecast:
    date: str
    corridor_id: str
    corridor_name: str
    freight_demand_index: float
    expected_freight_trains: int


@dataclass
class DatasetBundle:
    """Holds all authoritative input tables and fast-lookup indexes."""
    neev_predictions: Dict[str, NeevPrediction] = field(default_factory=dict)
    tasks: Dict[str, Task] = field(default_factory=dict)
    blocks: Dict[str, Block] = field(default_factory=dict)
    teams: Dict[str, Team] = field(default_factory=dict)
    trains: Dict[str, Train] = field(default_factory=dict)
    conflicts: Dict[Tuple[str, str], TrainBlockConflict] = field(default_factory=dict)
    conflicts_by_block: Dict[str, List[TrainBlockConflict]] = field(default_factory=dict)
    bundling_rules: Dict[Tuple[str, str], BundlingRule] = field(default_factory=dict)
    corridors_sections: Dict[str, CorridorSection] = field(default_factory=dict)
    weather: Dict[Tuple[str, str], WeatherRecord] = field(default_factory=dict)
    goods_forecast: Dict[Tuple[str, str], GoodsForecast] = field(default_factory=dict)

    # Derived lookups
    blocks_by_date_section: Dict[Tuple[str, str], List[Block]] = field(default_factory=dict)
    trains_by_date_section: Dict[Tuple[str, str], List[Train]] = field(default_factory=dict)
    teams_by_department: Dict[str, List[Team]] = field(default_factory=dict)
    tasks_by_date: Dict[str, List[Task]] = field(default_factory=dict)
    section_to_corridor: Dict[str, str] = field(default_factory=dict)
    section_to_region: Dict[str, str] = field(default_factory=dict)


def load_dataset(data_dir: Path) -> DatasetBundle:
    """Loads and parses all dataset files from the specified clean directory."""
    bundle = DatasetBundle()

    # 0. Authoritative Neev Predictions
    neev_path = data_dir / "neev_predictions_for_optimizer.csv"
    if not neev_path.exists():
        raise FileNotFoundError(f"Authoritative Neev predictions missing at: {neev_path}")

    with open(neev_path, "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            pred = NeevPrediction(
                asset_id=r["asset_id"],
                department=r["department"],
                asset_type=r.get("asset_type", ""),
                corridor_id=r["corridor_id"],
                section_id=r["section_id"],
                failure_probability_30d=float(r["failure_probability_30d"]),
                risk_score=float(r["risk_score"]),
                risk_level=r["risk_level"],
                forecast_30d_degradation=float(r["forecast_30d_degradation"]),
                observation_date=r.get("observation_date", ""),
                actual_failure_within_30d=int(r["actual_failure_within_30d"]) if r.get("actual_failure_within_30d") else None,
                actual_degradation_30d=float(r["actual_degradation_30d"]) if r.get("actual_degradation_30d") else None,
            )
            bundle.neev_predictions[pred.asset_id] = pred

    # 1. Corridors & Sections
    with open(data_dir / "corridors_sections.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            cs = CorridorSection(
                section_id=r["section_id"],
                corridor_id=r["corridor_id"],
                corridor_name=r.get("corridor_name", ""),
                section_name=r.get("section_name", ""),
                region=r.get("region", ""),
            )
            bundle.corridors_sections[cs.section_id] = cs
            bundle.section_to_corridor[cs.section_id] = cs.corridor_id
            bundle.section_to_region[cs.section_id] = cs.region

    # 2. Bundling Rules (bidirectional index)
    with open(data_dir / "bundling_rules.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            rule = BundlingRule(
                department_1=r["department_1"],
                department_2=r["department_2"],
                compatible=r["compatible"].strip(),
                max_combined_duration_minutes=int(r["max_combined_duration_minutes"]),
                same_section_required=(r["same_section_required"].strip().lower() == "yes"),
                minimum_overlap_minutes=int(r["minimum_overlap_minutes"]),
            )
            bundle.bundling_rules[(rule.department_1, rule.department_2)] = rule
            bundle.bundling_rules[(rule.department_2, rule.department_1)] = rule

    # 3. Teams
    with open(data_dir / "teams.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            team = Team(
                team_id=r["team_id"],
                department=r["department"],
                team_name=r["team_name"],
                team_size=int(r["team_size"]),
                shift_start_minute=int(r["shift_start_minute"]),
                shift_end_minute=int(r["shift_end_minute"]),
                availability_percent=float(r.get("availability_percent", 100.0)),
            )
            bundle.teams[team.team_id] = team
            bundle.teams_by_department.setdefault(team.department, []).append(team)

    # 4. Blocks (sorted by start_minute)
    with open(data_dir / "blocks.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            block = Block(
                block_id=r["block_id"],
                date=r["date"],
                corridor_id=r["corridor_id"],
                section_id=r["section_id"],
                start_minute=int(r["start_minute"]),
                end_minute=int(r["end_minute"]),
                duration_minutes=int(r["duration_minutes"]),
                track_available=(r["track_available"].strip().lower() == "yes"),
                block_type=r["block_type"],
                night_preference=(r["night_preference"].strip().lower() == "yes"),
                max_simultaneous_tasks=int(r["max_simultaneous_tasks"]),
            )
            bundle.blocks[block.block_id] = block
            bundle.blocks_by_date_section.setdefault((block.date, block.section_id), []).append(block)

    # Sort blocks in each (date, section) list by start_minute
    for key in bundle.blocks_by_date_section:
        bundle.blocks_by_date_section[key].sort(key=lambda b: b.start_minute)

    # 5. Trains
    with open(data_dir / "trains.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            train = Train(
                train_id=r["train_id"],
                train_type=r["train_type"],
                corridor_id=r["corridor_id"],
                section_id=r["section_id"],
                date=r["date"],
                arrival_minute=int(r["arrival_minute"]),
                departure_minute=int(r["departure_minute"]),
                priority_class=int(r.get("priority_class", 1)),
                passenger_load_percent=float(r.get("passenger_load_percent", 0.0)),
                passenger_capacity=int(r.get("passenger_capacity", 0)),
                delay_probability_percent=float(r.get("delay_probability_percent", 0.0)),
                scheduled_speed_kmph=int(r.get("scheduled_speed_kmph", 80)),
            )
            bundle.trains[train.train_id] = train
            bundle.trains_by_date_section.setdefault((train.date, train.section_id), []).append(train)

    # 6. Train-Block Conflicts
    with open(data_dir / "train_block_conflicts.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            # Support both 'priority_class' and legacy 'train_priority_class'
            p_class = int(r.get("priority_class") or r.get("train_priority_class", 1))
            c = TrainBlockConflict(
                train_id=r["train_id"],
                block_id=r["block_id"],
                conflict_type=r.get("conflict_type", "Track Occupied"),
                priority_class=p_class,
                passenger_load_percent=float(r.get("passenger_load_percent", 0.0)),
            )
            bundle.conflicts[(c.train_id, c.block_id)] = c
            bundle.conflicts_by_block.setdefault(c.block_id, []).append(c)

    # 7. Weather
    with open(data_dir / "weather.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            w = WeatherRecord(
                date=r["date"],
                region=r["region"],
                rainfall_forecast_mm=float(r.get("rainfall_forecast_mm", 0.0)),
                temperature_c=float(r.get("temperature_c", 25.0)),
                humidity_percent=float(r.get("humidity_percent", 50.0)),
            )
            bundle.weather[(w.date, w.region)] = w

    # 8. Goods Forecast
    with open(data_dir / "goods_forecast.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            gf = GoodsForecast(
                date=r["date"],
                corridor_id=r["corridor_id"],
                corridor_name=r.get("corridor_name", ""),
                freight_demand_index=float(r.get("freight_demand_index", 1.0)),
                expected_freight_trains=int(r.get("expected_freight_trains", 0)),
            )
            bundle.goods_forecast[(gf.date, gf.corridor_id)] = gf

    # 9. Maintenance Tasks (joined with authoritative Neev predictions)
    with open(data_dir / "maintenance_tasks.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            aid = r["asset_id"]
            if aid not in bundle.neev_predictions:
                raise ValueError(
                    f"[NEEV JOIN ERROR] Task {r['task_id']} references asset_id {aid} "
                    f"which does not exist in authoritative neev_predictions_for_optimizer.csv!"
                )
            neev = bundle.neev_predictions[aid]

            task = Task(
                task_id=r["task_id"],
                asset_id=aid,
                department=r["department"],
                maintenance_type=r["maintenance_type"],
                corridor_id=r["corridor_id"],
                section_id=r["section_id"],
                task_date=r["task_date"],
                deadline=r["deadline"],
                risk_score=neev.risk_score,  # Canonical Neev risk score
                risk_level=neev.risk_level,  # Canonical Neev risk level
                failure_probability_30d=neev.failure_probability_30d,
                forecast_30d_degradation=neev.forecast_30d_degradation,
                priority_score=float(r.get("priority_score", 50.0)),
                required_duration_minutes=int(r["required_duration_minutes"]),
                required_team_size=int(r["required_team_size"]),
                preferred_start_minute=int(r["preferred_start_minute"]),
                max_delay_tolerance_minutes=int(r.get("max_delay_tolerance_minutes", 60)),
                can_bundle=(r["can_bundle"].strip().lower() == "yes"),
                source_task_date=r.get("source_task_date", r["task_date"]),
                source_deadline=r.get("source_deadline", r["deadline"]),
                source_risk=r.get("source_risk", "neev"),
            )
            bundle.tasks[task.task_id] = task
            bundle.tasks_by_date.setdefault(task.task_date, []).append(task)

    # Verify 1:1 coverage between Neev predictions and maintenance tasks
    if len(bundle.tasks) != len(bundle.neev_predictions):
        raise ValueError(
            f"[NEEV COVERAGE ERROR] Task count ({len(bundle.tasks)}) does not match "
            f"Neev predictions count ({len(bundle.neev_predictions)})!"
        )

    return bundle
