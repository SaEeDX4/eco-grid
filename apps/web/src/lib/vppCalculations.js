// Revenue calculations and projections

export const calculateMonthlyProjection = (
  historicalData,
  daysInMonth = 30
) => {
  if (!historicalData || historicalData.length === 0) {
    return {
      projected: 0,
      confidence: "low",
    };
  }

  // Calculate daily average from historical data
  const totalRevenue = historicalData.reduce(
    (sum, record) => sum + record.netRevenue,
    0
  );
  const avgDailyRevenue = totalRevenue / historicalData.length;

  // Project for full month
  const projected = avgDailyRevenue * daysInMonth;

  // Determine confidence based on data points
  let confidence = "low";
  if (historicalData.length >= 60) confidence = "high";
  else if (historicalData.length >= 30) confidence = "moderate";

  return {
    projected,
    confidence,
    avgDaily: avgDailyRevenue,
  };
};

export const calculateROI = (totalRevenue, deviceCost, months) => {
  if (!deviceCost || deviceCost === 0) return null;

  const monthlyRevenue = totalRevenue / months;
  const paybackMonths = deviceCost / monthlyRevenue;
  const annualReturn = ((monthlyRevenue * 12) / deviceCost) * 100;

  return {
    paybackMonths: Math.round(paybackMonths),
    annualReturn: annualReturn.toFixed(1),
  };
};

export const calculateEffectiveRate = (revenue, energyKWh) => {
  if (!energyKWh || energyKWh === 0) return 0;
  return revenue / energyKWh;
};

export const calculateBatteryCycleValue = (cyclesUsed, totalRevenue) => {
  if (!cyclesUsed || cyclesUsed === 0) return 0;
  return totalRevenue / cyclesUsed;
};

export const estimateBatteryDegradation = (cyclesUsed, batteryCapacityKWh) => {
  // Simplified linear degradation model
  // Assumes 80% capacity at 3000 cycles
  const degradationPerCycle = 0.02 / 3000;
  const totalDegradation = cyclesUsed * degradationPerCycle;
  const capacityLoss = batteryCapacityKWh * totalDegradation;

  return {
    degradationPercent: (totalDegradation * 100).toFixed(3),
    capacityLossKWh: capacityLoss.toFixed(2),
    remainingCapacityPercent: ((1 - totalDegradation) * 100).toFixed(1),
  };
};

export const calculateNetRevenueAfterFees = (
  grossRevenue,
  platformFee,
  operatorFee
) => {
  return grossRevenue - platformFee - operatorFee;
};

export const calculateFeeAmounts = (
  grossRevenue,
  platformPercent,
  operatorPercent
) => {
  const platformFee = grossRevenue * (platformPercent / 100);
  const operatorFee = grossRevenue * (operatorPercent / 100);
  const netRevenue = grossRevenue - platformFee - operatorFee;

  return {
    platformFee,
    operatorFee,
    totalFees: platformFee + operatorFee,
    netRevenue,
    feePercent: platformPercent + operatorPercent,
  };
};

export const calculatePoolContribution = (deviceCapacityKW, poolTotalMW) => {
  const poolTotalKW = poolTotalMW * 1000;
  if (poolTotalKW === 0) return 0;
  return (deviceCapacityKW / poolTotalKW) * 100;
};

export const calculateExpectedDispatchRevenue = (
  capacityKW,
  durationHours,
  pricePerMWh
) => {
  const energyMWh = (capacityKW / 1000) * durationHours;
  return energyMWh * pricePerMWh;
};

export const calculateUtilizationRate = (hoursDispatched, hoursAvailable) => {
  if (hoursAvailable === 0) return 0;
  return (hoursDispatched / hoursAvailable) * 100;
};

export const aggregateRevenueByPeriod = (
  revenueRecords,
  period = "monthly"
) => {
  const aggregated = {};

  revenueRecords.forEach((record) => {
    let key;
    const date = new Date(record.period.start);

    switch (period) {
      case "daily":
        key = date.toISOString().split("T")[0];
        break;
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "monthly":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
      case "quarterly":
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
      default:
        key = date.toISOString().split("T")[0];
    }

    if (!aggregated[key]) {
      aggregated[key] = {
        period: key,
        gross: 0,
        net: 0,
        fees: 0,
        dispatches: 0,
      };
    }

    aggregated[key].gross += record.grossRevenue || 0;
    aggregated[key].net += record.netRevenue || 0;
    aggregated[key].fees +=
      (record.platformFee || 0) + (record.operatorFee || 0);
    aggregated[key].dispatches += record.dispatches?.count || 0;
  });

  return Object.values(aggregated).sort((a, b) =>
    a.period.localeCompare(b.period)
  );
};
