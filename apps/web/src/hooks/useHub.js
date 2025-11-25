import { useState, useEffect } from "react";
import api from "../lib/api";

export const useHub = (hubId) => {
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHub = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/hub/hubs/${hubId}`);

      if (response.data.success) {
        setHub(response.data.hub);
      }
    } catch (err) {
      console.error("Fetch hub error:", err);
      setError(err.response?.data?.message || "Failed to load hub");
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/hub/hubs/${hubId}/overview`);

      if (response.data.success) {
        return response.data.overview;
      }
    } catch (err) {
      console.error("Fetch overview error:", err);
      setError(err.response?.data?.message || "Failed to load overview");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rebalance = async (method = "proportional") => {
    try {
      const response = await api.post(`/hub/hubs/${hubId}/rebalance`, {
        method,
        trigger: "manual",
      });

      if (response.data.success) {
        await fetchHub();
        return response.data;
      }
    } catch (err) {
      console.error("Rebalance error:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (hubId) {
      fetchHub();
    }
  }, [hubId]);

  return {
    hub,
    loading,
    error,
    refresh: fetchHub,
    fetchOverview,
    rebalance,
  };
};

export default useHub;
