import React, { useState } from "react";
import API from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await API.post("register/", {
        username,
        email,
        password,
      });

      setSuccess("Account created successfully!");

setTimeout(() => {
  window.location.href = "/";
}, 1500);
    } catch (err) {
      setError(
  err.response?.data?.error ||
  JSON.stringify(err.response?.data) ||
  "Registration failed"
);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200">

      <div className="backdrop-blur-lg bg-white/60 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/40">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Register to get started
        </p>

        {/* Username */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-400">👤</span>
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-400">📧</span>
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-400">🔒</span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-400">🔒</span>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="text-green-600 text-sm text-center mb-3">
            {success}
          </p>
        )}

        {/* Button */}
        <button type="button" onClick={handleRegister}
          className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-200 shadow-md"
        >
          Register
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;