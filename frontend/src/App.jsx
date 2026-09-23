import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth, PORTALS } from './context/AuthContext';
import { PlanContext_Provider } from './context/PlanContext';

import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';

// Maintenance Portal Pages
import { MaintDashboard } from './pages/maintenance/MaintDashboard';
import { TodoWork } from './pages/maintenance/TodoWork';
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
  'todo-work',
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

// Page title mapping
const PAGE_TITLES = {
  'maint-dashboard': { title: 'Dashboard', subtitle: 'Work inventory & KPI overview' },
  'todo-work': { title: 'To-Do Work', subtitle: 'Asset health & requirement definition' },
  'neev-predictions': { title: 'To-Do Work', subtitle: 'Asset health & requirement definition' },
  'my-work': { title: 'My Work', subtitle: 'Assigned maintenance work orders' },
  'maint-history': { title: 'History', subtitle: 'Execution & rescheduling log' },
  'auth-dashboard': { title: 'Dashboard', subtitle: 'Operations control overview' },
  'operations': { title: 'Operations', subtitle: 'Weekly block calendar & live operations' },
  'replanning': { title: 'Replanning', subtitle: 'Operational disruptions & re-optimization' },
  'verification': { title: 'Work Verification', subtitle: 'Accept, reject, or report false closure' },
  'upcoming': { title: 'Upcoming', subtitle: 'Master possession schedule' },
  'auth-history': { title: 'Audit History', subtitle: 'Operational decisions & verifications' },
};

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

  const pageInfo = PAGE_TITLES[activeTab] || {};

  // If user signed out, show landing page
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
    <AppShell
      activeTab={activeTab}
      onTabChange={handleTabChange}
      pageTitle={pageInfo.title}
      pageSubtitle={pageInfo.subtitle}
    >
      {/* Portal A: Maintenance Portal */}
      {currentPortal === PORTALS.MAINTENANCE && (
        <>
          {activeTab === 'maint-dashboard' && <MaintDashboard onNavigate={handleTabChange} />}
          {(activeTab === 'todo-work' || activeTab === 'neev-predictions') && <TodoWork />}
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
    </AppShell>
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