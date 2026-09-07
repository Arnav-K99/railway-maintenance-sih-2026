import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

export const ScreenVerification = ({ onNavigate }) => {
  const [decision, setDecision] = useState(null); // 'approved', 'rejected', 'false_closure'
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleApprove = () => {
    setDecision('approved');
    setSubmitted(true);
  };

  const handleReject = () => {
    setDecision('rejected');
    setSubmitted(true);
  };

  const handleFalseClosure = () => {
    setDecision('false_closure');
  };

  const handleSubmitFalseClosure = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Obvious Back Button */}
      <div>
        <button
          onClick={() => onNavigate('portal')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Portal Selection</span>
        </button>
      </div>

      {/* Screen Header */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          VERIFY COMPLETED WORK
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          General user sign-off & physical asset execution verification
        </p>
      </div>

      {/* One Clean Monochrome Glass Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-6">
        {/* Work Item Details */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-black/[0.04] dark:border-white/[0.06] pb-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Rail Grinding
              </h2>
              <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                SEC-0004
              </div>
            </div>
            <span className="font-mono text-xs text-neutral-500">
              TASK-000005
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Completed</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-1">
                08 Sep 2026
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Department</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-1">
                Electrical / TRD
              </div>
            </div>
          </div>
        </div>

        {/* Verification Interaction */}
        {!submitted && decision !== 'false_closure' && (
          <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] space-y-3">
            <p className="text-xs font-semibold text-neutral-900 dark:text-white">
              Was this maintenance actually completed?
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                onClick={handleApprove}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs"
              >
                <span>Approve Work</span>
              </button>

              <button
                onClick={handleReject}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-black/[0.12] dark:border-white/[0.14] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white font-medium px-4 py-2.5 rounded-xl text-xs transition-all"
              >
                <span>Reject Work</span>
              </button>

              <button
                onClick={handleFalseClosure}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-black/[0.12] dark:border-white/[0.14] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white font-medium px-4 py-2.5 rounded-xl text-xs transition-all"
              >
                <span>Report False Closure</span>
              </button>
            </div>
          </div>
        )}

        {/* False Closure Form */}
        {!submitted && decision === 'false_closure' && (
          <form onSubmit={handleSubmitFalseClosure} className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] space-y-3 text-xs">
            <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Report False Closure</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400">
              Please provide the reason why this work order is believed to have been falsely closed.
            </p>
            <div>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Details for audit review..."
                className="w-full glass-input rounded-xl p-3 text-xs"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold px-4 py-2 rounded-xl text-xs"
              >
                <Send className="w-3 h-3" />
                <span>Submit Report</span>
              </button>
              <button
                type="button"
                onClick={() => setDecision(null)}
                className="text-neutral-500 hover:text-black dark:hover:text-white text-xs underline px-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Submitted Confirmation States */}
        {submitted && (
          <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] space-y-3 text-xs">
            {decision === 'approved' && (
              <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Work Approved & Verified</span>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  Verification logged to Northern Railway asset audit register.
                </div>
              </div>
            )}

            {decision === 'rejected' && (
              <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>Work Rejected</span>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  Notification transmitted to Electrical / TRD engineering supervisor for physical re-inspection.
                </div>
              </div>
            )}

            {decision === 'false_closure' && (
              <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>False Closure Report Filed</span>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  Audit report logged for internal investigation.
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setDecision(null);
                  setReason('');
                  setSubmitted(false);
                }}
                className="text-neutral-400 hover:text-black dark:hover:text-white underline text-xs"
              >
                Change verification response
              </button>

              <button
                onClick={() => onNavigate('portal')}
                className="inline-flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-xs"
              >
                <span>Return to Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
