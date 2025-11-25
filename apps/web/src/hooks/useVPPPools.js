import { useState, useEffect } from "react";
import api from "../lib/api";

export const useVPPPools = (filters = {}) => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPools();
  }, [filters.region, filters.status, filters.market]);

  const fetchPools = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.region) params.append("region", filters.region);
      if (filters.status) params.append("status", filters.status);
      if (filters.market) params.append("market", filters.market);

      const response = await api.get(`/vpp/pools?${params.toString()}`);

      if (response.data.success) {
        setPools(response.data.pools);
      }
    } catch (err) {
      console.error("Fetch pools error:", err);
      setError(err.response?.data?.message || "Failed to fetch pools");
    } finally {
      setLoading(false);
    }
  };

  const joinPool = async (poolId, deviceIds) => {
    try {
      const response = await api.post(`/vpp/pools/${poolId}/join`, {
        deviceIds,
      });

      if (response.data.success) {
        await fetchPools();
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Join pool error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to join pool",
      };
    }
  };

  const leavePool = async (poolId) => {
    try {
      const response = await api.post(`/vpp/pools/${poolId}/leave`);

      if (response.data.success) {
        await fetchPools();
        return { success: true };
      }
    } catch (err) {
      console.error("Leave pool error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to leave pool",
      };
    }
  };

  return {
    pools,
    loading,
    error,
    fetchPools,
    joinPool,
    leavePool,
  };
};
