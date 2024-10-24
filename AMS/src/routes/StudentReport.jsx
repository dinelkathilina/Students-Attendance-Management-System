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

export const StudentReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        const data = await authservice.getStudentAttendanceReport();
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
    const element = printRef.current;
    
    try {
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

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));
      pdf.save("my_attendance_report.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const filteredData = selectedSemester
    ? attendanceData.filter((course) => course.semester === parseInt(selectedSemester))
    : attendanceData;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-white">Loading...</div>
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

  const semesters = [...new Set(attendanceData.map((course) => course.semester))].sort();

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-y-auto">
      <div className="flex-grow flex items-start justify-center p-4">
        <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl text-white font-bold">My Attendance Report</h1>
            <div className="flex gap-4">
              <select
                className="bg-gray-700 text-white rounded-md px-4 py-2"
                onChange={(e) => setSelectedSemester(e.target.value)}
                value={selectedSemester}
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
              <button
                onClick={generatePDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div ref={printRef} className="space-y-6">
            <div className="mb-8" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <XAxis dataKey="courseName" tick={{ fill: "white" }} />
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

            <div className="grid gap-6">
              {filteredData.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-gray-700 rounded-lg p-6"
                >
                  <h2 className="text-xl text-white font-semibold mb-2">
                    {course.courseName}
                  </h2>
                  <p className="text-gray-300 mb-1">
                    Semester: {course.semester}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex-grow bg-gray-600 rounded-full h-2.5 mr-4">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${course.attendancePercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white">
                      {course.attendancePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-gray-300">
                    <p>Attended: {course.attendedSessions} / {course.totalSessions} sessions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};