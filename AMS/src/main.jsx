import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Root } from "./routes/Root.jsx";
import { ErrorPage } from "./ErrorPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Lecture_Login } from "./routes/Lecture_Login";
import { Lecture_Signup } from "./routes/Lecture_Signup";
import { Lecture_Home } from "./routes/Lecture_Home";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "/lecture",
    element:<Lecture_Login />,
  },
  {
    path: "/lecture_signup",
    element:<Lecture_Signup />,
  },
  {
    path: "/lecture_home",
    element:<Lecture_Home />,
  },
  
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
