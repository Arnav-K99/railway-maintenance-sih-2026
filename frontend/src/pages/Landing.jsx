import React from 'react';
import { useAuth, PORTALS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Wrench, ShieldCheck, ArrowRight, Globe, Sun, Moon, CheckCircle2, TrainTrack } from 'lucide-react';

export const Landing = ({ onSelectPortal }) => {
  const { login } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const [maintDept, setMaintDept] = React.useState('Electrical / TRD');

  const handlePortalSelect = (portal, dept) => {
    login(portal, dept || maintDept);
    if (onSelectPortal) onSelectPortal(portal);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0D0F12] flex flex-col justify-between text-slate-900 dark:text-[#EAECEF] antialiased">
      {/* Top Header */}
      <header className="bg-white/90 dark:bg-[#111419]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold shadow-xs">
              <TrainTrack size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                {t('systemTitle', 'Railway Maintenance Optimization System')}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {t('systemSubtitle', 'AI-Powered Automatic Block Planning')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-xs font-medium text-slate-800 transition-colors dark:bg-white/[0.06] dark:border-white/[0.08] dark:text-slate-200"
            >
              <Globe size={13} className="text-slate-500 dark:text-slate-400" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-700 transition-colors dark:bg-white/[0.06] dark:border-white/[0.08] dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section & Portal Options */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 w-full">
        {/* Title Banner */}
        <div className="text-center space-y-2.5 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:border-white/[0.08] text-xs font-medium font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t('systemNotice', 'Indian Railways • SIH 2026')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            {t('systemTitle', 'Railway Maintenance Optimization System')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-medium">
            {t('systemSubtitle', 'AI-Powered Automatic Block Planning for Train Operations')}
          </p>

          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              {t('selectPortal', 'Select Operational Portal to Sign In')}
            </span>
          </div>
        </div>

        {/* Two Clean Portal Login Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Portal Option 1: Maintenance Portal */}
          <div className="unicolor-card p-6 flex flex-col justify-between hover:border-slate-400 dark:hover:border-white/[0.20] transition-all group bg-white dark:bg-[#16191E] border border-slate-200/90 dark:border-white/[0.08] rounded-xl shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-white border border-slate-200/60 dark:border-white/[0.06]">
                  <Wrench size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  PORTAL 01
                </span>
              </div>

              <div>
                <div className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 mb-1.5">
                  ROLE: SENIOR SECTION ENGINEER
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('maintenancePortal', 'MAINTENANCE PORTAL')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('maintenancePortalDesc', 'For maintenance personnel, engineers and field teams. Review to-do work items, define manpower requirements, and inspect scheduled work orders.')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Active Department:
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden"
                    value={maintDept}
                    onChange={(e) => setMaintDept(e.target.value)}
                  >
                    <option value="Electrical / TRD">Electrical / TRD</option>
                    <option value="Track / Civil Engineering">Track / Civil Engineering</option>
                    <option value="Signal & Telecommunications">Signal & Telecommunications</option>
                    <option value="Mechanical / Rolling Stock">Mechanical / Rolling Stock</option>
                  </select>
                </div>

                <div className="pt-1 space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Work Management & To-Do Queue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Assigned Work Orders & Execution History</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePortalSelect(PORTALS.MAINTENANCE, maintDept)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              <span>{t('login', 'SIGN IN TO MAINTENANCE')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Portal Option 2: Authority Portal */}
          <div className="unicolor-card p-6 flex flex-col justify-between hover:border-slate-400 dark:hover:border-white/[0.20] transition-all group bg-white dark:bg-[#16191E] border border-slate-200/90 dark:border-white/[0.08] rounded-xl shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-white border border-slate-200/60 dark:border-white/[0.06]">
                  <ShieldCheck size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  PORTAL 02
                </span>
              </div>

              <div>
                <div className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 mb-1.5">
                  ROLE: CHIEF OPERATIONS CONTROLLER
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('authorityPortal', 'AUTHORITY PORTAL')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('authorityPortalDesc', 'For railway operational controllers and scheduling authorities. Oversee weekly block calendars, audit replanning events and verify completed work.')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Jurisdiction:
                  </label>
                  <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-lg text-xs text-slate-700 dark:text-slate-300 font-mono">
                    Central Operations HQ &bull; Network Division
                  </div>
                </div>

                <div className="pt-1 space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Weekly Block Planning Calendar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Closed-Loop Replanning & Verification</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePortalSelect(PORTALS.AUTHORITY)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              <span>{t('login', 'SIGN IN TO AUTHORITY')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-[#111419]/60 border-t border-slate-200/80 dark:border-white/[0.08] py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            Railway Maintenance Optimization System (SIH 2026)
          </div>
          <div className="font-mono text-slate-400 dark:text-slate-500">
            Live Operational Dataset
          </div>
        </div>
      </footer>
    </div>
  );
};