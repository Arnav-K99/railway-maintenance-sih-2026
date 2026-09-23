import React from 'react';
import { useAuth, PORTALS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  CheckSquare,
  Wrench,
  Clock,
  Radio,
  RefreshCw,
  CalendarDays,
  TrainTrack
} from 'lucide-react';

export const GovSidebar = ({ activeTab, onTabChange }) => {
  const { currentPortal } = useAuth();
  const { t } = useLanguage();

  const isMaint = currentPortal === PORTALS.MAINTENANCE;

  // Maintenance Navigation Items (Minimal, no department filter)
  const maintNavItems = [
    { id: 'maint-dashboard', label: t('maintDashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'todo-work', label: t('todoWork', 'To-Do Work'), icon: CheckSquare, countBadge: 3 },
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
    <aside className="w-52 sm:w-56 bg-white/70 dark:bg-black/45 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/[0.08] flex flex-col h-[calc(100vh-3.75rem)] sticky top-15 select-none shrink-0">
      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 pb-1.5">
          {isMaint ? 'Maintenance Navigation' : 'Authority Navigation'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon size={15} className={isActive ? 'text-white dark:text-slate-950' : 'text-slate-400 dark:text-slate-400'} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.countBadge && !isActive && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300">
                  {item.countBadge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/70 dark:border-white/[0.07] text-[10px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between font-medium">
          <span>{t('operationalStatus', 'Status')}</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t('normal', 'Operational')}
          </span>
        </div>
      </div>
    </aside>
  );
};
