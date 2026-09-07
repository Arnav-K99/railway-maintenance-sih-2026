import React, { createContext, useContext, useState, useMemo } from 'react';
import initialPlanJson from '../data/optimized_block_plan.json';
import metricsJson from '../data/optimization_metrics.json';
import initialTasks from '../data/tasks_inventory.json';
import { INITIAL_PLAN_TASK_5, REPLANNED_PLAN_TASK_5, SIMULATION_EVENTS } from '../data/simulationData';

const PlanContext = createContext();

export const PlanContext_Provider = ({ children }) => {
  // Toggle between original schedule (07 Sep) and replanned schedule (08 Sep) for TASK-000005
  const [isReplanned, setIsReplanned] = useState(false);

  // Active operational event simulated
  const [activeEvent, setActiveEvent] = useState(null);

  // Status overrides for maintenance tasks (e.g. accepted, in_progress, completed)
  const [taskStatusOverrides, setTaskStatusOverrides] = useState({});

  // General user verification actions (approvals, false closure reports)
  const [verifications, setVerifications] = useState({
    'TASK-000421': { status: 'Verified', comments: 'Track alignment certified by station master', reportedAt: '2026-09-04 11:30' },
  });

  // Replan request state
  const [replanRequestActive, setReplanRequestActive] = useState(false);

  // Derive scheduled tasks based on isReplanned state
  const scheduledTasks = useMemo(() => {
    return initialPlanJson.scheduled_tasks.map((task) => {
      if (task.task_id === 'TASK-000005') {
        return isReplanned ? REPLANNED_PLAN_TASK_5 : INITIAL_PLAN_TASK_5;
      }
      return task;
    });
  }, [isReplanned]);

  // Derive all tasks inventory with live status overrides
  const tasksInventory = useMemo(() => {
    return initialTasks.map((t) => {
      let currentStatus = t.status;
      if (taskStatusOverrides[t.task_id]) {
        currentStatus = taskStatusOverrides[t.task_id].status;
      }
      if (t.task_id === 'TASK-000005' && isReplanned) {
        currentStatus = 'Replanned';
      }
      return {
        ...t,
        status: currentStatus,
        statusMeta: taskStatusOverrides[t.task_id] || null,
      };
    });
  }, [isReplanned, taskStatusOverrides]);

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

  const submitVerification = (taskId, action, comments = '') => {
    setVerifications((prev) => ({
      ...prev,
      [taskId]: {
        status: action === 'approve' ? 'Approved' : action === 'false_closure' ? 'False Closure Reported' : 'Rejected',
        comments,
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
        updateTaskStatus,
        verifications,
        submitVerification,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
