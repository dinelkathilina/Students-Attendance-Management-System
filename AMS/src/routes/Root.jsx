import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

import authservice from "../../services/authservice";

export const Root = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    server: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    }
    if (
      !email.endsWith("@ucsi.ruh.ac.lk") &&
      !email.endsWith("@dcs.ruh.ac.lk")
    ) {
      return "Please use your University email";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    const inputValue = e.target.type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      server: "",
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        server: "",
      });
      return;
    }

    setIsLoading(true);
    setErrors({ email: "", password: "", server: "" });

    try {
      const response = await authservice.login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      localStorage.setItem("user", JSON.stringify(response));

      navigate(
        response.userType === "Student" ? "/student_home" : "/lecture_home"
      );
    } catch (err) {
      if (err.response?.status === 401) {
        setErrors((prev) => ({
          ...prev,
          server: "Invalid email or password",
        }));
      } else if (err.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          server: err.response.data.message,
        }));
      } else if (!navigator.onLine) {
        setErrors((prev) => ({
          ...prev,
          server: "Please check your internet connection",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          server: "An unexpected error occurred. Please try again.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // Prevent form submission
    setShowPassword(!showPassword);
  };

  return (
    <section className="bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-white"
        >
          <img className="w-8 h-8 mr-2" src="/presenT.svg" alt="logo" />
          presenT
        </a>

        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-xl font-bold text-white mb-6">
            Sign in to your account
          </h1>

          {errors.server && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.server}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white placeholder-gray-400
                  ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-blue-500"
                  }`}
                placeholder="enter email ends with ucsi.ruh.ac.lk or dcs.ruh.ac.lk"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-blue-500"
                    }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            <p className="mt-4 text-sm text-center text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-400"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
