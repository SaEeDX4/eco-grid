import { useState, useEffect } from "react";
import api from "../lib/api";

export const useHubMetrics = (hubId) => {
  const [metrics, setMetrics] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async (period = "month") => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        `/hub/hubs/${hubId}/metrics?period=${period}`
      );

      if (response.data.success) {
        setMetrics(response.data.metrics);
      }
    } catch (err) {
      console.error("Fetch metrics error:", err);
      setError(err.response?.data?.message || "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  const fetchSnapshot = async () => {
    try {
      const response = await api.get(`/hub/hubs/${hubId}/overview`);

      if (response.data.success) {
        setSnapshot(response.data.overview.snapshot);
      }
    } catch (err) {
      console.error("Fetch snapshot error:", err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get(`/hub/hubs/${hubId}/alerts`);

      if (response.data.success) {
        return response.data.alerts;
      }
    } catch (err) {
      console.error("Fetch alerts error:", err);
      return [];
    }
  };

  useEffect(() => {
    if (hubId) {
      fetchMetrics();
      fetchSnapshot();
    }
  }, [hubId]);

  return {
    metrics,
    snapshot,
    loading,
    error,
    refresh: fetchMetrics,
    fetchAlerts,
  };
};

export default useHubMetrics;
