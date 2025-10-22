import { useState, useEffect } from "react";
import api from "../lib/api";

export const useImpactMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();

    // Update every 30 seconds for real-time feel
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get("/metrics/impact");
      if (response.data.success) {
        setMetrics(response.data.metrics);
      }
    } catch (err) {
      console.error("Fetch impact metrics error:", err);
      setError("Failed to load impact metrics");

      // Use fallback data
      setMetrics({
        energySavedKWh: 127543,
        moneySavedCAD: 38263,
        co2ReducedKg: 38134,
        activeHomes: 127,
        devicesManaged: 1842,
        waterSavedLiters: 15234,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};
