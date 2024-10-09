import React, { useState, useEffect } from "react";
import { initFlowbite } from "flowbite";
import authservice from "../../services/authservice";
import { toast } from "react-toastify";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    courseName: "",
    semester: "",
    courseTimes: [{ day: 0, startTime: "", endTime: "" }],
  });
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initFlowbite();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const fetchedCourses = await authservice.getLecturerCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      setError("Failed to fetch courses. Please try again later.");
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, index = null) => {
    if (index !== null) {
      const updatedTimes = [...formData.courseTimes];
      if (e.target.name === "day") {
        updatedTimes[index] = {
          ...updatedTimes[index],
          [e.target.name]: parseInt(e.target.value, 10),
        };
      } else {
        updatedTimes[index] = {
          ...updatedTimes[index],
          [e.target.name]: e.target.value,
        };
      }
      setFormData({ ...formData, courseTimes: updatedTimes });
    } else {
      if (e.target.name === "semester") {
        setFormData({
          ...formData,
          [e.target.name]: parseInt(e.target.value, 10),
        });
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }
    }
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      courseTimes: [
        ...formData.courseTimes,
        { day: 0, startTime: "", endTime: "" },
      ],
    });
  };

  const removeTimeSlot = (index) => {
    const updatedTimes = formData.courseTimes.filter((_, i) => i !== index);
    setFormData({ ...formData, courseTimes: updatedTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const courseData = {
        ...formData,
        semester: parseInt(formData.semester, 10),
      };
      console.log("Payload being sent:", JSON.stringify(courseData, null, 2));
      
      let response;
      if (editingCourse) {
        console.log("Updating course with ID:", editingCourse.courseID);
        response = await authservice.updateCourse(editingCourse.courseID, courseData);
        console.log("Update response:", response);
        
        if (response && (response.success || response.courseID)) {
          toast.success("Course updated successfully");
          setIsModalOpen(false);
          setEditingCourse(null);
          resetFormData();
          
          // Update the local state directly
          setCourses(prevCourses => prevCourses.map(course => 
            course.courseID === editingCourse.courseID ? {...course, ...courseData} : course
          ));
          
          // Optionally, still fetch courses to ensure consistency with server
          await fetchCourses();
        } else {
          toast.error("Failed to update course. Please try again.");
        }
      } else {
        response = await authservice.createCourse(courseData);
        console.log("Create response:", response);
        
        if (response && response.courseID) {
          toast.success("Course created successfully");
          setIsModalOpen(false);
          setEditingCourse(null);
          resetFormData();
          await fetchCourses();
        } else {
          toast.error("Failed to create course. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving course:", error);
      if (error.response && error.response.data) {
        toast.error(typeof error.response.data === 'string' ? error.response.data : 'An error occurred while saving the course.');
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save course. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourseId(course.courseID);
  };

  const handleDelete = (courseId) => {
    setDeletingCourseId(courseId);
  };

  const openEditModal = () => {
    const courseToEdit = courses.find(
      (course) => course.courseID === editingCourseId
    );
    if (courseToEdit) {
      setEditingCourse(courseToEdit);
      setFormData({
        courseName: courseToEdit.courseName,
        semester: courseToEdit.semester.toString(),
        courseTimes: courseToEdit.courseTimes.map((ct) => ({
          day: ct.day,
          startTime: ct.startTime,
          endTime: ct.endTime,
        })),
      });
      setIsModalOpen(true);
      setEditingCourseId(null); // Clear the editing course ID
    }
  };

  const confirmDelete = async () => {
    try {
      await authservice.deleteCourse(deletingCourseId);
      await fetchCourses();
      setDeletingCourseId(null);
      toast.success("Course deleted successfully");
    } catch (error) {
      setError("Failed to delete course. Please try again.");
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again."); 

    }
  };

  const resetFormData = () => {
    setFormData({
      courseName: "",
      semester: "",
      courseTimes: [{ day: 0, startTime: "", endTime: "" }],
    });
  };

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
    return <div className="text-center text-white">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-start justify-center p-4">
        <div className="container mx-2 p-6">
          <h1 className="text-3xl text-white font-bold mb-6">Manage Courses</h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingCourse(null);
              resetFormData();
            }}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4"
            type="button"
          >
            Add New Course
          </button>

          {/* Course list */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.courseID}
                className="bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl text-white font-semibold mb-2">
                  {course.courseName}
                </h3>
                <p className="text-gray-200 mb-1">
                  Semester: {course.semester}
                </p>
                {course.courseTimes.map((ct, index) => (
                  <p key={index} className="text-gray-200 mb-1">
                    {getDayName(ct.day)}: {ct.startTime} - {ct.endTime}
                  </p>
                ))}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.courseID)}
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Course Form Modal */}
          {(isModalOpen || editingCourse) && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
              id="my-modal"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCourse(null);
                resetFormData();
              }}
            >
              <div
                className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              >
                <div className="mt-3">
                  <h3 className="text-lg leading-6 font-medium mb-2">
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-2">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="courseName"
                      >
                        Course Name
                      </label>
                      <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="semester"
                      >
                        Semester
                      </label>
                      <input
                        type="number"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      />
                    </div>
                    {formData.courseTimes.map((timeSlot, index) => (
                      <div key={index} className="mb-4 border-t pt-4">
                        <div className="mb-2">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor={`day-${index}`}
                          >
                            Day
                          </label>
                          <select
                            name="day"
                            value={timeSlot.day}
                            onChange={(e) => handleInputChange(e, index)}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          >
                            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                              <option key={day} value={day}>
                                {getDayName(day)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor={`startTime-${index}`}
                          >
                            Start Time
                          </label>
                          <input
                            type="time"
                            name="startTime"
                            value={timeSlot.startTime}
                            onChange={(e) => handleInputChange(e, index)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor={`endTime-${index}`}
                          >
                            End Time
                          </label>
                          <input
                            type="time"
                            name="endTime"
                            value={timeSlot.endTime}
                            onChange={(e) => handleInputChange(e, index)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                          >
                            Remove Time Slot
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                      Add Time Slot
                    </button>
                    <div className="flex justify-between mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setEditingCourse(null);
                          resetFormData();
                        }}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deletingCourseId && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
              id="delete-modal"
              onClick={() => setDeletingCourseId(null)}
            >
              <div
                className="relative p-5 border w-96 shadow-lg rounded-md bg-gray-800 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-medium leading-6 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-sm mb-4">
                  Are you sure you want to delete this course?
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeletingCourseId(null)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Confirmation Modal */}
          {editingCourseId && (
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
              id="edit-modal"
              onClick={() => setEditingCourseId(null)}
            >
              <div
                className="relative p-5 border w-96 shadow-lg rounded-md bg-gray-800 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-medium leading-6 mb-4">
                  Confirm Edit
                </h3>
                <p className="text-sm mb-4">
                  Are you sure you want to edit this course?
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={openEditModal}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setEditingCourseId(null)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
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
