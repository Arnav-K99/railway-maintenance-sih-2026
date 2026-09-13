import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth, PORTALS } from '../../context/AuthContext';
import { Sun, Moon, Globe, LogOut, TrainTrack, ShieldCheck, Wrench } from 'lucide-react';

export const AppHeader = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { currentPortal, currentUser, logout } = useAuth();

  const isMaint = currentPortal === PORTALS.MAINTENANCE;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0d0f12]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.08] shadow-2xs">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: System Logo & Clean Title */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 dark:bg-blue-600/90 text-white flex items-center justify-center shadow-xs shrink-0">
            <TrainTrack size={17} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                {t('systemTitle', 'Railway Maintenance Optimization System')}
              </h1>
              <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/[0.05] dark:text-neutral-400 dark:border-white/[0.08]">
                {t('prototypeNotice', 'Prototype • SIH • Synthetic Data')}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-neutral-400 hidden sm:block">
              {t('systemSubtitle', 'AI-Powered Automatic Block Planning')}
            </p>
          </div>
        </div>

        {/* Right: Portal Tag, Language Toggle, Dark Mode Toggle, User, Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Read-Only Portal Tag (Switch Portal Removed per Section 6) */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-neutral-300">
            {isMaint ? <Wrench size={12} className="text-blue-500" /> : <ShieldCheck size={12} className="text-emerald-500" />}
            <span>{isMaint ? t('maintenancePortal', 'Maintenance Portal') : t('authorityPortal', 'Authority Portal')}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-white/[0.1] mx-0.5 hidden sm:block" />

          {/* Bilingual Switcher (English | हिंदी) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-medium text-slate-700 transition-colors dark:bg-white/[0.05] dark:border-white/[0.08] dark:text-neutral-300 dark:hover:bg-white/[0.1]"
            title="Toggle Language"
            aria-label="Toggle Language"
          >
            <Globe size={13} className="text-slate-500 dark:text-neutral-400" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition-colors dark:bg-white/[0.05] dark:border-white/[0.08] dark:text-neutral-300 dark:hover:bg-white/[0.1]"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
          </button>

          {/* User Profile */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/[0.08] text-xs">
              <div className="text-left leading-tight">
                <div className="font-semibold text-slate-800 dark:text-neutral-200 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-neutral-400 truncate max-w-[120px]">
                  {currentUser.designation}
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Button (Returns to Landing Page) */}
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
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
