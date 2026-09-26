import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth, isDeptMatch } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { getTaskHorizonDay } from '../../utils/dateUtils';
import { 
  ClipboardList, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Search, 
  Filter, 
  Eye, 
  X,
  Layers,
  Wrench
} from 'lucide-react';

export const MaintDashboard = ({ onNavigate }) => {
  const { tasksInventory } = usePlan();
  const { selectedDept } = useAuth();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  // Top KPIs
  const kpis = useMemo(() => {
    let pending = 0;
    let highCritical = 0;
    let active = 0;
    let completed = 0;

    tasksInventory.forEach((task) => {
      // Filter KPIs strictly by active department
      if (!isDeptMatch(task.department, selectedDept)) return;

      const s = String(task.status || '').toLowerCase();
      const r = Number(task.risk_score || 0);

      if (s.includes('pending') || s.includes('scheduled')) pending++;
      if (r >= 60) highCritical++;
      if (s.includes('in progress') || s.includes('active')) active++;
      if (s.includes('complete') || s.includes('verified')) completed++;
    });

    return { pending, highCritical, active, completed };
  }, [tasksInventory, selectedDept]);

  // Filtered Tasks (Strictly for active department)
  const filteredTasks = useMemo(() => {
    return tasksInventory.filter((task) => {
      // Department filter
      if (!isDeptMatch(task.department, selectedDept)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const shortId = formatTaskId(task.task_id).toLowerCase();
        const shortAsset = formatAssetId(task.asset_id).toLowerCase();
        const matchesId = task.task_id?.toLowerCase().includes(q) || shortId.includes(q);
        const matchesAsset = task.asset_id?.toLowerCase().includes(q) || shortAsset.includes(q);
        const matchesDept = task.department?.toLowerCase().includes(q);
        const matchesType = task.maintenance_type?.toLowerCase().includes(q);
        if (!matchesId && !matchesAsset && !matchesDept && !matchesType) return false;
      }

      return true;
    });
  }, [tasksInventory, selectedDept, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t('maintDashboard', 'Maintenance Dashboard')}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
            {selectedDept}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Dedicated division console for {selectedDept}. Real-time work inventory, health indices, and execution schedule.
        </p>
      </div>

      {/* Unicolor Summary Boxes (Section 5 requirement: All cards share one clean background and border) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="unicolor-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('pendingWork', 'Pending Work')}
            </span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {kpis.pending}
            </span>
          </div>
          <div className="p-2.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
            <ClipboardList size={18} />
          </div>
        </div>

        <div className="unicolor-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('highCriticalRisk', 'High/Critical Risk')}
            </span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {kpis.highCritical}
            </span>
          </div>
          <div className="p-2.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-amber-500 dark:text-amber-400">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="unicolor-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('activeWork', 'Active Work')}
            </span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {kpis.active}
            </span>
          </div>
          <div className="p-2.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-macblue-500">
            <Activity size={18} />
          </div>
        </div>

        <div className="unicolor-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('completedWork', 'Completed Work')}
            </span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
              {kpis.completed}
            </span>
          </div>
          <div className="p-2.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-emerald-500">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mac-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Active Division Indicator (Exclusively locked to chosen department) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Division:
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs">
            <Wrench size={12} className="text-macblue-400 dark:text-macblue-600" />
            <span>{selectedDept}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ({filteredTasks.length} work orders)
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('search', 'Search task, asset, type...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Main Work Management Table (Section 9 & 11: Task ID -> T1, Asset ID -> A1) */}
      <div className="mac-panel overflow-hidden">
        <div className="mac-panel-header">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t('workInventory', 'Maintenance Work Orders')}
            </span>
            <span className="px-2 py-0.2 rounded-full bg-slate-100 dark:bg-white/[0.08] text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300">
              {filteredTasks.length} {t('all', 'records')}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <table className="mac-table">
            <thead>
              <tr>
                <th>{t('taskId', 'Task')}</th>
                <th>{t('asset', 'Asset')}</th>
                <th>{t('maintType', 'Maintenance Work')}</th>
                <th>{t('department', 'Department')}</th>
                <th>{t('risk', 'Risk Level')}</th>
                <th>{t('scheduledDate', 'Scheduled Date')}</th>
                <th>{t('status', 'Status')}</th>
                <th className="text-right">{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.slice(0, 45).map((task, idx) => {
                const shortTaskId = formatTaskId(task.task_id);
                const shortAssetId = formatAssetId(task.asset_id);
                const isHero = task.task_id === 'TASK-000005';
                const horizonDay = getTaskHorizonDay(task, idx);
                const displayDate = task.scheduled_date || `${horizonDay.date} 2026`;

                return (
                  <tr key={task.task_id}>
                    <td className="font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {shortTaskId}
                    </td>
                    <td className="font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      {shortAssetId}
                    </td>
                    <td className="font-medium text-slate-900 dark:text-white">
                      {task.maintenance_type}
                    </td>
                    <td className="text-slate-600 dark:text-slate-300">
                      {task.department}
                    </td>
                    <td>
                      <GovBadge status={task.risk_level || (task.risk_score >= 80 ? 'CRITICAL' : task.risk_score >= 60 ? 'HIGH' : 'MODERATE')} type="risk" />
                    </td>
                    <td className="font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{displayDate}</div>
                      <div className="text-[10px] text-slate-400 font-sans font-medium">{horizonDay.dayName}</div>
                    </td>
                    <td>
                      <GovBadge status={task.status || 'Scheduled'} />
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTask(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.12]"
                        title="View Details"
                      >
                        <Eye size={12} />
                        <span>{t('viewDetails', 'View')}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="mac-panel max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {formatTaskId(selectedTask.task_id)} • {formatAssetId(selectedTask.asset_id)}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedTask.maintenance_type}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] uppercase font-medium text-slate-500 block">Department</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{selectedTask.department}</span>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] uppercase font-medium text-slate-500 block">Risk Score</span>
                <span className="font-bold text-red-600 dark:text-red-400 font-mono mt-0.5 block">{selectedTask.risk_score || 81.0}%</span>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] uppercase font-medium text-slate-500 block">Section</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedTask.section_id || 'SEC-0004'}</span>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] uppercase font-medium text-slate-500 block">Duration</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedTask.duration_minutes || 200} min</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-3 py-1.5 rounded-md border border-slate-200/80 dark:border-white/[0.10] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
              >
                {t('close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
