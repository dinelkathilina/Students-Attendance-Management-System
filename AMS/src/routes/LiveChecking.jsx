import React, { useEffect, useState } from "react";
import signalRService from "../../services/signalRService";
import { useSession } from "../Context/SessionContext";
const LiveChecking = () => {
  const [checkedInStudents, setCheckedInStudents] = useState([]);
  const { sessionData } = useSession();
  useEffect(() => {
    if (sessionData) {
      signalRService.onNewCheckIn((studentInfo) => {
        setCheckedInStudents((prev) => [...prev, studentInfo]);
      });
    }

    return () => {
      signalRService.offNewCheckIn();
    };
  }, [sessionData]);

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
    <>
      <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
        <div className="flex-grow flex items-start justify-center p-4">
          <div className="container mx-2 p-6">
            <h1 className="text-3xl text-white font-bold mb-6">
              Live Check-in
            </h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl text-white font-semibold mb-4">
                Session Code: {sessionData.sessionCode}
              </h2>
              <ul className="space-y-2">
                {checkedInStudents.map((student, index) => (
                  <li
                    key={index}
                    className="bg-gray-700 p-3 rounded-md text-white"
                  >
                    <p className="font-semibold">{student.studentName}</p>
                    <p className="text-sm text-gray-300">
                      Checked in at:{" "}
                      {new Date(student.checkInTime).toLocaleTimeString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveChecking;
