import React from 'react';
import { ArrowRight, Wrench, Activity, ShieldCheck } from 'lucide-react';

export const ScreenPortal = ({ onSelectPortal }) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-4xl w-full text-center space-y-5">
        {/* Subtle pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.03] text-neutral-600 dark:text-neutral-400 text-xs font-medium tracking-wide">
          Railway Operations Prototype • SIH 2026
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Railway Maintenance Optimization System
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-normal">
          AI-Powered Automatic Block Planning for Train Operations on Indian Railways
        </p>

        {/* Portal Selection Label */}
        <div className="pt-6 pb-1">
          <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Choose a portal
          </p>
        </div>

        {/* Exactly THREE Large Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-2">
          {/* Card 1: MAINTENANCE (First-class starting point) */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all group">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">MAINTENANCE</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Define work requirements, evaluate asset condition, and manage execution schedules.
              </p>
            </div>
            <button
              onClick={() => onSelectPortal('maintenance')}
              className="mt-6 w-full inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-4 py-2.5 rounded-xl transition-all text-xs"
            >
              <span>Enter Maintenance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: OPERATIONS */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all group">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">OPERATIONS</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Overview network status, monitor planned blocks, and resolve live operational conflicts.
              </p>
            </div>
            <button
              onClick={() => onSelectPortal('operations')}
              className="mt-6 w-full inline-flex items-center justify-center space-x-2 border border-black/[0.12] dark:border-white/[0.16] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-xs"
            >
              <span>Enter Operations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: VERIFICATION */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all group">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">VERIFICATION</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Confirm that scheduled maintenance work was actually completed on physical track assets.
              </p>
            </div>
            <button
              onClick={() => onSelectPortal('verification')}
              className="mt-6 w-full inline-flex items-center justify-center space-x-2 border border-black/[0.12] dark:border-white/[0.16] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-xs"
            >
              <span>Enter Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Operational Note */}
        <div className="pt-6 text-[11px] text-neutral-400 dark:text-neutral-500">
          Northern Railway Operating Division • Demonstration System
        </div>
      </div>
    </div>
  );
};
