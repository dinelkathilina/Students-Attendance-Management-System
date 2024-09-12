import React, { useState } from "react";
import { initFlowbite } from "flowbite";
import { useEffect } from "react";

const ManageCourses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseName: "Introduction to React",
      courseId: "CSE101",
      startTime: "09:00",
      endTime: "10:30",
      day: "Monday",
    },
    {
      id: 2,
      courseName: "Advanced JavaScript",
      courseId: "CSE202",
      startTime: "11:00",
      endTime: "12:30",
      day: "Wednesday",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    courseName: "",
    courseId: "",
    startTime: "",
    endTime: "",
    day: "",
  });
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  useEffect(() => {
    initFlowbite();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id
            ? { ...formData, id: course.id }
            : course
        )
      );
    } else {
      setCourses([...courses, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({
      courseName: "",
      courseId: "",
      startTime: "",
      endTime: "",
      day: "",
    });
  };

  const handleEdit = (courseId) => {
    const courseToEdit = courses.find((course) => course.id === courseId);
    setEditingCourseId(courseId);
    setEditingCourse(courseToEdit);
  };

  const openEditModal = () => {
    const courseToEdit = courses.find(
      (course) => course.id === editingCourseId
    );
    setEditingCourse(courseToEdit);
    setFormData(courseToEdit);
    setIsModalOpen(true);
    setEditingCourseId(null);
  };

  const cancelEdit = () => {
    setEditingCourseId(null);
  };

  const handleDelete = (courseId) => {
    setDeletingCourseId(courseId);
  };

  const confirmDelete = () => {
    setCourses(courses.filter((course) => course.id !== deletingCourseId));
    setDeletingCourseId(null);
  };

  const cancelDelete = () => {
    setDeletingCourseId(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-start justify-center p-4">
        <div className="container mx-2 p-6">
          <h1 className="text-3xl text-white font-bold mb-6">Manage Courses</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4"
            type="button"
          >
            Add New Course
          </button>

          {/* Course list */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl text-white font-semibold mb-2">
                  {course.courseName}
                </h3>
                <p className="text-gray-200 mb-1">ID: {course.courseId}</p>
                <p className="text-gray-200 mb-1">
                  Time: {course.startTime} - {course.endTime}
                </p>
                <p className="text-gray-200 mb-3">Day: {course.day}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(course.id)}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CRUD Modal */}
          {/* CRUD Modal */}
          {isModalOpen && (
            <div
              id="crud-modal"
              tabIndex="-1"
              aria-hidden="true"
              className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editingCourse ? "Edit Course" : "Create New Course"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingCourse(null);
                        setFormData({
                          courseName: "",
                          courseId: "",
                          startTime: "",
                          endTime: "",
                          day: "",
                        });
                      }}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <form onSubmit={handleSubmit} className="p-4 md:p-5">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="courseName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Course Name
                        </label>
                        <input
                          type="text"
                          name="courseName"
                          id="courseName"
                          value={formData.courseName}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type course name"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="courseId"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Course ID
                        </label>
                        <input
                          type="text"
                          name="courseId"
                          id="courseId"
                          value={formData.courseId}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type Course ID"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="day"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Day
                        </label>
                        <select
                          id="day"
                          name="day"
                          value={formData.day}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="">Select Day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="startTime"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Start time
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="endTime"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          End time
                        </label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        className="me-1 -ms-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {editingCourse ? "Update Course" : "Add new Course"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deletingCourseId && (
            <div
              id="popup-modal"
              tabIndex="-1"
              className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <svg
                      className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this course?
                    </h3>
                    <button
                      onClick={confirmDelete}
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={cancelDelete}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Confirmation Modal */}
          {editingCourseId && (
            <div
              id="edit-modal"
              tabIndex="-1"
              className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <svg
                      className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to edit this course?
                    </h3>
                    <button
                      onClick={openEditModal}
                      type="button"
                      className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={cancelEdit}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
