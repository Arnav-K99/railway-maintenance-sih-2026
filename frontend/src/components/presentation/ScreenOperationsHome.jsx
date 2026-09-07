import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { TODAY_SCHEDULED_ITEMS, UPCOMING_EVENTS } from '../../data/prototypeData';

export const ScreenOperationsHome = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-7">
      {/* Obvious Back Button */}
      <div>
        <button
          onClick={() => onNavigate('portal')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Portal Selection</span>
        </button>
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Operations Overview
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Network status, block plan execution & real-time operational alerts
          </p>
        </div>
        <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
          Planning Horizon: 07 Sep 2026 (24-Hour)
        </div>
      </div>

      {/* TODAY: 3 Simple Summary Cards (Apple-style monochrome glass with semantic dots) */}
      <div>
        <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">
          Today
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Critical Maintenance */}
          <div className="glass-panel rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Critical Maintenance
              </span>
              <span className="inline-flex items-center text-[10px] font-semibold text-red-600 dark:text-red-400 space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Requires Attention</span>
              </span>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              12
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Work orders with high failure probability
            </div>
          </div>

          {/* Card 2: Scheduled Maintenance */}
          <div className="glass-panel rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Scheduled Maintenance
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                Confirmed
              </span>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              48
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Maintenance windows granted for today
            </div>
          </div>

          {/* Card 3: Operational Conflicts */}
          <div className="glass-panel rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Operational Conflicts
              </span>
              <span className="inline-flex items-center text-[10px] font-semibold text-amber-600 dark:text-amber-400 space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Active</span>
              </span>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              1
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Train movement conflict pending replan
            </div>
          </div>
        </div>
      </div>

      {/* MAINTENANCE REQUIRING ATTENTION & ACTION */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>MAINTENANCE REQUIRING ATTENTION</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              12 urgent maintenance requirements submitted by engineering gangs awaiting block optimization
            </p>
          </div>
          <button
            onClick={() => onNavigate('tasks_list')}
            className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>View Maintenance Tasks →</span>
          </button>
        </div>

        {/* Highlighted items */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-mono font-bold text-neutral-900 dark:text-white">TASK-000005</span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">Rail Grinding</span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-neutral-500 dark:text-neutral-400">Electrical / TRD (SEC-0004)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center text-[10px] font-semibold text-red-600 dark:text-red-400 space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>81% Critical</span>
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 font-mono">200 min</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between opacity-80">
            <div className="flex items-center space-x-3">
              <span className="font-mono font-bold text-neutral-900 dark:text-white">TASK-000018</span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">Track Inspection</span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-neutral-500 dark:text-neutral-400">Track / Civil (SEC-0012)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>72% High</span>
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 font-mono">180 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S BLOCK PLAN & OPERATIONAL ALERTS (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Block Plan */}
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Today's Block Plan
          </div>
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06] text-xs">
            {TODAY_SCHEDULED_ITEMS.map((item) => (
              <div key={item.taskId} className="py-2.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">{item.taskId}</span>
                    <span className="text-neutral-500 dark:text-neutral-400">{item.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    {item.section} • {item.window}
                  </div>
                </div>
                <div>
                  {item.statusType === 'conflict' ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>Conflict</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Operational Alerts
          </div>
          <div className="space-y-3 text-xs">
            {UPCOMING_EVENTS.map((event, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {event.title}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400">
                    {event.time}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {event.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
