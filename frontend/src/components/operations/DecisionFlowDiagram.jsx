import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  ArrowDown, 
  ShieldCheck,
  GitFork,
  Radio
} from 'lucide-react';

export const DecisionFlowDiagram = () => {
  const { t } = useLanguage();

  return (
    <div className="gov-panel p-4 space-y-4">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
          <Radio size={14} className="text-govnavy-700 dark:text-govnavy-300" />
          <span>{t('operationalDecisionFlow', 'OPERATIONAL DECISION CLOSED-LOOP ARCHITECTURE')}</span>
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Step-by-step logic preserving train safety while maximizing track possession availability
        </p>
      </div>

      {/* Structured Enterprise Decision Flow Nodes */}
      <div className="flex flex-col items-center max-w-2xl mx-auto space-y-3 text-xs">
        {/* Stage 1: Maintenance Block Generated */}
        <div className="w-full sm:w-80 p-2.5 rounded bg-govnavy-800 text-white font-bold text-center shadow-2xs">
          1. {t('maintBlockGranted', 'MAINTENANCE BLOCK PLANNED (CP-SAT)')}
        </div>

        <ArrowDown size={18} className="text-govnavy-700 dark:text-slate-400" />

        {/* Stage 2: Operational Feasibility Check */}
        <div className="w-full sm:w-80 p-2.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-center border border-slate-300 dark:border-slate-700">
          2. {t('operationalCheck', 'OPERATIONAL FEASIBILITY AUDIT (RITVIK)')}
        </div>

        <ArrowDown size={18} className="text-govnavy-700 dark:text-slate-400" />

        {/* Stage 3: Train Conflict Decision Node */}
        <div className="w-full sm:w-96 p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-2">
          <span className="font-extrabold text-amber-950 dark:text-amber-200 block text-xs">
            3. {t('trainConflictQ', 'TRAIN CONFLICT DETECTED IN POSSESSION WINDOW?')}
          </span>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-[11px] flex items-center justify-center gap-1">
              <CheckCircle2 size={13} />
              <span>{t('noConflict', 'NO → PLAN APPROVED')}</span>
            </div>

            <div className="p-2 rounded bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-bold text-[11px] flex items-center justify-center gap-1">
              <AlertCircle size={13} />
              <span>{t('yesConflict', 'YES → AUDIT BYPASSES')}</span>
            </div>
          </div>
        </div>

        <ArrowDown size={18} className="text-govnavy-700 dark:text-slate-400" />

        {/* Stage 4: Topological Route Search Node */}
        <div className="w-full sm:w-96 p-3 rounded bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-center space-y-2">
          <span className="font-extrabold text-blue-950 dark:text-blue-200 block text-xs">
            4. {t('safeRouteAvailableQ', 'SAFE ALTERNATIVE ROUTE AVAILABLE IN TOPOLOGY?')}
          </span>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-[11px] flex flex-col items-center justify-center">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>{t('yesReroute', 'YES → TRAIN REROUTED')}</span>
              </div>
              <span className="text-[10px] font-normal opacity-85 mt-0.5">Plan Remains Valid</span>
            </div>

            <div className="p-2 rounded bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 text-orange-950 dark:text-orange-200 font-bold text-[11px] flex flex-col items-center justify-center">
              <div className="flex items-center gap-1">
                <RefreshCw size={12} />
                <span>{t('noReplan', 'NO → REPLAN REQUIRED')}</span>
              </div>
              <span className="text-[10px] font-normal opacity-85 mt-0.5">Feedback to Arnav</span>
            </div>
          </div>
        </div>

        <ArrowDown size={18} className="text-orange-600 dark:text-orange-400" />

        {/* Stage 5: Replan Feedback Loop & Final Validation */}
        <div className="w-full sm:w-80 p-3 rounded bg-orange-50 dark:bg-orange-950/40 border-2 border-dashed border-orange-400 dark:border-orange-800 text-center space-y-1">
          <div className="font-extrabold text-orange-900 dark:text-orange-200 text-xs flex items-center justify-center gap-1.5">
            <RefreshCw size={13} className="text-orange-600" />
            <span>5. {t('newBlockScheduled', 'ARNAV CP-SAT RE-OPTIMIZATION')}</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Blacklists blocked slots &rarr; assigns 08 Sep (18:00–21:20) with TEAM-018
          </p>
          <div className="pt-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1">
            <ShieldCheck size={14} />
            <span>6. {t('reValidation', 'RITVIK RE-VALIDATION → PLAN APPROVED')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
