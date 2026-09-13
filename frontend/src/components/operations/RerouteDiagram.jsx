import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { GitFork, AlertCircle, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const RerouteDiagram = ({ trainId = 'TRN-SIM-001', section = 'SEC-0004', isBlocked = false }) => {
  const { t } = useLanguage();

  return (
    <div className="gov-panel p-4 space-y-4">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <GitFork size={14} className="text-govnavy-700 dark:text-govnavy-300" />
            <span>{t('rerouteSchematicTitle', 'TRAIN REROUTING SCHEMATIC & TOPOLOGY')}</span>
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t('rerouteSchematicSubtitle', 'Conflict resolution through alternative route feasibility evaluation')}
          </p>
        </div>
        <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
          Train: {trainId}
        </span>
      </div>

      {/* Railway Route Schematic (Section 20 requirement) */}
      <div className="space-y-4 font-mono text-xs">
        {/* 1. Original Route with Conflict */}
        <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-sans">
            <span className="font-bold uppercase tracking-wider">Original Scheduled Route:</span>
            <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
              <AlertCircle size={12} />
              <span>Conflict on {section} (00:00–03:20)</span>
            </span>
          </div>

          <div className="py-2 px-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-bold">
              <span>Station A (New Delhi)</span>
              <span className="text-slate-400 font-normal">──────</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-200 dark:border-red-800 font-bold flex items-center gap-1">
                <span>{section}</span>
                <span className="text-red-600 dark:text-red-400 font-extrabold text-sm">✕</span>
              </span>
              <span className="text-slate-400 font-normal">──────</span>
              <span>Station D (Agra Cantt)</span>
            </div>
            <span className="text-[10px] font-sans font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
              Blocked by Maint
            </span>
          </div>
        </div>

        {/* 2. Alternative Route Evaluation */}
        <div className="grid sm:grid-cols-2 gap-3">
          {/* Alternative Route A */}
          <div className={`p-3 rounded border space-y-1.5 ${
            isBlocked
              ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
              : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-[11px] text-slate-900 dark:text-white">
                Alternative Route A (SEC-0007 Siding)
              </span>
              {isBlocked ? (
                <span className="text-red-700 dark:text-red-400 font-bold text-[11px] flex items-center gap-0.5">
                  <XCircle size={12} />
                  <span>✕ Saturated</span>
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-0.5">
                  <CheckCircle2 size={12} />
                  <span>✓ Available</span>
                </span>
              )}
            </div>
            <p className="font-sans text-[11px] text-slate-600 dark:text-slate-400">
              {isBlocked
                ? 'Siding capacity exhausted (0 headroom slots). Train diversion infeasible.'
                : 'Bypass track clear. Safe clearance window verified (+75m operational headway delay).'}
            </p>
          </div>

          {/* Alternative Route B */}
          <div className="p-3 rounded bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-[11px] text-slate-900 dark:text-white">
                Alternative Route B (SEC-0005 Loop)
              </span>
              <span className="text-red-700 dark:text-red-400 font-bold text-[11px] flex items-center gap-0.5">
                <XCircle size={12} />
                <span>✕ Saturated</span>
              </span>
            </div>
            <p className="font-sans text-[11px] text-slate-600 dark:text-slate-400">
              Speed restriction (30 km/h) and heavy freight traffic. Available capacity 0 slots.
            </p>
          </div>
        </div>

        {/* 3. Operational Update Decision Banner */}
        <div className="p-3 rounded bg-govnavy-50 dark:bg-slate-800/80 border border-govnavy-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-govnavy-800 dark:text-govnavy-300 block">
              OPERATIONAL UPDATE & DECISION:
            </span>
            <span className="font-sans font-semibold text-xs text-slate-800 dark:text-slate-200">
              {isBlocked
                ? 'No safe alternate route available → Targeted REPLAN REQUEST dispatched to CP-SAT.'
                : 'Train rerouted via Route A (SEC-0007) → Maintenance possession on SEC-0004 remains valid.'}
            </span>
          </div>

          <span className={`px-2.5 py-1 rounded text-xs font-bold font-sans self-start sm:self-auto ${
            isBlocked
              ? 'bg-orange-600 text-white shadow-2xs'
              : 'bg-emerald-600 text-white shadow-2xs'
          }`}>
            {isBlocked ? 'REPLAN INITIATED' : 'PLAN PRESERVED'}
          </span>
        </div>
      </div>
    </div>
  );
};
