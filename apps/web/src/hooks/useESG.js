import { useState, useEffect } from "react";
import api from "../lib/api";
import {
  calculateESGScore,
  getESGRecommendations,
} from "../lib/esgCalculations";

export const useESG = (userId) => {
  const [loading, setLoading] = useState(true);
  const [esgData, setEsgData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadESGData();
  }, [userId]);

  const loadESGData = async () => {
    setLoading(true);
    try {
      // Try API first
      const response = await api.get("/reports/esg");
      setEsgData(response.data.esg);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error("Failed to load ESG data:", err);

      // Fallback to client-side calculation
      const mockUserData = {
        sharesData: false,
        completedTutorials: true,
        sharedTips: false,
        twoFactorEnabled: true,
        privacySettingsConfigured: true,
        reportsShared: false,
      };

      const mockConsumptionData = {
        renewablePercent: 45,
        efficiencyScore: 72,
        carbonReduction: 15,
      };

      const mockDevices = [
        { type: "solar" },
        { type: "battery" },
        { type: "ev_charger" },
      ];

      const calculated = calculateESGScore(
        mockUserData,
        mockConsumptionData,
        mockDevices,
      );
      setEsgData(calculated);

      const recs = getESGRecommendations(calculated);
      setRecommendations(recs);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    esgData,
    recommendations,
    refresh: loadESGData,
  };
};
