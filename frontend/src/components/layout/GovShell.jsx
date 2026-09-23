import React from 'react';
import { GovHeader } from './GovHeader';
import { GovSidebar } from './GovSidebar';

export const GovShell = ({ activeTab, onTabChange, children }) => {
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#06080c] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.08),rgba(0,0,0,0))] flex flex-col text-slate-900 dark:text-[#EAECEF] font-sans antialiased transition-colors">
      {/* Header */}
      <GovHeader />

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
