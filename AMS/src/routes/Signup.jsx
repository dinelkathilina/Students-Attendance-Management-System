import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import authservice from "../../services/authservice";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    server: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength criteria
  const getPasswordStrength = (password) => {
    const criteria = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const strength = Object.values(criteria).filter(Boolean).length;
    return { criteria, strength };
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!email.endsWith("@ucsi.ruh.ac.lk") && !email.endsWith("@dcs.ruh.ac.lk")) {
      return "Please use your institutional email (@ucsi.ruh.ac.lk or @dcs.ruh.ac.lk)";
    }
    return "";
  };

  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters long";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    const { criteria } = getPasswordStrength(password);
    if (!criteria.minLength) return "Password must be at least 8 characters";
    if (!criteria.hasUpper || !criteria.hasLower) return "Password must contain both uppercase and lowercase letters";
    if (!criteria.hasSymbol) return "Password must contain at least one symbol";
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // Clear errors on change
    setErrors(prev => ({
      ...prev,
      [name]: "",
      server: ""
    }));

    // Validate on change for immediate feedback
    let error = "";
    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "name":
        error = validateName(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value);
        break;
      default:
        break;
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      terms: !formData.termsAccepted ? "You must accept the Terms and Conditions" : ""
    };

    if (Object.values(errors).some(error => error)) {
      setErrors(errors);
      return;
    }

    setIsLoading(true);
    setErrors({ ...errors, server: "" });

    try {
      await authservice.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      // Auto login after successful registration
      const loginResponse = await authservice.login(formData.email, formData.password, false);
      
      navigate(loginResponse.userType === "Student" ? "/student_home" : "/lecture_home");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors(prev => ({
        ...prev,
        server: error.response?.data?.message || "An error occurred during registration. Please try again."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const { criteria, strength } = getPasswordStrength(formData.password);

  return (
    <section className="bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
          <img className="w-8 h-8 mr-2" src="/presenT.svg" alt="logo" />
          presenT
        </a>

        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-xl font-bold text-white mb-6">
            Create an account
          </h1>

          {errors.server && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.server}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Your name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white placeholder-gray-400
                  ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white placeholder-gray-400
                  ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                placeholder="name@ucsi.ruh.ac.lk or name@dcs.ruh.ac.lk"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white
                    ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
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
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < strength ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="space-y-1">
                    <li className="text-sm flex items-center gap-2">
                      {criteria.minLength ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={criteria.minLength ? "text-green-500" : "text-red-500"}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      {criteria.hasUpper && criteria.hasLower ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={criteria.hasUpper && criteria.hasLower ? "text-green-500" : "text-red-500"}>
                        Upper & lowercase letters
                      </span>
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      {criteria.hasSymbol ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                      <span className={criteria.hasSymbol ? "text-green-500" : "text-red-500"}>
                        At least one symbol
                      </span>
                    </li>
                  </ul>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-700 text-white
                    ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? 'Hide password' : 'Show password'}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <label className="ml-2 text-sm text-gray-300">
                I accept the{" "}
                <a href="#" className="text-blue-500 hover:text-blue-400">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-sm text-center text-gray-400">
              Already have an account?{" "}
              <a href="/" className="text-blue-500 hover:text-blue-400">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};