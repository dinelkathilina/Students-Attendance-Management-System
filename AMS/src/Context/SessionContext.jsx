import React, { createContext, useContext, useState, useEffect } from 'react';
import authservice from '../../services/authservice';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);

  const fetchActiveSession = async () => {
    const activeSession = await authservice.getActiveSession();
    if (activeSession) {
      setSessionData({
        ...activeSession,
        timeRemaining: activeSession.remainingTime
      });
    } else {
      setSessionData(null);
    }
  };

  useEffect(() => {
    fetchActiveSession();
    const intervalId = setInterval(fetchActiveSession, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let timer;
    if (sessionData && sessionData.timeRemaining > 0) {
      timer = setInterval(() => {
        setSessionData(prevData => {
          if (prevData.timeRemaining <= 1) {
            clearInterval(timer);
            return null;
          }
          return {
            ...prevData,
            timeRemaining: prevData.timeRemaining - 1
          };
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [sessionData]);

  const startSession = (data) => {
    setSessionData({
      ...data,
      timeRemaining: data.timeRemaining || data.expirationMinutes * 60
    });
  };

  const endSession = () => {
    setSessionData(null);
  };

  const refreshSession = () => {
    fetchActiveSession();
  };

  return (
    <SessionContext.Provider value={{ sessionData, startSession, endSession, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};