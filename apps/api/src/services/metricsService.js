import ImpactMetric from "../models/ImpactMetric.js";
import SystemStatus from "../models/SystemStatus.js";

// Background job to update metrics periodically
export const startMetricsCollection = () => {
  // Update impact metrics every 5 minutes
  setInterval(async () => {
    try {
      await ImpactMetric.calculateAndStore();
      console.log("Impact metrics updated");
    } catch (error) {
      console.error("Failed to update impact metrics:", error);
    }
  }, 300000); // 5 minutes

  // Update system status every 30 seconds
  setInterval(async () => {
    try {
      await SystemStatus.recordStatus();
      console.log("System status recorded");
    } catch (error) {
      console.error("Failed to record system status:", error);
    }
  }, 30000); // 30 seconds

  console.log("Metrics collection started");
};

// Calculate aggregate metrics for a time period
export const calculatePeriodMetrics = async (period, startDate, endDate) => {
  try {
    // In production, this would aggregate from actual user activity data
    // For now, we return mock data based on current metrics

    const latest = await ImpactMetric.getLatest();

    if (!latest) {
      return null;
    }

    // Calculate period-specific values (simplified)
    const periodMultiplier = {
      hourly: 0.001,
      daily: 0.02,
      weekly: 0.15,
      monthly: 0.5,
    };

    const multiplier = periodMultiplier[period] || 1;

    return {
      energySavedKWh: Math.round(latest.energySavedKWh * multiplier),
      moneySavedCAD: Math.round(latest.moneySavedCAD * multiplier),
      co2ReducedKg: Math.round(latest.co2ReducedKg * multiplier),
      activeHomes: latest.activeHomes,
      devicesManaged: latest.devicesManaged,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  } catch (error) {
    console.error("Calculate period metrics error:", error);
    return null;
  }
};
