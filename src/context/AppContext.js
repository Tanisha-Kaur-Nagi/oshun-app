import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: 1, username: 'Student' });
  const [stats, setStats] = useState({
    totalMinutes: 0,
    sessionCount: 0,
    avgCompletion: 0
  });

  return (
    <AppContext.Provider
      value={{
        user,
        stats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
