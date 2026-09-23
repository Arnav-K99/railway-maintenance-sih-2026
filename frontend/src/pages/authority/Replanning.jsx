import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePlan } from '../../context/PlanContext';
import { GovBadge } from '../../components/common/GovBadge';
import { BackButton } from '../../components/common/BackButton';
import { formatTaskId } from '../../utils/formatters';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Layers,
  TrainTrack,
  GitCommit,
  Navigation
} from 'lucide-react';

export const Replanning = () => {
  const { isReplanned, executeReplanFlow } = usePlan();
  const { t } = useLanguage();

  const [selectedEventId, setSelectedEventId] = useState(null);

  // Authoritative disruption incident feed
  const replanningEvents = [
    {
      id: 'TRN-SIM-001',
      title: 'Container Relief Freight insertion on Mainline',
      affectedSection: 'SEC-0004 (Delhi–Agra)',
      affectedBlock: 'BLK-009637 + BLK-009638',
      affectedTaskId: 'TASK-000005',
      affectedTaskName: 'Rail Grinding (Bundled)',
      conflictTime: '01:10 – 01:35',
      overlapDuration: '25 min overlap',
      status: 'RESOLVED',
      decision: 'Train Rerouted via SEC-0007',
      severity: 'HIGH',
      alternateRouteEval: 'SEC-0007 siding has 5 clear headway slots. Train diverted with +75m operational delay. Maintenance window preserved without disruption to track possessions.',
      originalSchedule: {
        date: '07 Sep 2026',
        time: '00:00 – 03:20',
        blocks: 'BLK-009637 + BLK-009638'
      },
      replannedSchedule: {
        date: '07 Sep 2026',
        time: '00:00 – 03:20',
        blocks: 'Preserved (Bypass active)'
      },
      validationStatus: 'Plan Approved',
      validationDetails: 'Automated topology audit verified headway clearance on SEC-0007 siding. Zero secondary passenger train stoppage.',
    },
    {
      id: 'TRN-SIM-002',
      title: 'Emergency Priority Military Movement',
      affectedSection: 'SEC-0004 (Delhi–Agra)',
      affectedBlock: 'BLK-009637 + BLK-009638',
      affectedTaskId: 'TASK-000005',
      affectedTaskName: 'Rail Grinding (Bundled)',
      conflictTime: '01:50 – 02:20',
      overlapDuration: '30 min direct collision',
      status: 'REPLAN REQUIRED',
      decision: 'All Bypasses Saturated → Rescheduled to 08 Sep',
      severity: 'CRITICAL',
      alternateRouteEval: 'SEC-0005 loop line capacity exhausted (6/6 slots). SEC-0007 siding congested. Topological search returned 0 safe bypasses without hazardous headways.',
      originalSchedule: {
        date: '07 Sep 2026',
        time: '00:00 – 03:20',
        blocks: 'BLK-009637 + BLK-009638'
      },
      replannedSchedule: {
        date: '08 Sep 2026',
        time: '18:00 – 21:20',
        blocks: 'BLK-012046 + BLK-012047'
      },
      validationStatus: 'Plan Approved',
      validationDetails: 'CP-SAT solver generated optimal assignment in 0.86s. Automated safety audit confirmed 0 collisions on 08 Sep.',
    },
    {
      id: 'TRN-SIM-003',
      title: 'Mainline Speed Restriction & Headway Bottleneck',
      affectedSection: 'SEC-0005 (Faridabad Loop)',
      affectedBlock: 'BLK-009650',
      affectedTaskId: 'TASK-000512',
      affectedTaskName: 'S&T Signal Overhaul',
      conflictTime: '15:00 – 18:00',
      overlapDuration: 'Dynamic headway throttle',
      status: 'RESOLVED',
      decision: 'Routing Weights Dynamically Re-Weighted',
      severity: 'MODERATE',
      alternateRouteEval: 'Available section capacity reduced from 6 to 2 slots. Automated dispatch weights updated to throttle entry headway while keeping the maintenance window intact.',
      originalSchedule: {
        date: '07 Sep 2026',
        time: '15:00 – 18:00',
        blocks: 'BLK-009650'
      },
      replannedSchedule: {
        date: '07 Sep 2026',
        time: '15:00 – 18:00',
        blocks: 'Preserved (Throttled dispatch)'
      },
      validationStatus: 'Plan Approved',
      validationDetails: 'Speed restriction monitored. Automatic safety headway enforcement verified across all trailing trains.',
    },
  ];

  const selectedEvent = replanningEvents.find((e) => e.id === selectedEventId);

  // Detail Page View: Structured vertical hierarchy (Event -> Conflict -> Route Evaluation -> Block Change -> Final Validation)
  if (selectedEvent) {
    return (
      <div className="space-y-6">
        {/* Navigation Bar with Visible Back Button */}
        <div className="flex items-center justify-between">
          <BackButton 
            onClick={() => setSelectedEventId(null)} 
            label="Back to Replanning"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08]">
              {selectedEvent.id}
            </span>
            <GovBadge status={selectedEvent.status} />
          </div>
        </div>

        {/* Section 1: EVENT INFORMATION */}
        <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            1. Event Information
          </div>

          <div className="border-b border-slate-100 dark:border-white/[0.06] pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedEvent.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Disruption detected on {selectedEvent.affectedSection}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Incident ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedEvent.id}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Corridor Section</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedEvent.affectedSection}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Affected Task</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                {formatTaskId(selectedEvent.affectedTaskId)}
              </span>
              <span className="text-[10px] text-slate-500 truncate block">{selectedEvent.affectedTaskName}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Possession Blocks</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedEvent.affectedBlock}</span>
            </div>
          </div>
        </div>

        {/* Section 2: CONFLICT */}
        <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <AlertTriangle size={14} />
            2. Conflict Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
              <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400 block">Collision Window</span>
              <span className="font-mono text-sm font-bold text-red-700 dark:text-red-300 mt-1 block">
                {selectedEvent.conflictTime}
              </span>
              <span className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-0.5 block">
                {selectedEvent.overlapDuration}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Severity Level</span>
              <div className="mt-1">
                <GovBadge status={selectedEvent.severity} />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Direct track segment occupancy conflict</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Operational Decision</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs mt-1 block">
                {selectedEvent.decision}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: ROUTE EVALUATION */}
        <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <Navigation size={14} />
            3. Route Evaluation & Bypass Audit
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Topological Bypass Analysis
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[13px]">
              {selectedEvent.alternateRouteEval}
            </p>
          </div>
        </div>

        {/* Section 4: BLOCK CHANGE (Side-by-side with two-line date formatting) */}
        <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <GitCommit size={14} />
            4. Block Change Comparison
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Schedule Box */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Original Schedule
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 font-semibold">
                  Blocked
                </span>
              </div>
              <div className="space-y-0.5 pt-1">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {selectedEvent.originalSchedule.date}
                </div>
                <div className="font-mono text-xs text-slate-600 dark:text-slate-400">
                  {selectedEvent.originalSchedule.time}
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200 dark:border-white/[0.06]">
                Possessions: {selectedEvent.originalSchedule.blocks}
              </div>
            </div>

            {/* Replanned Schedule Box */}
            <div className="p-4 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-2 border-orange-500/80 dark:border-orange-500/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Replanned Schedule
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 font-semibold">
                  Re-Optimized
                </span>
              </div>
              <div className="space-y-0.5 pt-1">
                <div className="font-bold text-sm text-orange-950 dark:text-orange-200">
                  {selectedEvent.replannedSchedule.date}
                </div>
                <div className="font-mono text-xs text-orange-800 dark:text-orange-300">
                  {selectedEvent.replannedSchedule.time}
                </div>
              </div>
              <div className="text-[11px] font-mono text-orange-700/80 dark:text-orange-400/80 pt-1 border-t border-orange-200/60 dark:border-orange-800/40">
                Possessions: {selectedEvent.replannedSchedule.blocks}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: FINAL VALIDATION */}
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>5. Final Operational Validation: Plan Approved</span>
            </div>
            <p className="text-[12px] text-slate-600 dark:text-slate-300 max-w-2xl">
              {selectedEvent.validationDetails}
            </p>
          </div>
          <GovBadge status="Plan Approved" />
        </div>
      </div>
    );
  }

  // Incident Directory Landing View
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <RefreshCw size={14} />
          <span>Operational Incident Directory</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Operational Disruption & Replanning Events
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time incident feed requiring route adjustment or schedule re-optimization.
        </p>
      </div>

      {/* Incident List Table */}
      <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Active Disruption Incidents
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Click any incident to open full audit comparison details
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-3.5">Event / Incident</th>
                <th className="p-3.5">Affected Section</th>
                <th className="p-3.5">Affected Task & Possession</th>
                <th className="p-3.5">Conflict Window</th>
                <th className="p-3.5">Decision & Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {replanningEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                  onClick={() => setSelectedEventId(evt.id)}
                >
                  <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {evt.id}
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-sans font-normal mt-0.5">
                      {evt.title}
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                    {evt.affectedSection}
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      {formatTaskId(evt.affectedTaskId)}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">{evt.affectedBlock}</div>
                  </td>
                  <td className="p-3.5 font-mono text-red-600 dark:text-red-400">
                    {evt.conflictTime}
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <GovBadge status={evt.status} />
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{evt.decision}</div>
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventId(evt.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-semibold transition-colors dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-blue-600 dark:hover:text-white"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
