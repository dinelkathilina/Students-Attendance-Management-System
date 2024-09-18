import React, { useState, useEffect } from 'react';
import { useSession } from "../Context/SessionContext";
import signalRService from '../../services/signalRService';

 const  RealtimeCheckins = () => {
  const { sessionData } = useSession();
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    if (sessionData && sessionData.sessionCode) {
      signalRService.joinSession(sessionData.sessionCode);
      
      signalRService.onNewCheckIn((attendanceInfo) => {
        setCheckins(prevCheckins => [...prevCheckins, attendanceInfo]);
      });
    }

    return () => {
      if (sessionData && sessionData.sessionCode) {
        signalRService.leaveSession(sessionData.sessionCode);
      }
      signalRService.offNewCheckIn();
    };
  }, [sessionData]);

  if (!sessionData || !sessionData.sessionCode) {
    return <p className="text-white">No active session.</p>;
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