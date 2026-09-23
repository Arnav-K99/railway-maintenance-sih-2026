import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { formatTaskId } from '../../utils/formatters';
import { Clock, Filter, CheckCircle2, XCircle, ShieldAlert, RefreshCw } from 'lucide-react';

export const AuthHistory = () => {
  const { isReplanned, verifications, falseClosureReports } = usePlan();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');

  // Complete Authority Audit History items across 1-week horizon (03 Sep - 09 Sep)
  // Names of people removed and replaced with Authority A, Authority B, etc. as requested
  const masterHistory = [
    {
      id: 'AUD-2026-941',
      category: 'Rescheduled',
      taskId: 'TASK-000005',
      maintName: 'Rail Grinding (Bundled)',
      department: 'Electrical / TRD',
      section: 'SEC-0004',
      date: '08 Sep 2026',
      time: '18:00',
      actionOfficial: 'Authority A',
      details: 'Shifted from 07 Sep (00:00–03:20) to 08 Sep (18:00–21:20) following collision with military emergency movement TRN-SIM-002.',
      status: 'Rescheduled',
    },
    {
      id: 'AUD-2026-935',
      category: 'Accepted',
      taskId: 'TASK-000892',
      maintName: 'Ballast Shoulder Dressing & Tamping',
      department: 'Track / Civil Engineering',
      section: 'SEC-0014',
      date: '09 Sep 2026',
      time: '10:45',
      actionOfficial: 'Authority B',
      details: 'Work verified compliant with tolerance limits. Possession cleared with full safety headway restored.',
      status: 'Verified',
    },
    {
      id: 'AUD-2026-928',
      category: 'Accepted',
      taskId: 'TASK-000421',
      maintName: 'Track Realignment & Dynamic Ballasting',
      department: 'Track / Civil Engineering',
      section: 'SEC-0002',
      date: '07 Sep 2026',
      time: '14:30',
      actionOfficial: 'Authority C',
      details: 'Work officially certified and accepted. Track cross-level within ±1.0mm tolerance standard.',
      status: 'Verified',
    },
    {
      id: 'AUD-2026-921',
      category: 'Completed',
      taskId: 'TASK-000512',
      maintName: 'Track Circuit Bond Wire Replacement',
      department: 'Signal & Telecommunications',
      section: 'SEC-0005',
      date: '06 Sep 2026',
      time: '17:40',
      actionOfficial: 'Authority D',
      details: 'Mainline speed restriction eased; track circuit signal voltage normalized.',
      status: 'Completed',
    },
    {
      id: 'AUD-2026-915',
      category: 'Rejected',
      taskId: 'TASK-000214',
      maintName: 'OHE Isolator Test & Contact Inspection',
      department: 'Electrical / TRD',
      section: 'SEC-0003',
      date: '05 Sep 2026',
      time: '04:30',
      actionOfficial: 'Authority E',
      details: 'Rejected due to substandard insulation resistance (8.2MΩ vs mandatory 10.0MΩ). Rectification work order issued.',
      status: 'Rejected',
    },
    {
      id: 'AUD-2026-902',
      category: 'False Closure Reports',
      taskId: 'TASK-000892',
      maintName: 'Ballast Dressing Audit Inquiry',
      department: 'Track / Civil Engineering',
      section: 'SEC-0014',
      date: '04 Sep 2026',
      time: '16:45',
      actionOfficial: 'Authority F',
      details: 'Site audit confirmed possession closed without physical dressing. Incident escalated to Safety Commission.',
      status: 'False Closure Reported',
    },
    {
      id: 'AUD-2026-889',
      category: 'Completed',
      taskId: 'TASK-000109',
      maintName: 'Hot Axle Sensor Scan & Calibration',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0012',
      date: '03 Sep 2026',
      time: '15:50',
      actionOfficial: 'Authority G',
      details: 'Routine periodic infrared scan calibration completed on wayside detector head.',
      status: 'Completed',
    },
  ];

  const filterOptions = [
    'All',
    'Accepted',
    'Rejected',
    'False Closure Reports',
    'Completed',
    'Rescheduled',
  ];

  const filteredHistory = masterHistory.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <Clock size={14} />
          <span>Audit Archive</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Authority Possession & Verification Audit Log
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Permanent audit register documenting all accepted, rejected, false-closure reported, and dynamically rescheduled decisions across the 1-week horizon.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mac-panel p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5">
          {filterOptions.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-slate-400 px-2 shrink-0">
          {filteredHistory.length} Records • 03 Sep – 09 Sep Horizon
        </span>
      </div>

      {/* Master Event/History Table */}
      <div className="mac-panel overflow-hidden">
        <div className="mac-panel-header">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Operational Audit Trail
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Signed by Certified Authorities (Authority A–G)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="mac-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Work Order & Section</th>
                <th>Department</th>
                <th>Action Official</th>
                <th>Operational Audit Details</th>
                <th>Action Date</th>
                <th>Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs whitespace-nowrap">
                    {item.id}
                  </td>

                  <td>
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatTaskId(item.taskId)}
                      <span className="text-slate-400 font-normal text-[10px] ml-1.5 font-sans">
                        {item.maintName}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Section: {item.section}
                    </div>
                  </td>

                  <td className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.department}
                  </td>

                  <td className="text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                      {item.actionOfficial}
                    </span>
                  </td>

                  <td className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                    {item.details}
                  </td>

                  <td className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    <div className="font-semibold">{item.date}</div>
                    <div className="text-[10px] text-slate-400">{item.time}</div>
                  </td>

                  <td>
                    <GovBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
