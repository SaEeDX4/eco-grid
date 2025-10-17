import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi"; // ✅ added for authenticated fetch
import { mockDashboardData } from "../lib/mockData";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // ✅ Fixed: ensure correct endpoint
      const dashboardData = await apiFetch("/api/dashboard");
      setData(dashboardData);
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message);
      // fallback to mock data
      setData(mockDashboardData);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadDashboardData();
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
};
