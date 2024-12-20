import axios from "axios";

// Base URL for your backend   http://127.0.0.1:8000/  https://candidate-management-backend-1.onrender.com
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent for session-based authentication
});

export default axiosInstance;
