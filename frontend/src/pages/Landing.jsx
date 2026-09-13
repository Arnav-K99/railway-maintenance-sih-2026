import React from 'react';
import { StateEmblemIndia, IndianRailwaysCrest } from '../assets/emblem';
import { TricolorLine } from '../components/common/TricolorLine';
import { useAuth, PORTALS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Wrench, ShieldCheck, ArrowRight, Globe, Sun, Moon, CheckCircle2 } from 'lucide-react';

export const Landing = ({ onSelectPortal }) => {
  const { login } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const handlePortalSelect = (portal) => {
    login(portal);
    if (onSelectPortal) onSelectPortal(portal);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-between">
      {/* Top Government Masthead */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <TricolorLine className="h-1 w-full" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-govnavy-800 dark:text-slate-200">
              <StateEmblemIndia className="h-12 w-auto" />
            </div>
            <div className="border-l border-slate-300 dark:border-slate-700 pl-3">
              <div className="text-xs font-bold text-govnavy-800 dark:text-slate-200 tracking-wider uppercase">
                {t('govOfIndia', 'GOVERNMENT OF INDIA')} • {t('ministryOfRailways', 'MINISTRY OF RAILWAYS')}
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {t('indianRailways', 'INDIAN RAILWAYS')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            >
              <Globe size={13} className="text-govnavy-700 dark:text-govnavy-300" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section & Portal Choice */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* System Title Banner */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-govnavy-50 text-govnavy-800 border border-govnavy-200 dark:bg-govnavy-950 dark:text-govnavy-200 dark:border-govnavy-800 text-xs font-semibold tracking-wider uppercase font-mono">
            <span>{t('prototypeNotice', 'Prototype • SIH • Synthetic Data')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-govnavy-900 dark:text-white tracking-tight uppercase max-w-2xl mx-auto leading-tight">
            {t('systemTitle', 'Railway Maintenance Optimization System')}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
            {t('systemSubtitle', 'AI-Powered Automatic Block Planning for Train Operations on Indian Railways')}
          </p>
        </div>

        {/* Two Clean Government Portal Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Portal Option 1: Maintenance Portal */}
          <div className="gov-panel p-6 flex flex-col justify-between hover:border-govnavy-600 dark:hover:border-govnavy-500 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-govnavy-50 dark:bg-slate-800 text-govnavy-800 dark:text-govnavy-200 border border-govnavy-200 dark:border-slate-700 group-hover:bg-govnavy-100 transition-colors">
                  <Wrench size={26} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  PORTAL 01
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('maintenancePortal', 'MAINTENANCE PORTAL')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('maintenancePortalDesc', 'For maintenance personnel and department teams (Civil, TRD, S&T, Mechanical). Inspect Neev AI risk predictions, define manpower requirements and submit for block scheduling.')}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-govnavy-600 dark:text-govnavy-400" />
                  <span>Cross-Department Work Demand Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-govnavy-600 dark:text-govnavy-400" />
                  <span>Neev AI Failure Risk Diagnostic Inbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-govnavy-600 dark:text-govnavy-400" />
                  <span>Assigned Work Orders & Rescheduled History</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePortalSelect(PORTALS.MAINTENANCE)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-govnavy-800 hover:bg-govnavy-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <span>{t('login', 'LOGIN')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Portal Option 2: Authority Portal */}
          <div className="gov-panel p-6 flex flex-col justify-between hover:border-govnavy-600 dark:hover:border-govnavy-500 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-govnavy-50 dark:bg-slate-800 text-govnavy-800 dark:text-govnavy-200 border border-govnavy-200 dark:border-slate-700 group-hover:bg-govnavy-100 transition-colors">
                  <ShieldCheck size={26} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  PORTAL 02
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('authorityPortal', 'AUTHORITY PORTAL')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('authorityPortalDesc', 'For railway authorities and operational staff. Oversee the 7-day weekly block calendar, resolve train conflicts, audit replanning events and verify completed work.')}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-govnavy-600 dark:text-govnavy-400" />
                  <span>Weekly Block Planning Calendar (24h Headway)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-govnavy-600 dark:text-govnavy-400" />
                  <span>Train Rerouting & Closed-Loop Replanning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-govnavy-600 dark:text-govnavy-400" />
                  <span>Work Verification (Accept / Reject / False Closure)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePortalSelect(PORTALS.AUTHORITY)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-govnavy-800 hover:bg-govnavy-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <span>{t('login', 'LOGIN')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 Ministry of Railways, Government of India. Smart India Hackathon Prototype.
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Security: Official Use Only</span>
            <span>•</span>
            <span>Data: Synthetic</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
