import React, { useState } from 'react';
import { AssetHealthCard } from '../../components/maintenance/AssetHealthCard';
import { useAuth } from '../../context/AuthContext';
import { usePlan } from '../../context/PlanContext';
import { HeartPulse, Search, Filter } from 'lucide-react';

export const AssetHealth = () => {
  const { selectedDept } = useAuth();
  const { tasksInventory } = usePlan();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Filter assets by department, search, and risk
  const deptAssets = tasksInventory.filter((t) => {
    const matchesDept = t.department === selectedDept;
    const matchesSearch =
      t.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.section_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.asset_type && t.asset_type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRisk = riskFilter === 'ALL' || t.risk_level === riskFilter;

    return matchesDept && matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
            <HeartPulse size={14} className="text-red-500 animate-pulse" />
            <span>Neev Predictive ML Health Telemetry</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Asset Health & Degradation Monitor — {selectedDept}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Machine-learned predictive failure risks, 30-day degradation forecasts, and physical wear indicators.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Monitored Assets: <strong>{deptAssets.length}</strong>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Asset ID, Type, Section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="CRITICAL">Critical Risk (Neev &ge; 80)</option>
          <option value="HIGH">High Risk (60–79)</option>
          <option value="MODERATE">Moderate Risk (40–59)</option>
          <option value="LOW">Low Risk (&lt; 40)</option>
        </select>
      </div>

      {/* Grid of Asset Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deptAssets.map((asset) => (
          <AssetHealthCard key={asset.asset_id} asset={asset} />
        ))}
      </div>
    </div>
  );
};
