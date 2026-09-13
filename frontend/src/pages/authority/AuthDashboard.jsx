import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { 
  ShieldCheck, 
  CalendarDays, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  TrainTrack,
  Clock,
  Layers,
  Radio
} from 'lucide-react';

export const AuthDashboard = ({ onNavigate }) => {
  const { metrics, scheduledTasks, isReplanned } = usePlan();
  const { t } = useLanguage();

  // Upcoming critical possessions
  const upcomingBlocks = [
    {
      taskId: 'TASK-000005',
      assetId: 'AST-120005',
      maintType: 'Rail Grinding',
      dept: 'Electrical / TRD',
      section: 'SEC-0004 (Delhi–Agra)',
      date: isReplanned ? '2026-09-08' : '2026-09-07',
      window: isReplanned ? '18:00 – 21:20' : '00:00 – 03:20',
      block: isReplanned ? 'BLK-012046+47' : 'BLK-009637+38',
      risk: 'CRITICAL',
      status: isReplanned ? 'Rescheduled' : 'Scheduled',
    },
    {
      taskId: 'TASK-000004',
      assetId: 'AST-120004',
      maintType: 'Track Inspection & Renewal',
      dept: 'Track / Civil Engineering',
      section: 'SEC-0004 (Delhi–Agra)',
      date: '2026-09-07',
      window: '00:00 – 03:20',
      block: 'BLK-009637+38',
      risk: 'HIGH',
      status: 'Scheduled',
    },
    {
      taskId: 'TASK-000210',
      assetId: 'AST-120002',
      maintType: 'Track Maintenance',
      dept: 'Track / Civil Engineering',
      section: 'SEC-0002 (Palwal)',
      date: '2026-09-07',
      window: '02:00 – 05:30',
      block: 'BLK-009630+31',
      risk: 'MODERATE',
      status: 'Scheduled',
    },
    {
      taskId: 'TASK-000315',
      assetId: 'AST-120003',
      maintType: 'Electrical Maintenance',
      dept: 'Electrical / TRD',
      section: 'SEC-0003 (Faridabad)',
      date: '2026-09-07',
      window: '06:00 – 09:00',
      block: 'BLK-009633',
      risk: 'MODERATE',
      status: 'Scheduled',
    },
  ];

  // Recent operational events & audit records
  const recentHistory = [
    {
      id: 'EVT-2026-901',
      event: 'Replanned Task Approved by Ritvik',
      item: 'TASK-000005 (Rail Grinding)',
      time: '08 Sep 2026, 09:15',
      status: 'Plan Approved',
      detail: 'Replaced BLK-009637 with BLK-012046. Zero train collisions confirmed.',
    },
    {
      id: 'EVT-2026-899',
      event: 'Work Verified by Divisional Engineer',
      item: 'TASK-000421 (Track Realignment)',
      time: '06 Sep 2026, 14:30',
      status: 'Verified',
      detail: 'Certified compliant with Section 4.2 of IR Track Manual.',
    },
    {
      id: 'EVT-2026-894',
      event: 'Work Rejected on Inspection',
      item: 'TASK-000214 (OHE Isolator)',
      time: '03 Sep 2026, 08:45',
      status: 'Rejected',
      detail: 'Megger insulation below 10MΩ threshold. Returned for rectification.',
    },
    {
      id: 'EVT-2026-880',
      event: 'False Closure Discrepancy Filed',
      item: 'TASK-000892 (Ballast Dressing)',
      time: '02 Sep 2026, 18:20',
      status: 'False Closure Reported',
      detail: 'Physical site patrol detected incomplete ballast shoulder dressing.',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>{t('authorityPortal', 'Authority Portal')}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t('authDashboard', 'Authority Operations & Control Dashboard')}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Executive control overview of track possessions, operational headway alerts, and closed-loop replanning audits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('operations')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-govnavy-800 hover:bg-govnavy-700 text-white text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Radio size={13} className="text-saffron-light" />
          <span>Open Weekly Operations Calendar</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Top Operational Summary Cards (Section 14) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Blocks */}
        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-govnavy-700">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Active Blocks
            </span>
            <span className="text-xl font-bold font-mono text-govnavy-900 dark:text-white mt-1 block">
              {metrics.block_utilization?.total_blocks_used || 98}
            </span>
            <span className="text-[10px] text-slate-400">Possession windows</span>
          </div>
          <div className="p-2.5 rounded bg-govnavy-50 text-govnavy-800 dark:bg-slate-800 dark:text-govnavy-300">
            <TrainTrack size={18} />
          </div>
        </div>

        {/* Scheduled Tasks */}
        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-blue-600">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Scheduled Tasks
            </span>
            <span className="text-xl font-bold font-mono text-blue-700 dark:text-blue-400 mt-1 block">
              {scheduledTasks.length}
            </span>
            <span className="text-[10px] text-slate-400">Zero conflicts</span>
          </div>
          <div className="p-2.5 rounded bg-blue-50 text-blue-800 dark:bg-slate-800 dark:text-blue-300">
            <CalendarDays size={18} />
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-amber-600">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Operational Alerts
            </span>
            <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1 block">
              01
            </span>
            <span className="text-[10px] text-slate-400">TRN-SIM-002 on SEC-0004</span>
          </div>
          <div className="p-2.5 rounded bg-amber-50 text-amber-800 dark:bg-slate-800 dark:text-amber-300">
            <AlertTriangle size={18} />
          </div>
        </div>

        {/* Replanning Events */}
        <div className="gov-panel p-3.5 flex items-center justify-between border-l-4 border-l-orange-600">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Replanning Events
            </span>
            <span className="text-xl font-bold font-mono text-orange-700 dark:text-orange-400 mt-1 block">
              03
            </span>
            <span className="text-[10px] text-slate-400">1 Resolved, 2 Audited</span>
          </div>
          <div className="p-2.5 rounded bg-orange-50 text-orange-800 dark:bg-slate-800 dark:text-orange-300">
            <RefreshCw size={18} />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Maintenance & Recent History (Section 14) */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: Upcoming Maintenance Table (7 cols) */}
        <div className="lg:col-span-7 gov-panel overflow-hidden">
          <div className="gov-panel-header">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-govnavy-700 dark:text-govnavy-300" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Upcoming Maintenance Possessions
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('upcoming')}
              className="text-[11px] text-govnavy-700 dark:text-govnavy-300 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Task & Asset</th>
                  <th>Department</th>
                  <th>Window & Block</th>
                  <th>Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBlocks.map((b) => (
                  <tr key={b.taskId}>
                    <td>
                      <div className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300 text-xs">
                        {b.taskId}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {b.maintType}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {b.section}
                      </div>
                    </td>
                    <td className="text-[11px] text-slate-600 dark:text-slate-400">
                      {b.dept}
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {b.date}
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                        {b.window}
                      </div>
                      <div className="text-[10px] font-mono text-govnavy-600 dark:text-govnavy-400">
                        {b.block}
                      </div>
                    </td>
                    <td>
                      <GovBadge status={b.risk} type="risk" />
                    </td>
                    <td>
                      <GovBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent History Log (5 cols) */}
        <div className="lg:col-span-5 gov-panel overflow-hidden flex flex-col">
          <div className="gov-panel-header">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-govnavy-700 dark:text-govnavy-300" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Operational Audits
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('auth-history')}
              className="text-[11px] text-govnavy-700 dark:text-govnavy-300 hover:underline font-semibold"
            >
              View Archive
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 p-2 space-y-2 overflow-y-auto max-h-[400px]">
            {recentHistory.map((h) => (
              <div key={h.id} className="p-2.5 rounded bg-slate-50/70 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {h.id}
                  </span>
                  <GovBadge status={h.status} />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {h.event}
                </div>
                <div className="text-[11px] text-govnavy-700 dark:text-govnavy-300 font-medium">
                  {h.item}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {h.detail}
                </p>
                <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                  {h.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
