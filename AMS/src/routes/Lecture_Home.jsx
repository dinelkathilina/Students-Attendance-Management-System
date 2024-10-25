import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { initFlowbite } from "flowbite";
import CourseScheduleDisplay from "../Components/CourseScheduleDisplay";
import authservice from "../../services/authservice";
import signalRService from "../../services/signalRService";
import { useSession } from "../Context/SessionContext";
export const Lecture_Home = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCoursesTimes, setShowCoursesTimes] = useState(true);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { sessionData, refreshSession } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      to: "create_session",
      icon: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z",
      label: "Create Session",
    },
    {
      to: "manage_courses",
      icon: "M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z",
      label: "Manage Courses",
    },
    {
      to: "report",
      icon: "M6 16v-3h.375a.626.626 0 0 1 .625.626v1.749a.626.626 0 0 1-.626.625H6Zm6-2.5a.5.5 0 1 1 1 0v2a.5.5 0 0 1-1 0v-2Z M11 7V2h7a2 2 0 0 1 2 2v5h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h6a2 2 0 0 0 2-2Zm7.683 6.006 1.335-.024-.037-2-1.327.024a2.647 2.647 0 0 0-2.636 2.647v1.706a2.647 2.647 0 0 0 2.647 2.647H20v-2h-1.335a.647.647 0 0 1-.647-.647v-1.706a.647.647 0 0 1 .647-.647h.018ZM5 11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 9 15.375v-1.75A2.626 2.626 0 0 0 6.375 11H5Zm7.5 0a2.5 2.5 0 0 0-2.5 2.5v2a2.5 2.5 0 0 0 5 0v-2a2.5 2.5 0 0 0-2.5-2.5Z M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Z",
      label: "Attendance Report",
    },
    {
      to: "course_schedules",
      icon: "M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z",
      label: "Course Schedules",
    },
    {
      to: "view-check-in",
      icon: "M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z",
      label: "View Live Check-in",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authservice.getProfile();
        if (user) {
          setUserName(user.name || "Lecturer");
          setUserEmail(user.email || "");
        } else {
          navigate("/");
          return;
        }

        const coursesData = await authservice.getLecturerCoursesTime();
        setCourses(coursesData);

        await refreshSession();

        setIsLoading(false);

        // Initialize SignalR connection
        await signalRService.startConnection();
        // signalRService.onNewCheckIn((attendanceInfo) => {
        //   setCheckedInStudents((prev) => [...prev, attendanceInfo]);
        // });
      } catch (error) {
        console.error("Error fetching data or initializing SignalR:", error);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
    initFlowbite();

    setShowCoursesTimes(location.pathname === "/lecture_home");

    // Clean up SignalR connection on component unmount
    return () => {
      signalRService.stopConnection();
    };
  }, [navigate, location.pathname, refreshSession]);

  useEffect(() => {
    if (sessionData) {
      signalRService.joinSession(sessionData.sessionCode);
    }
  }, [sessionData]);

  const handleLogout = () => {
    navigate("/logout");
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
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

  return (
    <>
      <div class="antialiased bg-gray-50 dark:bg-gray-900">
        <nav class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
          <div class="flex flex-wrap justify-between items-center">
            <div class="flex justify-start items-center">
              <button
                onClick={toggleMobileMenu}
                data-drawer-target="drawer-navigation"
                data-drawer-toggle="drawer-navigation"
                aria-controls="drawer-navigation"
                class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  aria-hidden="true"
                  class="hidden w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Toggle sidebar</span>
              </button>
              <a href="/" class="flex items-center justify-between mr-4">
                <img src="/presenT.svg" class="mr-3 h-8" alt="PresentT Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  presenT
                </span>
              </a>
            </div>
            <div class="flex items-center lg:order-2">
              {/* profile button with image */}
              <button
                type="button"
                class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="dropdown"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="w-8 h-8 rounded-full"
                  src="/user.png"
                  alt="user photo"
                />
              </button>
              {/* Dropdown menu in profile */}
              <div
                class="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 "
                id="dropdown"
              >
                <div class="py-3 px-4">
                  <span class="block text-sm font-semibold text-gray-900 dark:text-white">
                    {userName}
                  </span>
                  <span class="block text-sm text-gray-900 truncate dark:text-white">
                    {userEmail}
                  </span>
                </div>
                

                <ul
                  class="py-1 text-gray-700 dark:text-gray-300"
                  aria-labelledby="dropdown"
                >
                  <li>
                    <a
                      href="#"
                      onClick={handleLogout}
                      class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:translate-x-0 
            ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Sidenav"
          id="drawer-navigation"
        >
          <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className={`flex items-center p-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                      location.pathname.includes(item.to)
                        ? "text-blue-600 bg-blue-100 dark:bg-blue-700 dark:text-white"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >

                    <svg
                      className="w-6 h-6 transition-colors duration-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}

            </ul>
          </div>
        </aside>

        <div className={`md:ml-64 ${isMobileMenuOpen ? 'ml-64' : ''}`}>
        <main className="p-4  h-screen pt-20">
          {showCoursesTimes ? (
            <CourseScheduleDisplay
              courses={courses}
              isLoading={isLoading}
              error={error}
              userName={userName}
              getDayName={getDayName}
              formatTime={formatTime}
            />
          ) : (
            <Outlet />
          )}
        </main>
    </div>
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-gray-900 opacity-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </div>
</>
  );
};
