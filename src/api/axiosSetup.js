import axios from "axios";
import { getToken, logout } from "../utils/auth";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Attach token automatically to all requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);
