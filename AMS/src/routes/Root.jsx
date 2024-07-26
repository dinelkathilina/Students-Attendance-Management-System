import React from "react";


export const Root = () => {
  return (
    <>
      <div className="grid justify-center mt-12 sm:grid justify-items-center">
        <img src="Login.svg" alt="HomePage" className="" />
        <div className=" mt-8">
          <a href="/lecture">

          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-64"
            
            >
            I'm a Lecturer
          </button>
            </a>
        </div>
        <a href="/student">

        <div  className=" mt-2">
          <button
            type="button"
            class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 w-64"
            >
            I'm a Student
          </button>
        </div>
            </a>
      </div>
    </>
  );
};
