import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import {
  calculateMetrics,
  prepareChartData,
  calculateImpactData,
  generateMockReadings,
} from "../lib/reportUtils";

export const useReports = (startDate, endDate) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [readings, setReadings] = useState([]);

  const loadReportData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from API
      const response = await api.post("/reports/generate", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const { readings: apiReadings, devices } = response.data;

      setReadings(apiReadings);

      const calculatedMetrics = calculateMetrics(apiReadings, devices);
      setMetrics(calculatedMetrics);

      const chart = prepareChartData(apiReadings, "daily");
      setChartData(chart);

      const impact = calculateImpactData(
        calculatedMetrics.totalCost * 0.35, // Rough CO2 estimate
        calculatedMetrics.totalEnergy,
      );
      setImpactData(impact);
    } catch (err) {
      console.error("Failed to load report data:", err);

      // Fallback to mock data
      const mockReadings = generateMockReadings(30);
      setReadings(mockReadings);

      const calculatedMetrics = calculateMetrics(mockReadings, []);
      setMetrics(calculatedMetrics);

      const chart = prepareChartData(mockReadings, "daily");
      setChartData(chart);

      const impact = calculateImpactData(
        calculatedMetrics.totalCost * 0.35,
        calculatedMetrics.totalEnergy,
      );
      setImpactData(impact);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const refresh = useCallback(() => {
    loadReportData();
  }, [loadReportData]);

  return {
    loading,
    error,
    metrics,
    chartData,
    impactData,
    readings,
    refresh,
  };
};
