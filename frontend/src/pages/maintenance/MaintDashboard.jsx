import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth, DEPARTMENTS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { 
  ClipboardList, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Search, 
  Filter, 
  Eye, 
  X,
  Clock,
  Layers
} from 'lucide-react';

export const MaintDashboard = ({ onNavigate }) => {
  const { tasksInventory } = usePlan();
  const { selectedDept, setSelectedDept } = useAuth();
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
      const s = String(task.status || '').toLowerCase();
      const r = Number(task.risk_score || 0);

      if (s.includes('pending') || s.includes('scheduled')) pending++;
      if (r >= 60) highCritical++;
      if (s.includes('in progress') || s.includes('active')) active++;
      if (s.includes('complete') || s.includes('verified')) completed++;
    });

    return { pending, highCritical, active, completed };
  }, [tasksInventory]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasksInventory.filter((task) => {
      // Department filter
      if (selectedDept && selectedDept !== 'All Departments') {
        if (task.department !== selectedDept) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = task.task_id?.toLowerCase().includes(q);
        const matchesAsset = task.asset_id?.toLowerCase().includes(q);
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
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <ClipboardList size={14} />
          <span>{t('maintenancePortal', 'Maintenance Portal')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t('maintDashboard', 'Maintenance Work Management Dashboard')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {t('workInventoryDesc', 'Central work order registry consolidating maintenance demands across Track, TRD, Signal and Mechanical engineering wings.')}
        </p>
      </div>

      {/* Top Summary Cards (Section 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-govnavy-700">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('pendingWork', 'Pending Work')}
            </span>
            <span className="text-xl font-bold font-mono text-govnavy-900 dark:text-white mt-1 block">
              {kpis.pending}
            </span>
          </div>
          <div className="p-2.5 rounded bg-govnavy-50 text-govnavy-800 dark:bg-slate-800 dark:text-govnavy-300">
            <ClipboardList size={18} />
          </div>
        </div>

        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-amber-600">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('highCriticalRisk', 'High/Critical Risk')}
            </span>
            <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1 block">
              {kpis.highCritical}
            </span>
          </div>
          <div className="p-2.5 rounded bg-amber-50 text-amber-800 dark:bg-slate-800 dark:text-amber-300">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-blue-600">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('activeWork', 'Active Work')}
            </span>
            <span className="text-xl font-bold font-mono text-blue-700 dark:text-blue-400 mt-1 block">
              {kpis.active}
            </span>
          </div>
          <div className="p-2.5 rounded bg-blue-50 text-blue-800 dark:bg-slate-800 dark:text-blue-300">
            <Activity size={18} />
          </div>
        </div>

        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-emerald-600">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t('completedWork', 'Completed Work')}
            </span>
            <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1 block">
              {kpis.completed}
            </span>
          </div>
          <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 dark:bg-slate-800 dark:text-emerald-300">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="gov-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter size={12} />
            <span>{t('filter', 'Filter')}:</span>
          </span>
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {dept === 'All Departments' ? t('allDepartments', 'All') : dept.split('/')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('search', 'Search task, asset, dept, type...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Main Work Management Table (Section 9) */}
      <div className="gov-panel overflow-hidden">
        <div className="gov-panel-header">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t('workInventory', 'Maintenance Demand Table')}
            </span>
            <span className="px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
              {filteredTasks.length} {t('all', 'records')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Showing work from ALL engineering departments
          </span>
        </div>

        <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <table className="gov-table gov-table-zebra">
            <thead>
              <tr>
                <th>{t('taskId', 'Task ID')}</th>
                <th>{t('asset', 'Asset ID')}</th>
                <th>{t('maintType', 'Maintenance Type')}</th>
                <th>{t('department', 'Department')}</th>
                <th>{t('risk', 'Risk Level')}</th>
                <th>{t('scheduledDate', 'Scheduled Date')}</th>
                <th>{t('status', 'Status')}</th>
                <th className="text-right">{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.slice(0, 45).map((task) => {
                const isHero = task.task_id === 'TASK-000005';
                return (
                  <tr key={task.task_id} className={isHero ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300">
                      {task.task_id}
                      {isHero && (
                        <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="font-mono text-slate-700 dark:text-slate-300">
                      {task.asset_id}
                    </td>
                    <td className="font-medium text-slate-900 dark:text-white">
                      {task.maintenance_type}
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">
                      {task.department}
                    </td>
                    <td>
                      <GovBadge status={task.risk_level || (task.risk_score >= 80 ? 'CRITICAL' : task.risk_score >= 60 ? 'HIGH' : 'MODERATE')} type="risk" />
                    </td>
                    <td className="font-mono text-slate-700 dark:text-slate-300">
                      {task.scheduled_date || '2026-09-07'}
                    </td>
                    <td>
                      <GovBadge status={task.status || 'Scheduled'} />
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTask(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-govnavy-800 hover:text-white text-slate-700 text-xs font-semibold transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-govnavy-700"
                        title="Inspect Task Details"
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

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="gov-panel max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {selectedTask.task_id} • {selectedTask.asset_id}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedTask.maintenance_type}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Department</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedTask.department}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Risk Score</span>
                <span className="font-semibold text-red-600 font-mono">{selectedTask.risk_score || 81.0}% (CRITICAL)</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Corridor & Section</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTask.corridor_id || 'COR-001'} • {selectedTask.section_id || 'SEC-0004'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Required Duration</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTask.duration_minutes || 200} minutes</span>
              </div>
            </div>

            <div className="p-3 rounded bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Layers size={13} />
                <span>Possession Window Specifications</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300">
                Scheduled during night possession (00:00–04:00) on block BLK-009637+38. Assigned to qualified gang TEAM-013.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
