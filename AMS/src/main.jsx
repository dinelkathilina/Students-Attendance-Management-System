import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoute';
import { Student_Home } from './routes/Student_Home';
import { Lecture_Home } from './routes/Lecture_Home';
import { ErrorPage } from './ErrorPage';
import { Root } from './routes/Root';
import { Createsession } from "./routes/Createsession";
import App from "./App";
import { Signup } from "./routes/Signup";
import ManageCourses from "./routes/ManageCourses";
import { Report } from "./routes/Report";
import { CourseSchedules } from "./routes/CourseSchedules";
import "./index.css";
import LiveChecking from "./routes/LiveChecking";
import { StudentReport } from "./routes/StudentReport";
import StudentSchedule from "./routes/StudentSchedule";
import { ForgotPassword } from "./routes/ForgotPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Root />,
      },
      {
        path: "lecture_home",
        element: (
          <ProtectedRoute allowedRoles={["Lecturer"]}>
            <Lecture_Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "create_session",
            element: <Createsession />,
          },
          {
            path: "manage_courses",
            element: <ManageCourses />,
          },
          {
            path: "report",
            element: <Report />,
          },
          {
            path: "course_schedules",
            element: <CourseSchedules />,
          },
          {
            path: "view-check-in",
            element: <LiveChecking/>,
          },
        ],
      },
      {
        path: "student_home",
        element: (
          <ProtectedRoute allowedRoles={["Student"]}>
            <Student_Home />
          </ProtectedRoute>
        ),
        children:[
          {
            path: "attendance-report",
            element: <StudentReport />,
          },
          {
            path: "view-schedule",
            element: <StudentSchedule />
          }
        ]
      },
      {
        path: "register",
        element: <Signup />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "logout",
        element: <ProtectedRoute allowedRoles={["Student", "Lecturer"]}><div>Logging out...</div></ProtectedRoute>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

