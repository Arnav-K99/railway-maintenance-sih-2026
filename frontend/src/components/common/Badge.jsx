import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2 py-0.5 font-semibold',
    lg: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-300',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border border-orange-200',
    
    // Risk badges
    CRITICAL: 'bg-red-600 text-white font-bold tracking-wide shadow-sm',
    HIGH: 'bg-orange-500 text-white font-semibold',
    MODERATE: 'bg-amber-500 text-white font-semibold',
    LOW: 'bg-emerald-600 text-white font-semibold',
    
    // Status badges
    Scheduled: 'bg-blue-50 text-blue-700 border border-blue-300',
    Replanned: 'bg-orange-50 text-orange-700 border border-orange-300 font-semibold',
    Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-300',
    Pending: 'bg-slate-100 text-slate-600 border border-slate-300',
    'In Progress': 'bg-indigo-50 text-indigo-700 border border-indigo-300 animate-pulse',
    'False Closure': 'bg-red-50 text-red-700 border border-red-300 font-semibold',
  };

  const badgeStyle = variantClasses[variant] || variantClasses.default;

  return (
    <span className={`inline-flex items-center rounded-full ${sizeClasses[size]} ${badgeStyle} ${className}`}>
      {children}
    </span>
  );
};
