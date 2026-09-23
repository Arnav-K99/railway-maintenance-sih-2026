import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { BackButton } from '../../components/common/BackButton';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Clock, 
  Camera, 
  MapPin, 
  FileText,
  User,
  X,
  AlertTriangle,
  ArrowRight,
  Eye,
  Sliders,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const WorkVerification = () => {
  const { 
    verifications, 
    acceptWork, 
    rejectWork, 
    reportFalseClosure, 
    falseClosureReports 
  } = usePlan();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending' | 'Upcoming' | 'History'
  const [selectedTaskForReview, setSelectedTaskForReview] = useState(null);
  const [activeActionChoice, setActiveActionChoice] = useState(null); // 'accept' | 'reject' | 'false_closure'
  const [comments, setComments] = useState('');
  const [reporterName, setReporterName] = useState('Authority A');
  const [notification, setNotification] = useState('');

  // Initial candidate pool for verification across the 1-week horizon
  const initialPendingPool = [
    {
      taskId: 'TASK-000109',
      maintType: 'Wayside Hot Axle Detector Sensor Calibration',
      department: 'Mechanical / Rolling Stock',
      assetId: 'AST-120109',
      section: 'SEC-0012 (Kosi Kalan)',
      scheduledBlock: 'BLK-002891',
      completionTime: '04 Sep 2026, 15:50',
      crewLeader: 'Maintenance Crew Unit 1',
      toleranceRecorded: 'Infrared offset: 0.2°C (Limit: ±0.5°C)',
      photoProofUrl: 'Thermal calibrator benchmark scan report (GEO-LOC: 27.91°N, 77.43°E)',
      notes: 'Sensor head cleaned, thermistor resistance normalized, passing test scan completed with freight rake.',
    },
    {
      taskId: 'TASK-000388',
      maintType: 'Point Machine Lubrication & Relay Overhaul',
      department: 'Signal & Telecommunications',
      assetId: 'AST-120388',
      section: 'SEC-0009 (Agra Cantt Yard)',
      scheduledBlock: 'BLK-005912',
      completionTime: '05 Sep 2026, 11:45',
      crewLeader: 'Maintenance Crew Unit 2',
      toleranceRecorded: 'Throw force 450 kg (Standard range: 400–500 kg)',
      photoProofUrl: 'Point detector micro-switch multimeter trace log & video inspection',
      notes: 'Points tested 5 times on mainline reverse and normal. Signal lock circuit verified intact.',
    },
    {
      taskId: 'TASK-000724',
      maintType: 'Overhead Contact Wire Height & Stagger Calibration',
      department: 'Electrical / TRD',
      assetId: 'AST-120724',
      section: 'SEC-0004 (Delhi–Agra)',
      scheduledBlock: 'BLK-004312',
      completionTime: '07 Sep 2026, 04:30',
      crewLeader: 'Maintenance Crew Unit 3',
      toleranceRecorded: 'Wire height 5.58 m (Permissible: 5.50–5.60 m)',
      photoProofUrl: 'Optical pantograph laser gauge calibration dataset & timestamp',
      notes: 'Stagger adjusted across 14 mast spans. Sparking potential eliminated under test pantograph load.',
    },
  ];

  // Critical Rule: Tasks that have been verified, rejected, or reported as false closure immediately leave Pending
  const pendingTasks = initialPendingPool.filter((task) => {
    const v = verifications[task.taskId];
    if (!v) return true;
    return v.status !== 'Verified' && v.status !== 'Rejected' && v.status !== 'False Closure Reported';
  });

  const handleInspect = (task) => {
    setSelectedTaskForReview(task);
    setActiveActionChoice('accept'); // Default to accept for fast flow
    setComments('Certified compliant with standard maintenance guidelines.');
  };

  const handleExecuteDecision = (e) => {
    e.preventDefault();
    if (!selectedTaskForReview || !activeActionChoice) return;

    const tId = selectedTaskForReview.taskId;
    const shortTId = formatTaskId(tId);

    if (activeActionChoice === 'accept') {
      acceptWork(tId, reporterName, comments || 'Certified compliant with standard maintenance specifications.');
      setNotification(`✓ Work order ${shortTId} (${tId}) successfully ACCEPTED and certified.`);
    } else if (activeActionChoice === 'reject') {
      rejectWork(tId, reporterName, comments || 'Tolerance variance exceeded limit; returned for rectification.');
      setNotification(`✕ Work order ${shortTId} (${tId}) REJECTED. Returned to field crew for rework.`);
    } else if (activeActionChoice === 'false_closure') {
      reportFalseClosure(tId, reporterName, comments || 'Field inspection revealed maintenance was falsely marked closed.');
      setNotification(`⚠ FALSE CLOSURE filed for ${shortTId} (${tId}). Safety inquiry initiated.`);
    }

    setSelectedTaskForReview(null);
    setActiveActionChoice(null);
    setComments('');
    setTimeout(() => setNotification(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <CheckSquare size={14} />
          <span>Work Verification</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Work Completion Verification & Authority Sign-Off
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review execution proof, audit sensor tolerances, and record official certification decisions.
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2.5 shadow-lg border border-white/[0.1] animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'Pending', label: `Pending Verification (${pendingTasks.length})` },
            { id: 'Upcoming', label: 'Upcoming Sign-Offs (2)' },
            { id: 'History', label: `Verification History (${Object.keys(verifications).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedTaskForReview(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono font-medium text-slate-400 px-2">
          Authority Sign-Off Mode
        </span>
      </div>

      {/* TAB 1: PENDING VERIFICATION */}
      {activeTab === 'Pending' && (
        <>
          {/* Detail View when [ Inspect ] is clicked */}
          {selectedTaskForReview ? (
            <div className="space-y-6">
              {/* Back Bar */}
              <div className="flex items-center justify-between">
                <BackButton 
                  onClick={() => setSelectedTaskForReview(null)} 
                  label="Back to Pending Verification List"
                />
                <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                  <span>{formatTaskId(selectedTaskForReview.taskId)}</span>
                  <span>•</span>
                  <span>{selectedTaskForReview.taskId}</span>
                </div>
              </div>

              {/* Work Completion Review Card */}
              <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                        {formatTaskId(selectedTaskForReview.taskId)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="font-mono text-xs text-slate-500">
                        {formatAssetId(selectedTaskForReview.assetId)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {selectedTaskForReview.department}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {selectedTaskForReview.maintType}
                    </h3>
                  </div>

                  <GovBadge status="Pending Verification" />
                </div>

                {/* Section 1: Execution & Location */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Section</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                      {selectedTaskForReview.section}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Possession Block</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                      {selectedTaskForReview.scheduledBlock}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Completion Time</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                      {selectedTaskForReview.completionTime}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Supervisor</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                      {selectedTaskForReview.crewLeader}
                    </span>
                  </div>
                </div>

                {/* Section 2: Sensor & Evidence Review */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sensor & Quality Compliance Evidence
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Recorded Tolerance Parameter</span>
                      <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedTaskForReview.toleranceRecorded}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Within standard acceptable mechanical/civil bounds
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Photo & Telemetry Verification</span>
                      <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 break-words">
                        {selectedTaskForReview.photoProofUrl}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Digital hash & GPS timestamp validated
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Field Crew Notes</span>
                    <p className="text-slate-700 dark:text-slate-300 italic">
                      "{selectedTaskForReview.notes}"
                    </p>
                  </div>
                </div>

                {/* Section 3: Grouped Decision Area */}
                <form onSubmit={handleExecuteDecision} className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                      Authority Decision Action
                    </div>
                    
                    {/* 3 Grouped Action Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveActionChoice('accept');
                          setComments('Certified compliant with standard maintenance specifications.');
                        }}
                        className={`p-3 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                          activeActionChoice === 'accept'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:border-emerald-400'
                        }`}
                      >
                        <CheckCircle2 size={18} />
                        <span>✓ Accept Work</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveActionChoice('reject');
                          setComments('Tolerance variance exceeded permissible threshold; work order rejected for rectification.');
                        }}
                        className={`p-3 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                          activeActionChoice === 'reject'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm ring-1 ring-rose-500'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:border-rose-400'
                        }`}
                      >
                        <XCircle size={18} />
                        <span>✕ Reject Work</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveActionChoice('false_closure');
                          setComments('Site discrepancy reported: physical inspection indicates work was marked complete without execution.');
                        }}
                        className={`p-3 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                          activeActionChoice === 'false_closure'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-amber-500'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:border-amber-400'
                        }`}
                      >
                        <ShieldAlert size={18} />
                        <span>⚠ Report False Closure</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments & Inspector Identity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Certifying Officer
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {activeActionChoice === 'accept'
                          ? 'Audit Notes / Compliance Remarks'
                          : activeActionChoice === 'reject'
                          ? 'Rejection Grounds & Defect Notice'
                          : 'False Closure Inquiry Reason'}
                      </label>
                      <input
                        type="text"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTaskForReview(null)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/[0.08] text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className={`px-5 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-all ${
                        activeActionChoice === 'accept'
                          ? 'bg-emerald-600 hover:bg-emerald-500'
                          : activeActionChoice === 'reject'
                          ? 'bg-rose-600 hover:bg-rose-500'
                          : 'bg-amber-600 hover:bg-amber-500'
                      }`}
                    >
                      {activeActionChoice === 'accept'
                        ? 'Confirm Acceptance'
                        : activeActionChoice === 'reject'
                        ? 'Confirm Rejection'
                        : 'Submit False Closure Inquiry'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Pending Tasks List */
            <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Works Awaiting Authority Sign-Off ({pendingTasks.length})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Select Inspect to review tolerances and record certification
                </span>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400">
                  <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500 opacity-80" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    All submitted work orders have been processed and certified!
                  </p>
                  <p className="text-slate-400 mt-1">
                    Check the "Verification History" tab to view official decisions and audit records.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-semibold">
                        <th className="p-3.5">Task ID</th>
                        <th className="p-3.5">Asset ID</th>
                        <th className="p-3.5">Maintenance Work</th>
                        <th className="p-3.5">Section & Possession</th>
                        <th className="p-3.5">Tolerance Recorded</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                      {pendingTasks.map((task) => (
                        <tr
                          key={task.taskId}
                          className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {formatTaskId(task.taskId)}
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5">{task.taskId}</div>
                          </td>
                          <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 font-semibold">
                            {formatAssetId(task.assetId)}
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {task.maintType}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{task.department}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-slate-800 dark:text-slate-200">{task.section}</div>
                            <div className="font-mono text-[11px] text-slate-400">{task.scheduledBlock}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {task.toleranceRecorded.split('(')[0]}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleInspect(task)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition-all dark:bg-white/[0.06] dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white text-xs"
                            >
                              <Eye size={12} />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* TAB 2: UPCOMING SIGN-OFFS */}
      {activeTab === 'Upcoming' && (
        <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Upcoming Possessions for Sign-Off (07 Sep – 09 Sep Horizon)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              These possessions are scheduled or in progress and will appear in the verification queue upon crew clearance submission.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">T1</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rail Grinding & OHE Adjust (SEC-0004)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Scheduled: 08 Sep 18:00–21:20 (BLK-012046+47) • Crew: TEAM-018
                </div>
              </div>
              <GovBadge status="Scheduled" />
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">T4</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Track Inspection & Ultrasonic Testing (SEC-0004)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Scheduled: 07 Sep 00:00–03:20 (BLK-009637+38) • Joint Possession
                </div>
              </div>
              <GovBadge status="Scheduled" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION HISTORY */}
      {activeTab === 'History' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#14171d] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Permanent Verification & Safety Audit Trail
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {Object.keys(verifications).length} Decision Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="p-3.5">Work Order ID</th>
                    <th className="p-3.5">Certification Status</th>
                    <th className="p-3.5">Inspecting Official</th>
                    <th className="p-3.5">Decision Remarks</th>
                    <th className="p-3.5 font-mono text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                  {Object.entries(verifications).map(([taskId, ver]) => (
                    <tr key={taskId} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {formatTaskId(taskId)}
                        <span className="text-slate-400 font-normal text-[10px] ml-1.5">({taskId})</span>
                      </td>
                      <td className="p-3.5">
                        <GovBadge status={ver.status} />
                      </td>
                      <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                        {ver.inspector}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-sm">
                        {ver.comments}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400 text-right">
                        {ver.reportedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dedicated False Closure Inquiries Table */}
          {falseClosureReports.length > 0 && (
            <div className="bg-white dark:bg-[#14171d] rounded-xl border border-amber-300 dark:border-amber-900/60 shadow-sm overflow-hidden">
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert size={14} className="text-amber-600" />
                  <span>Official False Closure Inquiries Log</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-300">
                  {falseClosureReports.length} Inquiry Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-semibold">
                      <th className="p-3.5">Report ID</th>
                      <th className="p-3.5">Task ID</th>
                      <th className="p-3.5">Section</th>
                      <th className="p-3.5">Reported By</th>
                      <th className="p-3.5">Alleged Discrepancy</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                    {falseClosureReports.map((fcr) => (
                      <tr key={fcr.reportId} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono font-bold text-amber-900 dark:text-amber-300">
                          {fcr.reportId}
                        </td>
                        <td className="p-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {formatTaskId(fcr.taskId)}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">{fcr.section}</td>
                        <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">{fcr.reportedBy}</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-xs">{fcr.discrepancy}</td>
                        <td className="p-3.5">
                          <GovBadge status="False Closure Reported" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
