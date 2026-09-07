import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Send, Layers } from 'lucide-react';

export const ScreenMaintenancePortal = ({ onNavigate, onSelectTask }) => {
  const [activeDept, setActiveDept] = useState('electrical'); // 'civil', 'electrical', 'snt', 'mechanical'
  const [taskStatus, setTaskStatus] = useState('updated'); // 'updated', 'accepted', 'completed'
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeRequestSubmitted, setChangeRequestSubmitted] = useState(false);
  const [changeReason, setChangeReason] = useState('Team unavailable');
  const [newDuration, setNewDuration] = useState('240');
  const [newPersonnel, setNewPersonnel] = useState('6');
  const [preferredTiming, setPreferredTiming] = useState('09 Sep Night');
  const [changeNotes, setChangeNotes] = useState('');

  const departments = [
    { key: 'electrical', label: 'Electrical / TRD' },
    { key: 'civil', label: 'Track / Civil' },
    { key: 'snt', label: 'Signal & Telecom' },
    { key: 'mechanical', label: 'Rolling Stock' },
  ];

  const handleSubmitChange = (e) => {
    e.preventDefault();
    setShowChangeModal(false);
    setChangeRequestSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Obvious Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('portal')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Portal Selection</span>
        </button>

        <button
          onClick={() => onNavigate('replanning_requests')}
          className="text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white underline"
        >
          View Replanning Requests
        </button>
      </div>

      {/* Screen Header */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Maintenance Execution Portal
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Department work orders, team dispatch clearances & execution confirmation
          </p>
        </div>
      </div>

      {/* Department Switcher Tabs */}
      <div className="flex flex-wrap gap-1 bg-black/[0.04] dark:bg-white/[0.05] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.08]">
        {departments.map((dept) => (
          <button
            key={dept.key}
            onClick={() => setActiveDept(dept.key)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeDept === dept.key
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* Change Request Notification */}
      {changeRequestSubmitted && (
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-200">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <div>
              <span className="font-semibold">CHANGE REQUEST SUBMITTED (Status: Pending Review)</span>
              <span className="text-neutral-500 dark:text-neutral-400 block mt-0.5">
                Reason: {changeReason} • New Duration: {newDuration} min • Logged to Operations Control.
              </span>
            </div>
          </div>
          <button
            onClick={() => setChangeRequestSubmitted(false)}
            className="text-neutral-400 hover:text-black dark:hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Task Display: TASK-000005 (Appears in BOTH Electrical & Civil due to collaboration!) */}
      {(activeDept === 'electrical' || activeDept === 'civil') ? (
        <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-black/[0.04] dark:border-white/[0.06] pb-3">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-lg font-bold text-neutral-900 dark:text-white">
                  TASK-000005
                </span>
                <span className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-900 dark:text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>Critical Risk</span>
                </span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Rail Grinding • SEC-0004
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                {taskStatus === 'completed'
                  ? 'Work Completed'
                  : taskStatus === 'accepted'
                  ? 'Team Dispatched'
                  : 'Status: Updated'}
              </span>
            </div>
          </div>

          {/* Collaborative Department Indicator */}
          <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              <div>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {activeDept === 'electrical' ? 'Working with: Track / Civil' : 'Working with: Electrical / TRD'}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">
                  Shared possession window coordinated on track section SEC-0004
                </span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-neutral-400">
              BLK-012046/47
            </span>
          </div>

          {/* Updated Schedule Details (Post-Replan) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-xs">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                Updated Schedule
              </div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-1 text-sm">
                08 Sep 2026
              </div>
              <div className="font-mono text-neutral-600 dark:text-neutral-300 mt-0.5">
                18:00 – 21:20 (200 min)
              </div>
            </div>

            <div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                Assigned Team
              </div>
              <div className="font-mono font-semibold text-neutral-900 dark:text-white mt-1 text-sm">
                TEAM-018
              </div>
              <div className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                5 qualified technicians (Evening Shift)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {taskStatus === 'updated' && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setTaskStatus('accepted')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-black/[0.12] dark:border-white/[0.14] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white font-medium px-4 py-2.5 rounded-xl text-xs transition-all"
                >
                  <span>Request Change</span>
                </button>
                <button
                  onClick={() => onSelectTask('TASK-000005')}
                  className="text-xs text-neutral-500 hover:text-black dark:hover:text-white underline px-2 py-1"
                >
                  Inspect Work Order
                </button>
              </div>
            )}

            {taskStatus === 'accepted' && (
              <div className="space-y-3">
                <div className="text-xs text-neutral-600 dark:text-neutral-300 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Task accepted by team supervisor. Work in progress on track section SEC-0004.</span>
                </div>
                <button
                  onClick={() => setTaskStatus('completed')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  <span>Mark Work Completed</span>
                </button>
              </div>
            )}

            {taskStatus === 'completed' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-xs">
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    Maintenance Work Completed on 08 Sep 2026 (21:20)
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Rail grinding executed. Track section reopened for live train operations.
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('verification')}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  <span>Go to Verification →</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Other Department Portal View */
        <div className="glass-panel rounded-2xl p-8 text-center space-y-2">
          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
            {activeDept === 'snt' ? 'Signal & Telecommunications' : 'Mechanical / Rolling Stock'}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            All department work orders operating within scheduled limits. Task TASK-000005 is managed by Electrical / TRD in collaboration with Track / Civil.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveDept('electrical')}
              className="text-xs text-neutral-500 hover:text-black dark:hover:text-white underline font-medium"
            >
              Switch to Electrical / TRD to view active demonstration task
            </button>
          </div>
        </div>
      )}

      {/* REQUEST CHANGE MODAL */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 bg-white dark:bg-[#101014]">
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                REQUEST CHANGE
              </div>
              <button
                onClick={() => setShowChangeModal(false)}
                className="text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitChange} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Reason
                </label>
                <select
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs font-medium"
                >
                  <option value="Team unavailable">Team unavailable</option>
                  <option value="Equipment unavailable">Equipment unavailable</option>
                  <option value="Duration changed">Duration changed</option>
                  <option value="Personnel shortage">Personnel shortage</option>
                  <option value="Safety issue">Safety issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    New Duration (min)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full glass-input rounded-xl p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    New Personnel Requirement
                  </label>
                  <input
                    type="number"
                    value={newPersonnel}
                    onChange={(e) => setNewPersonnel(e.target.value)}
                    className="w-full glass-input rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Preferred Date / Time
                </label>
                <input
                  type="text"
                  value={preferredTiming}
                  onChange={(e) => setPreferredTiming(e.target.value)}
                  className="w-full glass-input rounded-xl p-2"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full glass-input rounded-xl p-2"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="px-3 py-1.5 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
