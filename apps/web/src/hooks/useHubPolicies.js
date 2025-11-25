import { useState, useEffect } from "react";
import api from "../lib/api";

export const useHubPolicies = (hubId) => {
  const [policies, setPolicies] = useState([]);
  const [activePolicy, setActivePolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/hub/policies?hubId=${hubId}`);

      if (response.data.success) {
        setPolicies(response.data.policies);
      }
    } catch (err) {
      console.error("Fetch policies error:", err);
      setError(err.response?.data?.message || "Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivePolicy = async () => {
    try {
      const response = await api.get(`/hub/policies/active/hub?hubId=${hubId}`);

      if (response.data.success) {
        setActivePolicy(response.data.policy);
      }
    } catch (err) {
      console.error("Fetch active policy error:", err);
    }
  };

  const createPolicy = async (policyData) => {
    try {
      const response = await api.post("/hub/policies", {
        ...policyData,
        hubId,
      });

      if (response.data.success) {
        await fetchPolicies();
        return response.data.policy;
      }
    } catch (err) {
      console.error("Create policy error:", err);
      throw err;
    }
  };

  const applyPolicy = async (policyId, override = false) => {
    try {
      const response = await api.post(`/hub/policies/${policyId}/apply`, {
        hubId,
        override,
      });

      if (response.data.success) {
        await fetchActivePolicy();
        await fetchPolicies();
        return response.data;
      }
    } catch (err) {
      console.error("Apply policy error:", err);
      throw err;
    }
  };

  const simulatePolicy = async (policyConfig, days = 7) => {
    try {
      const response = await api.post("/hub/policies/simulate", {
        hubId,
        policyConfig,
        simulationDays: days,
      });

      if (response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.error("Simulate policy error:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (hubId) {
      fetchPolicies();
      fetchActivePolicy();
    }
  }, [hubId]);

  return {
    policies,
    activePolicy,
    loading,
    error,
    refresh: fetchPolicies,
    createPolicy,
    applyPolicy,
    simulatePolicy,
  };
};

export default useHubPolicies;
