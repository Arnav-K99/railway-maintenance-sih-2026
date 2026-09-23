import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { 
  TrainTrack, 
  AlertTriangle, 
  ArrowRight,
  Radio,
  CalendarDays,
  RefreshCw,
  CheckSquare
} from 'lucide-react';

export const AuthDashboard = ({ onNavigate }) => {
  const { metrics, isReplanned } = usePlan();
  const { t } = useLanguage();

  // Simplified Upcoming Maintenance List across 1-Week Horizon
  const upcomingMaintenance = [
    {
      taskId: 'TASK-000004',
      dept: 'Track / Civil',
      work: 'Joint Track Ultrasonic Inspection',
      date: '03 Sep (Mon)',
      status: 'Scheduled',
    },
    {
      taskId: 'TASK-000210',
      dept: 'Track / Civil',
      work: 'Track Tamping & Dynamic Ballasting',
      date: '04 Sep (Tue)',
      status: 'Scheduled',
    },
    {
      taskId: 'TASK-000315',
      dept: 'Electrical / TRD',
      work: 'Catenary Wire Pull & Stagger Check',
      date: '05 Sep (Wed)',
      status: 'Scheduled',
    },
    {
      taskId: 'TASK-000512',
      dept: 'Signal & Telecom',
      work: 'Track Circuit Relay Overhaul',
      date: '06 Sep (Thu)',
      status: 'Scheduled',
    },
    {
      taskId: 'TASK-000005',
      dept: 'Electrical / TRD',
      work: 'Rail Grinding & OHE Adjust',
      date: isReplanned ? '08 Sep (Sat)' : '07 Sep (Fri)',
      status: isReplanned ? 'Rescheduled' : 'Scheduled',
    },
  ];

  // Simplified Replanning Events List (Section 13 requirement)
  const replanningAlerts = [
    {
      trainId: 'TRN-SIM-001',
      title: 'Container Relief Freight on SEC-0004',
      status: 'Replan Required',
    },
    {
      trainId: 'TRN-SIM-002',
      title: 'Emergency Priority Movement on SEC-0004',
      status: 'Conflict Detected',
    },
    {
      trainId: 'TRN-SIM-003',
      title: 'Speed Restriction Bottleneck on SEC-0005',
      status: 'Resolved',
    },
  ];

  // Simplified Recent Verification Activity List with Authority Sign-Offs
  const recentVerifications = [
    {
      taskId: 'TASK-000421',
      work: 'Track Realignment & Ballast',
      decision: 'Accepted',
      signedBy: 'Authority A',
      date: '07 Sep',
    },
    {
      taskId: 'TASK-000512',
      work: 'Signal Overhaul Inspection',
      decision: 'Accepted',
      signedBy: 'Authority B',
      date: '06 Sep',
    },
    {
      taskId: 'TASK-000214',
      work: 'OHE Isolator Switch Test',
      decision: 'Rejected',
      signedBy: 'Authority C',
      date: '05 Sep',
    },
    {
      taskId: 'TASK-000892',
      work: 'Ballast Dressing Audit Inquiry',
      decision: 'False Closure Reported',
      signedBy: 'Authority D',
      date: '04 Sep',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/[0.08] pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t('authDashboard', 'Authority Dashboard')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational possession summary, replanning alerts, and recent verification activity
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('operations')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Radio size={13} className="text-macblue-500" />
          <span>Open Weekly Calendar</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Section 1: Operational Status (Unicolor Summary Cards) */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Operational Status
        </h3>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="unicolor-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Active Blocks
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                12
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Conflict-free possession windows</span>
            </div>
            <div className="p-2.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
              <TrainTrack size={20} />
            </div>
          </div>

          <div className="unicolor-card flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Operational Alerts
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                3
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Train headway overlaps under review</span>
            </div>
            <div className="p-2.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-amber-500">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Upcoming Maintenance (Section 13 requirement) */}
      <div className="mac-panel overflow-hidden">
        <div className="mac-panel-header">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Upcoming Maintenance
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('upcoming')}
            className="text-[11px] text-macblue-500 hover:underline font-semibold"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="mac-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Department</th>
                <th>Maintenance Work</th>
                <th>Scheduled Date</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMaintenance.map((m) => (
                <tr key={m.taskId}>
                  <td className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatTaskId(m.taskId)}
                  </td>
                  <td className="text-slate-600 dark:text-slate-400 text-xs">
                    {m.dept}
                  </td>
                  <td className="font-medium text-slate-800 dark:text-slate-200">
                    {m.work}
                  </td>
                  <td className="font-mono text-xs text-slate-700 dark:text-slate-300">
                    {m.date}
                  </td>
                  <td className="text-right">
                    <GovBadge status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Grid: Replanning Events & Recent Verification (Section 13 requirement) */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Section 3: Replanning Events */}
        <div className="mac-panel overflow-hidden">
          <div className="mac-panel-header">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Replanning Events
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('replanning')}
              className="text-[11px] text-macblue-500 hover:underline font-semibold"
            >
              Inspect
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {replanningAlerts.map((r) => (
              <div key={r.trainId} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white block">
                    {r.trainId}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {r.title}
                  </span>
                </div>
                <GovBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Recent Verification */}
        <div className="mac-panel overflow-hidden">
          <div className="mac-panel-header">
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Recent Verification
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('verification')}
              className="text-[11px] text-macblue-500 hover:underline font-semibold"
            >
              Audit Log
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {recentVerifications.map((v) => (
              <div key={v.taskId} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatTaskId(v.taskId)}
                  </span>
                  <span className="mx-1.5 text-slate-400">•</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {v.work}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Recorded: {v.date} • Certified: <span className="font-semibold text-slate-300">{v.signedBy}</span>
                  </div>
                </div>
                <GovBadge status={v.decision} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
