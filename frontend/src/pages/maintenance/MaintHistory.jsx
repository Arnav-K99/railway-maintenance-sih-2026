import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { Clock, RefreshCw, CheckCircle2, XCircle, ArrowRight, Calendar, Filter } from 'lucide-react';

export const MaintHistory = () => {
  const { isReplanned } = usePlan();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('All');

  // Authoritative historical and replanned records
  const historyItems = [
    {
      taskId: 'TASK-000005',
      assetId: 'AST-120005',
      maintType: 'Rail Grinding',
      department: 'Electrical / TRD',
      section: 'SEC-0004 (Delhi–Agra)',
      originalBlock: '07 Sep 2026 • 00:00–03:20 (BLK-009637+38)',
      replannedBlock: isReplanned ? '08 Sep 2026 • 18:00–21:20 (BLK-012046+47)' : '—',
      status: isReplanned ? 'Rescheduled' : 'Scheduled',
      reason: 'Conflict with Unscheduled Emergency Priority Train TRN-SIM-002 on SEC-0004. Re-optimized via CP-SAT.',
      isRescheduled: true,
      completedDate: isReplanned ? '08 Sep 2026' : '07 Sep 2026',
    },
    {
      taskId: 'TASK-000421',
      assetId: 'AST-120421',
      maintType: 'Track Alignment & Ballast Consolidation',
      department: 'Track / Civil Engineering',
      section: 'SEC-0002 (Palwal–Mathura)',
      originalBlock: '05 Sep 2026 • 01:00–04:00 (BLK-007120)',
      replannedBlock: '—',
      status: 'Completed',
      reason: 'Executed on time under night possession. Dy. CE certified compliance with Track Manual.',
      isRescheduled: false,
      completedDate: '05 Sep 2026',
    },
    {
      taskId: 'TASK-000388',
      assetId: 'AST-120388',
      maintType: 'Signal Point Machine Overhaul',
      department: 'Signal & Telecommunications',
      section: 'SEC-0009 (Agra Cantt Yard)',
      originalBlock: '04 Sep 2026 • 11:30–14:00 (BLK-005912)',
      replannedBlock: '05 Sep 2026 • 13:00–15:30 (BLK-007240)',
      status: 'Rescheduled',
      reason: 'S&T testing vehicle delay due to yard shunting operations.',
      isRescheduled: true,
      completedDate: '05 Sep 2026',
    },
    {
      taskId: 'TASK-000214',
      assetId: 'AST-120214',
      maintType: 'OHE Isolator Switch Replacement',
      department: 'Electrical / TRD',
      section: 'SEC-0003 (Faridabad)',
      originalBlock: '03 Sep 2026 • 02:00–05:00 (BLK-004108)',
      replannedBlock: '—',
      status: 'Rejected',
      reason: 'Work rejected during post-maintenance megger test due to insulation resistance below 10MΩ threshold.',
      isRescheduled: false,
      completedDate: '03 Sep 2026',
    },
    {
      taskId: 'TASK-000109',
      assetId: 'AST-120109',
      maintType: 'Wayside Hot Axle Detector Sensor Calibration',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0012 (Kosi Kalan)',
      originalBlock: '02 Sep 2026 • 14:00–16:00 (BLK-002891)',
      replannedBlock: '—',
      status: 'Completed',
      reason: 'Sensors calibrated and verified against laser reference standards.',
      isRescheduled: false,
      completedDate: '02 Sep 2026',
    },
  ];

  const filteredItems = historyItems.filter((item) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Rescheduled') return item.isRescheduled;
    if (activeTab === 'Completed') return item.status === 'Completed';
    if (activeTab === 'Rejected') return item.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <Clock size={14} />
          <span>{t('history', 'Historical Archive')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t('maintHistory', 'Maintenance Execution & Rescheduling History')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {t('completionLog', 'Audit log tracking executed, deferred, rejected and dynamically rescheduled maintenance possessions.')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="gov-panel p-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {['All', 'Rescheduled', 'Completed', 'Rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {tab === 'All'
                ? t('all', 'All')
                : tab === 'Rescheduled'
                ? t('rescheduled', 'Rescheduled')
                : tab === 'Completed'
                ? t('completed', 'Completed')
                : t('rejected', 'Rejected')}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">
          {filteredItems.length} {t('all', 'Records')}
        </span>
      </div>

      {/* Main History Table (Section 12 requirement: Original Block → Replanned Block) */}
      <div className="gov-panel overflow-hidden">
        <div className="gov-panel-header">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Possession Audit Log
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Original possession window to replanned slot tracking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table gov-table-zebra">
            <thead>
              <tr>
                <th>{t('taskId', 'Task ID')}</th>
                <th>{t('maintType', 'Maintenance Type')}</th>
                <th>{t('department', 'Department')}</th>
                <th>{t('originalBlock', 'Original Block')}</th>
                <th></th>
                <th>{t('replannedBlock', 'Replanned Block')}</th>
                <th>{t('status', 'Status')}</th>
                <th>{t('reasonForChange', 'Operational Notes')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.taskId}>
                  <td className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300 whitespace-nowrap">
                    {item.taskId}
                    <div className="text-[10px] text-slate-400 font-normal">{item.assetId}</div>
                  </td>
                  <td className="font-medium text-slate-900 dark:text-white">
                    {item.maintType}
                    <div className="text-[10px] text-slate-500">{item.section}</div>
                  </td>
                  <td className="text-slate-600 dark:text-slate-400 text-xs">
                    {item.department}
                  </td>
                  {/* Original Block */}
                  <td className="font-mono text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap">
                    {item.originalBlock}
                  </td>
                  {/* Arrow separator */}
                  <td className="px-1 text-center text-slate-400">
                    {item.replannedBlock !== '—' && <ArrowRight size={13} className="text-orange-600 dark:text-orange-400 inline" />}
                  </td>
                  {/* Replanned Block */}
                  <td className="font-mono text-[11px] whitespace-nowrap">
                    {item.replannedBlock !== '—' ? (
                      <span className="font-bold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800">
                        {item.replannedBlock}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td>
                    <GovBadge status={item.status} />
                  </td>
                  <td className="text-[11px] text-slate-600 dark:text-slate-400 max-w-xs">
                    {item.reason}
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
