import React from 'react';
import { useAuth, PORTALS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Wrench, ShieldCheck, ArrowRight, Globe, Sun, Moon, CheckCircle2, TrainTrack } from 'lucide-react';

export const Landing = ({ onSelectPortal }) => {
  const { login } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const handlePortalSelect = (portal) => {
    login(portal);
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
        <div className="text-center space-y-2.5 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:border-white/[0.08] text-xs font-medium font-mono">
            <span>{t('prototypeNotice', 'Prototype • SIH • Synthetic Data')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            {t('systemTitle', 'Railway Maintenance Optimization System')}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-medium">
            {t('systemSubtitle', 'AI-Powered Automatic Block Planning for Train Operations')}
          </p>
        </div>

        {/* Two Clean Portal Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Portal Option 1: Maintenance Portal */}
          <div className="unicolor-card p-6 flex flex-col justify-between hover:border-slate-400 dark:hover:border-white/[0.20] transition-all group">
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('maintenancePortal', 'MAINTENANCE PORTAL')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('maintenancePortalDesc', 'For maintenance personnel, engineers and field teams. Review to-do work items, define manpower requirements, and inspect scheduled work orders.')}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-500 dark:text-slate-400" />
                  <span>Work Management Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-500 dark:text-slate-400" />
                  <span>Maintenance To-Do Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-500 dark:text-slate-400" />
                  <span>Assigned Work Orders & History</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePortalSelect(PORTALS.MAINTENANCE)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <span>{t('login', 'LOGIN')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Portal Option 2: Authority Portal */}
          <div className="unicolor-card p-6 flex flex-col justify-between hover:border-slate-400 dark:hover:border-white/[0.20] transition-all group">
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('authorityPortal', 'AUTHORITY PORTAL')}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {t('authorityPortalDesc', 'For railway operational controllers and scheduling authorities. Oversee weekly block calendars, audit replanning events and verify completed work.')}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-500 dark:text-slate-400" />
                  <span>Weekly Block Planning Calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-500 dark:text-slate-400" />
                  <span>Closed-Loop Replanning Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-500 dark:text-slate-400" />
                  <span>Work Verification Workflow</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePortalSelect(PORTALS.AUTHORITY)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              <span>{t('login', 'LOGIN')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-[#111419]/60 border-t border-slate-200/80 dark:border-white/[0.08] py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            Railway Maintenance Optimization System Prototype (SIH 2026)
          </div>
          <div className="font-mono text-slate-400 dark:text-slate-500">
            Synthetic Operational Dataset
          </div>
        </div>
      </footer>
    </div>
  );
};