import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../Components/CustomDatePicker";
import QRCode from "qrcode.react";

export const Createsession = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    course: "",
    date: "",
    startTime: "",
    endTime: "",
    lectureHall: "",
  });
  const [sessionCode, setSessionCode] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date: date,
    }));
  };

  const generateSessionCode = () => {
    const { course, date, startTime, endTime, lectureHall } = formData;
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${course}-${date}-${startTime}-${endTime}-${lectureHall}-${randomCode}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = generateSessionCode();
    setSessionCode(code);
    console.log("Form submitted with data:", formData);
    console.log("Generated session code:", code);
    // Here you would typically send the data to your backend
  };

  return (
<div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-center justify-center  p-4">
        <main className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-white text-center">Create Session</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-1">
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
                  <option value="CS101">CS101</option>
                  <option value="CS102">CS102</option>
                  <option value="CS103">CS103</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <CustomDatePicker
                  value={formData.date}
                  onChange={handleDateChange}
                  placeholder="Select date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-1">
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
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-1">
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
                <label htmlFor="lectureHall" className="block text-sm font-medium text-gray-300 mb-1">
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
                  <option value="MainAuditorium">Main Auditorium</option>
                  <option value="PLT1">PLT1</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Create Session
              </button>
            </form>
          </div>

          {sessionCode && (
            <div className="bg-gray-900 p-6 text-center">
              <h3 className="text-lg font-semibold mb-2 text-white">Session Code:</h3>
              <p className="mb-4 break-all text-white">{sessionCode}</p>
              <div className="flex justify-center">
                <QRCode value={sessionCode} size={200} bgColor="transparent" fgColor="white" />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};