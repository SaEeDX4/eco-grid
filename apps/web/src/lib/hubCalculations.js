/**
 * Calculate total hub revenue from tenants
 */
export const calculateTotalRevenue = (tenants) => {
  if (!tenants || tenants.length === 0) return 0;
  return tenants.reduce((sum, tenant) => {
    return sum + (tenant.billing?.currentBalanceCAD || 0);
  }, 0);
};

/**
 * Calculate average utilization across tenants
 */
export const calculateAvgUtilization = (tenants) => {
  if (!tenants || tenants.length === 0) return 0;
  const total = tenants.reduce((sum, tenant) => {
    return sum + (tenant.performance?.avgUtilization || 0);
  }, 0);
  return total / tenants.length;
};

/**
 * Calculate hub efficiency
 */
export const calculateHubEfficiency = (hub) => {
  if (!hub) return 0;

  const { totalKW, allocatedKW } = hub.capacity;
  if (totalKW === 0) return 0;

  const allocationEfficiency = (allocatedKW / totalKW) * 100;
  const utilizationEfficiency = hub.capacity.utilizationPercent || 0;

  // Weighted average: 60% utilization, 40% allocation
  return utilizationEfficiency * 0.6 + allocationEfficiency * 0.4;
};

/**
 * Calculate projected monthly revenue
 */
export const calculateProjectedRevenue = (
  currentRevenue,
  daysInMonth,
  currentDay
) => {
  if (!currentRevenue || !currentDay || currentDay === 0) return 0;
  const dailyAverage = currentRevenue / currentDay;
  return dailyAverage * daysInMonth;
};

/**
 * Calculate capacity headroom
 */
export const calculateHeadroom = (hub) => {
  if (!hub) return 0;
  const { totalKW, allocatedKW, reservedKW } = hub.capacity;
  return totalKW - allocatedKW - reservedKW;
};

/**
 * Calculate tenant contribution to hub
 */
export const calculateTenantContribution = (tenant, hub) => {
  if (!tenant || !hub) return 0;
  const totalAllocated = hub.capacity.allocatedKW;
  if (totalAllocated === 0) return 0;
  return (tenant.capacity.allocatedKW / totalAllocated) * 100;
};

/**
 * Calculate fair share allocation
 */
export const calculateFairShareAllocation = (
  hub,
  tenants,
  method = "proportional"
) => {
  if (!hub || !tenants || tenants.length === 0) return [];

  const totalCapacity = hub.capacity.totalKW;
  const allocations = [];

  switch (method) {
    case "equal-split":
      const equalShare = totalCapacity / tenants.length;
      tenants.forEach((tenant) => {
        allocations.push({
          tenantId: tenant._id,
          tenantName: tenant.name,
          allocatedKW: equalShare,
          method: "equal-split",
        });
      });
      break;

    case "proportional":
      const totalSquareFootage = tenants.reduce(
        (sum, t) => sum + (t.location?.squareFootage || 1),
        0
      );

      tenants.forEach((tenant) => {
        const sqft = tenant.location?.squareFootage || 1;
        const proportion = sqft / totalSquareFootage;
        allocations.push({
          tenantId: tenant._id,
          tenantName: tenant.name,
          allocatedKW: totalCapacity * proportion,
          method: "proportional",
          basis: "squareFootage",
        });
      });
      break;

    case "weighted":
      const totalUsage = tenants.reduce(
        (sum, t) => sum + (t.usage?.month?.avgKW || 1),
        0
      );

      tenants.forEach((tenant) => {
        const usage = tenant.usage?.month?.avgKW || 1;
        const weight = usage / totalUsage;
        allocations.push({
          tenantId: tenant._id,
          tenantName: tenant.name,
          allocatedKW: totalCapacity * weight,
          method: "weighted",
          basis: "historical-usage",
        });
      });
      break;

    default:
      return [];
  }

  return allocations;
};

/**
 * Calculate cost per kWh for tenant
 */
export const calculateCostPerKWh = (tenant) => {
  if (!tenant) return 0;

  const totalKWh = tenant.usage?.month?.totalKWh || 0;
  const totalCost = tenant.billing?.currentBalanceCAD || 0;

  if (totalKWh === 0) return 0;
  return totalCost / totalKWh;
};

/**
 * Calculate demand charge
 */
export const calculateDemandCharge = (peakDemandKW, ratePerKW) => {
  return peakDemandKW * ratePerKW;
};

/**
 * Calculate energy charge
 */
export const calculateEnergyCharge = (energyKWh, ratePerKWh) => {
  return energyKWh * ratePerKWh;
};

/**
 * Calculate overage charge
 */
export const calculateOverageCharge = (overageKWh, baseRate, multiplier) => {
  return overageKWh * baseRate * multiplier;
};

/**
 * Calculate total bill
 */
export const calculateTotalBill = (charges) => {
  const {
    baseCAD = 0,
    usageCAD = 0,
    demandCAD = 0,
    overageCAD = 0,
    creditsCAD = 0,
  } = charges;

  return baseCAD + usageCAD + demandCAD + overageCAD - creditsCAD;
};

/**
 * Calculate ROI for hub investment
 */
export const calculateHubROI = (
  initialInvestment,
  monthlyRevenue,
  monthlyOperatingCost
) => {
  const monthlyProfit = monthlyRevenue - monthlyOperatingCost;
  const annualProfit = monthlyProfit * 12;

  if (initialInvestment === 0) return 0;

  const roi = (annualProfit / initialInvestment) * 100;
  const paybackMonths = initialInvestment / monthlyProfit;

  return {
    roi,
    paybackMonths,
    annualProfit,
  };
};

/**
 * Calculate capacity factor
 */
export const calculateCapacityFactor = (actualKWh, ratedKW, hours) => {
  const maxPossibleKWh = ratedKW * hours;
  if (maxPossibleKWh === 0) return 0;
  return (actualKWh / maxPossibleKWh) * 100;
};

/**
 * Calculate load factor
 */
export const calculateLoadFactor = (avgKW, peakKW) => {
  if (peakKW === 0) return 0;
  return (avgKW / peakKW) * 100;
};

/**
 * Calculate diversity factor
 */
export const calculateDiversityFactor = (
  sumOfIndividualPeaks,
  coincidentPeak
) => {
  if (coincidentPeak === 0) return 0;
  return sumOfIndividualPeaks / coincidentPeak;
};

/**
 * Calculate peak demand reduction potential
 */
export const calculatePeakReductionPotential = (currentPeak, targetPeak) => {
  const reduction = currentPeak - targetPeak;
  const reductionPercent = (reduction / currentPeak) * 100;

  return {
    reductionKW: reduction,
    reductionPercent,
    targetPeak,
  };
};

/**
 * Aggregate metrics by period
 */
export const aggregateMetricsByPeriod = (data, period = "daily") => {
  if (!data || data.length === 0) return [];

  const aggregated = {};

  data.forEach((item) => {
    const date = new Date(item.timestamp || item.createdAt);
    let key;

    switch (period) {
      case "hourly":
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`;
        break;
      case "daily":
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        break;
      case "weekly":
        const weekNum = Math.ceil(date.getDate() / 7);
        key = `${date.getFullYear()}-${date.getMonth() + 1}-W${weekNum}`;
        break;
      case "monthly":
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      default:
        key = date.toISOString().split("T")[0];
    }

    if (!aggregated[key]) {
      aggregated[key] = {
        period: key,
        count: 0,
        total: 0,
        values: [],
      };
    }

    aggregated[key].count++;
    aggregated[key].total += item.value || item.grantedKW || 0;
    aggregated[key].values.push(item);
  });

  // Calculate averages
  return Object.values(aggregated).map((agg) => ({
    ...agg,
    average: agg.total / agg.count,
    max: Math.max(...agg.values.map((v) => v.value || v.grantedKW || 0)),
    min: Math.min(...agg.values.map((v) => v.value || v.grantedKW || 0)),
  }));
};

/**
 * Calculate violation rate
 */
export const calculateViolationRate = (totalAllocations, violations) => {
  if (totalAllocations === 0) return 0;
  return (violations / totalAllocations) * 100;
};

/**
 * Calculate compliance score
 */
export const calculateComplianceScore = (tenant) => {
  if (!tenant) return 100;

  const baseScore = 100;
  const violationPenalty = Math.min(tenant.compliance?.violations || 0, 20) * 2;
  const utilizationBonus = tenant.performance?.avgUtilization > 80 ? 5 : 0;

  return Math.max(
    0,
    Math.min(100, baseScore - violationPenalty + utilizationBonus)
  );
};

/**
 * Predict future capacity needs
 */
export const predictCapacityNeeds = (
  historicalData,
  growthRate = 0.05,
  months = 12
) => {
  if (!historicalData || historicalData.length === 0) return [];

  const latestUsage = historicalData[historicalData.length - 1]?.avgKW || 0;
  const predictions = [];

  for (let i = 1; i <= months; i++) {
    const predicted = latestUsage * Math.pow(1 + growthRate, i);
    predictions.push({
      month: i,
      predictedKW: predicted,
      confidence: Math.max(0.5, 1 - i * 0.05), // Confidence decreases over time
    });
  }

  return predictions;
};

/**
 * Calculate cost savings from optimization
 */
export const calculateOptimizationSavings = (
  beforeKWh,
  afterKWh,
  ratePerKWh
) => {
  const energySaved = beforeKWh - afterKWh;
  const costSavings = energySaved * ratePerKWh;
  const savingsPercent = (energySaved / beforeKWh) * 100;

  return {
    energySavedKWh: energySaved,
    costSavingsCAD: costSavings,
    savingsPercent,
  };
};
