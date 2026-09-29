import React from 'react';
import { X, Calendar, Clock, Wrench, Shield, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { GovBadge } from '../common/GovBadge';
import { formatTaskId } from '../../utils/formatters';

export const DayDetailDrawer = ({ dayData, blocks, isOpen, onClose, onSwitchToWeek }) => {
  if (!isOpen || !dayData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full max-w-md h-full bg-white dark:bg-[#161a22] shadow-2xl border-l border-slate-200 dark:border-white/[0.1] flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-start justify-between bg-slate-50 dark:bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                {dayData.dayName || dayData.date}
              </span>
              {dayData.isToday && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-amber-950 uppercase shadow-2xs">
                  TODAY
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Possessions for {dayData.date}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              {dayData.fullDate} • {dayData.isBeyondFutureHorizon ? 'Beyond 1-Wk Horizon (Unscheduled)' : `${blocks.length} Total Scheduled Possession${blocks.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.1] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body - Scrollable Possession Cards */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3.5 custom-scrollbar">
          {blocks.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                {dayData.isBeyondFutureHorizon ? 'Beyond 1-Week Operational Planning Horizon' : 'No Maintenance Possessions Scheduled'}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
                {dayData.isBeyondFutureHorizon 
                  ? 'In accordance with Indian Railways operating procedures, track possessions are allocated within a rolling 7-day operational window. Maintenance blocks for this date will be scheduled 7 days prior.'
                  : 'Track is clear with no sanctioned traffic blocks for this date.'}
              </p>
            </div>
          ) : (
            blocks.map((block) => {
              const isRescheduled = block.isRescheduled;
              const isCompleted = block.status === 'Completed' || block.status === 'Verified' || block.isPast;
              const isCritical = block.risk === 'CRITICAL' || block.category === 'critical';
              const isHigh = block.risk === 'HIGH' || block.category === 'high';

              const getCardAccent = () => {
                if (isRescheduled) return 'border-l-4 border-l-orange-500 border-orange-300 dark:border-orange-800/80 bg-orange-50/80 dark:bg-orange-950/30';
                if (isCompleted) return 'border-l-4 border-l-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40';
                if (isCritical) return 'border-l-4 border-l-red-600 border-red-300 dark:border-red-800/80 bg-red-50/60 dark:bg-red-950/25';
                if (isHigh) return 'border-l-4 border-l-amber-500 border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20';
                return 'border-l-4 border-l-slate-400 border-slate-200 dark:border-slate-700 bg-white dark:bg-white/[0.02]';
              };

              return (
                <div
                  key={block.id}
                  className={`p-4 rounded-xl border transition-all shadow-xs ${getCardAccent()}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {block.blockId}
                      </span>
                      {block.taskId && (
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          ({formatTaskId(block.taskId)})
                        </span>
                      )}
                    </div>
                    <GovBadge status={block.status} />
                  </div>

                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {block.fullMaintenanceType || block.maintenanceType}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time Window</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{block.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Section</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{block.section}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">{block.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Risk Level</span>
                      <GovBadge status={block.risk} type="risk" />
                    </div>
                  </div>

                  {isRescheduled && block.previousBlock && (
                    <div className="mt-3 p-2 rounded bg-orange-100/70 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/80 text-[10px] text-orange-900 dark:text-orange-200">
                      <span className="font-bold uppercase tracking-wider block">Reschedule Audit:</span>
                      <span className="font-mono">{block.previousBlock}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/[0.08] transition-colors"
          >
            Close
          </button>

          {onSwitchToWeek && (
            <button
              type="button"
              disabled={dayData.isBeyondFutureHorizon}
              onClick={() => {
                if (dayData.isBeyondFutureHorizon) return;
                onSwitchToWeek(dayData.rawDate || new Date(dayData.fullDate));
                onClose();
              }}
              title={dayData.isBeyondFutureHorizon ? 'Scheduling horizon capped at +1 week ahead' : 'View Full Week'}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                dayData.isBeyondFutureHorizon
                  ? 'bg-slate-100 text-slate-400 dark:bg-white/[0.04] dark:text-slate-600 border border-slate-200 dark:border-white/[0.06] cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs'
              }`}
            >
              <span>{dayData.isBeyondFutureHorizon ? 'Horizon Capped' : 'View Full Week'}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
