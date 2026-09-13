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
  // Default to AUTHORITY mode on first load for demonstration, or read from storage
  const [currentPortal, setCurrentPortal] = useState(() => {
    return localStorage.getItem('sih_portal') || PORTALS.AUTHORITY;
  });

  const [selectedDept, setSelectedDept] = useState('All Departments');

  const [currentUser, setCurrentUser] = useState(() => {
    const p = localStorage.getItem('sih_portal') || PORTALS.AUTHORITY;
    return p === PORTALS.MAINTENANCE
      ? {
          name: 'R. K. Verma',
          designation: 'Senior Section Engineer (SSE)',
          department: 'Electrical / TRD',
          station: 'Northern Railway / Delhi Div',
        }
      : {
          name: 'S. K. Sharma',
          designation: 'Chief Operations Controller (COC)',
          department: 'Central Operations Control',
          station: 'Rail Bhavan, New Delhi HQ',
        };
  });

  const login = (portal, department = 'All Departments') => {
    setCurrentPortal(portal);
    setSelectedDept(department);
    localStorage.setItem('sih_portal', portal);

    if (portal === PORTALS.MAINTENANCE) {
      setCurrentUser({
        name: 'R. K. Verma',
        designation: 'Senior Section Engineer (SSE)',
        department: department === 'All Departments' ? 'Electrical / TRD' : department,
        station: 'Northern Railway / Delhi Div',
      });
    } else {
      setCurrentUser({
        name: 'S. K. Sharma',
        designation: 'Chief Operations Controller (COC)',
        department: 'Central Operations Control',
        station: 'Rail Bhavan, New Delhi HQ',
      });
    }
  };

  const switchPortal = (portal) => {
    login(portal, selectedDept);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sih_portal');
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
