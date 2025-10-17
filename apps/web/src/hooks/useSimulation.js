// apps/web/src/hooks/useSimulation.js
import { useState, useCallback } from "react";
import api from "../lib/api";

/**
 * useSimulation Hook
 * Handles running optimization or energy-saving simulations.
 * Works with backend endpoints at /api/optimizer/simulate or /api/optimizer/run.
 */
export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Run simulation for the selected mode and device data
   * @param {Object} params - Simulation parameters
   * @param {'eco'|'balanced'|'performance'} params.mode
   * @param {Array} params.devices
   * @param {Object} params.constraints
   */
  const runSimulation = useCallback(async (params = {}) => {
    setIsSimulating(true);
    setError(null);

    try {
      const response = await api.post("/optimizer/simulate", params);
      setSimulationResult(response.data);
      return response.data;
    } catch (err) {
      console.error("Simulation failed:", err);
      setError(err.response?.data?.error || "Simulation failed");
      return null;
    } finally {
      setIsSimulating(false);
    }
  }, []);

  /**
   * Accept and apply the best optimization plan
   */
  const acceptOptimization = useCallback(async (planId) => {
    try {
      const response = await api.post(`/optimizer/accept/${planId}`);
      setSimulationResult(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to accept optimization:", err);
      setError(err.response?.data?.error || "Failed to accept optimization");
      return null;
    }
  }, []);

  /**
   * Reset current simulation data
   */
  const resetSimulation = useCallback(() => {
    setSimulationResult(null);
    setError(null);
  }, []);

  return {
    isSimulating,
    simulationResult,
    error,
    runSimulation,
    acceptOptimization,
    resetSimulation,
  };
};

export default useSimulation;
