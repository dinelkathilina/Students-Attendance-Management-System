import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initFlowbite } from "flowbite";
import authservice from "../../services/authservice";

export const Student_Home = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await authservice.getProfile();
        console.log("Fetched user profile:", user); // Debug log
        if (user) {
          setUserName(user.name || "Student");
          setUserEmail(user.email || "");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/");
      }
    };

    fetchUserProfile();
    initFlowbite();
  }, [navigate]);

  const handleLogout = () => {
    authservice.logout();
    navigate("/");
  };

  return (
    <>
      <div class="antialiased bg-gray-50 dark:bg-gray-900">
        <nav class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
          <div class="flex flex-wrap justify-between items-center">
            <div class="flex justify-start items-center">
              <button
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
                <img src="presenT.svg" class="mr-3 h-8" alt="Flowbite Logo" />
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
                  src="user.png"
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
                      class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      My profile
                    </a>
                  </li>
                </ul>

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
          class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidenav"
          id="drawer-navigation"
        >
          <div class="overflow-y-auto py-5 px-3  h-full bg-white dark:bg-gray-800">
            <ul class="space-y-3">
              {/* Manage Courses */}
              {/* <li>
                <a
                  href="#"
                  class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span class="ml-3">Manage Courses</span>
                </a>
              </li>*/}
              {/* Attendance Report */}
              <li>
                <a
                  href="#"
                  class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 16v-3h.375a.626.626 0 0 1 .625.626v1.749a.626.626 0 0 1-.626.625H6Zm6-2.5a.5.5 0 1 1 1 0v2a.5.5 0 0 1-1 0v-2Z" />
                    <path
                      fill-rule="evenodd"
                      d="M11 7V2h7a2 2 0 0 1 2 2v5h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h6a2 2 0 0 0 2-2Zm7.683 6.006 1.335-.024-.037-2-1.327.024a2.647 2.647 0 0 0-2.636 2.647v1.706a2.647 2.647 0 0 0 2.647 2.647H20v-2h-1.335a.647.647 0 0 1-.647-.647v-1.706a.647.647 0 0 1 .647-.647h.018ZM5 11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 9 15.375v-1.75A2.626 2.626 0 0 0 6.375 11H5Zm7.5 0a2.5 2.5 0 0 0-2.5 2.5v2a2.5 2.5 0 0 0 5 0v-2a2.5 2.5 0 0 0-2.5-2.5Z"
                      clip-rule="evenodd"
                    />
                    <path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Z" />
                  </svg>

                  <span class="ml-3">Attendance Report</span>
                </a>
              </li>
              {/* Course Schedules */}
              <li>
                <a
                  href="#"
                  class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span class="ml-3">View Schedule</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <main class="p-4 md:ml-64 h-auto pt-20">
        <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4 flex justify-center items-center">
            <button
              type="button"
              class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="66" height="66" viewBox="0 0 66 66">
<path d="M 11.300781 8.0996094 C 9.0007812 8.0996094 7.1992188 9.9992188 7.1992188 12.199219 L 7.1992188 36.199219 L 4.8007812 36.199219 C 2.7007813 36.199219 1 37.9 1 40 C 1 42.1 2.7007813 43.800781 4.8007812 43.800781 L 7.1992188 43.800781 L 7.1992188 53.699219 C 7.1992188 55.999219 9.1007812 57.800781 11.300781 57.800781 L 54.599609 57.800781 C 56.899609 57.800781 58.699219 55.899219 58.699219 53.699219 L 58.699219 43.800781 L 61 43.800781 C 63.1 43.800781 64.800781 42.1 64.800781 40 C 64.800781 37.9 63.299219 36.199219 61.199219 36.199219 L 58.900391 36.199219 L 58.900391 12.199219 C 58.900391 9.8992187 57.000781 8.0996094 54.800781 8.0996094 L 11.300781 8.0996094 z M 11.300781 10.099609 L 54.599609 10.099609 C 55.799609 10.099609 56.699219 11.099219 56.699219 12.199219 L 56.699219 36.199219 L 9.1992188 36.199219 L 9.1992188 12.199219 C 9.1992188 10.999219 10.200781 10.099609 11.300781 10.099609 z M 15.199219 13.300781 C 13.699219 13.300781 12.400391 14.599609 12.400391 16.099609 L 12.400391 19.300781 C 12.400391 19.900781 12.800391 20.300781 13.400391 20.300781 C 14.000391 20.300781 14.400391 19.900781 14.400391 19.300781 L 14.400391 16.099609 C 14.400391 15.699609 14.799219 15.300781 15.199219 15.300781 L 18.400391 15.300781 C 19.000391 15.300781 19.400391 14.800781 19.400391 14.300781 C 19.400391 13.700781 19.000391 13.300781 18.400391 13.300781 L 15.199219 13.300781 z M 46.699219 13.300781 C 46.099219 13.300781 45.699219 13.700781 45.699219 14.300781 C 45.699219 14.900781 46.099219 15.300781 46.699219 15.300781 L 49.900391 15.300781 C 50.300391 15.300781 50.699219 15.699609 50.699219 16.099609 L 50.699219 19.300781 C 50.699219 19.900781 51.099219 20.300781 51.699219 20.300781 C 52.299219 20.300781 52.699219 19.900781 52.699219 19.300781 L 52.699219 16.099609 C 52.699219 14.499609 51.500391 13.300781 49.900391 13.300781 L 46.699219 13.300781 z M 18.800781 18.300781 C 17.700781 18.300781 16.800781 19.200781 16.800781 20.300781 L 16.800781 27.800781 C 16.800781 28.900781 17.700781 29.800781 18.800781 29.800781 L 26.300781 29.800781 C 27.400781 29.800781 28.300781 28.900781 28.300781 27.800781 L 28.300781 20.300781 C 28.300781 19.200781 27.400781 18.300781 26.300781 18.300781 L 18.800781 18.300781 z M 38.800781 18.300781 C 37.700781 18.300781 36.800781 19.200781 36.800781 20.300781 L 36.800781 27.800781 C 36.800781 28.900781 37.700781 29.800781 38.800781 29.800781 L 46.300781 29.800781 C 47.400781 29.800781 48.300781 28.900781 48.300781 27.800781 L 48.300781 20.300781 C 48.300781 19.200781 47.400781 18.300781 46.300781 18.300781 L 38.800781 18.300781 z M 33.5 19.300781 C 32.9 19.300781 32.5 19.700781 32.5 20.300781 L 32.5 24.699219 L 31.800781 24.699219 C 30.700781 24.699219 29.900391 25.599609 29.900391 26.599609 L 29.900391 31.400391 L 25.099609 31.400391 C 24.499609 31.400391 24.099609 31.800391 24.099609 32.400391 C 24.099609 33.000391 24.499609 33.400391 25.099609 33.400391 L 30 33.400391 C 31.1 33.400391 31.900391 32.5 31.900391 31.5 L 31.900391 26.699219 L 32.599609 26.699219 C 33.699609 26.699219 34.5 25.800781 34.5 24.800781 L 34.5 20.300781 C 34.5 19.700781 34.1 19.300781 33.5 19.300781 z M 18.800781 20.199219 L 26.300781 20.199219 L 26.300781 27.699219 L 18.800781 27.699219 L 18.800781 20.199219 z M 38.900391 20.199219 L 46.400391 20.199219 L 46.400391 27.599609 L 38.900391 27.699219 L 38.900391 20.199219 z M 35.199219 30.699219 C 34.599219 30.699219 34.199219 31.099219 34.199219 31.699219 C 34.199219 32.299219 34.599219 32.699219 35.199219 32.699219 L 37.800781 32.699219 L 37.800781 33 C 37.800781 34.1 38.699219 34.900391 39.699219 34.900391 L 42.199219 34.900391 C 42.799219 34.900391 43.199219 34.500391 43.199219 33.900391 C 43.199219 33.300391 42.699219 32.900391 42.199219 32.900391 L 39.800781 32.900391 L 39.800781 32.599609 C 39.800781 31.499609 38.900391 30.699219 37.900391 30.699219 L 35.199219 30.699219 z M 17.800781 31.5 C 17.200781 31.5 16.800781 31.9 16.800781 32.5 C 16.800781 33.1 17.200781 33.5 17.800781 33.5 L 19.599609 33.5 C 20.199609 33.5 20.599609 33.1 20.599609 32.5 C 20.599609 31.9 20.199609 31.5 19.599609 31.5 L 17.800781 31.5 z M 45.5 31.5 C 44.9 31.5 44.5 31.9 44.5 32.5 C 44.5 33.1 44.9 33.5 45.5 33.5 L 47.300781 33.5 C 47.900781 33.5 48.300781 33.1 48.300781 32.5 C 48.300781 31.9 47.900781 31.5 47.300781 31.5 L 45.5 31.5 z M 4.8007812 38.199219 L 61.099609 38.199219 C 62.099609 38.199219 62.900391 39 62.900391 40 C 62.900391 41 62.199219 41.900391 61.199219 41.900391 L 4.8007812 41.900391 C 3.8007812 41.900391 3 41 3 40 C 3 39 3.8007813 38.199219 4.8007812 38.199219 z M 18.800781 43.800781 L 26.199219 43.800781 L 26.300781 45.699219 L 18.800781 45.699219 L 18.800781 43.800781 z M 38.800781 43.800781 L 46.199219 43.800781 L 46.300781 45.699219 L 38.800781 45.699219 L 38.800781 43.800781 z M 9.1992188 43.900391 L 16.900391 43.900391 L 16.900391 45.800781 C 16.900391 46.900781 17.800391 47.800781 18.900391 47.800781 L 26.400391 47.800781 C 27.500391 47.800781 28.400391 46.900781 28.400391 45.800781 L 28.400391 43.900391 L 37 43.900391 L 37 45.800781 C 37 46.900781 37.9 47.800781 39 47.800781 L 46.5 47.800781 C 47.6 47.800781 48.5 46.900781 48.5 45.800781 L 48.5 43.900391 L 57 43.900391 L 57 53.800781 L 56.800781 53.800781 C 56.800781 55.000781 55.799219 55.900391 54.699219 55.900391 L 11.300781 55.900391 C 10.100781 55.900391 9.1992188 54.900781 9.1992188 53.800781 L 9.1992188 43.900391 z M 13.400391 45.699219 C 12.800391 45.699219 12.400391 46.099219 12.400391 46.699219 L 12.400391 49.900391 C 12.400391 51.400391 13.699219 52.699219 15.199219 52.699219 L 18.400391 52.699219 C 19.000391 52.699219 19.400391 52.299219 19.400391 51.699219 C 19.400391 51.199219 19.000391 50.699219 18.400391 50.699219 L 15.199219 50.699219 C 14.799219 50.699219 14.400391 50.300391 14.400391 49.900391 L 14.400391 46.699219 C 14.400391 46.099219 14.000391 45.699219 13.400391 45.699219 z M 51.699219 45.699219 C 51.099219 45.699219 50.699219 46.099219 50.699219 46.699219 L 50.699219 49.900391 C 50.699219 50.300391 50.300391 50.699219 49.900391 50.699219 L 46.699219 50.699219 C 46.099219 50.699219 45.699219 51.099219 45.699219 51.699219 C 45.699219 52.299219 46.099219 52.699219 46.699219 52.699219 L 49.900391 52.699219 C 51.400391 52.699219 52.699219 51.400391 52.699219 49.900391 L 52.699219 46.699219 C 52.699219 46.099219 52.299219 45.699219 51.699219 45.699219 z"></path>
</svg>
              Scan QR Code
            </button>
          </div>
          {/* Second */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 h-32 md:h-64"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
          </div>
          <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
          </div>
        </main>
      </div>
    </>
  );
};
