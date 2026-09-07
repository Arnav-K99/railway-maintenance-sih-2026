import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { usePlan } from '../../context/PlanContext';
import {
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
  TrainTrack,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export const Replanning = ({ onNavigate }) => {
  const { isReplanned, toggleReplan } = usePlan();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <RefreshCw size={14} className="text-blue-500" />
            <span>Closed-Loop Replanning Audit Interface</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Maintenance Replanning Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative analysis of the original CP-SAT maintenance block vs the re-optimized schedule following Ritvik operational feedback.
          </p>
        </div>

        {/* Toggle between original and replanned for live testing */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
          <button
            onClick={() => toggleReplan(false)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              !isReplanned ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Show Original Plan
          </button>
          <button
            onClick={() => toggleReplan(true)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              isReplanned ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Show Replanned Plan
          </button>
        </div>
      </div>

      {/* 3-Column Comparison Grid: Original Plan | Conflict Cause | Replanned Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. ORIGINAL PLAN */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">Step 1 — Initial Schedule</span>
            <Badge variant="primary" size="sm">Original Assignment</Badge>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Task Identifier:</span>
              <span className="text-sm font-bold font-mono text-slate-900">TASK-000005</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Maintenance Type:</span>
              <span className="text-xs font-semibold text-slate-800">Rail Grinding</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Scheduled Date:</span>
              <span className="text-xs font-bold text-slate-800 font-mono">07 Sep 2026</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Time Window:</span>
              <span className="text-xs font-bold font-mono text-blue-700">00:00 – 03:20 (200m)</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Assigned Blocks:</span>
              <span className="text-xs font-mono text-slate-800 font-bold">BLK-009637 + BLK-009638</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Assigned Crew:</span>
              <span className="text-xs font-mono text-slate-800">TEAM-013 (Night Shift)</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Neev Risk Score:</span>
              <Badge variant="CRITICAL" size="sm">81.0% CRITICAL</Badge>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
            Initial CP-SAT solution satisfied all physical constraints on 07 Sep night window.
          </div>
        </div>

        {/* 2. OPERATIONAL CONFLICT DETECTED BY RITVIK */}
        <div className="bg-amber-50/40 rounded-xl border border-amber-300 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <span className="text-xs font-mono font-bold text-amber-800 uppercase">Step 2 — Disruption Event</span>
            <Badge variant="danger" size="sm">Collision Detected</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-2">
              <div className="font-bold text-slate-900 text-xs">High-Priority Train Movement</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Special Military Relief Movement <strong>TRN-SIM-002</strong> entered SEC-0004 with scheduled traversal during <strong>01:50 – 02:20</strong>.
              </p>
              <div className="text-red-600 font-mono font-bold text-[11px]">
                Direct 30-Minute Overlap with TASK-000005 Window!
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-1 text-[11px]">
              <div className="font-bold text-slate-800">Ritvik Rerouting Audit:</div>
              <div>• Alternate SEC-0005: Capacity Exhausted (6/6 slots)</div>
              <div>• Alternate SEC-0007: Capacity Exhausted (0 headroom)</div>
              <div className="text-red-700 font-bold">• Rerouting Impossible &rarr; Safety Violation Risk</div>
            </div>

            <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-950 font-mono text-[11px] space-y-1">
              <div className="font-bold">Generated Artifact:</div>
              <div>replan_request.json &rarr; Handed to Arnav</div>
            </div>
          </div>
        </div>

        {/* 3. REPLANNED PLAN BY ARNAV */}
        <div className="bg-white rounded-xl border border-orange-300 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <span className="text-xs font-mono font-bold text-orange-600 uppercase">Step 3 — Re-Optimized Plan</span>
            <Badge variant="Replanned" size="sm">Optimal Re-Assignment</Badge>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Task Identifier:</span>
              <span className="text-sm font-bold font-mono text-slate-900">TASK-000005</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Maintenance Type:</span>
              <span className="text-xs font-semibold text-slate-800">Rail Grinding</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">New Scheduled Date:</span>
              <span className="text-xs font-bold text-orange-700 font-mono">08 Sep 2026 (Within Deadline)</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">New Time Window:</span>
              <span className="text-xs font-bold font-mono text-orange-700">18:00 – 21:20 (200m)</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">New Assigned Blocks:</span>
              <span className="text-xs font-mono text-slate-800 font-bold">BLK-012046 + BLK-012047</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Reassigned Crew:</span>
              <span className="text-xs font-mono text-slate-800">TEAM-018 (Evening/Night Shift)</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 font-medium">Deadline Compliance:</span>
              <span className="text-xs font-bold text-emerald-600 font-mono">08 Sep &le; 08 Sep Deadline</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-[11px] text-orange-950 leading-relaxed">
            Arnav CP-SAT blacklisted conflicted blocks BLK-009637/38 and proved new optimal candidate in &lt; 1s.
          </div>
        </div>
      </div>

      {/* RITVIK VALIDATION AUDIT (Section 17 requirement) */}
      <div className="bg-white rounded-xl border border-emerald-300 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Ritvik Independent Operational Validation Audit
            </h4>
          </div>
          <Badge variant="LOW" size="md">PLAN APPROVED</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5 text-emerald-950">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">No Train Conflict</div>
              <div className="text-[10px] text-emerald-800">Zero overlap during 18:00–21:20</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5 text-emerald-950">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">Section Available</div>
              <div className="text-[10px] text-emerald-800">SEC-0004 track open</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5 text-emerald-950">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">Crew Available</div>
              <div className="text-[10px] text-emerald-800">TEAM-018 on duty & verified</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center gap-2.5 text-emerald-950">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">Constraints Satisfied</div>
              <div className="text-[10px] text-emerald-800">All 10 rules respected</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-slate-700">
          <span>Output Artifact: <strong>ritvik_operational_decision.json</strong></span>
          <span className="text-emerald-700 font-bold">STATUS: PLAN_APPROVED • MAINTENANCE VALID</span>
        </div>
      </div>
    </div>
  );
};
