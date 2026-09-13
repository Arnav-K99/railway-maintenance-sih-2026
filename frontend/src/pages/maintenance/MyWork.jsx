import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { BackButton } from '../../components/common/BackButton';
import { 
  Wrench, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  FileText,
  ArrowRight
} from 'lucide-react';

export const MyWork = () => {
  const { tasksInventory, updateTaskStatus, isReplanned } = usePlan();
  const { selectedDept } = useAuth();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Primary filter options
  const filterOptions = [
    'All',
    'Pending',
    'Scheduled',
    'In Progress',
    'Completed',
    'Rescheduled',
  ];

  // Work assigned to logged-in worker/team
  const myTasks = useMemo(() => {
    return tasksInventory.filter((task) => {
      // Department filter
      if (selectedDept && selectedDept !== 'All Departments') {
        if (task.department !== selectedDept) return false;
      }

      // Status filter
      if (activeFilter !== 'All') {
        const s = String(task.status || '').toLowerCase();
        if (activeFilter === 'Pending' && !s.includes('pending')) return false;
        if (activeFilter === 'Scheduled' && !s.includes('scheduled')) return false;
        if (activeFilter === 'In Progress' && !s.includes('in progress')) return false;
        if (activeFilter === 'Completed' && !s.includes('complete') && !s.includes('verified')) return false;
        if (activeFilter === 'Rescheduled' && !s.includes('reschedule') && !s.includes('replan')) return false;
      }

      return true;
    });
  }, [tasksInventory, selectedDept, activeFilter]);

  const handleAction = (newStatus) => {
    if (!selectedTask) return;
    updateTaskStatus(selectedTask.task_id, newStatus);
    setStatusMessage(`Work order ${selectedTask.task_id} status updated to: ${newStatus}`);
    setSelectedTask((prev) => ({ ...prev, status: newStatus }));
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // If a task is selected, show Full Work Details Page (with visible BackButton)
  if (selectedTask) {
    const isHero = selectedTask.task_id === 'TASK-000005';
    return (
      <div className="space-y-5">
        {/* Visible Required Back Button */}
        <div className="flex items-center justify-between">
          <BackButton onClick={() => setSelectedTask(null)} />
          <span className="text-xs font-mono font-bold text-slate-500">
            {selectedTask.task_id} • {selectedTask.asset_id}
          </span>
        </div>

        {/* Work Details Header Card */}
        <div className="gov-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-govnavy-700 dark:text-govnavy-300">
                  {selectedTask.task_id}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedTask.department}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {selectedTask.maintenance_type}
              </h2>
            </div>
            <GovBadge status={selectedTask.status || 'Scheduled'} />
          </div>

          {statusMessage && (
            <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Collaborative Work Box (Section 11 requirement) */}
          {(isHero || selectedTask.canCollaborate || selectedTask.department === 'Electrical / TRD') && (
            <div className="p-3.5 rounded bg-blue-50 dark:bg-govnavy-950/60 border border-blue-200 dark:border-govnavy-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Users size={14} className="text-govnavy-700 dark:text-govnavy-300" />
                <span>{t('workingWith', 'WORKING WITH')}: Track / Civil Engineering</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300">
                Joint possession window bundled on section <strong>SEC-0004</strong>. Compatible work orders execute simultaneously under single track closure.
              </p>
            </div>
          )}

          {/* Full Specifications Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Asset Number</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {selectedTask.asset_id}
              </span>
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Section / Corridor</span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
                {selectedTask.section_id || 'SEC-0004'} ({selectedTask.corridor_id || 'COR-001'})
              </span>
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Possession Window</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">
                {isReplanned && isHero ? '08 Sep • 18:00–21:20' : '07 Sep • 00:00–03:20'}
              </span>
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Crew</span>
              <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
                {isReplanned && isHero ? 'TEAM-018 (TRD Evening Gang)' : 'TEAM-013 (TRD Night Gang)'}
              </span>
            </div>
          </div>

          {/* Action Triggers for Field Team */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-mono">
              Status Authority: Field Section Engineer Sign-off
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAction('In Progress')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <Play size={13} />
                <span>{t('startWork', 'Start Work')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Completed')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <CheckCircle2 size={13} />
                <span>{t('completeWork', 'Complete Work')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Conflict Detected')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <AlertCircle size={13} />
                <span>{t('reportIssue', 'Report Issue')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Master Work Table View
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <Wrench size={14} />
          <span>{t('myWork', 'Field Work Orders')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t('myWorkTitle', 'Assigned Maintenance Work Orders')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {t('myWorkSubtitle', 'Work assigned to your engineering division and active duty crews.')}
        </p>
      </div>

      {/* Filter Tabs (Section 11) */}
      <div className="gov-panel p-2.5 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5">
          {filterOptions.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {filter === 'All'
                  ? t('all', 'All')
                  : filter === 'Pending'
                  ? t('pendingWork', 'Pending')
                  : filter === 'Scheduled'
                  ? t('scheduled', 'Scheduled')
                  : filter === 'In Progress'
                  ? t('inProgress', 'In Progress')
                  : filter === 'Completed'
                  ? t('completed', 'Completed')
                  : t('rescheduled', 'Rescheduled')}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
          {myTasks.length} {t('all', 'Work Orders')}
        </span>
      </div>

      {/* Work Orders Table */}
      <div className="gov-panel overflow-hidden">
        <div className="gov-panel-header">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Operational Work Orders
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Click any work order to open full details and execute status updates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table gov-table-zebra">
            <thead>
              <tr>
                <th>{t('taskId', 'Task ID')}</th>
                <th>{t('maintType', 'Maintenance Type')}</th>
                <th>{t('asset', 'Asset ID')}</th>
                <th>{t('department', 'Department')}</th>
                <th>{t('scheduledBlock', 'Scheduled Block')}</th>
                <th>{t('dateTime', 'Date / Time')}</th>
                <th>{t('status', 'Status')}</th>
                <th className="text-right">{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.map((task) => {
                const isHero = task.task_id === 'TASK-000005';
                const isJoint = isHero || task.canCollaborate;

                return (
                  <tr key={task.task_id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedTask(task)}>
                    <td className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300">
                      {task.task_id}
                      {isJoint && (
                        <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                          JOINT
                        </span>
                      )}
                    </td>
                    <td className="font-medium text-slate-900 dark:text-white">
                      {task.maintenance_type}
                    </td>
                    <td className="font-mono text-slate-700 dark:text-slate-300">
                      {task.asset_id}
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">
                      {task.department}
                    </td>
                    <td className="font-mono text-slate-700 dark:text-slate-300">
                      {isReplanned && isHero ? 'BLK-012046+47' : task.block_ids?.join('+') || 'BLK-009637+38'}
                    </td>
                    <td className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                      {isReplanned && isHero ? '08 Sep • 18:00–21:20' : '07 Sep • 00:00–03:20'}
                    </td>
                    <td>
                      <GovBadge status={task.status || 'Scheduled'} />
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-govnavy-800 hover:text-white text-slate-700 text-xs font-semibold transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-govnavy-700"
                      >
                        <span>{t('details', 'Details')}</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
