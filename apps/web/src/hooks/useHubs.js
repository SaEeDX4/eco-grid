import { useState, useEffect } from "react";
import api from "../lib/api";

export const useHubs = (filters = {}) => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHubs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.organizationId)
        params.append("organizationId", filters.organizationId);
      if (filters.status) params.append("status", filters.status);

      const response = await api.get(`/hub/hubs?${params.toString()}`);

      if (response.data.success) {
        setHubs(response.data.hubs);
      }
    } catch (err) {
      console.error("Fetch hubs error:", err);
      setError(err.response?.data?.message || "Failed to load hubs");
    } finally {
      setLoading(false);
    }
  };

  const createHub = async (hubData) => {
    try {
      const response = await api.post("/hub/hubs", hubData);

      if (response.data.success) {
        await fetchHubs();
        return response.data.hub;
      }
    } catch (err) {
      console.error("Create hub error:", err);
      throw err;
    }
  };

  const updateHub = async (hubId, updates) => {
    try {
      const response = await api.put(`/hub/hubs/${hubId}`, updates);

      if (response.data.success) {
        await fetchHubs();
        return response.data.hub;
      }
    } catch (err) {
      console.error("Update hub error:", err);
      throw err;
    }
  };

  const deleteHub = async (hubId) => {
    try {
      const response = await api.delete(`/hub/hubs/${hubId}`);

      if (response.data.success) {
        await fetchHubs();
        return true;
      }
    } catch (err) {
      console.error("Delete hub error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchHubs();
  }, [JSON.stringify(filters)]);

  return {
    hubs,
    loading,
    error,
    refresh: fetchHubs,
    createHub,
    updateHub,
    deleteHub,
  };
};

export default useHubs;
