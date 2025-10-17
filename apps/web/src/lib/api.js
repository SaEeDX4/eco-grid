import axios from "axios";

// ✅ Create axios instance with correct base URL
// Prevents double "/api/api" when VITE_API_BASE already includes "/api"
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
    "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response interceptor for handling 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export default api;
