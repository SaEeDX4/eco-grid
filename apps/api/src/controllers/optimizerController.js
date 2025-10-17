import OptimizerPlan from "../models/OptimizerPlan.js";
import Device from "../models/Device.js";
import AuditLog from "../models/AuditLog.js";
import {
  optimizeSchedule,
  calculateSavings,
  validateSchedule,
} from "../services/optimizationService.js";
import { getAIExplanation } from "../services/aiService.js";

export const calculateOptimization = async (req, res) => {
  try {
    const { devices, mode } = req.body;
    const userId = req.user.id;

    if (!devices || devices.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No devices provided",
      });
    }

    // Generate optimized schedule
    const beforeSchedule = optimizeSchedule(devices, "normal");
    const afterSchedule = optimizeSchedule(devices, mode);

    // Calculate savings
    const savingsData = calculateSavings(beforeSchedule, afterSchedule);

    // Validate schedule
    const validationResult = validateSchedule(afterSchedule);

    // Prepare response data
    const beforeData = {
      dailyCost: savingsData.beforeCost,
      monthlyCost: savingsData.beforeCost * 30,
      yearlyCost: savingsData.beforeCost * 365,
    };

    const afterData = {
      dailyCost: savingsData.afterCost,
      monthlyCost: savingsData.afterCost * 30,
      yearlyCost: savingsData.afterCost * 365,
    };

    const savings = {
      dailySavings: savingsData.dailySavings,
      monthlySavings: savingsData.monthlySavings,
      yearlySavings: savingsData.yearlySavings,
      percentSaved: savingsData.percentSaved,
      co2Reduced: savingsData.co2Reduced,
    };

    res.json({
      success: true,
      optimizedSchedule: afterSchedule,
      beforeData,
      afterData,
      savings,
      validation: validationResult,
    });
  } catch (error) {
    console.error("Calculate optimization error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate optimization",
    });
  }
};

export const explainPlan = async (req, res) => {
  try {
    const { schedule, mode, savings } = req.body;

    // Get AI explanation from Claude
    const explanation = await getAIExplanation(schedule, mode, savings);

    res.json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error("Explain plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
    });
  }
};

export const acceptPlan = async (req, res) => {
  try {
    const { schedule, mode, savings } = req.body;
    const userId = req.user.id;

    // Save optimization plan
    const plan = await OptimizerPlan.create({
      userId,
      mode,
      schedule,
      expectedSavings: savings.monthlySavings,
      expectedCO2: savings.co2Reduced,
      status: "active",
      activatedAt: new Date(),
    });

    // Update device schedules
    for (const item of schedule) {
      await Device.updateOne(
        { _id: item.deviceId, ownerId: userId },
        {
          $set: {
            "settings.schedule": {
              startHour: item.startHour,
              endHour: item.endHour,
              enabled: true,
            },
          },
        },
      );
    }

    // Log the acceptance
    await AuditLog.create({
      userId,
      action: "device_control",
      entity: "OptimizerPlan",
      entityId: plan._id,
      details: {
        action: "plan_accepted",
        mode,
        devicesCount: schedule.length,
        expectedSavings: savings.monthlySavings,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Optimization plan activated successfully",
      plan: {
        id: plan._id,
        mode: plan.mode,
        expectedSavings: plan.expectedSavings,
      },
    });
  } catch (error) {
    console.error("Accept plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to activate optimization plan",
    });
  }
};

export const getActivePlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const activePlan = await OptimizerPlan.findOne({
      userId,
      status: "active",
    }).sort({ activatedAt: -1 });

    if (!activePlan) {
      return res.json({
        success: true,
        plan: null,
      });
    }

    res.json({
      success: true,
      plan: {
        id: activePlan._id,
        mode: activePlan.mode,
        schedule: activePlan.schedule,
        expectedSavings: activePlan.expectedSavings,
        activatedAt: activePlan.activatedAt,
      },
    });
  } catch (error) {
    console.error("Get active plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active plan",
    });
  }
};
