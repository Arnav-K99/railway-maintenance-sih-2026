import React, { createContext, useContext, useState } from 'react';

const DemoGuideContext = createContext();

export const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Operations Control Center Overview",
    page: "overview",
    role: "Operations Control",
    description: "Start at the OCC dashboard. Overview of the 7-day planning horizon, 6 critical KPIs, active corridor network status, and upcoming maintenance possessions.",
    tip: "Notice the real-time operational status and network availability metrics from Arnav optimizer."
  },
  {
    step: 2,
    title: "2. Maintenance Demand Inventory",
    page: "demand",
    role: "Operations Control",
    description: "Browse the 30,000-task inventory submitted by civil, electrical, signal, and mechanical maintenance departments.",
    tip: "Click on 'TASK-000005' in the table to inspect its AI predictive risk profile."
  },
  {
    step: 3,
    title: "3. Neev AI Predictive Risk Drawer",
    page: "demand",
    role: "Operations Control",
    highlightTask: "TASK-000005",
    description: "Asset AST-120005 is diagnosed by Neev with 81.0% Failure Risk (CRITICAL) and a 30-day degradation forecast of 71.1.",
    tip: "Neev provides the objective risk signal that prioritizes this task in the optimizer."
  },
  {
    step: 4,
    title: "4. Automatic Block Planning Hero Screen",
    page: "block-planning",
    role: "Operations Control",
    description: "The core screen of the system. Visualizes the conflict-free maintenance schedule on a horizontal 24-hour Gantt timeline across railway sections.",
    tip: "See TASK-000005 scheduled on SEC-0004 in night blocks BLK-009637 + BLK-009638 (00:00 - 03:20)."
  },
  {
    step: 5,
    title: "5. 'Why Did Arnav Select This Block?' Trace",
    page: "block-planning",
    role: "Operations Control",
    openWhyArnav: true,
    description: "Inspect the mathematical decision trace: Neev risk input -> maintenance specs -> pruning table of 9 rejected blocks -> crew match -> best feasible assignment.",
    tip: "Shows exact physical reasons for rejections: train conflicts, track unavailable, shift mismatch."
  },
  {
    step: 6,
    title: "6. Smart Cross-Department Bundling",
    page: "block-planning",
    role: "Operations Control",
    description: "Examine SEC-0073 (Bhopal–Itarsi): Track/Civil TASK-018159 and Electrical/TRD TASK-016913 coordinated into ONE shared possession window.",
    tip: "Eliminates 120 minutes of redundant track disruption and prevents a second train stoppage."
  },
  {
    step: 7,
    title: "7. Event Simulator: Inject Operational Disruption",
    page: "simulator",
    role: "Operations Control",
    description: "Open the simulation environment to test dynamic operational responsiveness. Inject an emergency priority train (TRN-SIM-002) into SEC-0004.",
    tip: "Click 'New Train (Blocked)' to trigger the real-time closed-loop simulation."
  },
  {
    step: 8,
    title: "8. Ritvik Conflict Detection",
    page: "simulator",
    role: "Operations Control",
    description: "Ritvik's time-interval collision engine detects a 30-minute direct overlap between the new train (01:50 - 02:20) and TASK-000005 (00:00 - 03:20).",
    tip: "Calculated via interval overlap: train_arrival < maint_end and train_departure > maint_start."
  },
  {
    step: 9,
    title: "9. Ritvik Topological Route Feasibility Search",
    page: "simulator",
    role: "Operations Control",
    description: "Ritvik explores alternative bypass routes in route_topology.json: SEC-0005 has capacity exhausted; SEC-0007 is congested.",
    tip: "Ritvik audits actual graph connectivity—never inventing fictitious railway routes."
  },
  {
    step: 10,
    title: "10. Rerouting Infeasible -> REPLAN REQUEST",
    page: "simulator",
    role: "Operations Control",
    description: "Because all bypass paths are saturated, Ritvik emits a targeted replan_request.json back to Arnav instead of risking train delays.",
    tip: "Ritvik is NOT a maintenance scheduler. It triggers the feedback loop back to Arnav."
  },
  {
    step: 11,
    title: "11. Arnav CP-SAT Re-Optimization",
    page: "simulator",
    role: "Operations Control",
    description: "Arnav consumes replan_request.json, blacklists BLK-009637 + BLK-009638, and re-optimizes TASK-000005 to 08 Sep (18:00 - 21:20) with TEAM-018.",
    tip: "Proves optimality in 0.86s and writes updated optimized_block_plan.json."
  },
  {
    step: 12,
    title: "12. Original Plan vs Replanned Plan Comparison",
    page: "replanning",
    role: "Operations Control",
    description: "Review the side-by-side comparison interface: Original Plan (07 Sep) -> Conflict Details -> Replanned Plan (08 Sep).",
    tip: "Clear audit trail of why the schedule moved and how constraints remained satisfied."
  },
  {
    step: 13,
    title: "13. Ritvik Re-Validation -> PLAN APPROVED",
    page: "replanning",
    role: "Operations Control",
    description: "Ritvik audits the updated plan on 08 Sep: 0 train conflicts, section available, team available -> PLAN APPROVED emitted to Aditya.",
    tip: "The closed loop is 100% closed: both safety and maintenance delivery are preserved."
  },
  {
    step: 14,
    title: "14. Maintenance Portal Receives Updated Schedule",
    page: "my-tasks",
    role: "Maintenance Personnel",
    description: "Switch to the Maintenance Personnel role. The TRD crew sees the updated work order on 08 Sep (18:00 - 21:20) and can accept or update task status.",
    tip: "Demonstrates seamless end-to-end integration from AI prediction to field execution!"
  }
];

export const DemoGuideProvider = ({ children }) => {
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = DEMO_STEPS[currentStepIndex];

  const nextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const setStep = (index) => {
    if (index >= 0 && index < DEMO_STEPS.length) {
      setCurrentStepIndex(index);
    }
  };

  const toggleGuide = () => {
    setIsGuideActive(!isGuideActive);
  };

  return (
    <DemoGuideContext.Provider
      value={{
        isGuideActive,
        toggleGuide,
        setIsGuideActive,
        currentStepIndex,
        currentStep,
        nextStep,
        prevStep,
        setStep,
        totalSteps: DEMO_STEPS.length,
      }}
    >
      {children}
    </DemoGuideContext.Provider>
  );
};

export const useDemoGuide = () => useContext(DemoGuideContext);
