import React from 'react';
import { Layers, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SMART_BUNDLING_EXAMPLE } from '../../data/simulationData';

export const BundlingView = () => {
  const data = SMART_BUNDLING_EXAMPLE;

  return (
    <div className="bg-white rounded-xl border border-purple-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
            <Layers size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Smart Cross-Department Bundling
            </h4>
            <p className="text-xs text-slate-500">
              {data.section_id} — {data.section_name} ({data.corridor_name})
            </p>
          </div>
        </div>
        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full font-mono">
          2 Compatible Tasks → 1 Possession Window
        </span>
      </div>

      {/* Visual Timeline Comparison */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-600 border-b border-slate-200 pb-2">
          <span>POSSESSION WINDOW: {data.block_id}</span>
          <span>TIME: 04:00 ━━━━━━━━━━━━━━━ 06:00 (120 MIN CAPACITY)</span>
        </div>

        {/* Task A */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-slate-700">
            <span>{data.task_a.task_id} — {data.task_a.department}</span>
            <span className="font-mono text-slate-500">{data.task_a.duration}</span>
          </div>
          <div className="h-6 w-full bg-blue-100 rounded-md overflow-hidden p-0.5 border border-blue-300 flex items-center">
            <div className="h-full w-[85%] bg-blue-600 rounded text-[10px] font-bold text-white flex items-center px-2">
              {data.task_a.maintenance_type}
            </div>
          </div>
        </div>

        {/* Task B */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-slate-700">
            <span>{data.task_b.task_id} — {data.task_b.department}</span>
            <span className="font-mono text-slate-500">{data.task_b.duration}</span>
          </div>
          <div className="h-6 w-full bg-emerald-100 rounded-md overflow-hidden p-0.5 border border-emerald-300 flex items-center">
            <div className="h-full w-[65%] bg-emerald-600 rounded text-[10px] font-bold text-white flex items-center px-2">
              {data.task_b.maintenance_type}
            </div>
          </div>
        </div>

        {/* Coordinated Shared Possession Tag */}
        <div className="pt-1 flex items-center justify-center">
          <span className="bg-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            ★ Shared Track Possession Window (Concurrent Execution)
          </span>
        </div>
      </div>

      {/* Explanation & Rules */}
      <div className="text-xs text-slate-600 leading-relaxed bg-purple-50/50 p-3.5 rounded-lg border border-purple-100">
        <p className="font-semibold text-purple-900 mb-1.5">
          &ldquo;Compatible maintenance activities are coordinated within the same possession window.&rdquo;
        </p>
        <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
          {data.benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-purple-600 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
