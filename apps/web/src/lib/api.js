import axios from "axios";

// ✅ Determine base URL dynamically for both local dev and Render
let baseURL;

// 1️⃣ If environment variable exists (Render or local .env)
if (import.meta.env.VITE_API_BASE) {
  baseURL = import.meta.env.VITE_API_BASE.replace(/\/+$/, "");

  // 2️⃣ If no env (e.g., local preview or manual test)
} else if (typeof window !== "undefined") {
  const origin = window.location.origin;

  // Use port 5000 backend when running locally
  if (origin.includes("localhost")) {
    baseURL = "http://localhost:5000/api";
  } else {
    // For production (Render, Netlify, etc.)
    baseURL = `${origin.replace(/\/+$/, "")}/api`;
  }

  // 3️⃣ Default fallback (SSR, test)
} else {
  baseURL = "http://localhost:5000/api";
}

// ✅ Create axios instance
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Request interceptor (attach token)
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.warn("No localStorage (SSR?)");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (auto logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
