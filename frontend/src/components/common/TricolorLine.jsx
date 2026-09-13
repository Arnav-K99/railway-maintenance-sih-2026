import React from 'react';

// Subtle Indian National Tricolour Accent Line
export const TricolorLine = ({ className = "h-1 w-full" }) => {
  return (
    <div className={`flex ${className}`} aria-hidden="true">
      <div className="flex-1 bg-[#FF9933]" />
      <div className="flex-1 bg-[#FFFFFF] dark:bg-slate-300" />
      <div className="flex-1 bg-[#138808]" />
    </div>
  );
};
