import React, { useState, useEffect } from "react";
import authservice from "../../services/authservice";
import { toast } from "react-toastify";

export const StudentSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await authservice.getStudentSchedules();
        setScheduleData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setError("Failed to load schedule data");
        setIsLoading(false);
      }
    };

    fetchSchedule();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-white">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">My Schedule</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scheduleData.map((course) => (
          <div
            key={course.courseId}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {course.courseName}
            </h2>

            <div className="space-y-3">
              {[...course.upcomingLectures, ...course.earlierLectures]
                .sort((a, b) => {
                  // Sort by day first
                  if (a.day !== b.day) {
                    return a.day - b.day;
                  }
                  // Then by start time
                  return a.startTime.localeCompare(b.startTime);
                })
                .map((lecture, index) => (
                  <div
                    key={index}
                    className="flex items-center text-gray-300 bg-gray-700 rounded-lg p-3"
                  >
                    <span className="font-medium w-24">
                      {getDayName(lecture.day)}
                    </span>
                    <span>
                      {lecture.startTime} - {lecture.endTime}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSchedule;
