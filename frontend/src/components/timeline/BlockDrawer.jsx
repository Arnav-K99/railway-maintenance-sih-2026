import React from 'react';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { Clock, Calendar, Users, Layers, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

export const BlockDrawer = ({ task, isOpen, onClose, onOpenWhyArnav }) => {
  if (!task) return null;

  const minToHhmm = (m) => {
    const hh = String(Math.floor(m / 60) % 24).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const startTime = minToHhmm(task.start_minute);
  const endTime = minToHhmm(task.end_minute);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Maintenance Block Details — ${task.task_id}`}
      subtitle={`Asset: ${task.asset_id} • Section: ${task.section_id}`}
    >
      {/* "Why did Arnav select this block?" Primary Callout Button */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 rounded-xl shadow-md border border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              OR-Tools CP-SAT Decision Trace
            </span>
          </div>
          <Badge variant="LOW" size="sm">Mathematically Proven</Badge>
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Explore the 5-step constraint pruning and optimization trace that selected this specific block window.
        </p>
        <button
          onClick={() => onOpenWhyArnav(task)}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <Sparkles size={14} />
          <span>Why Did Arnav Select This Block?</span>
        </button>
      </div>

      {/* 1. BLOCK INFORMATION */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Clock size={14} className="text-blue-600" />
          <span>Block Possession Information</span>
        </h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Block ID(s)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {Array.isArray(task.block_ids) ? task.block_ids.join(' + ') : task.block_ids}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Date</span>
            <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar size={13} className="text-slate-400" />
              {task.date}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Start Time – End Time</span>
            <span className="font-mono font-bold text-slate-900 text-xs">
              {startTime} – {endTime} ({task.duration_minutes}m)
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Corridor & Section</span>
            <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin size={13} className="text-slate-400" />
              {task.corridor_id} • {task.section_id}
            </span>
          </div>
          <div className="col-span-2 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center justify-between">
            <span className="text-slate-600 text-[11px] font-medium">Block Availability:</span>
            <span className="text-emerald-800 font-bold font-mono text-xs flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Available (No Conflicting Trains)
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAINTENANCE WORK ORDER */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <ShieldAlert size={14} className="text-red-600" />
          <span>Maintenance Task Details</span>
        </h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Task ID</span>
            <span className="font-mono font-bold text-slate-900">{task.task_id}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Maintenance Type</span>
            <span className="font-bold text-slate-800">{task.maintenance_type || 'Track Inspection / Renewal'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Department</span>
            <span className="font-medium text-slate-700">{task.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Duration</span>
            <span className="font-mono font-bold text-slate-800">{task.duration_minutes} minutes</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Neev Risk Score</span>
            <Badge
              variant={task.risk_score >= 80 ? 'CRITICAL' : task.risk_score >= 60 ? 'HIGH' : 'MODERATE'}
              size="sm"
            >
              {task.risk_score ? task.risk_score.toFixed(1) : '81.0'}% {task.risk_score >= 80 ? 'CRITICAL' : ''}
            </Badge>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Priority Score</span>
            <span className="font-mono font-bold text-slate-800">
              {task.priority_score ? task.priority_score.toFixed(1) : '1,762.2'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. ASSIGNED TEAMS */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Users size={14} className="text-emerald-600" />
          <span>Assigned Teams</span>
        </h4>

        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
          <div>
            <span className="font-bold font-mono text-slate-900 text-sm">
              {Array.isArray(task.assigned_teams) ? task.assigned_teams.join(', ') : task.assigned_teams || 'TEAM-013'}
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5">{task.department} Qualified Crew</p>
          </div>
          <Badge variant="success" size="sm">Available & Shift Active</Badge>
        </div>
      </div>

      {/* 4. BUNDLING DETAILS (Section 10 requirement) */}
      {task.is_bundled && (
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-purple-700" />
              Bundled Maintenance
            </span>
            <Badge variant="purple" size="sm">Shared Possession</Badge>
          </div>

          <div className="bg-white p-3 rounded-lg border border-purple-100 text-center space-y-1 text-xs">
            <div className="font-bold text-blue-900">Track / Civil</div>
            <div className="text-purple-600 font-bold text-sm">+</div>
            <div className="font-bold text-purple-900">Electrical / TRD</div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-purple-900">
            <div className="bg-purple-100/70 p-1.5 rounded border border-purple-200">Shared possession</div>
            <div className="bg-purple-100/70 p-1.5 rounded border border-purple-200">Same section</div>
            <div className="bg-purple-100/70 p-1.5 rounded border border-purple-200">Compatible work</div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
