// Cost calculator logic

export const propertyTypes = {
  apartment: {
    label: "Apartment",
    baselineDevices: 8,
    averageUsage: 500, // kWh/month
  },
  house: {
    label: "House",
    baselineDevices: 15,
    averageUsage: 900,
  },
  commercial: {
    label: "Small Business",
    baselineDevices: 30,
    averageUsage: 2000,
  },
  industrial: {
    label: "Industrial",
    baselineDevices: 100,
    averageUsage: 10000,
  },
};

export const calculateSavings = (inputs) => {
  const {
    propertyType = "house",
    monthlyBill = 150,
    numberOfDevices = 10,
  } = inputs;

  // Baseline savings percentages
  const baseSavingsRate = 0.25; // 25% base savings
  const deviceBonus = Math.min(numberOfDevices * 0.005, 0.15); // Up to 15% bonus for more devices

  // Total savings rate (capped at 40%)
  const totalSavingsRate = Math.min(baseSavingsRate + deviceBonus, 0.4);

  // Calculate savings
  const monthlySavings = monthlyBill * totalSavingsRate;
  const annualSavings = monthlySavings * 12;

  // CO2 reduction (rough estimate: 0.5 kg CO2 per kWh saved)
  const property = propertyTypes[propertyType];
  const estimatedUsage = property?.averageUsage || 900;
  const usageSaved = estimatedUsage * totalSavingsRate;
  const co2Reduced = usageSaved * 0.5; // kg per month
  const annualCO2 = co2Reduced * 12;

  // Recommend plan based on usage
  let recommendedPlan = "household";
  if (
    propertyType === "commercial" ||
    propertyType === "industrial" ||
    numberOfDevices > 30
  ) {
    recommendedPlan = "sme";
  }
  if (numberOfDevices > 100 || monthlyBill > 2000) {
    recommendedPlan = "enterprise";
  }

  // ROI calculation
  const planCosts = {
    household: 15,
    sme: 300,
    enterprise: 500, // Estimated
  };
  const monthlyCost = planCosts[recommendedPlan];
  const netSavings = monthlySavings - monthlyCost;
  const roi = netSavings > 0 ? (netSavings / monthlyCost) * 100 : 0;

  return {
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    co2Reduced: Math.round(co2Reduced),
    annualCO2: Math.round(annualCO2),
    savingsRate: Math.round(totalSavingsRate * 100),
    recommendedPlan,
    netMonthlySavings: Math.round(netSavings),
    roi: Math.round(roi),
  };
};

export const formatCurrency = (amount, currency = "CAD") => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-CA").format(num);
};
