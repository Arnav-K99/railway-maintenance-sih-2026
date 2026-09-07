import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { usePlan } from '../../context/PlanContext';
import {
  Radio,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Train,
  Clock,
  Sparkles,
} from 'lucide-react';

export const LiveOps = ({ onNavigate }) => {
  const { activeEvent, replanRequestActive, isReplanned, executeReplanFlow, triggerEvent } = usePlan();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span>Ritvik Dynamic Operations & Replanning Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Live Operations & Conflict Resolution
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time validation layer. Evaluates railway state against maintenance possessions, reroutes conflicting trains, or triggers automated replan requests.
          </p>
        </div>

        {/* Quick Simulator Link */}
        <button
          onClick={() => onNavigate('simulator')}
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
        >
          <span>Open Event Simulator</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Active Operational Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Real-Time Network Operational State
            </h3>
          </div>
          <Badge variant="LOW" size="sm">Ritvik Validation Active</Badge>
        </div>

        {/* Dynamic Conflict Alert Banner */}
        {activeEvent ? (
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle size={18} className="text-amber-600 animate-bounce" />
                <span>ACTIVE OPERATIONAL CONFLICT DETECTED BY RITVIK</span>
              </div>
              <Badge variant="danger" size="md">Collision Conflict</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-white/80 p-3 rounded-lg border border-amber-200 font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">Affected Maintenance:</span>
                <span className="font-bold text-slate-900">TASK-000005</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Occupied Blocks:</span>
                <span className="font-bold text-slate-900">BLK-009637, BLK-009638</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Disrupting Train:</span>
                <span className="font-bold text-red-600">{activeEvent.trainId}</span>
              </div>
            </div>

            <p className="text-xs text-amber-950">
              {activeEvent.details}
            </p>

            {/* Reroute / Replan Decision Box */}
            {activeEvent.outcomeType === 'OPERATIONAL_UPDATE' && (
              <div className="bg-emerald-100 border border-emerald-300 p-3.5 rounded-lg text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  <span>OPERATIONAL UPDATE — TRAIN REROUTED SUCCESSFULLY</span>
                </div>
                <p className="text-xs leading-relaxed">
                  &ldquo;Train {activeEvent.trainId} rerouted successfully via {activeEvent.bypassRoute}. Maintenance plan remains 100% valid.&rdquo;
                </p>
                <div className="text-[11px] font-mono text-emerald-800">
                  Delay Penalty: +75 min • Maintenance Possession Preserved
                </div>
              </div>
            )}

            {activeEvent.outcomeType === 'REPLAN_REQUEST' && (
              <div className="bg-red-50 border border-red-300 p-3.5 rounded-lg text-red-950 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-red-900">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span>REPLAN REQUEST — ALL ALTERNATE BYPASS ROUTES INFEASIBLE</span>
                </div>
                <p className="text-xs leading-relaxed">
                  &ldquo;No safe alternate route available on SEC-0005 / SEC-0007. Maintenance possession cannot proceed safely in current slot.&rdquo;
                </p>

                {/* Primary Action Button to trigger Arnav replanning */}
                {!isReplanned ? (
                  <button
                    onClick={executeReplanFlow}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <RefreshCw size={14} />
                    <span>Request Replan from Arnav Optimizer</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-white p-2 rounded border border-emerald-200">
                    <CheckCircle2 size={14} />
                    <span>Replan Request executed. Task re-scheduled to 08 Sep (18:00 - 21:20) by Arnav.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <ShieldCheck size={36} className="text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">All Sections Operating Conflict-Free</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Ritvik has verified that scheduled maintenance windows do not collide with scheduled train movements or track closures.
            </p>
            <div className="pt-2">
              <button
                onClick={() => triggerEvent('NEW_TRAIN_BLOCKED')}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Inject Demo Conflict (TRN-SIM-002)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario A Card */}
        <Card
          title="Scenario A: Dynamic Train Rerouting"
          subtitle="Ritvik resolves conflict without rescheduling maintenance"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              When an unexpected train collides with a maintenance block but clear bypass routes exist:
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <div>• Section: SEC-0004 (Delhi–Agra)</div>
              <div>• Conflict: TRN-SIM-001 (01:10 - 01:35) vs TASK-000005</div>
              <div>• Alternate: SEC-0004 &rarr; SEC-0007 &rarr; SEC-0008 &rarr; SEC-0010</div>
              <div className="text-emerald-700 font-bold">• Result: OPERATIONAL_UPDATE (Plan Preserved)</div>
            </div>
            <button
              onClick={() => triggerEvent('NEW_TRAIN_SUCCESS')}
              className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-xs transition-colors"
            >
              Simulate Scenario A
            </button>
          </div>
        </Card>

        {/* Scenario B Card */}
        <Card
          title="Scenario B: Automated Re-Planning Loop"
          subtitle="Ritvik signals Arnav when rerouting is impossible"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              When all bypass routes are saturated or track is physically unavailable:
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <div>• Section: SEC-0004 (Delhi–Agra)</div>
              <div>• Conflict: Military Train TRN-SIM-002 (01:50 - 02:20)</div>
              <div>• Bypass Status: SEC-0005 & SEC-0007 Capacity Exhausted (0 slots)</div>
              <div className="text-red-700 font-bold">• Result: REPLAN_REQUEST &rarr; Arnav CP-SAT</div>
            </div>
            <button
              onClick={() => triggerEvent('NEW_TRAIN_BLOCKED')}
              className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-xs transition-colors"
            >
              Simulate Scenario B
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
