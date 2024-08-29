import React from "react";
import * as ReactDOM from "react-dom/client";
import ProtectedRoute from './routes/ProtectedRoute'
import {Student_Home} from './routes/Student_Home'
import {Lecture_Home} from './routes/Lecture_Home'
import {ErrorPage} from './ErrorPage'
import {Root} from './routes/Root'
import { Createsession } from "./routes/Createsession";
import App from "./App";

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { Signup } from "./routes/Signup";
import  ManageCourses  from "./routes/ManageCourses";


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
            element:<ManageCourses />,
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
      },
      {
        path: "register",
        element: <Signup />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);