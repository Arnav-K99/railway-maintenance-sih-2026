import React from 'react';
import { ArrowLeft, ArrowRight, Check, X, Layers } from 'lucide-react';
import { ALL_TASKS } from '../../data/prototypeData';

export const ScreenArnavPlan = ({ onNavigate, taskId, maintenanceReqs }) => {
  const currentTask = ALL_TASKS.find((t) => t.id === taskId) || ALL_TASKS[0];

  const reqDuration = maintenanceReqs?.duration || currentTask.duration;
  const reqPersonnel = maintenanceReqs?.personnel || currentTask.personnel;
  const reqCompatible = maintenanceReqs?.compatibleDept || currentTask.compatibleDept || 'Track / Civil';
  const reqCanBundle = maintenanceReqs?.canBundle !== undefined ? (maintenanceReqs.canBundle ? 'Yes' : 'No') : 'Yes';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Obvious Back Button */}
      <div>
        <button
          onClick={() => onNavigate('task_details')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Maintenance Requirement</span>
        </button>
      </div>

      {/* Screen Header */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          AUTOMATIC BLOCK PLANNING
        </h1>
        <div className="flex items-center space-x-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          <span className="font-mono font-semibold text-neutral-900 dark:text-white">{currentTask.id}</span>
          <span>•</span>
          <span>{currentTask.name}</span>
          <span>•</span>
          <span className="font-mono">{currentTask.section}</span>
          <span>•</span>
          <span>{currentTask.department}</span>
        </div>
      </div>

      {/* Small Summary: MAINTENANCE REQUIREMENT (Input to Arnav) */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          Maintenance Requirement
        </div>
        <div className="flex flex-wrap items-center gap-6 font-medium text-neutral-700 dark:text-neutral-300">
          <div>
            Duration: <span className="font-mono font-bold text-neutral-900 dark:text-white">{reqDuration} min</span>
          </div>
          <div>
            Personnel: <span className="font-mono font-bold text-neutral-900 dark:text-white">{reqPersonnel}</span>
          </div>
          <div>
            Can bundle: <span className="font-bold text-neutral-900 dark:text-white">{reqCanBundle}</span>
          </div>
          <div>
            Compatible department: <span className="font-bold text-neutral-900 dark:text-white">{reqCompatible}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side: Vertical Recommended Block on Left vs Other Blocks on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: OPTIMIZED BLOCK PLACEMENT (Vertical Stack) - 7 cols */}
        <div className="md:col-span-7 glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.06] pb-3">
            <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Optimized Block Placement
            </div>
            <span className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-900 dark:text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-[11px]">FEASIBLE</span>
            </span>
          </div>

          {/* Vertical Information Stack */}
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06] text-xs">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">Date</span>
              <span className="font-semibold text-neutral-900 dark:text-white">07 Sep 2026</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">Start Time</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">00:00</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">End Time</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">03:20</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">Duration</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{reqDuration} minutes</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">Section</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{currentTask.section}</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">Blocks Allocated</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">BLK-009637, BLK-009638</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">Assigned Team</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">TEAM-013</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-neutral-400 dark:text-neutral-500">Status</span>
              <span className="font-semibold text-neutral-900 dark:text-white">FEASIBLE</span>
            </div>
          </div>

          {/* Simple Timeline */}
          <div className="pt-2">
            <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-xs">
              <div className="flex justify-between font-mono text-[11px] text-neutral-400 mb-1.5">
                <span>00:00</span>
                <span>──────────────────────</span>
                <span>03:20</span>
              </div>
              <div className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-2 rounded-lg text-center font-bold text-xs tracking-wide">
                MAINTENANCE BLOCK ({reqDuration} MIN)
              </div>
            </div>
          </div>
        </div>

        {/* Right: OTHER BLOCKS CONSIDERED - 5 cols */}
        <div className="md:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
              Other Blocks Considered
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-neutral-900 dark:text-white">BLK-009640</div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">06:00–08:00</div>
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  Track unavailable
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-neutral-900 dark:text-white">BLK-009642</div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">10:00–12:00</div>
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  Track unavailable
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-neutral-900 dark:text-white">BLK-009645</div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">16:00–18:00</div>
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  Team conflict
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-xs space-y-1.5">
            <div className="text-[10px] uppercase font-medium text-neutral-400 tracking-wider">
              Selection Logic
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              BLK-009637/38 satisfies continuous 200 min duration, night team assignment, and zero train conflict.
            </p>
          </div>
        </div>
      </div>

      {/* BELOW RECOMMENDED BLOCK: MAINTENANCE WORKING TOGETHER */}
      <div className="glass-panel rounded-2xl p-6 space-y-3">
        <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center space-x-2">
          <Layers className="w-3.5 h-3.5" />
          <span>MAINTENANCE WORKING TOGETHER</span>
        </div>

        <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-bold text-neutral-900 dark:text-white text-sm">
              Track / Civil + Electrical / TRD
            </div>
            <div className="text-neutral-500 dark:text-neutral-400">
              Rail Grinding + Track Inspection
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="font-mono font-semibold text-neutral-900 dark:text-white">
              Same Section: {currentTask.section}
            </div>
            <div className="text-neutral-500 dark:text-neutral-400 font-mono text-[11px] mt-0.5">
              Shared Possession (00:00 – 03:20)
            </div>
          </div>
        </div>
      </div>

      {/* ARNAV RESULT: SIMPLE PROFESSIONAL LANGUAGE */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          Optimized Block Placement
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-medium text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
            <span>Duration satisfied</span>
          </div>
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
            <span>Train conflict avoided</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
            <span>Deadline satisfied</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 border-t border-black/[0.04] dark:border-white/[0.06] pt-3">
          Best feasible placement found for the maintenance requirement.
        </p>

        <div className="flex justify-end pt-1">
          <button
            onClick={() => onNavigate('live_ops')}
            className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs"
          >
            <span>Continue to Live Operations →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
