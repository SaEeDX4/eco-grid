// Backend report generation service

export const generateReport = async (readings, devices, options = {}) => {
  const { startDate, endDate } = options;

  // Calculate metrics
  const metrics = calculateMetrics(readings);

  // Prepare chart data
  const chartData = prepareChartData(readings);

  // Calculate environmental impact
  const impact = calculateImpact(metrics.totalEnergy, metrics.totalCost);

  return {
    metrics,
    chartData,
    impact,
    period: {
      start: startDate,
      end: endDate,
    },
  };
};

const calculateMetrics = (readings) => {
  if (!readings || readings.length === 0) {
    return {
      totalEnergy: 0,
      totalCost: 0,
      totalSavings: 0,
      peakUsage: 0,
      solarGeneration: 0,
      waterUsage: 0,
      energyTrend: 0,
      costTrend: 0,
      savingsTrend: 0,
    };
  }

  const totalEnergy = readings.reduce((sum, r) => sum + (r.kWh || 0), 0);
  const totalCost = readings.reduce((sum, r) => sum + (r.cost || 0), 0);

  // Solar generation (negative readings)
  const solarReadings = readings.filter((r) => r.powerW < 0);
  const solarGeneration = Math.abs(
    solarReadings.reduce((sum, r) => sum + (r.kWh || 0), 0),
  );

  // Peak usage
  const peakUsage =
    Math.max(...readings.map((r) => Math.abs(r.powerW || 0))) / 1000;

  // Estimate savings (10% of total cost)
  const totalSavings = totalCost * 0.1;

  // Calculate trends
  const midPoint = Math.floor(readings.length / 2);
  const firstHalf = readings.slice(0, midPoint);
  const secondHalf = readings.slice(midPoint);

  const firstHalfEnergy =
    firstHalf.reduce((sum, r) => sum + (r.kWh || 0), 0) / firstHalf.length;
  const secondHalfEnergy =
    secondHalf.reduce((sum, r) => sum + (r.kWh || 0), 0) / secondHalf.length;
  const energyTrend =
    firstHalfEnergy > 0
      ? ((secondHalfEnergy - firstHalfEnergy) / firstHalfEnergy) * 100
      : 0;

  const firstHalfCost =
    firstHalf.reduce((sum, r) => sum + (r.cost || 0), 0) / firstHalf.length;
  const secondHalfCost =
    secondHalf.reduce((sum, r) => sum + (r.cost || 0), 0) / secondHalf.length;
  const costTrend =
    firstHalfCost > 0
      ? ((secondHalfCost - firstHalfCost) / firstHalfCost) * 100
      : 0;

  return {
    totalEnergy,
    totalCost,
    totalSavings,
    peakUsage,
    solarGeneration,
    waterUsage: 0, // Calculate from water heater data
    energyTrend,
    costTrend,
    savingsTrend: -costTrend,
  };
};

const prepareChartData = (readings) => {
  const grouped = {};

  readings.forEach((reading) => {
    const date = new Date(reading.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!grouped[date]) {
      grouped[date] = {
        date,
        consumption: 0,
        generation: 0,
        cost: 0,
      };
    }

    const kWh = reading.kWh || 0;
    if (kWh >= 0) {
      grouped[date].consumption += kWh;
    } else {
      grouped[date].generation += Math.abs(kWh);
    }
    grouped[date].cost += reading.cost || 0;
  });

  return Object.values(grouped);
};

const calculateImpact = (energyKWh, costSaved) => {
  const co2Saved = energyKWh * 0.12; // kg CO2 per kWh (BC Hydro factor)

  return {
    totalCO2Saved: co2Saved,
    treesEquivalent: Math.floor(co2Saved / 20),
    milesSaved: Math.floor(co2Saved / 0.4),
    homesPowered: Math.floor(energyKWh / 30),
    waterSaved: Math.floor(energyKWh * 3),
    cleanEnergyPercent: 45,
    wasteAvoided: Math.floor(co2Saved * 0.8),
    consistencyDays: 45,
  };
};

export const calculateESG = (user, readings, devices) => {
  // Environmental Score (40% renewable, 30% efficiency, 20% reduction, 10% sustainable devices)
  const renewableDevices = devices.filter(
    (d) => d.type === "solar" || d.type === "battery",
  ).length;
  const renewablePercent = Math.min(
    (renewableDevices / Math.max(devices.length, 1)) * 100,
    100,
  );

  const totalEnergy = readings.reduce(
    (sum, r) => sum + Math.abs(r.kWh || 0),
    0,
  );
  const avgDailyEnergy = totalEnergy / Math.max(readings.length / 24, 1);
  const efficiencyScore = Math.max(100 - avgDailyEnergy * 2, 0); // Lower is better

  const environmental = Math.round(
    renewablePercent * 0.4 +
      efficiencyScore * 0.3 +
      15 * 0.2 +
      (renewableDevices > 0 ? 10 : 0),
  );

  // Social Score (base 50, +25 for sharing, +25 for engagement)
  const social =
    50 + (user.sharesData ? 25 : 0) + (user.completedTutorials ? 25 : 0);

  // Governance Score (base 50, +15 for 2FA, +15 for privacy, +20 for transparency)
  const governance =
    50 + (user.twoFactorEnabled ? 15 : 0) + 15 + (user.reportsShared ? 20 : 0);

  const scores = {
    overall: Math.round((environmental + social + governance) / 3),
    environmental: Math.min(environmental, 100),
    social: Math.min(social, 100),
    governance: Math.min(governance, 100),
  };

  const recommendations = [];

  if (scores.environmental < 70) {
    recommendations.push({
      category: "Environmental",
      priority: "high",
      title: "Add Renewable Energy",
      description: "Consider solar panels or renewable energy plan",
      impact: "+15 points",
    });
  }

  if (scores.social < 70) {
    recommendations.push({
      category: "Social",
      priority: "medium",
      title: "Enable Community Sharing",
      description: "Share your impact data with the community",
      impact: "+25 points",
    });
  }

  if (scores.governance < 80) {
    recommendations.push({
      category: "Governance",
      priority: "high",
      title: "Enable Two-Factor Authentication",
      description: "Enhance account security",
      impact: "+15 points",
    });
  }

  return {
    scores,
    recommendations,
  };
};
