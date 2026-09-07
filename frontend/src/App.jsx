import React, { useState, useEffect } from 'react';
import { StoryNav } from './components/presentation/StoryNav';
import { ScreenPortal } from './components/presentation/ScreenPortal';
import { ScreenOperationsHome } from './components/presentation/ScreenOperationsHome';
import { ScreenTasksList } from './components/presentation/ScreenTasksList';
import { ScreenTaskDetails } from './components/presentation/ScreenTaskDetails';
import { ScreenArnavPlan } from './components/presentation/ScreenArnavPlan';
import { ScreenLiveOps } from './components/presentation/ScreenLiveOps';
import { ScreenReplanningRequests } from './components/presentation/ScreenReplanningRequests';
import { ScreenReplanning } from './components/presentation/ScreenReplanning';
import { ScreenMaintenancePortal } from './components/presentation/ScreenMaintenancePortal';
import { ScreenVerification } from './components/presentation/ScreenVerification';

export default function App() {
  // Screen state machine
  const [currentScreen, setCurrentScreen] = useState('portal');
  const [selectedTaskId, setSelectedTaskId] = useState('TASK-000005');
  const [selectedEventId, setSelectedEventId] = useState('EVENT-001');

  // Shared Maintenance Requirements state (defined by Maintenance, passed to Arnav)
  const [maintenanceReqs, setMaintenanceReqs] = useState({
    duration: 200,
    personnel: 5,
    canCollaborate: true,
    compatibleDept: 'Track / Civil',
    canBundle: true,
  });

  // Global Theme state (default dark per Vision Pro / Apple macOS black monochrome glass direction)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sih_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('sih_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectPortal = (portalType) => {
    if (portalType === 'maintenance') setCurrentScreen('tasks_list');
    else if (portalType === 'operations') setCurrentScreen('operations_home');
    else if (portalType === 'verification') setCurrentScreen('verification');
  };

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
    setCurrentScreen('task_details');
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    setCurrentScreen('replanning_detail');
  };

  const handleSaveRequirements = (newReqs) => {
    setMaintenanceReqs(newReqs);
  };

  const handleReset = () => {
    setCurrentScreen('portal');
    setSelectedTaskId('TASK-000005');
    setSelectedEventId('EVENT-001');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#08080a] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans antialiased transition-colors selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Apple-style Monochrome Glass Header */}
      <StoryNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Screen Container */}
      <main className="flex-1 pb-16">
        {currentScreen === 'portal' && (
          <ScreenPortal onSelectPortal={handleSelectPortal} />
        )}

        {currentScreen === 'tasks_list' && (
          <ScreenTasksList
            onNavigate={setCurrentScreen}
            onSelectTask={handleSelectTask}
          />
        )}

        {currentScreen === 'task_details' && (
          <ScreenTaskDetails
            taskId={selectedTaskId}
            onNavigate={setCurrentScreen}
            onSaveRequirements={handleSaveRequirements}
          />
        )}

        {currentScreen === 'arnav_plan' && (
          <ScreenArnavPlan
            taskId={selectedTaskId}
            maintenanceReqs={maintenanceReqs}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'operations_home' && (
          <ScreenOperationsHome onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'live_ops' && (
          <ScreenLiveOps onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'replanning_requests' && (
          <ScreenReplanningRequests
            onNavigate={setCurrentScreen}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {currentScreen === 'replanning_detail' && (
          <ScreenReplanning onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'maintenance_portal' && (
          <ScreenMaintenancePortal
            onNavigate={setCurrentScreen}
            onSelectTask={handleSelectTask}
          />
        )}

        {currentScreen === 'verification' && (
          <ScreenVerification onNavigate={setCurrentScreen} />
        )}
      </main>

      {/* Calm Monochrome Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-[#f8f9fa]/80 dark:bg-[#08080a]/80 py-4 text-center text-xs text-neutral-500 dark:text-neutral-500 transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Indian Railways • Maintenance Optimization Prototype</span>
          <span className="font-mono text-[11px] text-neutral-400">
            Maintenance Requirements → Block Optimization → Live Operations → Replanning → Verification
          </span>
        </div>
      </footer>
    </div>
  );
}
