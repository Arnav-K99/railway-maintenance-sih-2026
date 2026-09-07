import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ALL_TASKS } from '../../data/prototypeData';

export const ScreenTasksList = ({ onNavigate, onSelectTask }) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  const filteredTasks = selectedDeptFilter === 'ALL'
    ? ALL_TASKS
    : ALL_TASKS.filter((t) => t.departmentKey === selectedDeptFilter);

  const filterOptions = [
    { key: 'ALL', label: 'All Departments' },
    { key: 'civil', label: 'Track / Civil' },
    { key: 'electrical', label: 'Electrical / TRD' },
    { key: 'snt', label: 'Signal & Telecom' },
    { key: 'mechanical', label: 'Rolling Stock' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Maintenance Tasks
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Work requirements submitted by engineering departments awaiting block assignment
          </p>
        </div>

        {/* Department Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-black/[0.04] dark:bg-white/[0.05] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.08]">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelectedDeptFilter(opt.key)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                selectedDeptFilter === opt.key
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Tasks Glass List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] flex justify-between items-center text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          <span>Active Inventory ({filteredTasks.length} tasks)</span>
          <span>Click inspect to review work order</span>
        </div>

        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
          {filteredTasks.map((task) => {
            const isHero = task.isHero;
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  isHero
                    ? 'bg-black/[0.015] dark:bg-white/[0.025] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                    : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'
                }`}
              >
                {/* Left: Task ID & Name & Dept */}
                <div className="space-y-1 sm:max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white">
                      {task.id}
                    </span>
                    {isHero && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-black/[0.06] dark:bg-white/[0.1] text-neutral-800 dark:text-neutral-200">
                        Primary Demo Case
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {task.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center space-x-2">
                    <span>{task.department}</span>
                    <span>•</span>
                    <span className="font-mono">{task.section}</span>
                  </div>
                </div>

                {/* Middle: Urgency, Duration, Collaboration */}
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-medium">Asset Risk</div>
                    <div className="mt-0.5 flex items-center space-x-1.5 font-medium">
                      {task.riskLevel === 'CRITICAL' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span className="text-red-600 dark:text-red-400 font-semibold">{task.riskScore}% Critical</span>
                        </>
                      ) : task.riskLevel === 'HIGH' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">{task.riskScore}% High</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                          <span className="text-neutral-700 dark:text-neutral-300">{task.riskScore}% Moderate</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-medium">Requirement</div>
                    <div className="mt-0.5 font-mono text-neutral-700 dark:text-neutral-300">
                      {task.duration} min • {task.personnel} crew
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-medium">Collaboration</div>
                    <div className="mt-0.5 text-neutral-700 dark:text-neutral-300">
                      {task.canCollaborate ? (
                        <span className="font-medium text-neutral-900 dark:text-white">With {task.compatibleDept}</span>
                      ) : (
                        <span className="text-neutral-400">Standalone</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-medium">Status</div>
                    <div className="mt-0.5 text-neutral-500 dark:text-neutral-400 font-mono">
                      {task.status}
                    </div>
                  </div>
                </div>

                {/* Right Action: Clean Apple-like Inspect button */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(task.id);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-black/[0.1] dark:border-white/[0.14] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-neutral-900 dark:text-white transition-all shadow-2xs"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
