import React, { createContext, useContext, useState, useMemo } from 'react';
import initialPlanJson from '../data/optimized_block_plan.json';
import metricsJson from '../data/optimization_metrics.json';
import initialTasks from '../data/tasks_inventory.json';
import { 
  INITIAL_PLAN_TASK_5, 
  REPLANNED_PLAN_TASK_5, 
  DAY_7_TIMELINE_TASKS, 
  SIMULATION_EVENTS 
} from '../data/simulationData';

const PlanContext = createContext();

export const PlanContext_Provider = ({ children }) => {
  // Replan state for TASK-000005 (07 Sep vs 08 Sep)
  const [isReplanned, setIsReplanned] = useState(false);

  // Active operational disruption event
  const [activeEvent, setActiveEvent] = useState(null);

  // Replan request emitted state
  const [replanRequestActive, setReplanRequestActive] = useState(false);

  // Maintenance Editable Requirements state
  const [taskRequirements, setTaskRequirements] = useState({
    'TASK-000005': {
      maintType: 'Rail Grinding',
      duration: 200,
      personnel: 5,
      teamType: 'OHE / TRD Special Gang (TEAM-013)',
      equipment: 'Rail Grinding Train (RGM-02), OHE Tower Car',
      preferredWindow: '00:00 – 04:00 (Night Possession)',
      deadline: '2026-09-08',
      canCollaborate: true,
      collaboratingDept: 'Track / Civil Engineering',
      canBundle: true,
      isSubmitted: true,
      lastUpdated: '2026-09-07 09:30',
    },
    'TASK-000018': {
      maintType: 'Track Inspection & Alignment',
      duration: 180,
      personnel: 6,
      teamType: 'Permanent Way Gang 4',
      equipment: 'USFD Testing Rig, Track Gauges',
      preferredWindow: '04:00 – 08:00 (Early Morning)',
      deadline: '2026-09-09',
      canCollaborate: false,
      collaboratingDept: 'None',
      canBundle: false,
      isSubmitted: true,
      lastUpdated: '2026-09-07 10:15',
    },
    'TASK-000031': {
      maintType: 'Signal Relay Overhaul',
      duration: 150,
      personnel: 4,
      teamType: 'S&T Signal Tech Unit',
      equipment: 'Relay Testing Bench, Multi-meters',
      preferredWindow: '11:00 – 14:00 (Day Headway)',
      deadline: '2026-09-10',
      canCollaborate: true,
      collaboratingDept: 'Electrical / TRD',
      canBundle: false,
      isSubmitted: true,
      lastUpdated: '2026-09-07 11:00',
    },
  });

  // Task execution overrides (e.g. In Progress, Completed, etc.)
  const [taskStatusOverrides, setTaskStatusOverrides] = useState({});

  // Work verification audits (Accept, Reject, False Closure)
  const [verifications, setVerifications] = useState({
    'TASK-000421': {
      status: 'Verified',
      inspector: 'Authority A',
      comments: 'Track geometric alignment and cross-level variance verified within ±1mm limit.',
      reportedAt: '2026-09-06 14:30',
    },
  });

  // False closure reports log
  const [falseClosureReports, setFalseClosureReports] = useState([
    {
      reportId: 'FCR-2026-089',
      taskId: 'TASK-000892',
      department: 'Track / Civil Engineering',
      assetId: 'AST-120892',
      section: 'SEC-0014',
      reportedBy: 'Authority B',
      discrepancy: 'Ballast shoulder dressing left incomplete near km post 142/6 despite closure sign-off.',
      reportedAt: '2026-09-05 16:45',
      status: 'Under Safety Commission Inquiry',
    },
  ]);

  // Derive scheduled tasks
  const scheduledTasks = useMemo(() => {
    const base = initialPlanJson.scheduled_tasks.map((task) => {
      if (task.task_id === 'TASK-000005') {
        return isReplanned ? REPLANNED_PLAN_TASK_5 : INITIAL_PLAN_TASK_5;
      }
      return task;
    });

    const existingIds = new Set(base.map((t) => t.task_id));
    const extraDay7 = DAY_7_TIMELINE_TASKS.filter((t) => !existingIds.has(t.task_id));

    return [...base, ...extraDay7];
  }, [isReplanned]);

  // Derive consolidated tasks inventory
  const tasksInventory = useMemo(() => {
    return initialTasks.map((t) => {
      let currentStatus = t.status;
      if (taskStatusOverrides[t.task_id]) {
        currentStatus = taskStatusOverrides[t.task_id].status;
      }
      if (verifications[t.task_id]) {
        currentStatus = verifications[t.task_id].status;
      }
      if (t.task_id === 'TASK-000005' && isReplanned) {
        currentStatus = 'Rescheduled';
      }
      return {
        ...t,
        status: currentStatus,
        statusMeta: taskStatusOverrides[t.task_id] || null,
        verificationMeta: verifications[t.task_id] || null,
        requirement: taskRequirements[t.task_id] || null,
      };
    });
  }, [isReplanned, taskStatusOverrides, verifications, taskRequirements]);

  // Actions
  const toggleReplan = (state) => {
    const newState = state !== undefined ? state : !isReplanned;
    setIsReplanned(newState);
    if (newState) {
      setReplanRequestActive(false);
    }
  };

  const triggerEvent = (eventId) => {
    const ev = SIMULATION_EVENTS.find((e) => e.id === eventId);
    if (ev) {
      setActiveEvent(ev);
      if (ev.outcomeType === 'REPLAN_REQUEST') {
        setReplanRequestActive(true);
      }
    }
  };

  const clearEvent = () => {
    setActiveEvent(null);
    setReplanRequestActive(false);
  };

  const executeReplanFlow = () => {
    setIsReplanned(true);
    setReplanRequestActive(false);
  };

  // Maintenance: Save editable requirement
  const saveTaskRequirement = (taskId, newReq) => {
    setTaskRequirements((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        ...newReq,
        isSubmitted: true,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    }));
  };

  // Maintenance: Field status change
  const updateTaskStatus = (taskId, newStatus, reason = '', proposedDate = '') => {
    setTaskStatusOverrides((prev) => ({
      ...prev,
      [taskId]: {
        status: newStatus,
        reason,
        proposedDate,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    }));
  };

  // Authority: Accept work
  const acceptWork = (taskId, inspector = 'Chief Operations Controller', comments = '') => {
    setVerifications((prev) => ({
      ...prev,
      [taskId]: {
        status: 'Verified',
        inspector,
        comments: comments || 'Certified compliant with Indian Railways Track Manual standards.',
        reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    }));
  };

  // Authority: Reject work
  const rejectWork = (taskId, inspector = 'Chief Operations Controller', reason = '') => {
    setVerifications((prev) => ({
      ...prev,
      [taskId]: {
        status: 'Rejected',
        inspector,
        comments: reason || 'Work does not meet engineering tolerances. Rework mandated.',
        reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    }));
  };

  // Authority: Report False Closure
  const reportFalseClosureAction = (taskId, reporter, discrepancy) => {
    const newReport = {
      reportId: `FCR-2026-${Math.floor(100 + Math.random() * 900)}`,
      taskId,
      department: tasksInventory.find((t) => t.task_id === taskId)?.department || 'Track / Civil Engineering',
      assetId: tasksInventory.find((t) => t.task_id === taskId)?.asset_id || 'AST-120005',
      section: tasksInventory.find((t) => t.task_id === taskId)?.section_id || 'SEC-0004',
      reportedBy: reporter || 'Vigilance Cell / Safety Officer',
      discrepancy: discrepancy || 'Physical inspection confirmed site possession closed without work execution.',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Under Formal Inquiry',
    };

    setFalseClosureReports((prev) => [newReport, ...prev]);

    setVerifications((prev) => ({
      ...prev,
      [taskId]: {
        status: 'False Closure Reported',
        inspector: reporter,
        comments: discrepancy,
        reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    }));
  };

  return (
    <PlanContext.Provider
      value={{
        isReplanned,
        toggleReplan,
        activeEvent,
        triggerEvent,
        clearEvent,
        executeReplanFlow,
        replanRequestActive,
        scheduledTasks,
        tasksInventory,
        metrics: metricsJson,
        taskRequirements,
        saveTaskRequirement,
        updateTaskStatus,
        verifications,
        acceptWork,
        rejectWork,
        reportFalseClosure: reportFalseClosureAction,
        falseClosureReports,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
