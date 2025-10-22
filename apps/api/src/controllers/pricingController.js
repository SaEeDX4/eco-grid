import Plan from "../models/Plan.js";

export const getPlans = async (req, res) => {
  try {
    const { active = true } = req.query;

    const query = {};
    if (active !== undefined) {
      query.active = active === "true";
    }

    const plans = await Plan.find(query).sort({ sortOrder: 1 });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findOne({ id });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Get plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plan",
    });
  }
};

export const calculateSavings = async (req, res) => {
  try {
    const {
      propertyType = "house",
      monthlyBill = 150,
      numberOfDevices = 10,
    } = req.body;

    // Validation
    if (monthlyBill < 0 || monthlyBill > 100000) {
      return res.status(400).json({
        success: false,
        message: "Monthly bill must be between 0 and 100,000",
      });
    }

    if (numberOfDevices < 0 || numberOfDevices > 1000) {
      return res.status(400).json({
        success: false,
        message: "Number of devices must be between 0 and 1000",
      });
    }

    // Calculate savings (same logic as frontend)
    const baseSavingsRate = 0.25;
    const deviceBonus = Math.min(numberOfDevices * 0.005, 0.15);
    const totalSavingsRate = Math.min(baseSavingsRate + deviceBonus, 0.4);

    const monthlySavings = monthlyBill * totalSavingsRate;
    const annualSavings = monthlySavings * 12;

    // CO2 reduction
    const propertyTypes = {
      apartment: 500,
      house: 900,
      commercial: 2000,
      industrial: 10000,
    };
    const estimatedUsage = propertyTypes[propertyType] || 900;
    const usageSaved = estimatedUsage * totalSavingsRate;
    const co2Reduced = usageSaved * 0.5;
    const annualCO2 = co2Reduced * 12;

    // Recommend plan
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

    res.json({
      success: true,
      results: {
        monthlySavings: Math.round(monthlySavings),
        annualSavings: Math.round(annualSavings),
        co2Reduced: Math.round(co2Reduced),
        annualCO2: Math.round(annualCO2),
        savingsRate: Math.round(totalSavingsRate * 100),
        recommendedPlan,
      },
    });
  } catch (error) {
    console.error("Calculate savings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate savings",
    });
  }
};
