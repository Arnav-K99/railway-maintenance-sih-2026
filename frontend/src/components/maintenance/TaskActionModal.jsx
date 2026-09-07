import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const TaskActionModal = ({ isOpen, onClose, task, actionType, onSubmit }) => {
  const [reason, setReason] = useState('Team unavailable');
  const [customComments, setCustomComments] = useState('');
  const [proposedDate, setProposedDate] = useState('2026-09-09');

  if (!task) return null;

  const isRejectOrChange = actionType === 'reject' || actionType === 'reschedule';

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = reason === 'Other' ? customComments : `${reason}${customComments ? ` - ${customComments}` : ''}`;
    onSubmit(task.task_id, actionType, finalReason, proposedDate);
    onClose();
  };

  const getTitle = () => {
    if (actionType === 'accept') return 'Accept Maintenance Task';
    if (actionType === 'reject') return 'Reject Maintenance Task';
    if (actionType === 'reschedule') return 'Request Schedule Change';
    if (actionType === 'in_progress') return 'Mark Work in Progress';
    if (actionType === 'completed') return 'Mark Work Completed';
    return 'Task Action';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      subtitle={`Task ID: ${task.task_id} • Department: ${task.department}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Task Summary Card */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">{task.maintenance_type}</span>
            <Badge variant={task.risk_level || 'MODERATE'} size="sm">
              Risk: {task.risk_score}%
            </Badge>
          </div>
          <div className="text-slate-500 flex justify-between">
            <span>Asset: {task.asset_id} ({task.section_id})</span>
            <span>Duration: {task.required_duration_minutes}m</span>
          </div>
        </div>

        {/* Reason Selector (Mandatory for Reject or Reschedule) */}
        {isRejectOrChange && (
          <div className="space-y-3 bg-amber-50/60 p-3.5 rounded-lg border border-amber-200">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Mandatory Justification Required</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Reason for {actionType === 'reject' ? 'Rejection' : 'Schedule Change'}:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="Team unavailable">Team unavailable (crew shortage / illness)</option>
                <option value="Equipment unavailable">Equipment unavailable (tamping machine / OHE tower wagon in maintenance)</option>
                <option value="Safety issue">Safety issue (severe weather / hazardous site condition)</option>
                <option value="Duration changed">Duration changed (requires longer possession)</option>
                <option value="Emergency maintenance">Emergency maintenance conflict elsewhere</option>
                <option value="Other">Other reason (specify below)</option>
              </select>
            </div>

            {actionType === 'reschedule' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Proposed Rescheduled Date:
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Additional Notes / Engineering Remarks:
              </label>
              <textarea
                rows={2}
                value={customComments}
                onChange={(e) => setCustomComments(e.target.value)}
                placeholder="Provide specific details for Operations Control review..."
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Action Confirmation for Accept / In Progress / Completed */}
        {!isRejectOrChange && (
          <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200 text-blue-900 leading-relaxed">
            {actionType === 'accept' && (
              <p>You are confirming acceptance of this scheduled block possession for your department. Crew readiness will be marked confirmed in the Control Center.</p>
            )}
            {actionType === 'in_progress' && (
              <p>Confirming that track possession is active and field maintenance team has commenced on-site work.</p>
            )}
            {actionType === 'completed' && (
              <p>Confirming that all track work is completed, site is cleared, and track is ready for general user inspection and train speed restoration.</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-1.5 rounded-lg text-white font-bold transition-all shadow-xs ${
              actionType === 'reject'
                ? 'bg-red-600 hover:bg-red-700'
                : actionType === 'reschedule'
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm {getTitle()}
          </button>
        </div>
      </form>
    </Modal>
  );
};
