import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth, PORTALS } from './context/AuthContext';
import { PlanContext_Provider } from './context/PlanContext';

import { GovShell } from './components/layout/GovShell';
import { Landing } from './pages/Landing';

// Maintenance Portal Pages
import { MaintDashboard } from './pages/maintenance/MaintDashboard';
import { NeevPredictions } from './pages/maintenance/NeevPredictions';
import { MyWork } from './pages/maintenance/MyWork';
import { MaintHistory } from './pages/maintenance/MaintHistory';

// Authority Portal Pages
import { AuthDashboard } from './pages/authority/AuthDashboard';
import { Operations } from './pages/authority/Operations';
import { Replanning } from './pages/authority/Replanning';
import { WorkVerification } from './pages/authority/WorkVerification';
import { UpcomingTasks } from './pages/authority/UpcomingTasks';
import { AuthHistory } from './pages/authority/AuthHistory';

const MAINT_TABS = [
  'maint-dashboard',
  'neev-predictions',
  'my-work',
  'maint-history',
];

const AUTH_TABS = [
  'auth-dashboard',
  'operations',
  'replanning',
  'verification',
  'upcoming',
  'auth-history',
];

function MainApp() {
  const { currentPortal, currentUser, login } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return currentPortal === PORTALS.MAINTENANCE ? 'maint-dashboard' : 'operations';
  });

  // Keep active tab synchronized with active portal
  useEffect(() => {
    if (currentPortal === PORTALS.MAINTENANCE) {
      if (!MAINT_TABS.includes(activeTab)) {
        setActiveTab('maint-dashboard');
      }
    } else {
      if (!AUTH_TABS.includes(activeTab)) {
        setActiveTab('operations');
      }
    }
  }, [currentPortal]);

  const handlePortalSwitch = (nextPortal) => {
    if (nextPortal === PORTALS.MAINTENANCE) {
      setActiveTab('maint-dashboard');
    } else {
      setActiveTab('operations');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // If user signed out, show clean government landing/portal selector
  if (!currentUser) {
    return (
      <Landing
        onSelectPortal={(portal) => {
          if (portal === PORTALS.MAINTENANCE) {
            setActiveTab('maint-dashboard');
          } else {
            setActiveTab('operations');
          }
        }}
      />
    );
  }

  return (
    <GovShell
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSwitchPortal={handlePortalSwitch}
    >
      {/* Portal A: Maintenance Portal */}
      {currentPortal === PORTALS.MAINTENANCE && (
        <>
          {activeTab === 'maint-dashboard' && <MaintDashboard onNavigate={handleTabChange} />}
          {activeTab === 'neev-predictions' && <NeevPredictions />}
          {activeTab === 'my-work' && <MyWork />}
          {activeTab === 'maint-history' && <MaintHistory />}
        </>
      )}

      {/* Portal B: Authority Portal */}
      {currentPortal === PORTALS.AUTHORITY && (
        <>
          {activeTab === 'auth-dashboard' && <AuthDashboard onNavigate={handleTabChange} />}
          {activeTab === 'operations' && <Operations />}
          {activeTab === 'replanning' && <Replanning />}
          {activeTab === 'verification' && <WorkVerification />}
          {activeTab === 'upcoming' && <UpcomingTasks />}
          {activeTab === 'auth-history' && <AuthHistory />}
        </>
      )}
    </GovShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PlanContext_Provider>
            <MainApp />
          </PlanContext_Provider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
