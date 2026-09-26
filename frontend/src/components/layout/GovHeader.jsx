import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth, PORTALS } from '../../context/AuthContext';
import { Sun, Moon, Globe, LogOut, TrainTrack, User, ShieldCheck, Wrench } from 'lucide-react';

export const GovHeader = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { currentPortal, currentUser, logout } = useAuth();

  const isMaint = currentPortal === PORTALS.MAINTENANCE;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/55 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Clean Brand Icon + System Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold shadow-xs shrink-0">
            <TrainTrack size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                {t('systemTitle', 'Railway Maintenance Optimization System')}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/[0.06] dark:text-slate-400 dark:border-white/[0.08]">
                {t('systemNotice', 'Indian Railways • SIH 2026')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {t('systemSubtitle', 'AI-Powered Automatic Block Planning')}
            </p>
          </div>
        </div>

        {/* Right: Language switch, Theme toggle, User badge, Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Active Portal Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-white/[0.05] dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08]">
            {isMaint ? <Wrench size={13} className="text-macblue-500" /> : <ShieldCheck size={13} className="text-macblue-500" />}
            <span>{isMaint ? t('maintenancePortal', 'Maintenance Portal') : t('authorityPortal', 'Authority Portal')}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-white/[0.08]" />

          {/* Bilingual Switcher (English | हिंदी) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 transition-colors dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.12] border border-slate-200/60 dark:border-white/[0.06]"
            title="Toggle Language / भाषा बदलें"
            aria-label="Toggle Language"
          >
            <Globe size={13} className="text-slate-500 dark:text-slate-400" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Theme Toggle (Light / macOS Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/[0.12] border border-slate-200/60 dark:border-white/[0.06]"
            title={isDark ? 'Switch to Light Mode' : 'Switch to macOS Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
          </button>

          {/* User Profile Badge */}
          {currentUser && (
            <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/[0.08] text-xs">
              <div className="text-left leading-tight">
                <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                  {currentUser.designation}
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
            title={t('signOut', 'Sign Out')}
            aria-label="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};
