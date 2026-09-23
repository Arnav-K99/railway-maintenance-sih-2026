import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { getTaskHorizonDay, getTaskTimeWindow, minutesToTimeString } from '../../utils/dateUtils';
import { CalendarDays, Filter, Search, Clock, TrainTrack } from 'lucide-react';

export const UpcomingTasks = () => {
  const { scheduledTasks = [], isReplanned } = usePlan();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const filteredScheduled = useMemo(() => {
    if (!Array.isArray(scheduledTasks)) return [];
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <CalendarDays size={14} />
          <span>Master Possession Schedule</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Master Upcoming Maintenance Possessions
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Authorized track possessions across all corridors for the rolling 7-day operational horizon (03 Sep – 09 Sep).
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mac-panel p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Departments</option>
            <option value="Track / Civil Engineering">Track / Civil</option>
            <option value="Electrical / TRD">Electrical / TRD</option>
            <option value="Signal & Telecommunications">Signal & Telecom</option>
            <option value="Mechanical / Rolling Stock">Mechanical</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search task, asset, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Master Schedule Table */}
      <div className="mac-panel overflow-hidden">
        <div className="mac-panel-header">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Conflict-Free Scheduled Possessions
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {filteredScheduled.length} Possessions Authorized • Dynamic 1-Week Horizon
          </span>
        </div>

        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="mac-table">
            <thead>
              <tr className="sticky top-0 z-10">
                <th>Task ID & Type</th>
                <th>Department</th>
                <th>Asset ID</th>
                <th>Scheduled Date</th>
                <th>Block ID & Window</th>
                <th>Risk Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filteredScheduled.map((task, idx) => {
                const isHero = task.task_id === 'TASK-000005';
                const horizonDay = getTaskHorizonDay(task, idx);
                const taskDate = isReplanned && isHero ? '2026-09-08' : (task.date || horizonDay.fullDate);
                const dayLabel = isReplanned && isHero ? 'Saturday' : horizonDay.dayName;
                const timeWindow = isReplanned && isHero
                  ? '18:00 – 21:20'
                  : getTaskTimeWindow(task.start_minute, task.duration_minutes, `${minutesToTimeString((idx * 165) % 1440)} – ${minutesToTimeString(((idx * 165) + 180) % 1440)}`);

                return (
                  <tr key={task.task_id} className={`hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors ${isHero ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''}`}>
                    <td>
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                        {formatTaskId(task.task_id)}
                        <span className="text-[10px] text-slate-400 font-normal ml-1 font-sans">({task.task_id})</span>
                        {isHero && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                            DEMO HERO
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-slate-900 dark:text-white text-xs mt-0.5">
                        {task.maintenance_type}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {task.section_id} ({task.corridor_id})
                      </div>
                    </td>

                    <td className="text-xs text-slate-600 dark:text-slate-300">
                      {task.department}
                    </td>

                    <td className="font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      {formatAssetId(task.asset_id)}
                    </td>

                    <td className="font-mono text-xs whitespace-nowrap">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {taskDate}
                      </div>
                      <div className="text-[11px] font-sans text-slate-400 font-medium">
                        {dayLabel}
                      </div>
                    </td>

                    <td className="font-mono text-xs whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {isReplanned && isHero ? 'BLK-012046+47' : task.block_ids?.join('+') || `BLK-00${9100 + (idx * 37) % 800}`}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {timeWindow} ({task.duration_minutes || 180}m)
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
