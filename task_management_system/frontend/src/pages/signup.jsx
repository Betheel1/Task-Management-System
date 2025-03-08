// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register", // Adjust this URL to your backend API endpoint
        formData
      );

      // Save the email in local storage for auto-filling in the login page
      localStorage.setItem("userEmail", formData.email);

      alert("Signup successful!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      setErrorMessage("Error signing up. Please try again.", error.messaage);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-semibold">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full p-3 border rounded-md"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-semibold">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full p-3 border rounded-md"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border rounded-md"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 border rounded-md"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
