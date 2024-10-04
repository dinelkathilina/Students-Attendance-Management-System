import React, { useEffect, useState } from "react";
import signalRService from "../../services/signalRService";
import { useSession } from "../Context/SessionContext";
import authservice from "../../services/authservice";
import { parseISO, addMinutes, format } from "date-fns";


const LiveChecking = () => {
  const [checkedInStudents, setCheckedInStudents] = useState([]);
  const { sessionData } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (sessionData) {
        try {
          const response = await authservice.getCheckedInStudents(
            sessionData.sessionCode
          );
          setCheckedInStudents(response);
        } catch (error) {
          console.error("Error fetching initial check-in data:", error);
        }
      }
    };

    fetchInitialData();

    if (sessionData) {
      signalRService.joinSession(sessionData.sessionCode);
      signalRService.onNewCheckIn((studentInfo) => {
        setCheckedInStudents((prev) => [...prev, studentInfo]);
      });
    }

    return () => {
      if (sessionData) {
        signalRService.leaveSession(sessionData.sessionCode);
      }
      signalRService.offNewCheckIn();
    };
  }, [sessionData]);

  const handleRefresh = async () => {
    if (!sessionData) return;

    setIsRefreshing(true);
    try {
      const response = await authservice.getCheckedInStudents(
        sessionData.sessionCode
      );
      setCheckedInStudents(response);
    } catch (error) {
      console.error("Error refreshing check-in data:", error);
    }
    setIsRefreshing(false);
  };

  if (!sessionData) {
    return (
      <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
        <div className="flex-grow flex items-start justify-center p-4">
          <div className="container mx-2 p-6">
            <h1 className="text-3xl text-white font-bold mb-6">
              No active session
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-start justify-center p-4">
        <div className="container mx-2 p-6">
          <h1 className="text-3xl text-white font-bold mb-6">Live Check-in</h1>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl text-white font-semibold mb-4">
              Session Code: {sessionData.sessionCode}
            </h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            {checkedInStudents.length === 0 ? (
              <p className="text-white">No students have checked in yet.</p>
            ) : (
<ul className="space-y-2">
        {checkedInStudents.map((student, index) => {
          console.log("Received check-in time:", student.checkInTime);
          console.log(
            "User's timezone:",
            Intl.DateTimeFormat().resolvedOptions().timeZone
          );

          const checkInDate = parseISO(student.checkInTime);
          const localCheckInDate = addMinutes(checkInDate, 330); // Add 5 hours and 30 minutes

          return (
            <li
              key={index}
              className="bg-gray-700 p-3 rounded-md text-white"
            >
              <p className="font-semibold">{student.studentName}</p>
              <p className="text-sm text-gray-300">
                Checked in at:{" "}
                {format(localCheckInDate, "HH:mm:ss")}
              </p>
            </li>
          );
        })}
      </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChecking;
