import React, { useState } from 'react';
import { GanttTimeline } from '../../components/timeline/GanttTimeline';
import { BlockDrawer } from '../../components/timeline/BlockDrawer';
import { WhyArnavModal } from '../../components/timeline/WhyArnavModal';
import { BundlingView } from '../../components/timeline/BundlingView';
import { TrafficContext } from '../../components/timeline/TrafficContext';
import { WeeklyView } from '../../components/planning/WeeklyView';
import { MonthlyHeatmap } from '../../components/planning/MonthlyHeatmap';
import { MetricCard } from '../../components/common/MetricCard';
import { usePlan } from '../../context/PlanContext';
import corridorsSectionsData from '../../data/corridors_sections.json';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Filter,
  Layers,
  AlertTriangle,
  Clock,
  Users,
  CheckCircle2,
  CalendarDays,
  Grid,
} from 'lucide-react';

export const BlockPlanning = () => {
  const { scheduledTasks, metrics, isReplanned, activeEvent } = usePlan();

  const [selectedDate, setSelectedDate] = useState('2026-09-07');
  const [selectedCorridor, setSelectedCorridor] = useState('COR-001');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'weekly', 'monthly'

  const [drawerTask, setDrawerTask] = useState(null);
  const [whyArnavOpen, setWhyArnavOpen] = useState(false);
  const [whyArnavTask, setWhyArnavTask] = useState(null);

  // Filter sections for the corridor
  const sections = corridorsSectionsData.sections.filter(
    (s) => s.corridor_id === selectedCorridor || s.section_id === 'SEC-0073'
  );

  const handleSelectTask = (task) => {
    setDrawerTask(task);
  };

  const handleOpenWhyArnav = (task) => {
    setWhyArnavTask(task);
    setWhyArnavOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            <Sparkles size={14} className="text-blue-500" />
            <span>Google OR-Tools CP-SAT Scheduling Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Automatic Block Planning
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            AI-assisted maintenance scheduling based on asset risk, railway blocks, train operations and team availability.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Arnav CP-SAT optimizer solved 30,000 tasks across rolling horizon in 0.5s. Schedule refreshed.')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles size={14} />
            <span>Generate Block Plan</span>
          </button>
          <button
            onClick={() => alert('Plan synchronization verified against latest physical track blocks.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw size={13} />
            <span>Update Plan</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar & View Toggles */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gantt Timeline
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Planning
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'monthly'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Heatmap
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Date Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <Calendar size={14} className="text-slate-400" />
            <span className="font-semibold">Planning Date:</span>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono font-bold text-slate-800"
            >
              <option value="2026-09-07">2026-09-07 (Original Slot)</option>
              <option value="2026-09-08">2026-09-08 (Replanned Slot)</option>
              <option value="2026-09-09">2026-09-09</option>
              <option value="2026-09-10">2026-09-10</option>
            </select>
          </div>

          {/* Corridor Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="font-semibold">Corridor:</span>
            <select
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-800"
            >
              <option value="COR-001">COR-001 (Delhi–Agra)</option>
              <option value="COR-008">COR-008 (Bhopal–Itarsi)</option>
              <option value="COR-010">COR-010 (Mumbai–Surat)</option>
            </select>
          </div>
        </div>

        {/* Status Callout */}
        <div className="text-xs text-slate-500 font-mono">
          Horizon: <strong>03 Sep – 09 Sep 2026</strong>
        </div>
      </div>

      {/* Planning Summary Cards (Section 8) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider block">Critical Tasks</span>
          <span className="text-xl font-bold font-mono text-red-600 mt-1 block">
            {metrics.risk_breakdown.critical_risk_scheduled}
          </span>
          <span className="text-[10px] text-slate-400">Neev score &ge; 80</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider block">High Risk Tasks</span>
          <span className="text-xl font-bold font-mono text-orange-600 mt-1 block">
            {metrics.risk_breakdown.high_risk_scheduled}
          </span>
          <span className="text-[10px] text-slate-400">Neev score 60-79</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">Total Demand</span>
          <span className="text-xl font-bold font-mono text-slate-800 mt-1 block">30,000</span>
          <span className="text-[10px] text-slate-400">Full inventory</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">Planned Blocks</span>
          <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">
            {metrics.operational_metrics.unique_blocks_utilized}
          </span>
          <span className="text-[10px] text-slate-400">Conflict-free</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Deferred Tasks</span>
          <span className="text-xl font-bold font-mono text-slate-700 mt-1 block">
            {metrics.summary.total_deferred.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">Rolling horizon</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider block">Teams Utilized</span>
          <span className="text-xl font-bold font-mono text-purple-600 mt-1 block">
            {metrics.operational_metrics.teams_utilized}/39
          </span>
          <span className="text-[10px] text-slate-400">Specialist crews</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">Train Conflicts</span>
          <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
            {activeEvent ? 1 : 0}
          </span>
          <span className="text-[10px] text-slate-400">
            {activeEvent ? 'Simulated alert' : '100% Resolved'}
          </span>
        </div>
      </div>

      {/* Main Centerpiece Area: Gantt Timeline / Weekly / Monthly */}
      {viewMode === 'timeline' && (
        <GanttTimeline
          sections={sections}
          scheduledTasks={scheduledTasks}
          selectedDate={selectedDate}
          onSelectTask={handleSelectTask}
        />
      )}

      {viewMode === 'weekly' && (
        <WeeklyView
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setViewMode('timeline');
          }}
        />
      )}

      {viewMode === 'monthly' && (
        <MonthlyHeatmap
          onSelectDate={(date) => {
            setSelectedDate(date);
            setViewMode('timeline');
          }}
        />
      )}

      {/* Traffic Context Box (Section 13) */}
      <TrafficContext sectionId="SEC-0004" />

      {/* Smart Bundling Visualization Component (Section 12) */}
      <BundlingView />

      {/* Drawers & Decision Trace Modals */}
      <BlockDrawer
        task={drawerTask}
        isOpen={Boolean(drawerTask)}
        onClose={() => setDrawerTask(null)}
        onOpenWhyArnav={handleOpenWhyArnav}
      />

      <WhyArnavModal
        task={whyArnavTask}
        isOpen={whyArnavOpen}
        onClose={() => setWhyArnavOpen(false)}
      />
    </div>
  );
};
