import React, { createContext, useContext, useState, useEffect } from 'react';
import signalRService from '../../services/signalRService';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(() => {
    const savedSession = localStorage.getItem('sessionData');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      if (!parsedSession.timeRemaining) {
        const now = new Date();
        const expirationTime = new Date(parsedSession.expirationTime);
        parsedSession.timeRemaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
      }
      return parsedSession;
    }
    return null;
  });

  useEffect(() => {
    const initializeSignalR = async () => {
      await signalRService.startConnection();
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
    };

    initializeSignalR();

    let timer;
    if (sessionData && sessionData.timeRemaining > 0) {
      timer = setInterval(() => {
        setSessionData(prevData => {
          if (prevData.timeRemaining <= 1) {
            clearInterval(timer);
            localStorage.removeItem('sessionData');
            signalRService.leaveSession(prevData.sessionCode);
            return null;
          }
          const updatedData = {
            ...prevData,
            timeRemaining: prevData.timeRemaining - 1
          };
          localStorage.setItem('sessionData', JSON.stringify(updatedData));
          return updatedData;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      if (sessionData) {
        signalRService.leaveSession(sessionData.sessionCode);
      }
      signalRService.stopConnection();
    };
  }, [sessionData]);

  const startSession = async (data) => {
    const sessionWithTime = {
      ...data,
      timeRemaining: data.timeRemaining || data.expirationMinutes * 60,
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

  const updateRemainingTime = (time) => {
    setSessionData(prevData => {
      if (!prevData) return null;
      const updatedData = { ...prevData, timeRemaining: time };
      localStorage.setItem('sessionData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <SessionContext.Provider value={{ sessionData, startSession, endSession, updateRemainingTime }}>
      {children}
    </SessionContext.Provider>
  );
};