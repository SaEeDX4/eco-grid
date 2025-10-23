export const calculateMetrics = (data) => {
  // Calculate various impact metrics

  const metrics = {
    costSavings: 0,
    carbonReduction: 0,
    energySaved: 0,
    roi: 0,
  };

  // Parse cost savings
  if (data.costSavings) {
    metrics.costSavings =
      parseFloat(data.costSavings.replace(/[^0-9.-]+/g, "")) || 0;
  }

  // Parse carbon reduction
  if (data.carbonReduction) {
    metrics.carbonReduction =
      parseFloat(data.carbonReduction.replace(/[^0-9.-]+/g, "")) || 0;
  }

  // Parse energy saved
  if (data.energySaved) {
    metrics.energySaved =
      parseFloat(data.energySaved.replace(/[^0-9.-]+/g, "")) || 0;
  }

  // Parse ROI
  if (data.roi) {
    metrics.roi = parseFloat(data.roi.replace(/[^0-9.-]+/g, "")) || 0;
  }

  return metrics;
};

export const formatMetric = (value, type) => {
  switch (type) {
    case "currency":
      return `$${value.toLocaleString()}/year`;
    case "carbon":
      return `${value.toLocaleString()} tonnes CO₂`;
    case "percentage":
      return `${value}%`;
    case "months":
      return `${value} months`;
    case "energy":
      return `${value.toLocaleString()} kWh`;
    default:
      return value.toString();
  }
};

export const aggregateMetrics = (items) => {
  const totals = {
    costSavings: 0,
    carbonReduction: 0,
    energySaved: 0,
    roiSum: 0,
    roiCount: 0,
  };

  items.forEach((item) => {
    if (item.metrics) {
      const parsed = calculateMetrics(item.metrics);
      totals.costSavings += parsed.costSavings;
      totals.carbonReduction += parsed.carbonReduction;
      totals.energySaved += parsed.energySaved;

      if (parsed.roi > 0) {
        totals.roiSum += parsed.roi;
        totals.roiCount++;
      }
    }
  });

  return {
    totalSavings: totals.costSavings,
    totalCO2: totals.carbonReduction,
    totalEnergy: totals.energySaved,
    avgROI:
      totals.roiCount > 0 ? Math.round(totals.roiSum / totals.roiCount) : 0,
  };
};
