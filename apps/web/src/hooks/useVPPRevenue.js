import { useState, useEffect } from "react";
import api from "../lib/api";

export const useVPPRevenue = () => {
  const [revenue, setRevenue] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [byPool, setByPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summary, monthly, poolBreakdown] = await Promise.all([
        api.get("/vpp/revenue/summary"),
        api.get("/vpp/revenue/monthly?months=6"),
        api.get("/vpp/revenue/by-pool"),
      ]);

      setRevenue(summary.data.summary);
      setMonthlyTrend(monthly.data.revenue);
      setByPool(poolBreakdown.data.pools);
    } catch (err) {
      console.error("Fetch revenue error:", err);
      setError(err.response?.data?.message || "Failed to fetch revenue");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.poolId) params.append("poolId", filters.poolId);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.periodType) params.append("periodType", filters.periodType);

      const response = await api.get(
        `/vpp/revenue/history?${params.toString()}`
      );
      return response.data.revenue;
    } catch (err) {
      console.error("Fetch revenue history error:", err);
      throw err;
    }
  };

  return {
    revenue,
    monthlyTrend,
    byPool,
    loading,
    error,
    fetchRevenue,
    fetchHistory,
  };
};
