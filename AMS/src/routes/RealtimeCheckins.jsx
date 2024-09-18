import React, { useState, useEffect } from 'react';
import { useSession } from "../Context/SessionContext";
import signalRService from '../../services/signalRService';

const RealtimeCheckins = () => {
  const { sessionData } = useSession();
  const [checkins, setCheckins] = useState([]);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeSignalR = async () => {
      if (sessionData && sessionData.sessionCode) {
        try {
          await signalRService.startConnection();
          await signalRService.joinSession(sessionData.sessionCode);
          setConnectionError(null);
          
          signalRService.onNewCheckIn((attendanceInfo) => {
            if (isMounted) {
              setCheckins(prevCheckins => [...prevCheckins, attendanceInfo]);
            }
          });
        } catch (error) {
          console.error('Error initializing SignalR:', error);
          if (isMounted) {
            setConnectionError('Failed to connect to real-time updates. Please refresh the page.');
          }
        }
      }
    };

    initializeSignalR();

    return () => {
      isMounted = false;
      if (sessionData && sessionData.sessionCode) {
        signalRService.leaveSession(sessionData.sessionCode).catch(console.error);
      }
      signalRService.offNewCheckIn();
    };
  }, [sessionData]);

  if (!sessionData || !sessionData.sessionCode) {
    return <p className="text-white">No active session.</p>;
  }

  if (connectionError) {
    return <p className="text-red-500">{connectionError}</p>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-4">Real-time Check-ins</h2>
      <p className="text-white mb-4">Session Code: {sessionData.sessionCode}</p>
      <ul className="space-y-2">
        {checkins.map((checkin, index) => (
          <li key={index} className="bg-gray-700 p-3 rounded">
            <p className="text-white">{checkin.StudentName}</p>
            <p className="text-gray-300 text-sm">
              {new Date(checkin.CheckInTime).toLocaleTimeString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealtimeCheckins;