import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authservice from '../../services/authservice';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);

  const fetchActiveSession = useCallback(async () => {
    try {
      const activeSession = await authservice.getActiveSession();
      if (activeSession) {
        setSessionData({
          ...activeSession,
          timeRemaining: activeSession.remainingTime
        });
      } else {
        setSessionData(null);
      }
    } catch (error) {
      console.error("Error fetching active session:", error);
    }
  }, []);

  useEffect(() => {
    fetchActiveSession();
    const intervalId = setInterval(fetchActiveSession, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, [fetchActiveSession]);

  useEffect(() => {
    let timer;
    if (sessionData && sessionData.timeRemaining > 0) {
      timer = setInterval(() => {
        setSessionData(prevData => {
          if (!prevData || prevData.timeRemaining <= 1) {
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

  const startSession = useCallback((data) => {
    setSessionData({
      ...data,
      timeRemaining: data.timeRemaining || data.expirationMinutes * 60,
    });
  }, []);

  const endSession = useCallback(async () => {
    if (sessionData) {
      await authservice.endSession(sessionData.sessionID);
      setSessionData(null);
    }
  }, [sessionData]);

  const refreshSession = useCallback(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  return (
    <SessionContext.Provider value={{ 
      sessionData, 
      startSession, 
      endSession, 
      refreshSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
};