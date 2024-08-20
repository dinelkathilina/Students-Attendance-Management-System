import React from "react";
import * as ReactDOM from "react-dom/client";
import ProtectedRoute from './routes/ProtectedRoute'
import {Student_Home} from './routes/Student_Home'
import {Lecture_Home} from './routes/Lecture_Home'
import {ErrorPage} from './ErrorPage'
import {Root} from './routes/Root'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/lecture_home",
    element: (
      <ProtectedRoute allowedRoles={["Lecturer"]}>
        <Lecture_Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student_home",
    element: (
      <ProtectedRoute allowedRoles={["Student"]}>
        <Student_Home />
      </ProtectedRoute>
    ),
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);