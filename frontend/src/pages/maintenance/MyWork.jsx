import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { BackButton } from '../../components/common/BackButton';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { 
  Wrench, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const MyWork = () => {
  const { tasksInventory, updateTaskStatus, isReplanned } = usePlan();
  const { selectedDept } = useAuth();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Find currently selected task from live inventory so updates reflect immediately
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasksInventory.find((t) => t.task_id === selectedTaskId) || null;
  }, [tasksInventory, selectedTaskId]);

  // Dynamic status counters for the selected department
  const counts = useMemo(() => {
    let all = 0;
    let scheduled = 0;
    let inProgress = 0;
    let completed = 0;
    let rescheduled = 0;

    tasksInventory.forEach((task) => {
      if (selectedDept && selectedDept !== 'All Departments') {
        const deptPrefix = selectedDept.split('/')[0].trim().toLowerCase();
        if (!task.department.toLowerCase().includes(deptPrefix)) return;
      }

      all++;
      const s = String(task.status || '').toLowerCase();
      if (s.includes('in progress') || s.includes('active')) {
        inProgress++;
      } else if (s.includes('complete') || s.includes('verified')) {
        completed++;
      } else if (s.includes('conflict') || s.includes('reschedule') || s.includes('issue') || s.includes('replan')) {
        rescheduled++;
      } else {
        scheduled++;
      }
    });

    return { all, scheduled, inProgress, completed, rescheduled };
  }, [tasksInventory, selectedDept]);

  const filterTabs = [
    { id: 'All', label: t('all', 'All Work Orders'), count: counts.all },
    { id: 'Scheduled', label: 'Scheduled / Pending', count: counts.scheduled },
    { id: 'In Progress', label: 'In Progress', count: counts.inProgress },
    { id: 'Completed', label: 'Completed', count: counts.completed },
    { id: 'Rescheduled', label: 'Issues / Disrupted', count: counts.rescheduled },
  ];

  const myTasks = useMemo(() => {
    return tasksInventory.filter((task) => {
      if (selectedDept && selectedDept !== 'All Departments') {
        const deptPrefix = selectedDept.split('/')[0].trim().toLowerCase();
        if (!task.department.toLowerCase().includes(deptPrefix)) return false;
      }

      const s = String(task.status || '').toLowerCase();
      if (activeFilter === 'Scheduled') {
        return !s.includes('in progress') && !s.includes('complete') && !s.includes('verified') && !s.includes('conflict') && !s.includes('reschedule');
      }
      if (activeFilter === 'In Progress') {
        return s.includes('in progress') || s.includes('active');
      }
      if (activeFilter === 'Completed') {
        return s.includes('complete') || s.includes('verified');
      }
      if (activeFilter === 'Rescheduled') {
        return s.includes('conflict') || s.includes('reschedule') || s.includes('issue') || s.includes('replan');
      }
      return true;
    });
  }, [tasksInventory, selectedDept, activeFilter]);

  const handleAction = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
    setStatusMessage(`Work order ${formatTaskId(taskId)} updated to: ${newStatus}`);
    setTimeout(() => setStatusMessage(''), 4500);
  };

  // Work Details View
  if (selectedTask) {
    const isHero = selectedTask.task_id === 'TASK-000005';
    const shortTaskId = formatTaskId(selectedTask.task_id);
    const shortAssetId = formatAssetId(selectedTask.asset_id);

    const s = String(selectedTask.status || '').toLowerCase();
    const isCompleted = s.includes('complete') || s.includes('verified');
    const isInProgress = s.includes('in progress') || s.includes('active');
    const isIssue = s.includes('conflict') || s.includes('reschedule') || s.includes('issue');
    const isScheduled = !isCompleted && !isInProgress && !isIssue;

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => setSelectedTaskId(null)} />
          <span className="text-xs font-mono font-bold text-slate-400">
            {shortTaskId} • {shortAssetId}
          </span>
        </div>

        {/* Structured Work Details Container */}
        <div className="mac-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-macblue-500">
                  {shortTaskId}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-500">
                  {selectedTask.department}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedTask.maintenance_type}
              </h2>
            </div>
            <GovBadge status={selectedTask.status || 'Scheduled'} />
          </div>

          {statusMessage && (
            <div className="p-2.5 rounded-md bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-300/80 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Collaborative Work Box */}
          {(isHero || selectedTask.canCollaborate) && (
            <div className="p-3 rounded-md bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] text-xs text-slate-800 dark:text-slate-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-macblue-500">
                <Users size={13} />
                <span>{t('workingWith', 'WORKING WITH')}: Track / Civil Engineering</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Joint possession bundled on section <strong>SEC-0004</strong>. Both work orders execute in the same window.
              </p>
            </div>
          )}

          {/* Structured Specifications Table */}
          <div className="overflow-x-auto border border-slate-100 dark:border-white/[0.06] rounded-md">
            <table className="mac-table">
              <tbody>
                <tr>
                  <td className="w-44 text-slate-500 font-medium">Asset Identifier</td>
                  <td className="font-mono font-semibold text-slate-900 dark:text-white">{shortAssetId}</td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-medium">Section & Corridor</td>
                  <td className="font-medium text-slate-900 dark:text-white">{selectedTask.section_id || 'SEC-0004'} ({selectedTask.corridor_id || 'COR-001'})</td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-medium">Possession Window</td>
                  <td className="font-mono font-semibold text-slate-900 dark:text-white">
                    {isReplanned && isHero ? '08 Sep • 18:00–21:20' : '07 Sep • 00:00–03:20'}
                  </td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-medium">Assigned Team</td>
                  <td className="font-medium text-slate-900 dark:text-white">
                    {isReplanned && isHero ? 'TEAM-018 (Evening Special Unit)' : 'TEAM-013 (Night Unit)'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dynamic Action Trigger Group based on status */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06]">
            {isScheduled && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">Scheduled for possession: Ready to start execution</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(selectedTask.task_id, 'In Progress')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Play size={13} />
                    <span>{t('startWork', 'Start Work')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(selectedTask.task_id, 'Conflict Detected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    <AlertCircle size={13} />
                    <span>{t('reportIssue', 'Report Issue')}</span>
                  </button>
                </div>
              </div>
            )}

            {isInProgress && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                  <span>Work In Progress — Field gang active on track section</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(selectedTask.task_id, 'Completed')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 size={13} />
                    <span>{t('completeWork', 'Complete Work')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(selectedTask.task_id, 'Conflict Detected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    <AlertCircle size={13} />
                    <span>{t('reportIssue', 'Report Issue')}</span>
                  </button>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Work Order Completed • Certified and moved to Completed section</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('Completed');
                    setSelectedTaskId(null);
                  }}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                >
                  View in Completed Section →
                </button>
              </div>
            )}

            {isIssue && (
              <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-200 font-semibold">
                  <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Disruption / Issue Logged • Forwarded to Operations Control for Re-planning</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction(selectedTask.task_id, 'In Progress')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Resume Work</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Master Work Table View
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t('myWorkTitle', 'Assigned Maintenance Work Orders')}
          </h2>
          {selectedDept && selectedDept !== 'All Departments' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              {selectedDept}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('myWorkSubtitle', 'Work assigned to your engineering division and active duty crews.')}
        </p>
      </div>

      {statusMessage && (
        <div className="p-2.5 rounded-md bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-300/80 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Dynamic Section Filter Tabs with Live Item Counts */}
      <div className="mac-panel p-2 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  isSelected 
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-950'
                    : 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Orders Table with Direct Inline Actions */}
      <div className="mac-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="mac-table">
            <thead>
              <tr>
                <th>{t('taskId', 'Task')}</th>
                <th>{t('maintType', 'Maintenance Work')}</th>
                <th>{t('asset', 'Asset')}</th>
                <th>{t('department', 'Department')}</th>
                <th>{t('scheduledBlock', 'Scheduled Block')}</th>
                <th>{t('dateTime', 'Date / Time')}</th>
                <th>{t('status', 'Status')}</th>
                <th className="text-right">{t('action', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-slate-400">
                    No work orders found in "{activeFilter}" section for {selectedDept || 'selected department'}.
                  </td>
                </tr>
              ) : (
                myTasks.map((task) => {
                  const shortTaskId = formatTaskId(task.task_id);
                  const shortAssetId = formatAssetId(task.asset_id);
                  const isHero = task.task_id === 'TASK-000005';
                  const isJoint = isHero || task.canCollaborate;

                  const s = String(task.status || '').toLowerCase();
                  const isRowCompleted = s.includes('complete') || s.includes('verified');
                  const isRowInProgress = s.includes('in progress') || s.includes('active');
                  const isRowScheduled = !isRowCompleted && !isRowInProgress && !s.includes('conflict') && !s.includes('reschedule') && !s.includes('issue');

                  return (
                    <tr 
                      key={task.task_id} 
                      className="cursor-pointer hover:bg-slate-50/70 dark:hover:bg-white/[0.03] transition-colors" 
                      onClick={() => setSelectedTaskId(task.task_id)}
                    >
                      <td className="font-mono font-bold text-slate-900 dark:text-white">
                        {shortTaskId}
                        {isJoint && (
                          <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                            JOINT
                          </span>
                        )}
                      </td>
                      <td className="font-medium text-slate-900 dark:text-white">
                        {task.maintenance_type}
                      </td>
                      <td className="font-mono text-slate-500 dark:text-slate-400">
                        {shortAssetId}
                      </td>
                      <td className="text-slate-600 dark:text-slate-400">
                        {task.department}
                      </td>
                      <td className="font-mono text-slate-600 dark:text-slate-400">
                        {isReplanned && isHero ? 'BLK-012046+47' : task.block_ids?.join('+') || 'BLK-009637+38'}
                      </td>
                      <td className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {isReplanned && isHero ? '08 Sep • 18:00–21:20' : '07 Sep • 00:00–03:20'}
                      </td>
                      <td>
                        <GovBadge status={task.status || 'Scheduled'} />
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Inline Direct Action Buttons */}
                          {isRowScheduled && (
                            <button
                              type="button"
                              onClick={() => handleAction(task.task_id, 'In Progress')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                              title="Start Work execution"
                            >
                              <Play size={11} />
                              <span>Start</span>
                            </button>
                          )}

                          {isRowInProgress && (
                            <button
                              type="button"
                              onClick={() => handleAction(task.task_id, 'Completed')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                              title="Complete and submit for verification"
                            >
                              <CheckCircle2 size={11} />
                              <span>Complete</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedTaskId(task.task_id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors dark:bg-white/[0.06] dark:text-slate-200 cursor-pointer"
                          >
                            <span>{t('details', 'Details')}</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
