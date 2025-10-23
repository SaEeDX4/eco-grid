import { useState, useEffect } from "react";
import api from "../lib/api";

export const usePilots = (filters = {}) => {
  const [pilots, setPilots] = useState([]);
  const [aggregateMetrics, setAggregateMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPilots = async (newFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (newFilters.region?.length) {
        params.append("region", newFilters.region.join(","));
      }

      if (newFilters.deviceType?.length) {
        params.append("deviceType", newFilters.deviceType.join(","));
      }

      if (newFilters.status?.length) {
        params.append("status", newFilters.status.join(","));
      }

      if (newFilters.bounds) {
        params.append("bounds", newFilters.bounds.join(","));
      }

      const response = await api.get(`/pilots?${params}`);

      if (response.data.success) {
        setPilots(response.data.pilots);
        setAggregateMetrics(response.data.aggregateMetrics);
      }
    } catch (err) {
      console.error("Fetch pilots error:", err);
      setError(err.response?.data?.message || "Failed to load pilots");
    } finally {
      setLoading(false);
    }
  };

  const fetchPilotById = async (id) => {
    try {
      const response = await api.get(`/pilots/${id}`);

      if (response.data.success) {
        return response.data.pilot;
      }

      return null;
    } catch (err) {
      console.error("Fetch pilot error:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchPilots();
  }, []);

  return {
    pilots,
    aggregateMetrics,
    loading,
    error,
    fetchPilots,
    fetchPilotById,
  };
};
