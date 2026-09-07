import React from 'react';
import { Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export const WeeklyView = ({ selectedDate, onSelectDate }) => {
  const days = [
    { day: 'MON', date: '2026-09-07', tasks: 12, blocks: 16, critical: 4, conflicts: 0, active: selectedDate === '2026-09-07' },
    { day: 'TUE', date: '2026-09-08', tasks: 14, blocks: 18, critical: 3, conflicts: 0, active: selectedDate === '2026-09-08' },
    { day: 'WED', date: '2026-09-09', tasks: 10, blocks: 14, critical: 2, conflicts: 0, active: selectedDate === '2026-09-09' },
    { day: 'THU', date: '2026-09-10', tasks: 8, blocks: 11, critical: 1, conflicts: 0, active: selectedDate === '2026-09-10' },
    { day: 'FRI', date: '2026-09-11', tasks: 9, blocks: 12, critical: 2, conflicts: 0, active: selectedDate === '2026-09-11' },
    { day: 'SAT', date: '2026-09-12', tasks: 15, blocks: 20, critical: 5, conflicts: 0, active: selectedDate === '2026-09-12' },
    { day: 'SUN', date: '2026-09-13', tasks: 18, blocks: 24, critical: 6, conflicts: 0, active: selectedDate === '2026-09-13' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            7-Day Rolling Horizon Planning View
          </h4>
        </div>
        <span className="text-[11px] text-slate-500">Click a day to filter Gantt timeline</span>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {days.map((d) => (
          <div
            key={d.date}
            onClick={() => onSelectDate(d.date)}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              d.active
                ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 font-mono">{d.day}</span>
              <span className="text-[10px] text-slate-500">{d.date.slice(8)} Sep</span>
            </div>

            <div className="mt-2.5 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Tasks:</span>
                <span className="font-bold text-slate-900 font-mono">{d.tasks}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Blocks:</span>
                <span className="font-bold text-slate-900 font-mono">{d.blocks}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Critical:</span>
                <span className="font-bold text-red-600 font-mono">{d.critical}</span>
              </div>
              <div className="flex justify-between text-xs pt-0.5">
                <span className="text-slate-500">Conflicts:</span>
                <span className="font-bold text-emerald-600 font-mono">{d.conflicts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
