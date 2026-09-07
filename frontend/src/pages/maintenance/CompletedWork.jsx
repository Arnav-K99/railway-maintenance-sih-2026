import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CheckCircle2, Clock, Calendar, FileText, ShieldCheck } from 'lucide-react';

export const CompletedWork = () => {
  const completedJobs = [
    {
      taskId: 'TASK-000421',
      maintenanceType: 'Track Alignment & Turnout Tamping',
      department: 'Track / Civil Engineering',
      sectionId: 'SEC-0092',
      completedDate: '2026-09-04',
      completedWindow: '00:00 – 02:05 (125m)',
      team: 'TEAM-007',
      supervisor: 'A. K. Mishra (SSE/P-Way)',
      verificationStatus: 'Verified by General Auditor',
      qualityScore: '98.5%',
    },
    {
      taskId: 'TASK-000015',
      maintenanceType: 'Transformer Substation Bushing Replacement',
      department: 'Electrical / TRD',
      sectionId: 'SEC-0072',
      completedDate: '2026-09-03',
      completedWindow: '19:28 – 22:00 (152m)',
      team: 'TEAM-015',
      supervisor: 'V. Raman (SSE/TRD)',
      verificationStatus: 'Verified by Section Controller',
      qualityScore: '99.0%',
    },
    {
      taskId: 'TASK-000108',
      maintenanceType: 'Electronic Interlocking Panel Overhaul',
      department: 'Signal & Telecommunications',
      sectionId: 'SEC-0002',
      completedDate: '2026-09-02',
      completedWindow: '01:00 – 03:30 (150m)',
      team: 'TEAM-022',
      supervisor: 'P. Nair (SSE/Signal)',
      verificationStatus: 'Audited & Signed',
      qualityScore: '100.0%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>Execution Log & Field Sign-Offs</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
          Completed Maintenance Work Orders
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          History of certified track and OHE possessions executed within allocated block windows.
        </p>
      </div>

      <div className="space-y-4">
        {completedJobs.map((job) => (
          <div
            key={job.taskId}
            className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 text-sm">{job.taskId}</span>
                <span className="text-xs font-bold text-slate-800">{job.maintenanceType}</span>
              </div>
              <Badge variant="success" size="md">
                {job.verificationStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Section / Dept</span>
                <span className="font-bold text-slate-900">{job.sectionId} • {job.department.split('/')[0]}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Date & Window</span>
                <span className="font-bold text-slate-900">{job.completedDate} • {job.completedWindow}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Crew Executed</span>
                <span className="font-bold text-slate-900">{job.team}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Quality Index</span>
                <span className="font-bold text-emerald-700">{job.qualityScore}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Supervising Engineer: <strong>{job.supervisor}</strong></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 font-sans">
                <ShieldCheck size={13} />
                Site Cleared & Train Operations Restored
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
