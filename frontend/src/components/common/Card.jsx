import React from 'react';

export const Card = ({ children, title, subtitle, action, className = '', headerClassName = '', bodyClassName = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle || action) && (
        <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${headerClassName}`}>
          <div>
            {title && <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
