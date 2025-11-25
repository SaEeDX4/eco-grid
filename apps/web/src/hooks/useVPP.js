import { useState, useEffect } from "react";
import api from "../lib/api";

export const useVPP = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all overview data in parallel
      const [revenueSummary, userPools, upcomingDispatches, dispatchStats] =
        await Promise.all([
          api.get("/vpp/revenue/summary"),
          api.get("/vpp/pools/user"),
          api.get("/vpp/dispatches/upcoming?limit=5"),
          api.get("/vpp/dispatches/stats?days=30"),
        ]);

      setOverview({
        revenue: revenueSummary.data.summary,
        pools: userPools.data.pools,
        upcomingDispatches: upcomingDispatches.data.dispatches,
        stats: dispatchStats.data.stats,
      });
    } catch (err) {
      console.error("Fetch VPP overview error:", err);
      setError(err.response?.data?.message || "Failed to fetch VPP overview");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchOverview();
  };

  return {
    overview,
    loading,
    error,
    refresh,
  };
};
