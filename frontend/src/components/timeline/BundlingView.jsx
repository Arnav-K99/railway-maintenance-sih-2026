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
          <span>{data.window}</span>
        </div>

        {/* Task A: Track / Civil */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span className="uppercase tracking-wider text-[11px] text-blue-900 font-sans font-bold">
              {data.task_a.department} — {data.task_a.task_id}
            </span>
            <span className="font-mono text-slate-500 font-normal">{data.task_a.duration}</span>
          </div>
          <div className="h-8 w-full bg-blue-100 rounded-lg overflow-hidden p-1 border border-blue-300 flex items-center shadow-inner">
            <div className="h-full w-full bg-blue-600 rounded-md text-[11px] font-bold text-white flex items-center justify-between px-3">
              <span>{data.task_a.maintenance_type}</span>
              <span className="font-mono text-[10px] opacity-90">TRACK POSSESSION</span>
            </div>
          </div>
        </div>

        {/* Task B: Electrical / TRD */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span className="uppercase tracking-wider text-[11px] text-purple-900 font-sans font-bold">
              {data.task_b.department} — {data.task_b.task_id}
            </span>
            <span className="font-mono text-slate-500 font-normal">{data.task_b.duration}</span>
          </div>
          <div className="h-8 w-full bg-purple-100 rounded-lg overflow-hidden p-1 border border-purple-300 flex items-center shadow-inner">
            <div className="h-full w-full bg-purple-600 rounded-md text-[11px] font-bold text-white flex items-center justify-between px-3">
              <span>{data.task_b.maintenance_type}</span>
              <span className="font-mono text-[10px] opacity-90">OHE ISOLATION WINDOW</span>
            </div>
          </div>
        </div>

        {/* Coordinated Shared Possession Tag */}
        <div className="pt-1 flex items-center justify-center">
          <span className="bg-purple-700 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5 font-mono">
            <ShieldCheck size={14} />
            <span>SHARED POSSESSION WINDOW</span>
          </span>
        </div>
      </div>

      {/* Explanation & Rules */}
      <div className="text-xs text-slate-600 leading-relaxed bg-purple-50/70 p-4 rounded-lg border border-purple-100 space-y-2">
        <p className="font-bold text-purple-950 text-xs">
          &ldquo;{data.explanation}&rdquo;
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
          {data.benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-purple-600 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
