import React, { useState, useEffect, useCallback } from "react";
import { initFlowbite } from "flowbite";
import { QrCode, ClipboardCheck, CalendarDays } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";

import authservice from "../../services/authservice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signalRService from "../../services/signalRService";
import { QRScanner } from "../Components/QRScanner ";

export const Student_Home = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [checkInInfo, setCheckInInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { to: "", icon: QrCode, label: "Scan QR Code" },
    { to: "attendance-report", icon: ClipboardCheck, label: "Attendance Report" },
    { to: "view-schedule", icon: CalendarDays, label: "View Schedule" },
  ];

  const isHomePage = location.pathname === '/student_home';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await authservice.getProfile();
        if (user) {
          setUserName(user.name || "Student");
          setUserEmail(user.email || "");
        } else {
          toast.error("Failed to load user profile");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("An error occurred while loading your profile");
        navigate("/");
      }
    };

    fetchUserProfile();
    initFlowbite();
    toast.info("Welcome to the Student Home page!");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    authservice.logout();
    navigate("/");
  }, [navigate]);

  const handleCheckIn = async (qrCode) => {
    setShowScanner(false);
    console.log("Attempting check-in with code:", qrCode);

    try {
      const response = await authservice.checkIn(qrCode);
      console.log("Check-in response:", response);
      toast.success(response.message);
      setCheckInInfo(response.sessionDetails);
      await signalRService.joinSession(qrCode);
    } catch (error) {
      console.error("Error checking in:", error);
      const errorMessage = error.response?.data?.message || 
                          (typeof error.response?.data === "string" ? error.response.data : null) ||
                          (error.request ? "Network error. Please check your connection and try again." : 
                          "An unexpected error occurred. Please try again later.");
      toast.error(errorMessage);
    }
  };

  const isActiveRoute = useCallback((to) => {
    if (to === "" && isHomePage) return true;
    return location.pathname === `/student_home/${to}`;
  }, [isHomePage, location.pathname]);

  const renderMainContent = () => {
    if (!isHomePage) return <Outlet />;

    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          Welcome, {userName}
        </h2>

        {!showScanner && !checkInInfo && (
          <div className="text-center">
            <button
              onClick={() => setShowScanner(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Scan QR Code to Check In
            </button>
          </div>
        )}

        {showScanner && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <QRScanner
              onClose={() => setShowScanner(false)}
              onCheckIn={handleCheckIn}
            />
          </div>
        )}

        {checkInInfo && (
          <div className="mt-8 bg-gray-800 text-white p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-blue-400">
              Check-in Successful
            </h3>
            <div className="space-y-4">
              <p className="text-lg">
                <strong className="text-blue-300">Course:</strong>{" "}
                {checkInInfo.courseName}
              </p>
              <p className="text-lg">
                <strong className="text-blue-300">Start Time:</strong>{" "}
                {new Date(checkInInfo.startTime).toLocaleTimeString()}
              </p>
              <p className="text-lg">
                <strong className="text-blue-300">End Time:</strong>{" "}
                {new Date(checkInInfo.endTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 mr-2 text-gray-400 rounded-lg cursor-pointer md:hidden hover:text-white hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <Link to="/" className="flex items-center justify-between mr-4">
              <img src="presenT.svg" className="mr-3 h-8" alt="presenT Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                presenT
              </span>
            </Link>
          </div>
          
          <div className="flex items-center lg:order-2">
            <button
              type="button"
              className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="dropdown"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="user.png"
                alt="user photo"
              />
            </button>
            <div
              className="hidden z-50 my-4 w-56 text-base list-none bg-gray-700 rounded divide-y divide-gray-600 shadow"
              id="dropdown"
            >
              <div className="py-3 px-4">
                <span className="block text-sm font-semibold text-white">
                  {userName}
                </span>
                <span className="block text-sm text-gray-400 truncate">
                  {userEmail}
                </span>
              </div>
              <ul className="py-1 text-gray-300">
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-600 hover:text-white"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform bg-gray-800 border-r border-gray-700 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-gray-800">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  className={`flex items-center p-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.to)
                      ? "text-white bg-blue-600"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (item.to === "") {
                      setShowScanner(false);
                      setCheckInInfo(null);
                    }
                  }}
                >
                  {React.createElement(item.icon, {
                    className: "w-6 h-6 transition-colors duration-200",
                    "aria-hidden": "true"
                  })}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className={`p-4 md:ml-64 h-auto pt-20 ${isMobileMenuOpen ? 'ml-64' : ''}`}>
        {renderMainContent()}
      </main>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
        
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};