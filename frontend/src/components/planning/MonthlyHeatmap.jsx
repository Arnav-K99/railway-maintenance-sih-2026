import React from 'react';
import { Calendar, Layers } from 'lucide-react';

export const MonthlyHeatmap = ({ onSelectDate }) => {
  // Generate 30 days for September 2026
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
    // Pseudo-deterministic data for visual heatmap
    const tasks = Math.floor(10 + Math.sin(i) * 6 + (i % 7 === 5 || i % 7 === 6 ? 6 : 0));
    const critical = Math.floor(tasks * 0.25);
    const blocks = Math.floor(tasks * 1.3);
    const workload = tasks > 16 ? 'HIGH' : tasks > 11 ? 'MEDIUM' : 'LOW';

    return {
      day: dayNum,
      date: dateStr,
      tasks,
      critical,
      blocks,
      workload,
    };
  });

  const getWorkloadBg = (workload) => {
    switch (workload) {
      case 'HIGH':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'MEDIUM':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Monthly Workload Heatmap — September 2026
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-slate-100 border border-slate-300"></span> Low Workload
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-blue-50 border border-blue-200"></span> Medium Workload
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-blue-100 border border-blue-300"></span> High Workload
          </span>
        </div>
      </div>

      {/* 7-column calendar grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase py-1">
            {d}
          </div>
        ))}

        {days.map((d) => (
          <div
            key={d.date}
            onClick={() => onSelectDate(d.date)}
            className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-105 hover:shadow-xs ${getWorkloadBg(
              d.workload
            )}`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold font-mono">{d.day}</span>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-70">
                {d.workload}
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span>Tasks:</span>
                <span className="font-bold font-mono">{d.tasks}</span>
              </div>
              <div className="flex justify-between text-red-600 font-medium">
                <span>Crit:</span>
                <span className="font-bold font-mono">{d.critical}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Blocks:</span>
                <span className="font-bold font-mono">{d.blocks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
