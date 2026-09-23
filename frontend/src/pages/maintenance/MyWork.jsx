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
  ArrowRight
} from 'lucide-react';

export const MyWork = () => {
  const { tasksInventory, updateTaskStatus, isReplanned } = usePlan();
  const { selectedDept } = useAuth();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const filterOptions = [
    'All',
    'Pending',
    'Scheduled',
    'In Progress',
    'Completed',
    'Rescheduled',
  ];

  const myTasks = useMemo(() => {
    return tasksInventory.filter((task) => {
      if (selectedDept && selectedDept !== 'All Departments') {
        if (task.department !== selectedDept) return false;
      }

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
    setStatusMessage(`Work order ${formatTaskId(selectedTask.task_id)} status updated to: ${newStatus}`);
    setSelectedTask((prev) => ({ ...prev, status: newStatus }));
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // Work Details View (Section 11 & 19: Structured sections, not random floating boxes)
  if (selectedTask) {
    const isHero = selectedTask.task_id === 'TASK-000005';
    const shortTaskId = formatTaskId(selectedTask.task_id);
    const shortAssetId = formatAssetId(selectedTask.asset_id);

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <BackButton onClick={() => setSelectedTask(null)} />
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

          {/* Structured Specifications Table (Section 19: Tables/Sections, not floating cards) */}
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

          {/* Action Trigger Group */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Field Execution Actions:</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAction('In Progress')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-semibold transition-colors shadow-2xs"
              >
                <Play size={12} />
                <span>{t('startWork', 'Start Work')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Completed')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <CheckCircle2 size={12} />
                <span>{t('completeWork', 'Complete Work')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Conflict Detected')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <AlertCircle size={12} />
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
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {t('myWorkTitle', 'Assigned Maintenance Work Orders')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('myWorkSubtitle', 'Work assigned to your engineering division and active duty crews.')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mac-panel p-2.5 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5">
          {filterOptions.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300'
                }`}
              >
                {filter === 'All' ? t('all', 'All') : filter}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono font-medium text-slate-400 shrink-0">
          {myTasks.length} {t('all', 'Items')}
        </span>
      </div>

      {/* Work Orders Table */}
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
                <th className="text-right">{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.map((task) => {
                const shortTaskId = formatTaskId(task.task_id);
                const shortAssetId = formatAssetId(task.asset_id);
                const isHero = task.task_id === 'TASK-000005';
                const isJoint = isHero || task.canCollaborate;

                return (
                  <tr key={task.task_id} className="cursor-pointer hover:bg-slate-50/70 dark:hover:bg-white/[0.03]" onClick={() => setSelectedTask(task)}>
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
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors dark:bg-white/[0.06] dark:text-slate-200"
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
