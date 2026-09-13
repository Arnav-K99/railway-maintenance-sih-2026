import React from 'react';
import {
  HeartPulse,
  Wrench,
  Sparkles,
  Radio,
  RefreshCw,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export const WorkflowBanner = ({ activeTab, onNavigate }) => {
  const { currentUser, login } = useAuth();

  const steps = [
    {
      id: 'neev',
      label: 'Neev AI',
      sublabel: 'Failure Risk',
      icon: HeartPulse,
      color: 'text-red-600 bg-red-50 border-red-200',
      activeColor: 'bg-red-600 text-white',
      page: 'demand',
      role: ROLES.OCC,
    },
    {
      id: 'maintenance-req',
      label: 'Maintenance',
      sublabel: 'Work Demands',
      icon: Wrench,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      activeColor: 'bg-blue-600 text-white',
      page: 'my-tasks',
      role: ROLES.MAINTENANCE,
    },
    {
      id: 'arnav',
      label: 'Arnav CP-SAT',
      sublabel: 'Block Planning',
      icon: Sparkles,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      activeColor: 'bg-indigo-600 text-white',
      page: 'block-planning',
      role: ROLES.OCC,
    },
    {
      id: 'ritvik',
      label: 'Ritvik Engine',
      sublabel: 'Live Validation',
      icon: Radio,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      activeColor: 'bg-amber-600 text-white',
      page: 'live-ops',
      role: ROLES.OCC,
    },
    {
      id: 'replan',
      label: 'Arnav Replan',
      sublabel: 'Feedback Loop',
      icon: RefreshCw,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      activeColor: 'bg-orange-600 text-white',
      page: 'replanning',
      role: ROLES.OCC,
    },
    {
      id: 'operations',
      label: 'Operations',
      sublabel: 'Possession Control',
      icon: LayoutDashboard,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      activeColor: 'bg-blue-700 text-white',
      page: 'overview',
      role: ROLES.OCC,
    },
    {
      id: 'maint-exec',
      label: 'Field Crew',
      sublabel: 'Execution & Sign-Off',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      activeColor: 'bg-emerald-700 text-white',
      page: 'my-tasks',
      role: ROLES.MAINTENANCE,
    },
    {
      id: 'general',
      label: 'General User',
      sublabel: 'Public Audit',
      icon: CheckCircle2,
      color: 'text-green-700 bg-green-50 border-green-200',
      activeColor: 'bg-green-700 text-white',
      page: 'general-verify',
      role: ROLES.GENERAL,
    },
  ];

  const handleClickStep = (step) => {
    if (step.role !== currentUser?.role) {
      login(step.role);
    }
    if (onNavigate) {
      onNavigate(step.page);
    }
  };

  const isStepActive = (step) => {
    if (step.id === 'neev' && activeTab === 'demand') return true;
    if (step.id === 'arnav' && activeTab === 'block-planning') return true;
    if (step.id === 'ritvik' && activeTab === 'live-ops') return true;
    if (step.id === 'replan' && activeTab === 'replanning') return true;
    if (step.id === 'operations' && activeTab === 'overview') return true;
    if (step.id === 'maint-exec' && (activeTab === 'my-tasks' || activeTab === 'maint-dashboard')) return true;
    if (step.id === 'general' && activeTab === 'general-verify') return true;
    return false;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono">
            System Closed-Loop Workflow Architecture
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span>Click any stage to navigate</span>
          <span>•</span>
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
            Demo / Synthetic Data
          </span>
        </div>
      </div>

      {/* Horizontal Step Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const active = isStepActive(step);

          return (
            <button
              key={step.id}
              onClick={() => handleClickStep(step)}
              className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between group ${
                active
                  ? `${step.activeColor} shadow-xs font-semibold scale-[1.02]`
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/90 text-slate-700'
              }`}
              title={`Jump to ${step.label} (${step.sublabel})`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[10px] font-mono font-bold ${active ? 'opacity-90' : 'text-slate-400'}`}>
                  0{idx + 1}
                </span>
                <Icon size={14} className={active ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'} />
              </div>

              <div>
                <div className="text-[11px] font-bold leading-tight truncate">{step.label}</div>
                <div className={`text-[9px] truncate ${active ? 'opacity-85' : 'text-slate-500'}`}>
                  {step.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
