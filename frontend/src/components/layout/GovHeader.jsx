import React from 'react';
import { StateEmblemIndia } from '../../assets/emblem';
import { TricolorLine } from '../common/TricolorLine';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth, PORTALS } from '../../context/AuthContext';
import { Sun, Moon, Globe, LogOut, ArrowLeftRight, UserCheck, ShieldCheck } from 'lucide-react';

export const GovHeader = ({ onSwitchPortal }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { currentPortal, switchPortal, currentUser, logout } = useAuth();

  const isMaint = currentPortal === PORTALS.MAINTENANCE;

  const handlePortalSwitch = () => {
    const nextPortal = isMaint ? PORTALS.AUTHORITY : PORTALS.MAINTENANCE;
    switchPortal(nextPortal);
    if (onSwitchPortal) onSwitchPortal(nextPortal);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Top 3px Indian National Tricolor Accent Stripe */}
      <TricolorLine className="h-0.5 w-full" />

      {/* Main Official Header Row */}
      <div className="px-4 sm:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Indian State Emblem + Ministry & System Titles */}
        <div className="flex items-center gap-3.5">
          <div className="text-govnavy-800 dark:text-slate-200 shrink-0">
            <StateEmblemIndia className="h-11 w-auto" />
          </div>

          <div className="border-l border-slate-300 dark:border-slate-700 pl-3">
            {/* Government & Ministry Identity */}
            <div className="text-[10px] sm:text-[11px] font-bold text-govnavy-800 dark:text-slate-200 tracking-wider uppercase leading-tight">
              <span>{t('govOfIndia', 'GOVERNMENT OF INDIA')}</span>
              <span className="mx-1.5 text-slate-400">•</span>
              <span className="text-govnavy-700 dark:text-slate-300">{t('ministryOfRailways', 'MINISTRY OF RAILWAYS')}</span>
              <span className="mx-1.5 text-slate-400">•</span>
              <span className="text-govnavy-600 dark:text-slate-400">{t('indianRailways', 'INDIAN RAILWAYS')}</span>
            </div>

            {/* Application Name */}
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug mt-0.5">
              {t('systemTitle', 'Railway Maintenance Optimization System')}
            </h1>

            {/* Required Prototype & Synthetic Data Badge */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                {t('prototypeNotice', 'Prototype • SIH • Synthetic Data')}
              </span>
              <span className="text-[10px] text-slate-400 hidden lg:inline">
                {t('satyamevaJayate', 'Satyameva Jayate')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls (Bilingual toggle, Dark mode, Portal Switch, User) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end md:self-center">
          {/* Language Switcher Button (English | हिंदी) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Toggle Language / भाषा बदलें"
            aria-label="Toggle Language"
          >
            <Globe size={13} className="text-govnavy-700 dark:text-govnavy-300" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Theme Switcher Button (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-750 mx-0.5" />

          {/* Portal Switcher Pill */}
          <button
            type="button"
            onClick={handlePortalSwitch}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-govnavy-800 hover:bg-govnavy-700 text-white text-xs font-semibold shadow-2xs transition-all dark:bg-govnavy-700 dark:hover:bg-govnavy-600"
            title="Switch between Maintenance and Authority Portals"
          >
            <ArrowLeftRight size={13} className="text-saffron-light" />
            <span className="hidden sm:inline">{t('switchPortal', 'Switch Portal')}:</span>
            <span className="text-saffron-light font-bold">
              {isMaint ? t('authorityPortal', 'Authority Portal') : t('maintenancePortal', 'Maintenance Portal')}
            </span>
          </button>

          {/* User Profile Badge */}
          {currentUser && (
            <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs">
              <div className="h-7 w-7 rounded bg-govnavy-100 dark:bg-slate-800 border border-govnavy-200 dark:border-slate-700 flex items-center justify-center text-govnavy-800 dark:text-slate-200 font-bold">
                {isMaint ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
              </div>
              <div className="text-left leading-tight">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                  {currentUser.designation}
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
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
