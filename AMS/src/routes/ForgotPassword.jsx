import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Here you would normally call your API
      // For demo, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setSuccess(true);
      // Navigate to reset password page (in real app, this would include a token)
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError("Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
          <img className="w-8 h-8 mr-2" src="/presenT.svg" alt="logo" />
          presenT
        </a>

        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-300 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to login
            </button>
          </div>

          <h1 className="text-xl font-bold text-white mb-6">
            Reset your password
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg">
              Check your email for reset instructions.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  required
                />
                <p className="mt-2 text-sm text-gray-400">
                  Enter the email address associated with your account and we'll send you instructions to reset your password.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending request...
                  </div>
                ) : (
                  "Send reset instructions"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};