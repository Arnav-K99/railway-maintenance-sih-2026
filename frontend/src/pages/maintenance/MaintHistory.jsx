import React, { useState, useMemo } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth, isDeptMatch } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { Clock, ArrowRight, Calendar } from 'lucide-react';

export const MaintHistory = () => {
  const { isReplanned } = usePlan();
  const { selectedDept } = useAuth();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState('All');

  // Tasks distributed across the full 1-week horizon (03 Sep – 09 Sep)
  const historyItems = [
    // Electrical / TRD
    {
      taskId: 'TASK-000005',
      assetId: 'AST-120005',
      maintType: 'Rail Grinding & Surface Profile',
      department: 'Electrical / TRD',
      section: 'SEC-0004',
      originalDate: '07 Sep',
      originalWindow: '00:00–03:20',
      replannedDate: isReplanned ? '08 Sep' : '—',
      replannedWindow: isReplanned ? '18:00–21:20' : '',
      status: isReplanned ? 'Rescheduled' : 'Scheduled',
      isRescheduled: true,
      completion: isReplanned ? 'In Progress' : 'Pending',
    },
    {
      taskId: 'TASK-000724',
      assetId: 'AST-120724',
      maintType: 'Overhead Contact Wire Height Adjust',
      department: 'Electrical / TRD',
      section: 'SEC-0004',
      originalDate: '07 Sep',
      originalWindow: '02:30–05:30',
      replannedDate: '—',
      replannedWindow: '',
      status: 'Completed',
      isRescheduled: false,
      completion: '07 Sep • 05:15',
    },
    {
      taskId: 'TASK-000214',
      assetId: 'AST-120214',
      maintType: 'OHE Isolator Switch Replacement',
      department: 'Electrical / TRD',
      section: 'SEC-0003',
      originalDate: '03 Sep',
      originalWindow: '02:00–05:00',
      replannedDate: '—',
      replannedWindow: '',
      status: 'Rejected',
      isRescheduled: false,
      completion: '03 Sep • 04:30',
    },
    // Track / Civil Engineering
    {
      taskId: 'TASK-000892',
      assetId: 'AST-120892',
      maintType: 'Ballast Shoulder Dressing & Tamping',
      department: 'Track / Civil Engineering',
      section: 'SEC-0014',
      originalDate: '09 Sep',
      originalWindow: '08:00–11:00',
      replannedDate: '—',
      replannedWindow: '',
      status: 'Completed',
      isRescheduled: false,
      completion: '09 Sep • 10:45',
    },
    {
      taskId: 'TASK-000421',
      assetId: 'AST-120421',
      maintType: 'Track Realignment & Dynamic Ballasting',
      department: 'Track / Civil Engineering',
      section: 'SEC-0002',
      originalDate: '05 Sep',
      originalWindow: '01:00–04:00',
      replannedDate: '—',
      replannedWindow: '',
      status: 'Verified',
      isRescheduled: false,
      completion: '05 Sep • 03:45',
    },
    // Signal & Telecommunications
    {
      taskId: 'TASK-000512',
      assetId: 'AST-120512',
      maintType: 'Track Circuit Bond Wire Replacement',
      department: 'Signal & Telecommunications',
      section: 'SEC-0005',
      originalDate: '06 Sep',
      originalWindow: '15:00–18:00',
      replannedDate: '—',
      replannedWindow: '',
      status: 'Completed',
      isRescheduled: false,
      completion: '06 Sep • 17:40',
    },
    {
      taskId: 'TASK-000388',
      assetId: 'AST-120388',
      maintType: 'Signal Point Machine Service',
      department: 'Signal & Telecommunications',
      section: 'SEC-0009',
      originalDate: '04 Sep',
      originalWindow: '11:30–14:00',
      replannedDate: '05 Sep',
      replannedWindow: '13:00–15:30',
      status: 'Rescheduled',
      isRescheduled: true,
      completion: '05 Sep • 15:20',
    },
    // Mechanical / Rolling Stock
    {
      taskId: 'TASK-000109',
      assetId: 'AST-120109',
      maintType: 'Axle Detector Sensor Infrared Scan',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0012',
      originalDate: '04 Sep',
      originalWindow: '14:00–16:00',
      replannedDate: '—',
      replannedWindow: '',
      status: 'Completed',
      isRescheduled: false,
      completion: '04 Sep • 15:50',
    },
    {
      taskId: 'TASK-000671',
      assetId: 'AST-120671',
      maintType: 'Wheel Lathe Profile & Flange Turning',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0021',
      originalDate: '06 Sep',
      originalWindow: '13:00–17:00',
      replannedDate: '—',
      replannedWindow: '',
      status: 'Verified',
      isRescheduled: false,
      completion: '06 Sep • 16:30',
    },
    {
      taskId: 'TASK-000543',
      assetId: 'AST-120543',
      maintType: 'Bogie Primary Damper Inspection',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0021',
      originalDate: '05 Sep',
      originalWindow: '10:00–12:30',
      replannedDate: '06 Sep',
      replannedWindow: '09:00–11:30',
      status: 'Rescheduled',
      isRescheduled: true,
      completion: '06 Sep • 11:15',
    },
  ];

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      if (!isDeptMatch(item.department, selectedDept)) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === 'Rescheduled') return item.isRescheduled;
      if (activeFilter === 'Completed') return item.status === 'Completed' || item.status === 'Verified';
      if (activeFilter === 'Rejected') return item.status === 'Rejected';
      return true;
    });
  }, [historyItems, selectedDept, activeFilter]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <Clock size={14} />
          <span>Execution Log</span>
        </div>
        <div className="flex items-center gap-2.5 mt-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('maintHistory', 'Maintenance History')}
          </h2>
          {selectedDept && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
              {selectedDept}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('completionLog', 'Audit log tracking executed, rejected and dynamically rescheduled maintenance possessions across the 1-week horizon')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mac-panel p-2 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5">
          {['All', 'Rescheduled', 'Completed', 'Rejected'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono font-medium text-slate-400 px-2 shrink-0">
          {filteredItems.length} {t('all', 'Records')} • Horizon: 03–09 Sep
        </span>
      </div>

      {/* Redesigned Enterprise Table with Two-Line Date Formatting */}
      <div className="mac-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="mac-table">
            <thead>
              <tr>
                <th>{t('taskId', 'Task')}</th>
                <th>{t('asset', 'Asset')}</th>
                <th>{t('maintType', 'Maintenance Work')}</th>
                <th>{t('department', 'Department')}</th>
                <th>Original Block</th>
                <th>Replanned Block</th>
                <th>Completion</th>
                <th>{t('status', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filteredItems.map((item) => (
                <tr key={item.taskId} className="h-14">
                  {/* Task ID */}
                  <td className="font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {formatTaskId(item.taskId)}
                  </td>

                  {/* Asset ID */}
                  <td className="font-mono text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                    {formatAssetId(item.assetId)}
                  </td>

                  {/* Maintenance Type & Section */}
                  <td>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.maintType}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.section}
                    </div>
                  </td>

                  {/* Department */}
                  <td className="text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                    {item.department}
                  </td>

                  {/* Original Block (Two-Line Formatting) */}
                  <td className="whitespace-nowrap font-mono text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {item.originalDate}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.originalWindow}
                    </div>
                  </td>

                  {/* Replanned Block (Two-Line Formatting) */}
                  <td className="whitespace-nowrap font-mono text-xs">
                    {item.replannedDate !== '—' ? (
                      <div>
                        <div className="font-bold text-orange-600 dark:text-orange-400">
                          {item.replannedDate}
                        </div>
                        <div className="text-[11px] text-orange-500 font-semibold">
                          {item.replannedWindow}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-normal">—</span>
                    )}
                  </td>

                  {/* Completion Time */}
                  <td className="font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.completion}
                  </td>

                  {/* Status */}
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
