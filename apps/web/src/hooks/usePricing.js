import { useState, useEffect } from "react";
import api from "../lib/api";

export const usePricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pricing/plans");
      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (err) {
      console.error("Fetch plans error:", err);
      setError("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = async (inputs) => {
    try {
      const response = await api.post("/pricing/calculate", inputs);
      if (response.data.success) {
        return response.data.results;
      }
      return null;
    } catch (err) {
      console.error("Calculate savings error:", err);
      return null;
    }
  };

  return {
    plans,
    loading,
    error,
    calculateSavings,
  };
};
