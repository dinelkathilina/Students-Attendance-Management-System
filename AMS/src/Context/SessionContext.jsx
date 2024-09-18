import React, { useState, useEffect, createContext, useContext } from 'react';
import signalRService from '../../services/signalRService';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(() => {
    const savedSession = localStorage.getItem('sessionData');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      return parsedSession;
    }
    return null;
  });

  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        await signalRService.startConnection();
        console.log('SignalR connection initialized');
        signalRService.onNewCheckIn((attendanceInfo) => {
          setSessionData(prevData => {
            if (!prevData) return null;
            const updatedData = {
              ...prevData,
              attendees: [...(prevData.attendees || []), attendanceInfo]
            };
            localStorage.setItem('sessionData', JSON.stringify(updatedData));
            return updatedData;
          });
        });
      } catch (error) {
        console.error('Error initializing SignalR:', error);
      }
    };

    initializeSignalR();

    const timer = setInterval(() => {
      if (sessionData) {
        const now = new Date();
        const expirationTime = new Date(sessionData.expirationTime);
        const timeRemaining = Math.max(0, Math.floor((expirationTime - now) / 1000));

        if (timeRemaining <= 0) {
          clearInterval(timer);
          localStorage.removeItem('sessionData');
          setSessionData(null);
          signalRService.leaveSession(sessionData.sessionCode).catch(console.error);
        } else {
          setSessionData(prevData => ({
            ...prevData,
            timeRemaining
          }));
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (sessionData) {
        signalRService.leaveSession(sessionData.sessionCode).catch(console.error);
      }
      signalRService.stopConnection().catch(console.error);
    };
  }, [sessionData]);

  const startSession = async (data) => {
    const sessionWithTime = {
      ...data,
      attendees: []
    };
    setSessionData(sessionWithTime);
    localStorage.setItem('sessionData', JSON.stringify(sessionWithTime));
    await signalRService.joinSession(data.sessionCode);
  };

  const endSession = async () => {
    if (sessionData) {
      await signalRService.leaveSession(sessionData.sessionCode);
    }
    setSessionData(null);
    localStorage.removeItem('sessionData');
  };

  return (
    <SessionContext.Provider value={{ sessionData, startSession, endSession, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};