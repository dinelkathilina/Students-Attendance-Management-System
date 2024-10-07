import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useSession } from "../Context/SessionContext";
import authservice from "../../services/authservice";

export const Createsession = () => {
  const { sessionData, startSession, endSession, refreshSession } =
    useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    courses: [],
    lectureHalls: [],
  });
  const [formData, setFormData] = useState({
    course: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    lectureHall: "",
    expirationMinutes: 5,
  });

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        const [coursesData, lectureHallsData] = await Promise.all([
          authservice.getLecturerCourses(),
          authservice.getLectureHalls(),
        ]);
        await refreshSession();

        const endTime = Date.now();
        const loadTime = endTime - startTime;
        const remainingTime = Math.max(1000 - loadTime, 0);

        // Ensure a minimum loading time of 1 second
        setTimeout(() => {
          setData({
            courses: coursesData,
            lectureHalls: lectureHallsData,
          });
          setIsLoading(false);
        }, remainingTime);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    fetchData();
  }, [refreshSession]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEndSession = async () => {
    if (window.confirm("Are you sure you want to end the current session?")) {
      await endSession();
      await refreshSession();
    }
  };

  const generateSessionCode = () => {
    const { course, date, startTime, endTime, lectureHall } = formData;
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${course}-${date}-${startTime}-${endTime}-${lectureHall}-${randomCode}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sessionData) {
      alert("A session is already active. Please wait for it to expire.");
      return;
    }

    try {
      const creationTime = new Date(`${formData.date}T${formData.startTime}`);
      const expirationTime = new Date(
        creationTime.getTime() + formData.expirationMinutes * 60000
      );
      const generatedSessionCode = generateSessionCode();

      const newSessionData = {
        courseID: parseInt(formData.course, 10),
        lectureHallID: parseInt(formData.lectureHall, 10),
        creationTime: creationTime.toISOString(),
        sessionCode: generatedSessionCode,
        expirationTime: expirationTime.toISOString(),
        timeRemaining: formData.expirationMinutes * 60,
      };

      const response = await authservice.createSession(newSessionData);
      startSession({
        ...newSessionData,
        sessionCode: response.sessionCode,
      });
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  const openLargeQRCodeInNewTab = useCallback(() => {
    if (!sessionData) return;
    const canvas = document.createElement("canvas");
    QRCode.toCanvas(
      canvas,
      sessionData.sessionCode,
      {
        width: 1000,
        height: 1000,
        color: {
          dark: "#FFF",
          light: "#1a202c",
        },
      },
      (error) => {
        if (error) console.error(error);
        const dataUrl = canvas.toDataURL("image/png");
        const newTab = window.open();
        newTab.document.write(`
        <html>
          <head>
            <title>Large QR Code for Session: ${sessionData.sessionCode}</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #1a202c;
              }
              img {
                max-width: 90vmin;
                max-height: 90vmin;
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Large QR Code">
          </body>
        </html>
      `);
        newTab.document.close();
      }
    );
  }, [sessionData]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-white text-center">Loading session data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-center justify-center  p-4">
        <main className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {sessionData ? (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">
                Active Session
              </h2>
              <p className="text-white">
                Session Code: {sessionData.sessionCode}
              </p>
              <p className="text-white">
                Time Remaining: {formatTime(sessionData.timeRemaining)}
              </p>
              <div className="flex flex-col items-center">
                <canvas
                  ref={(el) => {
                    if (el && sessionData) {
                      QRCode.toCanvas(
                        el,
                        sessionData.sessionCode,
                        {
                          width: 200,
                          color: {
                            dark: "#FFF",
                            light: "#1a202c",
                          },
                        },
                        (error) => {
                          if (error) console.error(error);
                        }
                      );
                    }
                  }}
                />
                <button
                  onClick={openLargeQRCodeInNewTab}
                  className="mt-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
                >
                  Open Large QR Code
                </button>
              </div>
              <button
                onClick={handleEndSession}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                End Session
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">
                Create Session
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Select your Course
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {data.courses.map((course) => (
                      <option key={course.courseID} value={course.courseID}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    value={formData.date}
                    readOnly
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startTime"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Start time
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endTime"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      End time
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lectureHall"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Lecture Hall
                  </label>
                  <select
                    id="lectureHall"
                    name="lectureHall"
                    value={formData.lectureHall}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a lecture hall</option>
                    {data.lectureHalls.map((hall) => (
                      <option
                        key={hall.lectureHallID}
                        value={hall.lectureHallID}
                      >
                        {hall.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="expirationMinutes"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Expiration Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="expirationMinutes"
                    name="expirationMinutes"
                    value={formData.expirationMinutes}
                    onChange={handleInputChange}
                    min="1"
                    max="60"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Create Session
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
