import React from 'react';
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Oops!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, an unexpected error has occurred.
          </p>
        </div>
        <div className="mt-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Error Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {error.statusText || error.message}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Go back to homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;