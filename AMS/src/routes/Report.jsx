import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import authservice from "../../services/authservice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export const Report = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        const data = await authservice.getAttendanceReport();
        setAttendanceData(data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch attendance report. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchAttendanceReport();
  }, []);

  const generatePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const elements = printRef.current.getElementsByClassName("course-report");

    for (let i = 0; i < elements.length; i++) {
      if (i !== 0) {
        pdf.addPage();
      }

      const element = elements[i];
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    pdf.save("attendance_report.pdf");
  };

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const filteredData = selectedCourse
    ? attendanceData.filter(
        (course) => course.courseId === parseInt(selectedCourse)
      )
    : attendanceData;

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-start justify-center p-4">
        <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-3xl text-white font-bold mb-6">
            Attendance Report
          </h1>

          <div className="mb-6 flex justify-between items-center">
            <select
              className="bg-gray-700 text-white rounded-md px-4 py-2"
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option value="">All Courses</option>
              {attendanceData.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
            <button
              onClick={generatePDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save as PDF
            </button>
          </div>

          <div ref={printRef}>
            {filteredData.map((course) => (
              <div
                key={course.courseId}
                className="mb-8 bg-gray-700 rounded-lg p-6 course-report"
              >
                <h2 className="text-2xl text-white font-semibold mb-4">
                  {course.courseName}
                </h2>
                <p className="text-gray-300 mb-4">
                  Total Sessions: {course.totalSessions}
                </p>

                <div className="mb-6" style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={course.students}>
                      <XAxis dataKey="studentName" tick={{ fill: "white" }} />
                      <YAxis tick={{ fill: "white" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#4B5563",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="attendancePercentage"
                        fill="#10B981"
                        name="Attendance %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto text-xs sm:text-sm">
                  {" "}
                  {/* Reduced font size */}
                  <table className="w-full text-left text-gray-300">
                    <thead className="uppercase bg-gray-600">
                      <tr>
                        <th scope="col" className="px-4 py-2">
                          Student Name
                        </th>
                        <th scope="col" className="px-4 py-2">
                          Attended Sessions
                        </th>
                        <th scope="col" className="px-4 py-2">
                          Attendance Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.students.map((student) => (
                        <tr
                          key={student.studentId}
                          className="border-b bg-gray-800 border-gray-700"
                        >
                          <td className="px-4 py-2">{student.studentName}</td>
                          <td className="px-4 py-2">
                            {student.attendedSessions}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${student.attendancePercentage}%`,
                                  }}
                                ></div>
                              </div>
                              <span>
                                {student.attendancePercentage.toFixed(2)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
