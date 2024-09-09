import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(() => {
    const savedSession = localStorage.getItem('sessionData');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  useEffect(() => {
    if (sessionData) {
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    } else {
      localStorage.removeItem('sessionData');
    }
  }, [sessionData]);

  const startSession = (data) => {
    setSessionData(data);
  };

  const endSession = () => {
    setSessionData(null);
  };

  const updateRemainingTime = (time) => {
    setSessionData(prevData => ({ ...prevData, timeRemaining: time }));
  };

  return (
    <SessionContext.Provider value={{ sessionData, startSession, endSession, updateRemainingTime }}>
      {children}
    </SessionContext.Provider>
  );
};