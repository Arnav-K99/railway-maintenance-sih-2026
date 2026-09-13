import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePlan } from '../../context/PlanContext';
import { GovBadge } from '../../components/common/GovBadge';
import { BackButton } from '../../components/common/BackButton';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Layers,
  TrainTrack
} from 'lucide-react';

export const Replanning = () => {
  const { isReplanned, executeReplanFlow } = usePlan();
  const { t } = useLanguage();

  const [selectedEventId, setSelectedEventId] = useState(null);

  // Authoritative disruption incident feed (Section 21 requirement)
  const replanningEvents = [
    {
      id: 'TRN-SIM-001',
      title: 'Container Relief Freight insertion on Mainline',
      affectedSection: 'SEC-0004 (Delhi–Agra)',
      affectedBlock: 'BLK-009637 + BLK-009638',
      affectedTask: 'TASK-000005 (Rail Grinding)',
      conflictTime: '01:10 – 01:35 (25-min overlap)',
      status: 'RESOLVED',
      decision: 'Train Rerouted via SEC-0007',
      severity: 'HIGH',
      alternateRouteEval: 'SEC-0007 siding has 5 clear headway slots. Train diverted with +75m operational delay. Maintenance window preserved.',
      originalSchedule: '07 Sep 2026 • 00:00–03:20 (BLK-009637 + BLK-009638)',
      replannedSchedule: 'Plan Preserved (No Rescheduling Required)',
      validationStatus: 'Plan Approved',
      validationDetails: 'Ritvik verified headway clearance on SEC-0007. Zero secondary passenger stoppage.',
    },
    {
      id: 'TRN-SIM-002',
      title: 'Emergency Priority Military Movement',
      affectedSection: 'SEC-0004 (Delhi–Agra)',
      affectedBlock: 'BLK-009637 + BLK-009638',
      affectedTask: 'TASK-000005 (Rail Grinding)',
      conflictTime: '01:50 – 02:20 (30-min direct collision)',
      status: 'REPLAN REQUIRED',
      decision: 'All Bypasses Saturated → Rescheduled to 08 Sep',
      severity: 'CRITICAL',
      alternateRouteEval: 'SEC-0005 loop line capacity exhausted (6/6 slots). SEC-0007 siding congested. Topological search returned 0 safe bypasses.',
      originalSchedule: '07 Sep 2026 • 00:00–03:20 (BLK-009637 + BLK-009638)',
      replannedSchedule: '08 Sep 2026 • 18:00–21:20 (BLK-012046 + BLK-012047)',
      validationStatus: 'Plan Approved',
      validationDetails: 'CP-SAT generated optimal assignment in 0.86s. Ritvik confirmed 0 collisions on 08 Sep.',
    },
    {
      id: 'TRN-SIM-003',
      title: 'Mainline Speed Restriction & Headway Bottleneck',
      affectedSection: 'SEC-0005 (Faridabad Loop)',
      affectedBlock: 'BLK-009650',
      affectedTask: 'TASK-000512 (S&T Signal Overhaul)',
      conflictTime: '15:00 – 18:00',
      status: 'RESOLVED',
      decision: 'Routing Weights Dynamically Re-Weighted',
      severity: 'MODERATE',
      alternateRouteEval: 'Available section capacity reduced from 6 to 2 slots. Ritvik updated dispatch weights to throttle entry headway.',
      originalSchedule: '07 Sep 2026 • 15:00–18:00 (BLK-009650)',
      replannedSchedule: 'Plan Preserved with Throttled Dispatch Headway',
      validationStatus: 'Plan Approved',
      validationDetails: 'Speed restriction monitored. Automatic safety headway enforcement verified.',
    },
  ];

  const selectedEvent = replanningEvents.find((e) => e.id === selectedEventId);

  // Detail Page View (Section 22 requirement)
  if (selectedEvent) {
    return (
      <div className="space-y-5">
        {/* Visible Back Button (Section 30 requirement) */}
        <div className="flex items-center justify-between">
          <BackButton onClick={() => setSelectedEventId(null)} />
          <span className="text-xs font-mono font-bold text-slate-500">
            Incident ID: {selectedEvent.id}
          </span>
        </div>

        {/* Incident Detail Header Card */}
        <div className="gov-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-govnavy-700 dark:text-govnavy-300">
                  {selectedEvent.id}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedEvent.affectedSection}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {selectedEvent.title}
              </h2>
            </div>
            <GovBadge status={selectedEvent.status} />
          </div>

          {/* Incident Specifications Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Affected Possession</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">
                {selectedEvent.affectedBlock}
              </span>
              <span className="text-[11px] text-slate-500">{selectedEvent.affectedTask}</span>
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Collision Window</span>
              <span className="font-mono font-bold text-red-600 dark:text-red-400 text-xs mt-0.5 block">
                {selectedEvent.conflictTime}
              </span>
              <span className="text-[11px] text-slate-500">Direct track overlap</span>
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 sm:col-span-2 lg:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Operational Decision</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">
                {selectedEvent.decision}
              </span>
            </div>
          </div>

          {/* Alternate Route Evaluation Panel */}
          <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Topological Bypass Route Audit (Ritvik Engine)
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedEvent.alternateRouteEval}
            </p>
          </div>

          {/* Demonstration Side-by-Side Comparison Box (Section 22 requirement) */}
          <div className="p-4 rounded-md bg-govnavy-50/70 dark:bg-slate-800/80 border border-govnavy-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-bold text-govnavy-900 dark:text-white uppercase tracking-wider">
              Possession Schedule Comparison Audit
            </div>

            <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
              {/* Original Schedule */}
              <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 block">
                  ORIGINAL SCHEDULE:
                </span>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {selectedEvent.originalSchedule}
                </div>
                <div className="text-[11px] text-red-600 dark:text-red-400 font-sans font-semibold">
                  Blocked by {selectedEvent.id}
                </div>
              </div>

              {/* Replanned Schedule */}
              <div className="p-3 rounded bg-white dark:bg-slate-900 border-2 border-orange-500 dark:border-orange-600 space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                  REPLANNED SCHEDULE:
                </span>
                <div className="text-sm font-bold text-orange-800 dark:text-orange-200">
                  {selectedEvent.replannedSchedule}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                  Optimized Feasible Assignment
                </div>
              </div>
            </div>
          </div>

          {/* Operational Validation Box (Section 22 requirement) */}
          <div className="p-3.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <ShieldCheck size={16} className="text-emerald-700 dark:text-emerald-400" />
                <span>FINAL OPERATIONAL VALIDATION: ✓ APPROVED</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {selectedEvent.validationDetails}
              </p>
            </div>

            <GovBadge status="Plan Approved" />
          </div>
        </div>
      </div>
    );
  }

  // Incident Directory Landing View (Section 21)
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <RefreshCw size={14} />
          <span>{t('replanning', 'Operational Incident Directory')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t('replanningDirectory', 'Operational Disruption & Replanning Events')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {t('replanningDirectoryDesc', 'Real-time incident feed requiring route adjustment or schedule re-optimization.')}
        </p>
      </div>

      {/* Incident List Table */}
      <div className="gov-panel overflow-hidden">
        <div className="gov-panel-header">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Active Disruption Incidents
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Click any incident to open full audit comparison details
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table gov-table-zebra">
            <thead>
              <tr>
                <th>Event / Train ID</th>
                <th>Affected Section</th>
                <th>Affected Task & Possession</th>
                <th>Conflict Window</th>
                <th>Decision & Status</th>
                <th className="text-right">{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {replanningEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedEventId(evt.id)}
                >
                  <td className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300">
                    {evt.id}
                    <div className="text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                      {evt.title}
                    </div>
                  </td>
                  <td className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {evt.affectedSection}
                  </td>
                  <td>
                    <div className="font-mono text-xs text-slate-800 dark:text-slate-200">
                      {evt.affectedBlock}
                    </div>
                    <div className="text-[11px] text-slate-500">{evt.affectedTask}</div>
                  </td>
                  <td className="font-mono text-red-600 dark:text-red-400 text-xs">
                    {evt.conflictTime}
                  </td>
                  <td>
                    <div className="space-y-1">
                      <GovBadge status={evt.status} />
                      <div className="text-[10px] text-slate-500">{evt.decision}</div>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventId(evt.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-govnavy-800 hover:text-white text-slate-700 text-xs font-semibold transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-govnavy-700"
                    >
                      <span>{t('viewDetail', 'Inspect')}</span>
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
