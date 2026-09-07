import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export const ScreenReplanning = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Obvious Back Button */}
      <div>
        <button
          onClick={() => onNavigate('replanning_requests')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Replanning Requests</span>
        </button>
      </div>

      {/* Screen Header */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              REPLANNING
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200">
              EVENT-001
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Train: <strong className="font-mono text-neutral-800 dark:text-neutral-200">TRN-SIM-001</strong> • Section: <strong className="font-mono text-neutral-800 dark:text-neutral-200">SEC-0004</strong>
          </p>
        </div>
        <div className="text-xs text-neutral-400 font-mono">
          Automated Re-Optimization
        </div>
      </div>

      {/* Comparison Layout: ORIGINAL PLAN -> CONFLICT -> OPTIMIZED NEW PLACEMENT */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-black/[0.04] dark:border-white/[0.06] pb-2.5">
          Plan Re-Slotting Sequence
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Card 1: ORIGINAL PLAN */}
          <div className="p-5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-2.5">
            <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
              Original Plan
            </div>
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                07 Sep 2026
              </div>
              <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                00:00 – 03:20
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                BLK-009637, BLK-009638
              </div>
              <div className="text-[11px] text-neutral-500 pt-1">
                Assigned: <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">TEAM-013</span>
              </div>
            </div>
          </div>

          {/* Middle: OPERATIONAL CONFLICT */}
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-center space-y-1">
            <div className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>OPERATIONAL CONFLICT</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed pt-1">
              New train movement cannot safely coexist with the maintenance possession.
            </p>
          </div>

          {/* Card 2: OPTIMIZED NEW PLACEMENT */}
          <div className="p-5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.12] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                Optimized New Placement
              </span>
              <span className="inline-flex items-center text-[10px] font-medium text-neutral-900 dark:text-white space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Feasible</span>
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                08 Sep 2026
              </div>
              <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                18:00 – 21:20
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                BLK-012046, BLK-012047
              </div>
              <div className="text-[11px] text-neutral-500 pt-1">
                Assigned: <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">TEAM-018</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VALIDATION & FINAL STATUS */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5">
        <div>
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
            Validation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>Section available</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>Team available</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>No train conflict</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>Deadline satisfied</span>
            </div>
          </div>
        </div>

        {/* Final Status: Restrained Apple-style Approved indicator */}
        <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <div>
              <div className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                PLAN APPROVED
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Safe clearance confirmed for live train operations on Corridor 1 (SEC-0004).
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('maintenance_portal')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-xs shrink-0"
          >
            <span>Send Updated Plan to Maintenance →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
