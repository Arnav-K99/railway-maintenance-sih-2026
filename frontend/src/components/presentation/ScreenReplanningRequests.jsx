import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { REPLANNING_EVENTS } from '../../data/prototypeData';

export const ScreenReplanningRequests = ({ onNavigate, onSelectEvent }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Obvious Back Button */}
      <div>
        <button
          onClick={() => onNavigate('live_ops')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Live Operations</span>
        </button>
      </div>

      {/* Screen Header */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          REPLANNING REQUESTS
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Operational disruption events requiring maintenance re-slotting
        </p>
      </div>

      {/* List of Affected Operational Events (Inbox) */}
      <div className="space-y-4">
        {REPLANNING_EVENTS.map((event) => {
          const isReplanRequired = event.statusType === 'replan';
          return (
            <div
              key={event.id}
              className="glass-panel rounded-2xl p-5 sm:p-6 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200">
                      {event.id}
                    </span>
                    <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                      {event.trainId}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {event.trainName}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                    <div>
                      Section: <span className="font-mono font-semibold text-neutral-900 dark:text-white">{event.section}</span>
                    </div>
                    <div>
                      Affected Block: <span className="font-mono font-semibold text-neutral-900 dark:text-white">{event.affectedBlock}</span>
                    </div>
                    <div>
                      Maintenance: <span className="font-mono font-semibold text-neutral-900 dark:text-white">{event.affectedTask}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-0.5">
                    {event.reason}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                  <span className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-900 dark:text-white">
                    {isReplanRequired ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>Replan Required</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Resolved</span>
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => onSelectEvent(event.id)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium border border-black/[0.1] dark:border-white/[0.14] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-neutral-900 dark:text-white transition-all shadow-2xs"
                  >
                    <span>{isReplanRequired ? 'View Replanning' : 'View Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
