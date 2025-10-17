// ESG scoring based on industry standards (GRI, SASB)

export const calculateESGScore = (userData, consumptionData, devicesData) => {
  const environmental = calculateEnvironmentalScore(
    consumptionData,
    devicesData,
  );
  const social = calculateSocialScore(userData);
  const governance = calculateGovernanceScore(userData);

  return {
    overall: Math.round((environmental + social + governance) / 3),
    environmental,
    social,
    governance,
    breakdown: {
      environmental: getEnvironmentalBreakdown(consumptionData, devicesData),
      social: getSocialBreakdown(userData),
      governance: getGovernanceBreakdown(userData),
    },
  };
};

const calculateEnvironmentalScore = (consumptionData, devicesData) => {
  let score = 0;
  const maxScore = 100;

  // Renewable Energy Usage (40 points)
  const renewablePercent = consumptionData.renewablePercent || 0;
  score += (renewablePercent / 100) * 40;

  // Energy Efficiency (30 points)
  const efficiencyScore = consumptionData.efficiencyScore || 50;
  score += (efficiencyScore / 100) * 30;

  // Carbon Footprint Reduction (20 points)
  const reductionPercent = consumptionData.carbonReduction || 0;
  score += (reductionPercent / 100) * 20;

  // Sustainable Devices (10 points)
  const sustainableDevices = devicesData.filter(
    (d) => d.type === "solar" || d.type === "battery" || d.type === "heat_pump",
  ).length;
  const sustainableRatio = sustainableDevices / Math.max(devicesData.length, 1);
  score += sustainableRatio * 10;

  return Math.min(Math.round(score), maxScore);
};

const calculateSocialScore = (userData) => {
  let score = 50; // Base score

  // Community Sharing (25 points)
  if (userData.sharesData) score += 25;

  // Educational Engagement (25 points)
  if (userData.completedTutorials) score += 15;
  if (userData.sharedTips) score += 10;

  return Math.min(score, 100);
};

const calculateGovernanceScore = (userData) => {
  let score = 50; // Base score

  // Data Privacy (30 points)
  if (userData.twoFactorEnabled) score += 15;
  if (userData.privacySettingsConfigured) score += 15;

  // Transparency (20 points)
  if (userData.reportsShared) score += 20;

  return Math.min(score, 100);
};

const getEnvironmentalBreakdown = (consumptionData, devicesData) => {
  return {
    renewableEnergy: consumptionData.renewablePercent || 0,
    energyEfficiency: consumptionData.efficiencyScore || 50,
    carbonReduction: consumptionData.carbonReduction || 0,
    sustainableDevices: devicesData.filter(
      (d) =>
        d.type === "solar" || d.type === "battery" || d.type === "heat_pump",
    ).length,
  };
};

const getSocialBreakdown = (userData) => {
  return {
    communitySharing: userData.sharesData ? 100 : 0,
    education: userData.completedTutorials ? 75 : 0,
    engagement: userData.sharedTips ? 100 : 0,
  };
};

const getGovernanceBreakdown = (userData) => {
  return {
    dataPrivacy: userData.twoFactorEnabled ? 100 : 50,
    transparency: userData.reportsShared ? 100 : 0,
    compliance: 75, // Assume good compliance
  };
};

export const getESGRecommendations = (esgData) => {
  const recommendations = [];

  // Environmental
  if (esgData.environmental < 70) {
    recommendations.push({
      category: "Environmental",
      priority: "high",
      title: "Increase Renewable Energy",
      description:
        "Consider adding solar panels or switching to a renewable energy plan",
      impact: "+15 points",
    });
  }

  if (esgData.environmental < 80) {
    recommendations.push({
      category: "Environmental",
      priority: "medium",
      title: "Optimize Energy Usage",
      description: "Use the Optimizer to shift loads to off-peak hours",
      impact: "+10 points",
    });
  }

  // Social
  if (esgData.social < 70) {
    recommendations.push({
      category: "Social",
      priority: "medium",
      title: "Share Your Impact",
      description: "Enable data sharing to contribute to community insights",
      impact: "+25 points",
    });
  }

  // Governance
  if (esgData.governance < 80) {
    recommendations.push({
      category: "Governance",
      priority: "high",
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      impact: "+15 points",
    });
  }

  return recommendations;
};

export const calculateCarbonFootprint = (energyKWh) => {
  // BC Hydro emission factor: ~0.01 kg CO2e per kWh (very clean grid)
  // US average: ~0.4 kg CO2e per kWh
  // We'll use a blended rate for Canada
  const emissionFactor = 0.12; // kg CO2e per kWh

  return {
    total: energyKWh * emissionFactor,
    perDay: (energyKWh / 30) * emissionFactor,
    perMonth: energyKWh * emissionFactor,
    perYear: energyKWh * 12 * emissionFactor,
  };
};

export const getCarbonOffsetOptions = (carbonKg) => {
  // Carbon offset pricing: ~$15-30 per tonne
  const carbonTonnes = carbonKg / 1000;
  const costLow = carbonTonnes * 15;
  const costHigh = carbonTonnes * 30;

  return {
    carbonKg,
    carbonTonnes,
    offsetCost: {
      low: costLow,
      high: costHigh,
      average: (costLow + costHigh) / 2,
    },
    equivalents: {
      trees: Math.floor(carbonKg / 20),
      solarPanels: Math.floor(carbonTonnes / 0.5),
      windTurbines: Math.floor(carbonTonnes / 2),
    },
  };
};
