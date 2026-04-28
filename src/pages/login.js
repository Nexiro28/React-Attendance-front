import React, { useState } from "react";
import API from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async () => {
  try {
    const res = await API.post("login/", {
      username,
      password,
    });

    // ✅ FIXED HERE
    localStorage.setItem("token", res.data.token);

    window.location.href = "/dashboard";
  } catch (err) {
    setError("Invalid username or password");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-200 to-purple-200">

      <div className="backdrop-blur-lg bg-white/60 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/40">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          ATTENDANCE SYSTEM
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to continue
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

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-400">🔒</span>

          {/* Show / Hide */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-200 shadow-md"
        >
          Login
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
            Don’t have an account?{" "}
        <span
        className="text-indigo-600 cursor-pointer"
        onClick={() => (window.location.href = "/register")}
        >
        Register
        </span>
        </p>


      </div>
    </div>
  );
}

export default Login;