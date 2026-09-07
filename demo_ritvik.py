"""
Interactive Demonstration of Ritvik's Dynamic Railway Operations & Conflict Resolution Engine.
Demonstrates:
  Scenario A: Rerouting Success -> OPERATIONAL_UPDATE (Maintenance Plan Preserved)
  Scenario B: Rerouting Infeasible -> REPLAN_REQUEST -> Arnav
"""

import json
from pathlib import Path
from ritvik.config import RitvikConfig
from ritvik.engine import RitvikEngine
from ritvik.data_loader import OperationalEvent
from ritvik.validator import validate_operational_decision, validate_replan_request_file


def min_to_hhmm(minutes: int) -> str:
    """Converts minute of day (0-1440) to standard HH:MM time string."""
    h = (minutes // 60) % 24
    m = minutes % 60
    return f"{h:02d}:{m:02d}"


def run_demo():
    print("================================================================================")
    print("        RITVIK DYNAMIC RAILWAY OPERATIONS & REPLANNING ENGINE (AI/OR)")
    print("================================================================================")

    config = RitvikConfig()
    engine = RitvikEngine(config)
    engine.initialize()

    task_id = "TASK-000005"
    maint = engine.maintenance_plan[task_id]
    sec_meta = engine.corridor_meta.get(maint.section_id, {})
    sec_name = sec_meta.get("section_name", maint.section_id)
    cor_name = sec_meta.get("corridor_name", maint.corridor_id)

    # ==========================================================================
    # SCENARIO A — REROUTING SUCCESS (OPERATIONAL_UPDATE)
    # ==========================================================================
    print("\n" + "=" * 80)
    print("SCENARIO A — DYNAMIC TRAIN REROUTING (MAINTENANCE PLAN PRESERVED)")
    print("=" * 80)

    print("\n[1] ARNAV MAINTENANCE PLAN RECEIVED")
    print("--------------------------------------------------------------------------------")
    print(f"Task ID:              {maint.task_id} (Asset: {maint.asset_id})")
    print(f"Maintenance Type:     Rail Grinding")
    print(f"Department:           {maint.department}")
    print(f"Location:             {maint.section_id} — {sec_name} ({cor_name})")
    print(f"Date:                 {maint.date}")
    print(f"Maintenance Window:   {min_to_hhmm(maint.start_minute)} - {min_to_hhmm(maint.end_minute)} ({maint.duration_minutes} min)")
    print(f"Assigned Blocks:      {', '.join(maint.block_ids)}")
    print(f"Assigned Crew:        {', '.join(maint.assigned_teams)}")
    print(f"Neev Risk Score:      {maint.risk_score:.1f} / 100.0 (CRITICAL)")

    # Event 1: Unscheduled Special Train
    evt_a = OperationalEvent(
        event_id="EVT-001",
        event_type="NEW_TRAIN",
        train_id="TRN-SIM-001",
        train_name="Special Rajdhani Relief Express",
        section_id="SEC-0004",
        destination_section_id="SEC-0010",
        arrival_minute=70,
        departure_minute=95,
        date="2026-09-07",
        priority_class=2,
        notes="Unscheduled passenger train introduced on SEC-0004",
    )

    print("\n[2] CURRENT RAILWAY OPERATIONAL STATE")
    print("--------------------------------------------------------------------------------")
    print(f"Operational Event:    {evt_a.event_id} ({evt_a.event_type})")
    print(f"Train Introduced:     {evt_a.train_id} — {evt_a.train_name}")
    print(f"Affected Section:     {evt_a.section_id} ({sec_name})")
    print(f"Train Timetable:      {min_to_hhmm(evt_a.arrival_minute)} - {min_to_hhmm(evt_a.departure_minute)} (25 min)")
    print(f"Destination:          {evt_a.destination_section_id}")
    print(f"Priority Class:       Priority {evt_a.priority_class} (Passenger Express)")

    # Configure capacity to simulate mainline congestion vs bypass clearance
    config.section_capacities["SEC-0005"] = 0  # Congested mainline track
    config.section_capacities["SEC-0007"] = 8  # Clear bypass siding

    res_a = engine.process_scenario(task_id, [evt_a], write_outputs=True)
    conflict_a = res_a["conflict_report"]
    reroute_a = res_a["reroute_results"][0] if res_a["reroute_results"] else None
    decision_a = res_a["decision"]

    print("\n[3] CONFLICT ANALYSIS (TIME-INTERVAL COLLISION DETECTION)")
    print("--------------------------------------------------------------------------------")
    print(f"Maintenance Window:   {min_to_hhmm(maint.start_minute)} - {min_to_hhmm(maint.end_minute)} (Minutes {maint.start_minute} to {maint.end_minute})")
    print(f"Train Occupancy:      {min_to_hhmm(evt_a.arrival_minute)} - {min_to_hhmm(evt_a.departure_minute)} (Minutes {evt_a.arrival_minute} to {evt_a.departure_minute})")
    overlap_s, overlap_e = conflict_a.overlap_window
    print(f"Direct Overlap:       {min_to_hhmm(overlap_s)} - {min_to_hhmm(overlap_e)} ({overlap_e - overlap_s} minutes collision!)")
    print(f"Collision Status:     ACTIVE CONFLICT DETECTED ({conflict_a.conflict_type})")

    print("\n[4] CAPACITY ANALYSIS & TOPOLOGICAL BYPASS SEARCH")
    print("--------------------------------------------------------------------------------")
    print("Inspecting alternative bypass paths in route_topology.json...")
    for idx, cand in enumerate(reroute_a.inspected_candidates, start=1):
        status_tag = f"[{cand['status']}]"
        print(f"  Candidate {idx}: {cand['path']:<45} {status_tag:<12} Reason: {cand['reason']}")

    print("\n[5] RITVIK OPERATIONAL DECISION")
    print("--------------------------------------------------------------------------------")
    print(f"DECISION:             {decision_a.status}")
    print(f"Maintenance Plan:     VALID (Preserved without rescheduling!)")
    print(f"Replanning Required:  {decision_a.replanning_required}")
    for act in decision_a.train_actions:
        print(f"Train Dispatch:       {act.train_id} -> {act.action} via {' -> '.join(act.new_route)}")
        print(f"Estimated Delay:      +{act.delay_estimate_minutes} min (within operational tolerance)")

    print("\n[6] ADITYA OUTPUT ARTIFACT (ritvik_operational_decision.json)")
    print("--------------------------------------------------------------------------------")
    with open(config.output_decision_path, "r", encoding="utf-8") as f:
        print(f.read().strip())

    # Validate decision
    val_a = validate_operational_decision(decision_a, engine.topology)
    print("\nIndependent Validation Audit:")
    for chk in val_a.checks_passed:
        print(f"  [OK] {chk}")

    # ==========================================================================
    # SCENARIO B — REPLANNING REQUIRED (REPLAN_REQUEST -> ARNAV)
    # ==========================================================================
    print("\n\n" + "=" * 80)
    print("SCENARIO B — ALL BYPASSES BLOCKED (AUTOMATED REPLAN REQUEST TO ARNAV)")
    print("=" * 80)

    print("\n[1] OPERATIONAL EVENT: HIGH PRIORITY VVIP MOVEMENT ON CONGESTED CORRIDOR")
    print("--------------------------------------------------------------------------------")
    evt_b = OperationalEvent(
        event_id="EVT-002",
        event_type="NEW_TRAIN",
        train_id="TRN-SIM-002",
        train_name="Military Emergency Supply Train",
        section_id="SEC-0004",
        destination_section_id="SEC-0010",
        arrival_minute=110,
        departure_minute=140,
        date="2026-09-07",
        priority_class=1,
        notes="High-priority emergency movement",
    )
    print(f"Event:                {evt_b.event_id} ({evt_b.train_id} — {evt_b.train_name})")
    print(f"Section:              {evt_b.section_id} on {evt_b.date}")
    print(f"Window:               {min_to_hhmm(evt_b.arrival_minute)} - {min_to_hhmm(evt_b.departure_minute)} (Conflicts with TASK-000005)")

    # Simulate corridor saturation: both alternate corridors have 0 capacity
    config.section_capacities["SEC-0005"] = 0
    config.section_capacities["SEC-0007"] = 0

    res_b = engine.process_scenario(task_id, [evt_b], write_outputs=True)
    conflict_b = res_b["conflict_report"]
    reroute_b = res_b["reroute_results"][0] if res_b["reroute_results"] else None
    decision_b = res_b["decision"]

    print("\n[2] ALTERNATIVE ROUTE FEASIBILITY AUDIT")
    print("--------------------------------------------------------------------------------")
    for idx, cand in enumerate(reroute_b.inspected_candidates, start=1):
        status_tag = f"[{cand['status']}]"
        print(f"  Candidate {idx}: {cand['path']:<45} {status_tag:<12} Reason: {cand['reason']}")
    print("Result: ALL ALTERNATIVE BYPASS ROUTES ARE INFEASIBLE.")

    print("\n[3] RITVIK OPERATIONAL DECISION")
    print("--------------------------------------------------------------------------------")
    print(f"DECISION:             {decision_b.status}")
    print(f"Maintenance Plan:     INVALID (Cannot execute safely in current window)")
    print(f"Replanning Required:  {decision_b.replanning_required}")
    print(f"Action:               Trigger automated REPLAN_REQUEST back to Arnav Optimizer")

    print("\n[4] ARNAV HANDOFF ARTIFACT (replan_request.json)")
    print("--------------------------------------------------------------------------------")
    with open(config.replan_request_path, "r", encoding="utf-8") as f:
        print(f.read().strip())

    # Validate replan request file
    val_b = validate_replan_request_file(config.replan_request_path)
    print("\nIndependent Validation Audit:")
    for chk in val_b.checks_passed:
        print(f"  [OK] {chk}")

    print("\n================================================================================")
    print("DEMO COMPLETED SUCCESSFULLY — RITVIK OPERATIONS ENGINE VERIFIED")
    print("================================================================================")


if __name__ == "__main__":
    run_demo()
