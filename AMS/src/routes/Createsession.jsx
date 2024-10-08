import React, { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { toast } from "react-toastify";
import authservice from "../../services/authservice";
import { useSession } from "../Context/SessionContext";
import signalRService from "../../services/signalRService";
export const Createsession = () => {
  const { sessionData, startSession, endSession, refreshSession } =
    useSession();
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
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const getSriLankaDate = () => {
    const date = new Date();
    const sriLankaTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
    const [month, day, year] = sriLankaTime.split('/');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await authservice.getLecturerCourses();
        const lectureHalls = await authservice.getLectureHalls();
        setData({ courses, lectureHalls });
        await refreshSession();

        // Update the date in formData to ensure it's always current Sri Lanka date
        setFormData(prevData => ({
          ...prevData,
          date: getSriLankaDate()
        }));

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

  useEffect(() => {
    if (sessionData) {
      signalRService.joinSession(sessionData.sessionCode);
    }
  }, [sessionData]);


  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const activeSession = await authservice.getActiveSession();
        if (activeSession) {
          startSession({
            ...activeSession,
            timeRemaining: activeSession.remainingTime,
          });
        }
      } catch (error) {
        console.error("Error fetching active session:", error);
      }
    };

    fetchActiveSession();
  }, [startSession]);

  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "course") {
      try {
        const courseTime = await authservice.getCourseTime(value);
        if (courseTime) {
          setFormData((prevData) => ({
            ...prevData,
            startTime: courseTime.startTime,
            endTime: courseTime.endTime,
          }));
        }
      } catch (error) {
        console.error("Error fetching course time:", error);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          courseTime: "Failed to fetch course time",
        }));
      }
    }
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
    async (e) => {
      e.preventDefault();
      if (sessionData) {
        alert(
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
      // Convert local time to UTC for server
      const localDate = new Date(`${formData.date}T${formData.startTime}`);
      const utcCreationTime = new Date(localDate.toUTCString()).toISOString();
      
      const expirationTime = new Date(localDate.getTime() + formData.expirationMinutes * 60000);
      const utcExpirationTime = new Date(expirationTime.toUTCString()).toISOString();

      const localEndTime = new Date(`${formData.date}T${formData.endTime}`);
      const utcLectureEndTime = new Date(localEndTime.toUTCString()).toISOString();

      const newSessionData = {
        courseID: parseInt(formData.course, 10),
        lectureHallID: parseInt(formData.lectureHall, 10),
        creationTime: utcCreationTime,
        expirationTime: utcExpirationTime,
        lectureEndTime: utcLectureEndTime,
        expirationMinutes: formData.expirationMinutes,
      };

      const response = await authservice.createSession(newSessionData);
      const fullSessionData = {
        ...newSessionData,
        sessionCode: response.sessionCode,
        sessionID: response.sessionID,
        timeRemaining: formData.expirationMinutes * 60,
      };

      startSession(fullSessionData);
      await signalRService.joinSession(response.sessionCode);
      signalRService.onNewCheckIn((attendanceInfo) => {
        toast.success(`${attendanceInfo.studentName} checked in!`);
      });

      toast.success("Session created successfully!");
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session. Please try again.");
    }
  }, [formData, startSession]);
  //this useEffect to generate QR code when sessionData changes
  useEffect(() => {
    const generateQRCode = async () => {
      if (sessionData && sessionData.sessionCode) {
        try {
          const qrCodeDataUrl = await QRCode.toDataURL(
            sessionData.sessionCode,
            {
              width: 200,
              color: { dark: "#FFF", light: "#1a202c" },
            }
          );
          setQrCodeUrl(qrCodeDataUrl);
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      }
    };

    generateQRCode();
  }, [sessionData]);

  const handleEndSession = useCallback(async () => {
    if (window.confirm("Are you sure you want to end the current session?")) {
      try {
        await signalRService.leaveSession(sessionData.sessionCode);
        await endSession();
        await refreshSession();
        setQrCodeUrl("");
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
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="Session QR Code" className="mb-4" />
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
