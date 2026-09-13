import React from 'react';
import { useAuth, PORTALS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Clock,
  Radio,
  RefreshCw,
  CheckSquare,
  CalendarDays,
} from 'lucide-react';

export const AppSidebar = ({ activeTab, onTabChange }) => {
  const { currentPortal } = useAuth();
  const { t } = useLanguage();

  const isMaint = currentPortal === PORTALS.MAINTENANCE;

  // Maintenance Navigation Items (Section 7 & 8: Dashboard, To-Do Work, My Work, History. No department filter!)
  const maintNavItems = [
    { id: 'maint-dashboard', label: t('maintDashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'to-do-work', label: t('toDoWork', 'To-Do Work'), icon: ClipboardList, countBadge: 4 },
    { id: 'my-work', label: t('myWork', 'My Work'), icon: Wrench, countBadge: 4 },
    { id: 'maint-history', label: t('history', 'History'), icon: Clock },
  ];

  // Authority Navigation Items
  const authNavItems = [
    { id: 'auth-dashboard', label: t('authDashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'operations', label: t('operations', 'Operations'), icon: Radio },
    { id: 'replanning', label: t('replanning', 'Replanning'), icon: RefreshCw, countBadge: 3 },
    { id: 'verification', label: t('workVerification', 'Work Verification'), icon: CheckSquare, countBadge: 3 },
    { id: 'upcoming', label: t('upcomingTasks', 'Upcoming Tasks'), icon: CalendarDays },
    { id: 'auth-history', label: t('authHistory', 'Audit History'), icon: Clock },
  ];

  const navItems = isMaint ? maintNavItems : authNavItems;

  return (
    <aside className="w-52 sm:w-56 bg-white/70 dark:bg-[#0d0f12]/70 backdrop-blur-md border-r border-slate-200 dark:border-white/[0.08] flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 select-none shrink-0">
      {/* Navigation Header */}
      <div className="px-3.5 py-3 border-b border-slate-200/80 dark:border-white/[0.06]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
          {isMaint ? 'Maintenance Navigation' : 'Authority Navigation'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs dark:bg-blue-600'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-white/[0.05] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon size={15} className={isActive ? 'text-white' : 'text-slate-500 dark:text-neutral-400'} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.countBadge && !isActive && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold font-mono bg-slate-200 text-slate-700 dark:bg-white/[0.08] dark:text-neutral-300">
                  {item.countBadge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer: System Status */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.06] text-[10px] text-slate-500 dark:text-neutral-500 space-y-1">
        <div className="flex items-center justify-between font-medium">
          <span>Engine Status</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        </div>
        <div className="text-[9px] text-slate-400 dark:text-neutral-600">
          CP-SAT Block Engine v2.4
        </div>
      </div>
    </aside>
  );
};
