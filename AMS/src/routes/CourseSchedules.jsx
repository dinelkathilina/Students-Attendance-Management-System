import React, { useState, useEffect } from 'react';
import authservice from "../Services/authservice.js";
import CourseScheduleDisplay from "../Components/CourseScheduleDisplay";

export const CourseSchedules = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authservice.getProfile();
        if (user) {
          setUserName(user.name || "Lecturer");
        }

        const coursesData = await authservice.getLecturerCoursesTime();
        setCourses(coursesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDayName = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CourseScheduleDisplay
      courses={courses}
      isLoading={isLoading}
      error={error}
      userName={userName}
      getDayName={getDayName}
      formatTime={formatTime}
    />
  );
};

export default CourseSchedules;