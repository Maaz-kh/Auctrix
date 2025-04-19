import React, { useState } from "react";
import { User, Mail, Lock, Shield, UserCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import {postRequest} from "../axios";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_role: "",
  });

  const handleGoogleSignUp = async () => {
    try {
      toast.error("This feature is not Implemented Yet!");
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validate all fields including user role
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.user_role) {
      toast.error("Please select a user role");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Weak password: must include 1 lowercase, 1 uppercase, 1 number, and 1 special character");
      return;
    }

    const handleRegister = async () => {
      try {
        const response = await postRequest("http://localhost:5000/api/user/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.user_role,
        });
    
        console.log(response);
        if (response.success) {
          toast.success("Signup successful");
          window.location.href = "/";
        } else {          
          toast.error("Sign up failed: " + response.message);
        }
      } catch (error) {
        toast.error("An error occurred during registration");
      }
    };
    
    await handleRegister();
  };

  return (
    <>
    <ToastContainer />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="text-center">
          <img
            className="mx-auto mb-4"
            src={require("../images/logo-with-txt.png")}
            alt="Auctrix logo"
            style={{ width: "175px" }}
          />
          <p className="text-gray-500">Sign up to get started</p>
        </div>

        {/* Google Sign-Up Button */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FcGoogle className="mr-2" size={24} />
            Sign Up with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
                required/>
              
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2" >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required/>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a strong password"
                required />
              
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="user_role"
              className="block text-sm font-medium text-gray-700 mb-2">
              Select User Role
            </label>

            <div className="relative">
              <select
                id="user_role"
                name="user_role"
                value={formData.user_role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                required>

                <option className="text-gray-400" value="">
                  ---Select a Role---
                </option>
                <option className="text-black" value="bidder">
                  Bidder
                </option>
                <option className="text-black" value="seller">
                  Seller
                </option>
              </select>
              
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required/>

            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              
              <Link className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" >
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => { window.location.href = "/" }}>
              
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterPage;
