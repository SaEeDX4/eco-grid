// Client-side report calculation utilities

export const calculateMetrics = (readings, devices) => {
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
      peakTrend: 0,
      solarTrend: 0,
      waterTrend: 0,
    };
  }

  const totalEnergy = readings.reduce((sum, r) => sum + (r.kWh || 0), 0);
  const totalCost = readings.reduce((sum, r) => sum + (r.cost || 0), 0);

  // Solar is negative power
  const solarReadings = readings.filter((r) => r.powerW < 0);
  const solarGeneration = Math.abs(
    solarReadings.reduce((sum, r) => sum + (r.kWh || 0), 0),
  );

  // Peak usage (max instantaneous power)
  const peakUsage =
    Math.max(...readings.map((r) => Math.abs(r.powerW || 0))) / 1000;

  // Water usage (estimate based on water heater consumption)
  const waterHeaterReadings = readings.filter(
    (r) => r.deviceType === "water_heater",
  );
  const waterUsage =
    waterHeaterReadings.reduce((sum, r) => sum + (r.kWh || 0), 0) * 50; // 50L per kWh estimate

  // Calculate trends (compare first half vs second half)
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

  // Savings estimate (10% of cost for now)
  const totalSavings = totalCost * 0.1;
  const savingsTrend = -costTrend; // Inverse of cost trend

  return {
    totalEnergy: totalEnergy,
    totalCost: totalCost,
    totalSavings: totalSavings,
    peakUsage: peakUsage,
    solarGeneration: solarGeneration,
    waterUsage: waterUsage,
    energyTrend: energyTrend,
    costTrend: costTrend,
    savingsTrend: savingsTrend,
    peakTrend: 0,
    solarTrend: 0,
    waterTrend: 0,
  };
};

export const prepareChartData = (readings, period = "daily") => {
  if (!readings || readings.length === 0) {
    return [];
  }

  // Group by date
  const grouped = {};

  readings.forEach((reading) => {
    const date = new Date(reading.timestamp);
    let key;

    if (period === "hourly") {
      key = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
      });
    } else if (period === "daily") {
      key = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (period === "monthly") {
      key = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } else {
      key = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (!grouped[key]) {
      grouped[key] = {
        date: key,
        consumption: 0,
        generation: 0,
        cost: 0,
        count: 0,
      };
    }

    const kWh = reading.kWh || 0;
    if (kWh >= 0) {
      grouped[key].consumption += kWh;
    } else {
      grouped[key].generation += Math.abs(kWh);
    }
    grouped[key].cost += reading.cost || 0;
    grouped[key].count += 1;
  });

  // Convert to array and sort by date
  return Object.values(grouped).map((item) => ({
    date: item.date,
    consumption: item.consumption,
    generation: item.generation,
    cost: item.cost,
  }));
};

export const calculateImpactData = (totalCO2Saved, totalEnergySaved) => {
  // Environmental conversions based on real-world data
  const treesEquivalent = Math.floor(totalCO2Saved / 20); // 20kg CO2 per tree per year
  const milesSaved = Math.floor(totalCO2Saved / 0.4); // 0.4kg CO2 per mile average car
  const homesPowered = Math.floor(totalEnergySaved / 30); // 30 kWh powers a home for a day
  const waterSaved = Math.floor(totalEnergySaved * 3); // 3 liters per kWh (power plant cooling)
  const cleanEnergyPercent = 45; // Assume 45% from renewables
  const wasteAvoided = Math.floor(totalCO2Saved * 0.8); // 0.8kg waste per kg CO2

  return {
    totalCO2Saved,
    treesEquivalent,
    milesSaved,
    homesPowered,
    waterSaved,
    cleanEnergyPercent,
    wasteAvoided,
    consistencyDays: 45, // Mock for now
  };
};

export const formatPeriodLabel = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
};

export const generateMockReadings = (days = 30) => {
  const readings = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate 24 hourly readings per day
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(date);
      timestamp.setHours(hour);

      // Peak hours (4 PM - 9 PM) have higher consumption
      const isPeak = hour >= 16 && hour < 21;
      const baseConsumption = isPeak ? 2.5 : 1.5;
      const consumption = baseConsumption + (Math.random() * 0.5 - 0.25);

      // Solar generation during day (7 AM - 7 PM)
      const isSolar = hour >= 7 && hour < 19;
      const generation = isSolar ? -(Math.random() * 1.5) : 0;

      const rate = isPeak ? 0.18 : hour < 7 || hour >= 21 ? 0.082 : 0.13;

      readings.push({
        timestamp: timestamp.toISOString(),
        powerW: (consumption + generation) * 1000,
        kWh: consumption + generation,
        cost: consumption * rate,
        deviceType: generation < 0 ? "solar" : "general",
      });
    }
  }

  return readings;
};
