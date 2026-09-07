import React from 'react';

export const MetricCard = ({ title, value, subtext, icon: Icon, color = 'blue', trend = null, onClick = null }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${scheme.bg} ${scheme.text} ${scheme.border} border`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>
            {trend.value}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
};
