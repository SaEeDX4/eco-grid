// apps/web/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Verify token on startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ 🔥 Listen for token changes (so login updates instantly without reload)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        fetchUser(token);
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Validate user session using token
  const fetchUser = async (token) => {
    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.warn("⚠️ Invalid or expired token. Logging out...");
      localStorage.removeItem("token");
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login and immediately set user
  const login = async (email, password, remember = false) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      if (remember) localStorage.setItem("rememberMe", "true");

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setUser(userData);
      setLoading(false);

      // 👇 Trigger token-change event for immediate context update
      window.dispatchEvent(new Event("storage"));

      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    window.dispatchEvent(new Event("storage")); // 👈 ensure logout syncs too
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
