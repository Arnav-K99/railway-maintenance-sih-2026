import React from 'react';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export const AppShell = ({ activeTab, onTabChange, children }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0d0f12] flex flex-col text-slate-900 dark:text-neutral-100 font-sans transition-colors">
      {/* Top Application Header */}
      <AppHeader />

      {/* Main Container: Compact Sidebar + Content Body */}
      <div className="flex-1 flex min-w-0">
        <AppSidebar activeTab={activeTab} onTabChange={onTabChange} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
