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

  const [selectedDept, setSelectedDept] = useState(() => {
    return sessionStorage.getItem('sih_dept') || 'Electrical / TRD';
  });

  // Default to null so user lands on Login / Portal Selection page first
  const [currentUser, setCurrentUser] = useState(() => {
    const isLoggedIn = sessionStorage.getItem('sih_logged_in');
    const p = sessionStorage.getItem('sih_portal');
    const savedDept = sessionStorage.getItem('sih_dept') || 'Electrical / TRD';
    if (isLoggedIn === 'true' && p) {
      return p === PORTALS.MAINTENANCE
        ? {
            name: 'Authority B',
            designation: 'Senior Section Engineer (SSE)',
            department: savedDept,
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

  const login = (portal, department) => {
    setCurrentPortal(portal);
    const chosenDept = department || sessionStorage.getItem('sih_dept') || 'Electrical / TRD';
    setSelectedDept(chosenDept);
    sessionStorage.setItem('sih_portal', portal);
    sessionStorage.setItem('sih_logged_in', 'true');
    sessionStorage.setItem('sih_dept', chosenDept);

    if (portal === PORTALS.MAINTENANCE) {
      setCurrentUser({
        name: 'Authority B',
        designation: 'Senior Section Engineer (SSE)',
        department: chosenDept,
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
    sessionStorage.removeItem('sih_dept');
    localStorage.removeItem('sih_portal');
    localStorage.removeItem('sih_logged_in');
    localStorage.removeItem('sih_dept');
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
