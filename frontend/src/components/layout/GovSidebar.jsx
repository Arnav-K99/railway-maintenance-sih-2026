import React from 'react';
import { useAuth, PORTALS, DEPARTMENTS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  HeartPulse,
  Wrench,
  Clock,
  Radio,
  RefreshCw,
  CheckSquare,
  CalendarDays,
  ShieldAlert,
  Building2,
  TrainTrack,
  Filter
} from 'lucide-react';

export const GovSidebar = ({ activeTab, onTabChange }) => {
  const { currentPortal, selectedDept, setSelectedDept } = useAuth();
  const { t } = useLanguage();

  const isMaint = currentPortal === PORTALS.MAINTENANCE;

  // Maintenance Navigation Items
  const maintNavItems = [
    { id: 'maint-dashboard', label: t('maintDashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'neev-predictions', label: t('predictions', 'Neev Predictions'), icon: HeartPulse, countBadge: 3 },
    { id: 'my-work', label: t('myWork', 'My Work'), icon: Wrench, countBadge: 4 },
    { id: 'maint-history', label: t('history', 'History'), icon: Clock },
  ];

  // Authority Navigation Items
  const authNavItems = [
    { id: 'auth-dashboard', label: t('authDashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'operations', label: t('operations', 'Operations'), icon: Radio, highlight: true },
    { id: 'replanning', label: t('replanning', 'Replanning'), icon: RefreshCw, countBadge: 3 },
    { id: 'verification', label: t('workVerification', 'Work Verification'), icon: CheckSquare, countBadge: 2 },
    { id: 'upcoming', label: t('upcomingTasks', 'Upcoming Tasks'), icon: CalendarDays },
    { id: 'auth-history', label: t('authHistory', 'Audit History'), icon: Clock },
  ];

  const navItems = isMaint ? maintNavItems : authNavItems;

  return (
    <aside className="w-56 sm:w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-3.75rem)] sticky top-15 select-none shrink-0">
      {/* Portal Mode Tag */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-govnavy-100 dark:bg-govnavy-900 text-govnavy-800 dark:text-govnavy-200">
            <TrainTrack size={14} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('operationalStatus', 'Active Portal')}
            </div>
            <div className="text-xs font-bold text-govnavy-800 dark:text-slate-200 leading-tight">
              {isMaint ? t('maintenancePortal', 'Maintenance Portal') : t('authorityPortal', 'Authority Portal')}
            </div>
          </div>
        </div>
      </div>

      {/* Department Selector (When in Maintenance Portal) */}
      {isMaint && (
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
          <label className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            <Filter size={11} className="text-govnavy-600" />
            <span>{t('deptContext', 'Department Context')}</span>
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All Departments'
                  ? t('allDepartments', 'All Departments')
                  : dept === 'Track / Civil Engineering'
                  ? t('trackCivil', 'Track / Civil Engineering')
                  : dept === 'Electrical / TRD'
                  ? t('electricalTRD', 'Electrical / TRD')
                  : dept === 'Signal & Telecommunications'
                  ? t('signalTelecom', 'Signal & Telecommunications')
                  : t('mechanicalRollingStock', 'Mechanical / Rolling Stock')}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 pb-1">
          {isMaint ? t('maintenancePortal', 'Maintenance Operations') : t('authorityPortal', 'Authority Modules')}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-govnavy-800 text-white font-bold shadow-2xs dark:bg-govnavy-700'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon size={15} className={isActive ? 'text-saffron-light' : 'text-slate-500 dark:text-slate-400'} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.countBadge && !isActive && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold font-mono bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.countBadge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/40 space-y-1">
        <div className="flex items-center justify-between font-medium">
          <span>{t('operationalStatus', 'Status')}</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t('normal', 'Normal')}
          </span>
        </div>
        <div className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
          CP-SAT Block Engine v2.4
        </div>
      </div>
    </aside>
  );
};
