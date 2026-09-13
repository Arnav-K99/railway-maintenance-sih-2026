import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePlan } from '../../context/PlanContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  RefreshCw,
  X
} from 'lucide-react';

export const SIH_STEPS = [
  {
    step: 1,
    title: "1. Maintenance Requirement Received",
    detail: "Civil, TRD, Signal and Mechanical divisions submit field work demands into the central inventory.",
    badge: "DEMAND INGESTION",
  },
  {
    step: 2,
    title: "2. Neev AI Predictive Health Alert",
    detail: "Neev evaluates sensor telemetries: AST-120005 flagged with 81.0% failure risk & 71.1 degradation forecast on SEC-0004.",
    badge: "NEEV AI",
  },
  {
    step: 3,
    title: "3. Maintenance Edits Physical Requirement",
    detail: "TRD engineers determine actual duration (200 min), crew size (5 specialists), equipment and night window preference.",
    badge: "MAINTENANCE AUTHORITY",
  },
  {
    step: 4,
    title: "4. Requirement Submitted for Block Planning",
    detail: "TRD confirms bundled possession permission and sends work order to Arnav CP-SAT engine.",
    badge: "SUBMISSION",
  },
  {
    step: 5,
    title: "5. Optimizer Finds Best Feasible Block",
    detail: "Arnav evaluates timetable, trains, crews and sections. Prunes 9 conflict blocks on SEC-0004.",
    badge: "ARNAV CP-SAT",
  },
  {
    step: 6,
    title: "6. Block Scheduled",
    detail: "TASK-000005 placed on 07 Sep (00:00–03:20) in night possession BLK-009637+38 with TEAM-013.",
    badge: "PLAN GENERATED",
  },
  {
    step: 7,
    title: "7. Operational Validation",
    detail: "Ritvik time-interval collision engine audits scheduled block against timetable headways.",
    badge: "RITVIK AUDIT",
  },
  {
    step: 8,
    title: "8. Train Conflict Detection",
    detail: "Unscheduled Emergency Train TRN-SIM-002 inserted at 01:50. Direct 30-min collision detected with maintenance window.",
    badge: "CONFLICT DETECTED",
  },
  {
    step: 9,
    title: "9. Check Alternate Train Routes",
    detail: "Ritvik queries topological route graph: evaluates bypass options on SEC-0005 loop and SEC-0007 siding.",
    badge: "TOPOLOGY AUDIT",
  },
  {
    step: 10,
    title: "10. Decision: Reroute vs Replanning",
    detail: "Bypass SEC-0005 capacity exhausted; SEC-0007 siding congested. Train rerouting determined physically infeasible.",
    badge: "OPERATIONAL DECISION",
  },
  {
    step: 11,
    title: "11. Train Diversion Verification",
    detail: "When bypass is clear (e.g. TRN-SIM-001 on SEC-0007), train reroutes and plan remains valid. Here, rerouting is blocked.",
    badge: "HEADWAY CHECK",
  },
  {
    step: 12,
    title: "12. Send Replan Request to Arnav",
    detail: "Ritvik emits targeted replan_request.json back to Arnav CP-SAT with blacklisted block intervals.",
    badge: "CLOSED-LOOP FEEDBACK",
  },
  {
    step: 13,
    title: "13. Optimizer Creates New Block",
    detail: "Arnav re-optimizes in 0.86s: shifts TASK-000005 to 08 Sep (18:00–21:20, BLK-012046+47) with evening gang TEAM-018.",
    badge: "RE-OPTIMIZATION",
  },
  {
    step: 14,
    title: "14. Operational Validation Runs Again",
    detail: "Ritvik re-audits updated schedule on 08 Sep: 0 train conflicts, section available, qualified crew confirmed.",
    badge: "RE-AUDIT",
  },
  {
    step: 15,
    title: "15. Plan Approved",
    detail: "Ritvik emits PLAN APPROVED certification. Master dispatch authority authorizes track possession.",
    badge: "PLAN APPROVED",
  },
  {
    step: 16,
    title: "16. Approved Work Visible in Maintenance",
    detail: "Field engineers see updated work order on 08 Sep in My Work portal with verified crew roster.",
    badge: "FIELD DISPATCH",
  },
  {
    step: 17,
    title: "17. Maintenance Completes Work",
    detail: "TRD gang executes rail grinding on SEC-0004. Site supervisor submits completion logs and track clearance.",
    badge: "EXECUTION",
  },
  {
    step: 18,
    title: "18. Authority Verifies Work",
    detail: "Authority inspects geometric tolerance records and officially clicks [ACCEPT]. Loop is 100% closed!",
    badge: "FINAL SIGN-OFF",
  },
];

export const SihModePlayer = ({ onClose }) => {
  const { isReplanned, toggleReplan } = usePlan();
  const { t } = useLanguage();

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = SIH_STEPS[currentStepIdx];

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < SIH_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Synchronize replanned state with step progression
  useEffect(() => {
    // Steps 13 through 18 demonstrate the replanned schedule (08 Sep)
    if (currentStepIdx >= 12 && !isReplanned) {
      toggleReplan(true);
    } else if (currentStepIdx < 12 && isReplanned) {
      toggleReplan(false);
    }
  }, [currentStepIdx, isReplanned, toggleReplan]);

  const handleNext = () => {
    if (currentStepIdx < SIH_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    toggleReplan(false);
  };

  return (
    <div className="gov-panel p-4 bg-govnavy-900 text-white border-govnavy-800 shadow-lg space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-govnavy-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-saffron-light animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-saffron-light">
            SIH DEMO MODE • STEP {currentStepIdx + 1} OF {SIH_STEPS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded bg-govnavy-800 hover:bg-govnavy-700 text-slate-300 transition-colors"
            title="Reset Stepper"
          >
            <RotateCcw size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-saffron hover:bg-saffron-light text-govnavy-950 text-xs font-bold transition-colors"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? t('pause', 'Pause') : t('play', 'Play')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Close SIH Mode"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Step Content Card */}
      <div className="grid sm:grid-cols-12 gap-3 items-center py-1">
        <div className="sm:col-span-8 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              {step.title}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-govnavy-800 text-saffron-light border border-govnavy-700">
              {step.badge}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {step.detail}
          </p>
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="sm:col-span-4 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="p-1.5 rounded bg-govnavy-800 hover:bg-govnavy-700 disabled:opacity-30 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStepIdx === SIH_STEPS.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-govnavy-700 hover:bg-govnavy-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white shadow-2xs"
          >
            <span>{t('nextStep', 'Next')}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Mini Step Track Progress Bar */}
      <div className="w-full bg-govnavy-800 h-1.5 rounded-full overflow-hidden flex">
        {SIH_STEPS.map((s, idx) => (
          <div
            key={s.step}
            className={`flex-1 transition-all ${
              idx <= currentStepIdx ? 'bg-saffron' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
