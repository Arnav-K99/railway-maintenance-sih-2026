import React from 'react';
import { Train, Package, ShieldCheck, Gauge, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TrafficContext = ({ sectionId = 'SEC-0004' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-blue-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Operational Traffic Context — {sectionId}
          </h4>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Live Capacity Model</span>
      </div>

      <div className="grid grid-cols-4 gap-3 text-xs">
        {/* Passenger Traffic */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold uppercase">
              <Train size={12} className="text-blue-500" />
              Passenger Traffic
            </span>
            <Badge variant="MODERATE" size="sm">Moderate</Badge>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono mt-1">18 Trains / Day</div>
          <p className="text-[10px] text-slate-500">Peak pressure: 08:00 - 11:00 & 17:00 - 20:00</p>
        </div>

        {/* Goods Forecast */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold uppercase">
              <Package size={12} className="text-amber-500" />
              Goods Forecast
            </span>
            <Badge variant="LOW" size="sm">Normal</Badge>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono mt-1">12 Freight Paths</div>
          <p className="text-[10px] text-slate-500">Congestion Index: 1.15 (Optimal)</p>
        </div>

        {/* Block Availability */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold uppercase">
              <ShieldCheck size={12} className="text-emerald-500" />
              Track Status
            </span>
            <Badge variant="success" size="sm">Available</Badge>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono mt-1">8 Slots / Window</div>
          <p className="text-[10px] text-slate-500">240m continuous track availability</p>
        </div>

        {/* Recommended Window */}
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-emerald-800">
            <span className="flex items-center gap-1 font-bold uppercase">
              <CheckCircle2 size={12} className="text-emerald-600" />
              Optimal Window
            </span>
            <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
              Night Slot
            </span>
          </div>
          <div className="text-sm font-bold text-emerald-950 font-mono mt-1">00:00 – 04:00</div>
          <p className="text-[10px] text-emerald-800">Lowest passenger disruption impact</p>
        </div>
      </div>
    </div>
  );
};
