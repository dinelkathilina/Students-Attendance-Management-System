import React from "react";

const CourseScheduleDisplay = ({
  courses = [],
  isLoading,
  error,
  userName,
  getDayName,
  formatTime,
}) => {
  const currentDay = new Date().getDay();
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const sortedCourses = courses.map((course) => ({
    ...course,
    upcomingLectures: course.upcomingLectures.sort((a, b) => {
      if (a.day === b.day) {
        return a.startTime.localeCompare(b.startTime);
      }
      return ((a.day - currentDay + 7) % 7) - ((b.day - currentDay + 7) % 7);
    }),
    earlierLectures: course.earlierLectures.sort((a, b) => {
      if (a.day === b.day) {
        return b.startTime.localeCompare(a.startTime);
      }
      return ((currentDay - a.day + 7) % 7) - ((currentDay - b.day + 7) % 7);
    }),
  }));

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-start justify-center p-4">
        <main className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100  dark:bg-gray-800 min-h-screen p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Welcome, {userName}
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className=" rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="bg-blue-500 dark:bg-blue-600 text-white p-4">
                      <h3 className="text-xl font-semibold">
                        {course.courseName}
                      </h3>
                    </div>

                    <div className="p-4">
                      <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        Upcoming Lectures
                      </h4>
                      <ul className="space-y-2 mb-6">
                        {course.upcomingLectures &&
                        course.upcomingLectures.length > 0 ? (
                          course.upcomingLectures.map((lecture, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 py-2 px-3 rounded-md"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                              <span className="font-medium mr-2">
                                {getDayName(lecture.day)}
                              </span>
                              <span>
                                {formatTime(lecture.startTime)} -{" "}
                                {formatTime(lecture.endTime)}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No upcoming lectures
                          </li>
                        )}
                      </ul>

                      <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        Earlier Lectures
                      </h4>
                      <ul className="space-y-2">
                        {course.earlierLectures &&
                        course.earlierLectures.length > 0 ? (
                          course.earlierLectures.map((lecture, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 py-2 px-3 rounded-md"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                              <span className="font-medium mr-2">
                                {getDayName(lecture.day)}
                              </span>
                              <span>
                                {formatTime(lecture.startTime)} -{" "}
                                {formatTime(lecture.endTime)}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No earlier lectures
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseScheduleDisplay;
