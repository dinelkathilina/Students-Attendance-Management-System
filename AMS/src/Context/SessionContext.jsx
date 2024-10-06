import React, { createContext, useContext, useState, useEffect } from 'react';
import authservice from '../../services/authservice';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveSession = async () => {
    setIsLoading(true);
    setError(null);
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
    } catch (err) {
      console.error('Error fetching active session:', err);
      setError('Failed to fetch active session');
      setSessionData(null);
    } finally {
      setIsLoading(false);
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

  const startSession = (data) => {
    setSessionData({
      ...data,
      timeRemaining: data.timeRemaining || data.expirationMinutes * 60
    });
  };

  const endSession = async () => {
    if (!sessionData) return;
    
    try {
      await authservice.endSession(sessionData.sessionID);
      setSessionData(null);
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session');
    }
  };

  const refreshSession = () => {
    fetchActiveSession();
  };

  return (
    <SessionContext.Provider value={{ 
      sessionData, 
      startSession, 
      endSession, 
      refreshSession,
      isLoading,
      error
    }}>
      {children}
    </SessionContext.Provider>
  );
};