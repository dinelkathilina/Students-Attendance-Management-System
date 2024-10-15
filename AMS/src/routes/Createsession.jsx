import React, { useState, useEffect, useCallback } from "react";

import { toast } from "react-toastify";
import authservice from "../../services/authservice";
import { useSession } from "../Context/SessionContext";
import signalRService from "../../services/signalRService";
export const Createsession = () => {
  const {
    sessionData,
    startSession,
    endSession,
    refreshSession,
    generateQRCode,
  } = useSession();
  const [data, setData] = useState({ courses: [], lectureHalls: [] });
  const [formData, setFormData] = useState({
    course: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    lectureHall: "",
    expirationMinutes: 5,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await authservice.getLecturerCourses();
        const lectureHalls = await authservice.getLectureHalls();
        setData({ courses, lectureHalls });
        await refreshSession();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchData();
    signalRService.startConnection();

    return () => {
      signalRService.stopConnection();
    };
  }, [refreshSession]);

 /* useEffect(() => {
    if (sessionData && !sessionData.qrCodeUrl) {
      generateQRCode(sessionData.sessionCode).then((url) => {});
    }
  }, [sessionData, generateQRCode]);*/

  useEffect(() => {
    if (sessionData) {
      signalRService.joinSession(sessionData.sessionCode);
    }
  }, [sessionData]);

  const openQRCodeInNewTab = useCallback(() => {
    if (sessionData && sessionData.qrCodeUrl) {
      const newTab = window.open();
      newTab.document.write(`
        <html>
          <head>
            <title>QR Code for Session: ${sessionData.sessionCode}</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #1a202c;
              }
              img {
                max-width: 80vmin;
                max-height: 80vmin;
              }
                .qr-container {
                  width: 100%;
                  max-width: 500px;
                  max-height: 500px;
                }
                
            </style>
          </head>
          <body>
            <div class="qr-container">
                ${sessionData.qrCodeUrl}
              </div>
          </body>
        </html>
      `);
      newTab.document.close();
    }
  }, [sessionData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.course) errors.course = "Please select a course";
    if (!formData.startTime) errors.startTime = "Please enter a start time";
    if (!formData.endTime) errors.endTime = "Please enter an end time";
    if (!formData.lectureHall)
      errors.lectureHall = "Please select a lecture hall";
    if (!formData.expirationMinutes)
      errors.expirationMinutes = "Please enter expiration time";

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
    if (endDateTime <= startDateTime)
      errors.endTime = "End time must be after start time";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (sessionData) {
        toast.error(
          "A session is already active. Please wait for it to expire or end it manually."
        );
        return;
      }
      if (!validateForm()) return;
      setShowConfirmDialog(true);
    },
    [sessionData, validateForm]
  );

  const confirmCreateSession = useCallback(async () => {
    setShowConfirmDialog(false);
    try {
      const newSessionData = {
        courseID: parseInt(formData.course, 10),
        lectureHallID: parseInt(formData.lectureHall, 10),
        date: formData.date,
        lectureStartTime: formData.startTime,
        lectureEndTime: formData.endTime,
        qrCodeExpirationMinutes: parseInt(formData.expirationMinutes, 10),
      };

      console.log(
        "Sending session data:",
        JSON.stringify(newSessionData, null, 2)
      );
      const response = await authservice.createSession(newSessionData);
      console.log("Session creation response:", response);

      // Generate QR Code
      const qrCodeSvg = await generateQRCode(response.sessionCode);

      const fullSessionData = {
        ...response,
        remainingTime:
          (new Date(response.expirationTime) -
            new Date(response.creationTime)) /
          1000,
        qrCodeUrl: qrCodeSvg,
      };

      startSession(fullSessionData);
      await signalRService.joinSession(response.sessionCode);
      signalRService.onNewCheckIn((attendanceInfo) => {
        toast.success(`${attendanceInfo.studentName} checked in!`);
      });

      toast.success("Session created successfully!");
    } catch (error) {
      console.error("Error creating session:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      toast.error(
        `Failed to create session: ${error.message || "Please try again."}`
      );
    }
  }, [formData, startSession, generateQRCode]);

  const handleEndSession = useCallback(async () => {
    if (window.confirm("Are you sure you want to end the current session?")) {
      try {
        await signalRService.leaveSession(sessionData.sessionCode);
        await endSession();
        await refreshSession();
        toast.info("Session ended successfully.");
      } catch (error) {
        console.error("Error ending session:", error);
        toast.error("Failed to end session. Please try again.");
      }
    }
  }, [endSession, refreshSession, sessionData]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-white text-center">Loading session data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-center justify-center p-4">
        <main className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {sessionData ? (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Active Session
              </h2>
              <p className="text-white">
                Session Code: {sessionData.sessionCode}
              </p>
              <p className="text-white">
                Time Remaining: {formatTime(sessionData.timeRemaining)}
              </p>
              <div className="flex flex-col items-center">
                {sessionData.qrCodeUrl ? (
                  <>
                    {/* Small QR Code display */}
                    <div className="w-48 h-48 mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sessionData.qrCodeUrl,
                        }}
                      />
                    </div>
                    <button
                      onClick={openQRCodeInNewTab}
                      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Open QR Code in New Tab
                    </button>
                  </>
                ) : (
                  <p className="text-white mb-4">QR Code not available</p>
                )}
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
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Create Session
              </h2>
              {formErrors.fetchError && (
                <p className="text-red-500 text-sm">{formErrors.fetchError}</p>
              )}
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {data.courses.map((course) => (
                      <option key={course.courseID} value={course.courseID}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  {formErrors.course && (
                    <p className="text-red-500 text-sm">{formErrors.course}</p>
                  )}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    />
                    {formErrors.startTime && (
                      <p className="text-red-500 text-sm">
                        {formErrors.startTime}
                      </p>
                    )}
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
                    />
                    {formErrors.endTime && (
                      <p className="text-red-500 text-sm">
                        {formErrors.endTime}
                      </p>
                    )}
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
                  {formErrors.lectureHall && (
                    <p className="text-red-500 text-sm">
                      {formErrors.lectureHall}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="expirationMinutes"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    QR Code Expiration Time (minutes)
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
                  />
                  {formErrors.expirationMinutes && (
                    <p className="text-red-500 text-sm">
                      {formErrors.expirationMinutes}
                    </p>
                  )}
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
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Session Creation
            </h3>
            <p className="text-white mb-4">
              Are you sure you want to create this session?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmCreateSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
