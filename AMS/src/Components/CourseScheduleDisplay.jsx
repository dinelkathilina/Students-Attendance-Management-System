import React from 'react';

const CourseScheduleDisplay = ({ courses, isLoading, error, userName, getDayName, formatTime }) => {
  return (
    <div className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 p-6 mb-4 bg-gray-50 dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Welcome, {userName}
      </h2>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                {course.courseName}
              </h3>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
                  Upcoming Lectures
                </h4>
                <ul className="space-y-2">
                  {course.upcomingLectures.length > 0 ? (
                    course.upcomingLectures.map((lecture, index) => (
                      <li
                        key={index}
                        className="text-sm bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 py-2 px-3 rounded-md"
                      >
                        <span className="font-medium">
                          {getDayName(lecture.day)}
                        </span>
                        , {formatTime(lecture.startTime)} -{" "}
                        {formatTime(lecture.endTime)}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No upcoming lectures
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
                  Earlier Lectures
                </h4>
                <ul className="space-y-2">
                  {course.earlierLectures.length > 0 ? (
                    course.earlierLectures.map((lecture, index) => (
                      <li
                        key={index}
                        className="text-sm bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 py-2 px-3 rounded-md"
                      >
                        <span className="font-medium">
                          {getDayName(lecture.day)}
                        </span>
                        , {formatTime(lecture.startTime)} -{" "}
                        {formatTime(lecture.endTime)}
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
  );
};

export default CourseScheduleDisplay;