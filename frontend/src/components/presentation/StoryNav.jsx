import React from 'react';
import { RotateCcw, Sun, Moon } from 'lucide-react';

export const StoryNav = ({ currentScreen, onNavigate, onReset, theme, onToggleTheme }) => {
  const steps = [
    { id: 'portal', label: 'Portal', num: '1' },
    { id: 'tasks_list', label: 'Maintenance Tasks', num: '2' },
    { id: 'task_details', label: 'Work Order', num: '3' },
    { id: 'arnav_plan', label: 'Block Planning', num: '4' },
    { id: 'operations_home', label: 'Operations', num: '5' },
    { id: 'live_ops', label: 'Live Conflict', num: '6' },
    { id: 'replanning_requests', label: 'Replanning', num: '7' },
    { id: 'maintenance_portal', label: 'Execution', num: '8' },
    { id: 'verification', label: 'Verification', num: '9' },
  ];

  const getStepIndex = (id) => {
    if (id === 'portal') return 0;
    if (id === 'tasks_list') return 1;
    if (id === 'task_details') return 2;
    if (id === 'arnav_plan') return 3;
    if (id === 'operations_home') return 4;
    if (id === 'live_ops') return 5;
    if (id === 'replanning_requests' || id === 'replanning_detail') return 6;
    if (id === 'maintenance_portal') return 7;
    if (id === 'verification') return 8;
    return 0;
  };

  const currentIdx = getStepIndex(currentScreen);

  return (
    <header className="sticky top-0 z-50 bg-[#f8f9fa]/80 dark:bg-[#08080a]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Project Branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('portal')}>
          <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs tracking-wider">
            IR
          </div>
          <div>
            <div className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Indian Railways • SIH 2026
            </div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-none">
              Railway Maintenance Optimization
            </div>
          </div>
        </div>

        {/* Narrative Flow Pills for Evaluators */}
        <div className="hidden lg:flex items-center space-x-1">
          {steps.map((step, idx) => {
            const isActive = step.id === currentScreen || (step.id === 'replanning_requests' && currentScreen === 'replanning_detail');
            const isCompleted = idx < currentIdx;
            return (
              <button
                key={step.id}
                onClick={() => onNavigate(step.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold'
                    : isCompleted
                    ? 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
                title={`Jump to ${step.label}`}
              >
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                  isActive
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                    : isCompleted
                    ? 'text-neutral-600 dark:text-neutral-400 font-bold'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}>
                  {isCompleted ? '✓' : step.num}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions: Theme Toggle + Reset */}
        <div className="flex items-center space-x-2">
          {/* Light / Dark Toggle */}
          <button
            onClick={onToggleTheme}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-neutral-300" />
                <span className="text-[11px]">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-[11px]">DARK</span>
              </>
            )}
          </button>

          {/* Reset Action */}
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-black dark:hover:text-white transition-colors"
            title="Reset presentation to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
