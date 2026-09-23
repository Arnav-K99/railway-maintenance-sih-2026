import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const PORTALS = {
  MAINTENANCE: 'MAINTENANCE',
  AUTHORITY: 'AUTHORITY',
};

export const DEPARTMENTS = [
  'All Departments',
  'Track / Civil Engineering',
  'Electrical / TRD',
  'Signal & Telecommunications',
  'Mechanical / Rolling Stock',
];

export const AuthProvider = ({ children }) => {
  // Read saved portal or default to AUTHORITY
  const [currentPortal, setCurrentPortal] = useState(() => {
    return sessionStorage.getItem('sih_portal') || PORTALS.AUTHORITY;
  });

  const [selectedDept, setSelectedDept] = useState('All Departments');

  // Default to null so user lands on Login / Portal Selection page first
  const [currentUser, setCurrentUser] = useState(() => {
    const isLoggedIn = sessionStorage.getItem('sih_logged_in');
    const p = sessionStorage.getItem('sih_portal');
    if (isLoggedIn === 'true' && p) {
      return p === PORTALS.MAINTENANCE
        ? {
            name: 'Authority B',
            designation: 'Senior Section Engineer (SSE)',
            department: 'Electrical / TRD',
            station: 'Delhi Maintenance Division',
          }
        : {
            name: 'Authority A',
            designation: 'Chief Operations Controller (COC)',
            department: 'Central Operations Control',
            station: 'Central Operations HQ',
          };
    }
    return null;
  });

  const login = (portal, department = 'All Departments') => {
    setCurrentPortal(portal);
    setSelectedDept(department);
    sessionStorage.setItem('sih_portal', portal);
    sessionStorage.setItem('sih_logged_in', 'true');

    if (portal === PORTALS.MAINTENANCE) {
      setCurrentUser({
        name: 'Authority B',
        designation: 'Senior Section Engineer (SSE)',
        department: department === 'All Departments' ? 'Electrical / TRD' : department,
        station: 'Delhi Maintenance Division',
      });
    } else {
      setCurrentUser({
        name: 'Authority A',
        designation: 'Chief Operations Controller (COC)',
        department: 'Central Operations Control',
        station: 'Central Operations HQ',
      });
    }
  };

  const switchPortal = (portal) => {
    login(portal, selectedDept);
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('sih_portal');
    sessionStorage.removeItem('sih_logged_in');
    localStorage.removeItem('sih_portal');
    localStorage.removeItem('sih_logged_in');
  };

  return (
    <AuthContext.Provider
      value={{
        currentPortal,
        currentUser,
        selectedDept,
        setSelectedDept,
        login,
        switchPortal,
        logout,
        PORTALS,
        DEPARTMENTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
