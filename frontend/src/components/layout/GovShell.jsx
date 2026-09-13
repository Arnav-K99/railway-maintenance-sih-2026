import React from 'react';
import { GovHeader } from './GovHeader';
import { GovSidebar } from './GovSidebar';

export const GovShell = ({ activeTab, onTabChange, onSwitchPortal, children }) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans">
      {/* Official Government Header */}
      <GovHeader onSwitchPortal={onSwitchPortal} />

      {/* Main Layout: Compact Sidebar + Content Body */}
      <div className="flex-1 flex min-w-0">
        <GovSidebar activeTab={activeTab} onTabChange={onTabChange} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
