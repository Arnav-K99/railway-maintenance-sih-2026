import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
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
  AlertTriangle
} from 'lucide-react';

export const WorkVerification = () => {
  const { 
    tasksInventory, 
    verifications, 
    acceptWork, 
    rejectWork, 
    reportFalseClosure, 
    falseClosureReports 
  } = usePlan();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending' | 'Upcoming' | 'History'
  const [selectedTask, setSelectedTask] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' | 'reject' | 'false_closure'
  const [comments, setComments] = useState('');
  const [reporterName, setReporterName] = useState('S. K. Sharma (Chief Controller)');
  const [notification, setNotification] = useState('');

  // Sample verified / pending verification pool
  const pendingTasks = [
    {
      taskId: 'TASK-000421',
      maintType: 'Track Alignment & Ballast Consolidation',
      department: 'Track / Civil Engineering',
      assetId: 'AST-120421',
      section: 'SEC-0002 (Palwal–Mathura)',
      scheduledBlock: 'BLK-007120',
      completionTime: '05 Sep 2026, 03:45 AM',
      crewLeader: 'J. P. Meena (Permanent Way Supervisor)',
      toleranceRecorded: '±0.8 mm (Tolerance Limit ±2.0 mm)',
      photoProofUrl: 'Geo-stamped USFD wave pattern & digital gauge snapshot',
      notes: 'Executed 2.4 km ballast tamping and curve realignments. Track clear of all men and machinery at 03:45.',
    },
    {
      taskId: 'TASK-000109',
      maintType: 'Wayside Hot Axle Detector Sensor Calibration',
      department: 'Mechanical / Rolling Stock',
      assetId: 'AST-120109',
      section: 'SEC-0012 (Kosi Kalan)',
      scheduledBlock: 'BLK-002891',
      completionTime: '02 Sep 2026, 03:50 PM',
      crewLeader: 'Sunil Nair (C&W Engineer)',
      toleranceRecorded: 'Infrared tolerance 0.2°C calibration offset',
      photoProofUrl: 'Thermal calibrator benchmark scan report',
      notes: 'Sensor head cleaned, thermistor resistance normalized, passing test scan completed with freight rake.',
    },
    {
      taskId: 'TASK-000388',
      maintType: 'Point Machine Lubrication & Relay Overhaul',
      department: 'Signal & Telecommunications',
      section: 'SEC-0009 (Agra Cantt Yard)',
      scheduledBlock: 'BLK-005912',
      completionTime: '06 Sep 2026, 11:45 AM',
      crewLeader: 'A. K. Bansal (Signal Inspector)',
      toleranceRecorded: 'Throw force 450 kg within standard 400-500 kg',
      photoProofUrl: 'Point detector micro-switch multimeter log',
      notes: 'Points tested 5 times on mainline reverse and normal. Signal lock circuit verified intact.',
    },
  ];

  const handleOpenActionModal = (task, type) => {
    setSelectedTask(task);
    setActionType(type);
    setComments('');
  };

  const handleConfirmAction = (e) => {
    e.preventDefault();
    if (!selectedTask || !actionType) return;

    if (actionType === 'accept') {
      acceptWork(selectedTask.taskId, reporterName, comments);
      setNotification(`✓ Work order ${selectedTask.taskId} successfully ACCEPTED and permanently certified.`);
    } else if (actionType === 'reject') {
      rejectWork(selectedTask.taskId, reporterName, comments);
      setNotification(`✕ Work order ${selectedTask.taskId} REJECTED. Returned for engineering rework.`);
    } else if (actionType === 'false_closure') {
      reportFalseClosure(selectedTask.taskId, reporterName, comments);
      setNotification(`⚠ FALSE CLOSURE reported for ${selectedTask.taskId}. Chief Safety Commissioner notified.`);
    }

    setSelectedTask(null);
    setActionType(null);
    setTimeout(() => setNotification(''), 4500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <CheckSquare size={14} />
          <span>{t('workVerification', 'Work Verification')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t('workVerificationTitle', 'Work Completion Verification & Authority Sign-Off')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {t('workVerificationSubtitle', 'Official sign-off interface with photographic proof, sensor tolerances and false-closure inquiry reporting.')}
        </p>
      </div>

      {notification && (
        <div className="p-3.5 rounded bg-govnavy-900 text-white text-xs font-bold flex items-center gap-2 shadow-md">
          <CheckCircle2 size={16} className="text-saffron-light" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs (Section 23: Pending Verification, Upcoming, History) */}
      <div className="gov-panel p-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'Pending', label: 'Pending Verification' },
            { id: 'Upcoming', label: 'Upcoming Sign-Offs' },
            { id: 'History', label: 'Verification History' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">
          Role: Authority Certification Officer
        </span>
      </div>

      {/* Tab 1: Pending Verification List */}
      {activeTab === 'Pending' && (
        <div className="gov-panel overflow-hidden">
          <div className="gov-panel-header">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Works Awaiting Authority Sign-Off
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Inspect proofs & choose official action
            </span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {pendingTasks.map((task) => {
              const currentV = verifications[task.taskId];
              const isHandled = currentV && currentV.status !== 'Scheduled';

              return (
                <div key={task.taskId} className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-govnavy-700 dark:text-govnavy-300">
                          {task.taskId}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                          {task.assetId}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {task.department}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {task.maintType}
                      </h3>
                    </div>

                    <GovBadge status={isHandled ? currentV.status : 'Pending Verification'} />
                  </div>

                  {/* Detail Snapshot */}
                  <div className="grid sm:grid-cols-3 gap-2.5 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Section & Block</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{task.section}</span>
                      <span className="font-mono text-[10px] text-slate-500 block">{task.scheduledBlock}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Completion Time</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{task.completionTime}</span>
                      <span className="text-[10px] text-slate-500 block">Supervisor: {task.crewLeader}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Recorded Tolerance</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{task.toleranceRecorded}</span>
                      <span className="text-[10px] text-slate-500 block">{task.photoProofUrl}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    "{task.notes}"
                  </p>

                  {/* Action Buttons (Section 23: [✓ ACCEPT] [✕ REJECT] [⚠ REPORT FALSE CLOSURE]) */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(task, 'accept')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      <CheckCircle2 size={13} />
                      <span>{t('accept', '✓ ACCEPT')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(task, 'reject')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      <XCircle size={13} />
                      <span>{t('reject', '✕ REJECT')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(task, 'false_closure')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      <ShieldAlert size={13} />
                      <span>{t('reportFalseClosure', '⚠ REPORT FALSE CLOSURE')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Upcoming Sign-Offs */}
      {activeTab === 'Upcoming' && (
        <div className="gov-panel p-4 space-y-3">
          <div className="gov-panel-header -mx-4 -mt-4 mb-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Upcoming Possessions for Sign-Off
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              07 Sep – 09 Sep Horizon
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            These maintenance possessions are currently scheduled or in progress and will appear in the verification queue upon crew clearance submission:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300">TASK-000005</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-slate-900 dark:text-white">Rail Grinding & OHE Adjust (SEC-0004)</span>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Scheduled: 08 Sep 18:00–21:20 (BLK-012046+47) • Crew: TEAM-018
                </div>
              </div>
              <GovBadge status="Scheduled" />
            </div>

            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300">TASK-000004</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-slate-900 dark:text-white">Track Inspection & Renewal (SEC-0004)</span>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Scheduled: 07 Sep 00:00–03:20 (BLK-009637+38) • Joint Possession
                </div>
              </div>
              <GovBadge status="Scheduled" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: History & False Closure Reports */}
      {activeTab === 'History' && (
        <div className="space-y-4">
          <div className="gov-panel overflow-hidden">
            <div className="gov-panel-header">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Certified Verification Decisions & Discrepancies
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Permanent railway safety audit trail
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="gov-table gov-table-zebra">
                <thead>
                  <tr>
                    <th>Work Order ID</th>
                    <th>Certification Status</th>
                    <th>Inspecting Official</th>
                    <th>Inspection Comments / Reason</th>
                    <th>Recorded Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(verifications).map(([taskId, ver]) => (
                    <tr key={taskId}>
                      <td className="font-mono font-bold text-govnavy-700 dark:text-govnavy-300">
                        {taskId}
                      </td>
                      <td>
                        <GovBadge status={ver.status} />
                      </td>
                      <td className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                        {ver.inspector}
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                        {ver.comments}
                      </td>
                      <td className="font-mono text-[11px] text-slate-500">
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
            <div className="gov-panel overflow-hidden border-amber-300 dark:border-amber-900/60">
              <div className="gov-panel-header bg-amber-50/60 dark:bg-amber-950/30">
                <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
                  <ShieldAlert size={14} className="text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Official False Closure Inquiries Filed
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300">
                  {falseClosureReports.length} Under Inquiry
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Task ID</th>
                      <th>Section</th>
                      <th>Reported By</th>
                      <th>Alleged Discrepancy</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {falseClosureReports.map((fcr) => (
                      <tr key={fcr.reportId}>
                        <td className="font-mono font-bold text-amber-900 dark:text-amber-200">
                          {fcr.reportId}
                        </td>
                        <td className="font-mono text-slate-800 dark:text-slate-200">{fcr.taskId}</td>
                        <td className="text-xs">{fcr.section}</td>
                        <td className="text-xs font-semibold">{fcr.reportedBy}</td>
                        <td className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">{fcr.discrepancy}</td>
                        <td>
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

      {/* Official Verification Confirmation Modal */}
      {selectedTask && actionType && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleConfirmAction} className="gov-panel max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {selectedTask.taskId} • {selectedTask.assetId}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {actionType === 'accept'
                    ? 'Accept & Certify Work Order'
                    : actionType === 'reject'
                    ? 'Reject Work Order & Order Rectification'
                    : 'File Official False Closure Report'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTask(null);
                  setActionType(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('reportingParty', 'Reporting Officer / Authority Official')}
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  required
                  className="w-full font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {actionType === 'accept'
                    ? t('inspectionComments', 'Inspection Comments & Compliance Reference')
                    : actionType === 'reject'
                    ? 'Reason for Rejection & Tolerance Variance'
                    : t('discrepancyDetails', 'Describe Discrepancy or Missing Work')}
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    actionType === 'accept'
                      ? 'Certified compliant with Section 4 of Indian Railways Track Manual.'
                      : actionType === 'reject'
                      ? 'Tolerance variance exceeded maximum allowable limit.'
                      : 'Physical site inspection confirmed work was marked completed without execution.'
                  }
                  required
                  className="w-full text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedTask(null);
                  setActionType(null);
                }}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t('cancel', 'Cancel')}
              </button>

              <button
                type="submit"
                className={`px-4 py-1.5 rounded text-xs font-bold text-white shadow-2xs uppercase tracking-wider ${
                  actionType === 'accept'
                    ? 'bg-emerald-700 hover:bg-emerald-600'
                    : actionType === 'reject'
                    ? 'bg-rose-700 hover:bg-rose-600'
                    : 'bg-amber-700 hover:bg-amber-600'
                }`}
              >
                {actionType === 'accept' ? 'Confirm Acceptance' : actionType === 'reject' ? 'Confirm Rejection' : 'Submit False Closure Report'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
