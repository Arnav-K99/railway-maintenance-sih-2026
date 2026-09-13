import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { CalendarDays, Filter, Search, Clock, TrainTrack } from 'lucide-react';

export const UpcomingTasks = () => {
  const { scheduledTasks, isReplanned } = usePlan();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const filteredScheduled = useMemo(() => {
    return scheduledTasks.filter((task) => {
      if (selectedDept !== 'ALL' && task.department !== selectedDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = task.task_id?.toLowerCase().includes(q);
        const matchesAsset = task.asset_id?.toLowerCase().includes(q);
        const matchesType = task.maintenance_type?.toLowerCase().includes(q);
        if (!matchesId && !matchesAsset && !matchesType) return false;
      }
      return true;
    });
  }, [scheduledTasks, selectedDept, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <CalendarDays size={14} />
          <span>{t('upcomingTasks', 'Master Possession Schedule')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t('upcomingPossessions', 'Master Upcoming Maintenance Possessions')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {t('upcomingPossessionsDesc', 'Authorized possessions across all railway corridors for the rolling 7-day operational horizon.')}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="gov-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={13} className="text-slate-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs py-1"
          >
            <option value="ALL">All Departments</option>
            <option value="Track / Civil Engineering">Track / Civil</option>
            <option value="Electrical / TRD">Electrical / TRD</option>
            <option value="Signal & Telecommunications">Signal & Telecom</option>
            <option value="Mechanical / Rolling Stock">Mechanical</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search task, asset, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Master Schedule Table (Section 24) */}
      <div className="gov-panel overflow-hidden">
        <div className="gov-panel-header">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Conflict-Free Scheduled Possessions
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {filteredScheduled.length} Possessions Authorized
          </span>
        </div>

        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="gov-table gov-table-zebra">
            <thead>
              <tr>
                <th>Task ID & Type</th>
                <th>Department</th>
                <th>Asset ID</th>
                <th>Scheduled Date</th>
                <th>Block ID & Window</th>
                <th>Risk Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredScheduled.map((task) => {
                const isHero = task.task_id === 'TASK-000005';
                return (
                  <tr key={task.task_id} className={isHero ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                    <td>
                      <div className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300 text-xs">
                        {task.task_id}
                        {isHero && (
                          <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                            DEMO
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-slate-900 dark:text-white text-xs mt-0.5">
                        {task.maintenance_type}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {task.section_id} ({task.corridor_id})
                      </div>
                    </td>

                    <td className="text-xs text-slate-700 dark:text-slate-300">
                      {task.department}
                    </td>

                    <td className="font-mono text-xs text-slate-800 dark:text-slate-200">
                      {task.asset_id}
                    </td>

                    <td className="font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      {isReplanned && isHero ? '2026-09-08' : task.date || '2026-09-07'}
                    </td>

                    <td className="font-mono text-xs">
                      <div className="font-bold text-govnavy-800 dark:text-govnavy-300">
                        {isReplanned && isHero ? 'BLK-012046+47' : task.block_ids?.join('+') || 'BLK-009637+38'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isReplanned && isHero ? '18:00 – 21:20' : '00:00 – 03:20'} ({task.duration_minutes || 200}m)
                      </div>
                    </td>

                    <td>
                      <GovBadge status={task.risk_score >= 80 ? 'CRITICAL' : task.risk_score >= 60 ? 'HIGH' : 'MODERATE'} type="risk" />
                    </td>

                    <td>
                      <GovBadge status={isReplanned && isHero ? 'Rescheduled' : 'Scheduled'} />
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
