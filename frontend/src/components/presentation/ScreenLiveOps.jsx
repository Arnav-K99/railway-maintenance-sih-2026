import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sliders } from 'lucide-react';

export const ScreenLiveOps = ({ onNavigate }) => {
  const [showSimControl, setShowSimControl] = useState(false);
  const [simScenario, setSimScenario] = useState('new_train');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Obvious Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('arnav_plan')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Block Planning</span>
        </button>

        {/* Small Discrete Event Simulator Button */}
        <button
          onClick={() => setShowSimControl(!showSimControl)}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <Sliders className="w-3 h-3" />
          <span>Simulate Operational Event</span>
        </button>
      </div>

      {/* Discrete Simulation Options Drawer/Panel */}
      {showSimControl && (
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Synthetic Demo Event
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">Prototype Only</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => {
                setSimScenario('new_train');
                setShowSimControl(false);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                simScenario === 'new_train'
                  ? 'border-black/[0.3] dark:border-white/[0.3] bg-black/[0.04] dark:bg-white/[0.08] font-semibold text-neutral-900 dark:text-white'
                  : 'border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div>New Train (TRN-SIM-001)</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Freight priority movement</div>
            </button>

            <button
              onClick={() => {
                setSimScenario('block_unavail');
                setShowSimControl(false);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                simScenario === 'block_unavail'
                  ? 'border-black/[0.3] dark:border-white/[0.3] bg-black/[0.04] dark:bg-white/[0.08] font-semibold text-neutral-900 dark:text-white'
                  : 'border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div>Block Unavailable</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Emergency rail repair</div>
            </button>

            <button
              onClick={() => {
                setSimScenario('capacity_red');
                setShowSimControl(false);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                simScenario === 'capacity_red'
                  ? 'border-black/[0.3] dark:border-white/[0.3] bg-black/[0.04] dark:bg-white/[0.08] font-semibold text-neutral-900 dark:text-white'
                  : 'border-black/[0.06] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div>Capacity Reduction</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Headway restriction</div>
            </button>
          </div>
        </div>
      )}

      {/* Screen Header */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          LIVE OPERATIONS
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Real-time railway network monitoring & block possession validation
        </p>
      </div>

      {/* Section 1: OPERATIONAL ALERT — TRAIN CONFLICT DETECTED */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>TRAIN CONFLICT DETECTED</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Dispatch Event Log
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-neutral-400 dark:text-neutral-500">Train</div>
            <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white mt-0.5">
              TRN-SIM-001
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Unscheduled Freight</div>
          </div>

          <div>
            <div className="text-neutral-400 dark:text-neutral-500">Section</div>
            <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white mt-0.5">
              SEC-0004
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Delhi–Agra Chord</div>
          </div>

          <div>
            <div className="text-neutral-400 dark:text-neutral-500">Affected Maintenance</div>
            <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white mt-0.5">
              TASK-000005
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Rail Grinding</div>
          </div>

          <div>
            <div className="text-neutral-400 dark:text-neutral-500">Affected Block</div>
            <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white mt-0.5">
              BLK-009637
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">00:00–02:00 window</div>
          </div>
        </div>
      </div>

      {/* Section 2: CURRENT STATUS & ROUTE CHECK */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-black/[0.04] dark:border-white/[0.06] pb-2.5">
          Current Status
        </div>

        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Maintenance possession conflicts with newly introduced train movement on track section SEC-0004.
        </p>

        <div className="pt-2">
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] text-neutral-400 uppercase font-medium">Route Check</div>
              <div className="font-semibold text-neutral-900 dark:text-white text-sm mt-0.5">
                Alternate route: <span className="text-neutral-500 dark:text-neutral-400">Unavailable</span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Bypass corridors (SEC-0007, SEC-0009) saturated at peak traffic density.
              </div>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              No Safe Bypass
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: ACTION REQUIRED */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Action Required
          </div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            The current maintenance placement requires replanning.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Open replanning queue to generate a new feasible maintenance window.
          </p>
        </div>

        <button
          onClick={() => onNavigate('replanning_requests')}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-xs shrink-0"
        >
          <span>Open Replanning →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
