import { useState, useEffect } from "react";
import api from "../lib/api";

export const useVPPMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/vpp/markets");

      if (response.data.success) {
        setMarkets(response.data.markets);
      }
    } catch (err) {
      console.error("Fetch markets error:", err);
      setError(err.response?.data?.message || "Failed to fetch markets");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketPrices = async (
    marketId,
    product = "energy",
    hours = 24
  ) => {
    try {
      const response = await api.get(`/vpp/markets/${marketId}/prices`, {
        params: { product, hours },
      });

      return response.data.prices;
    } catch (err) {
      console.error("Fetch market prices error:", err);
      throw err;
    }
  };

  return {
    markets,
    loading,
    error,
    fetchMarkets,
    fetchMarketPrices,
  };
};
