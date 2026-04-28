import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend-name.onrender.com/api/",
});

// 🔥 Auto attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export default API;