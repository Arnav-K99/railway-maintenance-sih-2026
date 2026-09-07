import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react';
import { ALL_TASKS } from '../../data/prototypeData';

export const ScreenTaskDetails = ({ onNavigate, taskId, onSaveRequirements }) => {
  const currentTask = ALL_TASKS.find((t) => t.id === taskId) || ALL_TASKS[0];

  const [isEditing, setIsEditing] = useState(false);
  const [duration, setDuration] = useState(currentTask.duration);
  const [personnel, setPersonnel] = useState(currentTask.personnel);
  const [canCollaborate, setCanCollaborate] = useState(currentTask.canCollaborate ? 'Yes' : 'No');
  const [compatibleDept, setCompatibleDept] = useState(currentTask.compatibleDept || 'Track / Civil');
  const [canBundle, setCanBundle] = useState(currentTask.canBundle ? 'Yes' : 'No');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveRequirements) {
      onSaveRequirements({
        duration: Number(duration),
        personnel: Number(personnel),
        canCollaborate: canCollaborate === 'Yes',
        compatibleDept,
        canBundle: canBundle === 'Yes',
      });
    }
    setIsEditing(false);
    setSaveSuccessMsg('Maintenance requirements updated. Transmitted to block planning engine.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Obvious Back Button */}
      <div>
        <button
          onClick={() => onNavigate('tasks_list')}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Maintenance Tasks</span>
        </button>
      </div>

      {/* Screen Header: Task Title & Ownership */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tracking-tight">
              {currentTask.id}
            </h1>
            <span className="inline-flex items-center text-xs font-medium text-neutral-600 dark:text-neutral-400 space-x-1.5 font-mono">
              <span>AST: {currentTask.assetId}</span>
            </span>
          </div>
          <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
            {currentTask.name}
          </p>
        </div>

        <div className="text-xs text-neutral-400 dark:text-neutral-500">
          Work Order Specification • Maintenance Engineering Authority
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.04] text-xs font-medium text-neutral-900 dark:text-white flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Vertical Sections Layout */}
      <div className="space-y-5">
        {/* Section 1: MAINTENANCE INFORMATION */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-black/[0.04] dark:border-white/[0.06] pb-2.5">
            Maintenance Information
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Department</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {currentTask.department}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Asset</div>
              <div className="font-mono font-semibold text-neutral-900 dark:text-white mt-0.5">
                {currentTask.assetId}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Maintenance Type</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {currentTask.name}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Corridor</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {currentTask.corridor}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Section</div>
              <div className="font-mono font-semibold text-neutral-900 dark:text-white mt-0.5">
                {currentTask.section}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Maintenance Deadline</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {currentTask.deadline}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: WORK REQUIREMENTS (Maintenance-Owned & Editable) */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.06] pb-2.5">
            <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Work Requirements
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white underline"
              >
                Edit Requirements
              </button>
            ) : (
              <span className="text-[10px] text-neutral-400 uppercase font-mono">Editing Mode</span>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Estimated Duration</div>
                <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white mt-0.5">
                  {duration} minutes
                </div>
              </div>

              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Required Personnel</div>
                <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white mt-0.5">
                  {personnel} people
                </div>
              </div>

              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Required Team</div>
                <div className="font-semibold text-neutral-900 dark:text-white mt-0.5 font-mono">
                  {currentTask.teamType}
                </div>
              </div>

              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Preferred Window</div>
                <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {currentTask.preferredWindow}
                </div>
              </div>

              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Deadline</div>
                <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {currentTask.deadline}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 pt-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="480"
                    step="10"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Required Personnel (crew size)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={personnel}
                    onChange={(e) => setPersonnel(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Can work with another department?
                  </label>
                  <select
                    value={canCollaborate}
                    onChange={(e) => setCanCollaborate(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Compatible Department
                  </label>
                  <select
                    disabled={canCollaborate === 'No'}
                    value={compatibleDept}
                    onChange={(e) => setCompatibleDept(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-50"
                  >
                    <option value="Track / Civil">Track / Civil</option>
                    <option value="Electrical / TRD">Electrical / TRD</option>
                    <option value="Signal & Telecommunications">Signal & Telecommunications</option>
                    <option value="Mechanical / Rolling Stock">Mechanical / Rolling Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Can be bundled into shared possession?
                  </label>
                  <select
                    disabled={canCollaborate === 'No'}
                    value={canBundle}
                    onChange={(e) => setCanBundle(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold disabled:opacity-50"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Requirements</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section 3: COLLABORATION */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-black/[0.04] dark:border-white/[0.06] pb-2.5">
            Collaboration
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Can work with another department?</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {canCollaborate}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Compatible Department</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {canCollaborate === 'Yes' ? compatibleDept : 'None'}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Minimum Overlap</div>
              <div className="font-mono text-neutral-900 dark:text-white mt-0.5">
                {canCollaborate === 'Yes' ? `${currentTask.minOverlap} minutes` : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Can be bundled?</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {canBundle}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: RESOURCE REQUIREMENTS */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-b border-black/[0.04] dark:border-white/[0.06] pb-2.5">
            Resource Requirements
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Equipment</div>
              <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                {currentTask.equipment}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Special Requirements</div>
              <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                Adjacent line clearance required during rail grinding pass.
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: ASSET CONDITION (Neev supporting asset intelligence) */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.06] pb-2.5">
            <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Asset Condition (Supporting Intelligence)
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Diagnostic Source: Neev Predictive Model
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Neev Failure Risk</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
                {currentTask.riskScore}%
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Risk Level</div>
              <div className="mt-1 flex items-center space-x-1.5 font-bold text-neutral-900 dark:text-white text-sm">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>{currentTask.riskLevel}</span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                High probability of failure within next 30 days
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">30-Day Degradation Forecast</div>
              <div className="text-2xl font-mono font-bold text-neutral-900 dark:text-white mt-1">
                {currentTask.degradationForecast}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Wear metric threshold indicator
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 border-t border-black/[0.04] dark:border-white/[0.06] pt-3 leading-relaxed">
            Asset condition intelligence indicates urgent intervention required before 08 Sep 2026. Maintenance owns the work order requirement.
          </p>
        </div>
      </div>

      {/* Primary Action Button: Proceed to Block Planning */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-neutral-900 dark:text-white">
            Requirements Finalized
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Arnav scheduling engine will identify the best feasible block window matching these exact specifications.
          </p>
        </div>

        <button
          onClick={() => onNavigate('arnav_plan')}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-xs"
        >
          <span>Proceed to Block Planning →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
