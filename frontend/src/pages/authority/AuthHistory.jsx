import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { Clock, Filter, CheckCircle2, XCircle, ShieldAlert, RefreshCw } from 'lucide-react';

export const AuthHistory = () => {
  const { isReplanned, verifications, falseClosureReports } = usePlan();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');

  // Complete Authority Audit History items (Section 25: Accepted, Rejected, False Closure Reports, Completed, Rescheduled)
  const masterHistory = [
    {
      id: 'AUD-2026-941',
      category: 'Rescheduled',
      item: 'TASK-000005 (Rail Grinding)',
      department: 'Electrical / TRD',
      section: 'SEC-0004',
      date: '08 Sep 2026',
      actionOfficial: 'Arnav CP-SAT Re-Optimization',
      details: 'Shifted from 07 Sep (00:00–03:20) to 08 Sep (18:00–21:20) following collision with military emergency movement TRN-SIM-002.',
      status: 'Rescheduled',
    },
    {
      id: 'AUD-2026-928',
      category: 'Accepted',
      item: 'TASK-000421 (Track Realignment)',
      department: 'Track / Civil Engineering',
      section: 'SEC-0002',
      date: '06 Sep 2026',
      actionOfficial: 'K. S. Narayanan (Dy. Chief Engineer)',
      details: 'Work officially certified and accepted. Track cross-level within ±1.0mm tolerance standard.',
      status: 'Verified',
    },
    {
      id: 'AUD-2026-915',
      category: 'Rejected',
      item: 'TASK-000214 (OHE Isolator Test)',
      department: 'Electrical / TRD',
      section: 'SEC-0003',
      date: '03 Sep 2026',
      actionOfficial: 'Senior Divisional Electrical Engineer',
      details: 'Rejected due to substandard insulation resistance (8.2MΩ vs mandatory 10.0MΩ). Rectification work order issued.',
      status: 'Rejected',
    },
    {
      id: 'AUD-2026-902',
      category: 'False Closure Reports',
      item: 'TASK-000892 (Ballast Dressing & Tamping)',
      department: 'Track / Civil Engineering',
      section: 'SEC-0014',
      date: '02 Sep 2026',
      actionOfficial: 'Citizen Rail Auditor / Vigilance Cell',
      details: 'Site audit confirmed possession closed without physical dressing. Incident escalated to Chief Safety Commissioner.',
      status: 'False Closure Reported',
    },
    {
      id: 'AUD-2026-889',
      category: 'Completed',
      item: 'TASK-000109 (Hot Axle Sensor Scan)',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0012',
      date: '02 Sep 2026',
      actionOfficial: 'Carriage & Wagon Supervisor',
      details: 'Routine periodic infrared scan calibration completed on wayside detector head.',
      status: 'Completed',
    },
    {
      id: 'AUD-2026-874',
      category: 'Rescheduled',
      item: 'TASK-000388 (Point Machine Service)',
      department: 'Signal & Telecommunications',
      section: 'SEC-0009',
      date: '05 Sep 2026',
      actionOfficial: 'Arnav Block Scheduler',
      details: 'Rescheduled due to shunting locomotive congestion in Agra Cantt outer yard.',
      status: 'Rescheduled',
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
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <Clock size={14} />
          <span>{t('authHistory', 'Executive Audit Archive')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          Authority Possession & Verification Audit Log
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          Permanent audit register documenting all accepted, rejected, false-closure reported, and dynamically rescheduled possession decisions.
        </p>
      </div>

      {/* Filter Tabs (Section 25 requirement) */}
      <div className="gov-panel p-2.5 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5">
          {filterOptions.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono font-bold text-slate-500 shrink-0">
          {filteredHistory.length} Records
        </span>
      </div>

      {/* Master Event/History Table (Section 25) */}
      <div className="gov-panel overflow-hidden">
        <div className="gov-panel-header">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Statutory Audit Log
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Compliant with Indian Railways General Rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table gov-table-zebra">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Work Order & Asset</th>
                <th>Department</th>
                <th>Action / Sign-Off Official</th>
                <th>Operational Audit Details</th>
                <th>Action Date</th>
                <th>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300 text-xs whitespace-nowrap">
                    {item.id}
                  </td>

                  <td>
                    <div className="font-medium text-slate-900 dark:text-white text-xs">
                      {item.item}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Section: {item.section}
                    </div>
                  </td>

                  <td className="text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {item.department}
                  </td>

                  <td className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.actionOfficial}
                  </td>

                  <td className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                    {item.details}
                  </td>

                  <td className="font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {item.date}
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
