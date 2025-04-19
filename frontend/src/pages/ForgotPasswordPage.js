import React, { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { postRequest } from "../axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!email) {
        setError("Please enter your email address");
        setIsLoading(false);
        return;
      }

      await postRequest("http://localhost:5000/api/user/forget-password/request", { email });
      setIsSubmitted(true);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!otp || !newPassword || !confirmPassword) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      await postRequest("http://localhost:5000/api/user/forget-password/verify", {
        email, 
        otp,
        password: newPassword,
      });

      toast.success("Password updated successfully");
      window.location.href = "/";
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestError = (error) => {
    if (error.response) {
      setError(error.response.data.message || "An error occurred");
    } else if (error.request) {
      setError("No response from server. Please check your connection.");
    } else {
      setError("Error processing your request");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <ToastContainer />
        {!isSubmitted ? (
          <>
            <div className="text-center">
              <img
                className="mx-auto mb-4"
                src={require("../images/logo-with-txt.png")}
                style={{ width: "175px" }}
                alt="Logo"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Forgot Password
              </h2>
              <p className="text-gray-500 mb-6">
                Enter the email address associated with your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? <span className="animate-pulse">Sending...</span> : "Reset Password"}
              </button>
              <div className="flex justify-center">
                <Link
                  to="/"
                  className="w-full py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg text-center"
                >
                  Back to Login
                </Link>
              </div>

            </form>
          </>
        ) : (
          <>
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Check className="text-green-600" size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Password Reset Email Sent</h2>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>. Check your email and follow the instructions.
              </p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="relative">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 text-sm font-medium text-white ${
                  isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                Update Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
