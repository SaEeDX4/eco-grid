import HubRevenue from "../models/HubRevenue.js";
import hubRevenueService from "../services/hubRevenueService.js";

export const getRevenuePeriods = async (req, res) => {
  try {
    const { hubId, startDate, endDate, status } = req.query;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const query = { hubId };

    if (status) query.status = status;

    if (startDate || endDate) {
      query["period.start"] = {};
      if (startDate) query["period.start"].$gte = new Date(startDate);
      if (endDate) query["period.start"].$lte = new Date(endDate);
    }

    const periods = await HubRevenue.find(query)
      .populate("tenantCharges.tenantId", "name businessType")
      .sort({ "period.start": -1 })
      .lean();

    res.json({
      success: true,
      periods,
    });
  } catch (error) {
    console.error("Get revenue periods error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue periods",
      error: error.message,
    });
  }
};

export const getRevenuePeriodById = async (req, res) => {
  try {
    const { id } = req.params;

    const period = await HubRevenue.findById(id)
      .populate("hubId")
      .populate("tenantCharges.tenantId", "name businessType contactInfo")
      .lean();

    if (!period) {
      return res.status(404).json({
        success: false,
        message: "Revenue period not found",
      });
    }

    res.json({
      success: true,
      period,
    });
  } catch (error) {
    console.error("Get revenue period by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue period",
      error: error.message,
    });
  }
};

export const getCurrentPeriod = async (req, res) => {
  try {
    const { hubId } = req.query;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const period = await HubRevenue.getCurrentPeriod(hubId);

    if (!period) {
      return res.json({
        success: true,
        period: null,
        message: "No current period found",
      });
    }

    res.json({
      success: true,
      period,
    });
  } catch (error) {
    console.error("Get current period error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch current period",
      error: error.message,
    });
  }
};

export const createMonthlyPeriod = async (req, res) => {
  try {
    const { hubId, year, month } = req.body;

    if (!hubId || year === undefined || month === undefined) {
      return res.status(400).json({
        success: false,
        message: "hubId, year, and month are required",
      });
    }

    const result = await hubRevenueService.createMonthlyPeriod(
      hubId,
      parseInt(year),
      parseInt(month)
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Create monthly period error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create monthly period",
      error: error.message,
    });
  }
};

export const calculateTenantBill = async (req, res) => {
  try {
    const { tenantId, period = "current" } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required",
      });
    }

    const result = await hubRevenueService.calculateTenantBill(
      tenantId,
      period
    );

    res.json(result);
  } catch (error) {
    console.error("Calculate tenant bill error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate tenant bill",
      error: error.message,
    });
  }
};

export const allocateSharedCosts = async (req, res) => {
  try {
    const { hubId, period } = req.body;

    if (!hubId || !period) {
      return res.status(400).json({
        success: false,
        message: "hubId and period are required",
      });
    }

    const result = await hubRevenueService.allocateSharedCosts(hubId, period);

    res.json(result);
  } catch (error) {
    console.error("Allocate shared costs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to allocate shared costs",
      error: error.message,
    });
  }
};

export const distributeVPPRevenue = async (req, res) => {
  try {
    const { hubId, poolId, period } = req.body;

    if (!hubId || !poolId || !period) {
      return res.status(400).json({
        success: false,
        message: "hubId, poolId, and period are required",
      });
    }

    const result = await hubRevenueService.distributeVPPRevenue(
      hubId,
      poolId,
      period
    );

    res.json(result);
  } catch (error) {
    console.error("Distribute VPP revenue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to distribute VPP revenue",
      error: error.message,
    });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const { tenantId, period } = req.body;

    if (!tenantId || !period) {
      return res.status(400).json({
        success: false,
        message: "tenantId and period are required",
      });
    }

    const result = await hubRevenueService.generateInvoice(tenantId, period);

    res.json(result);
  } catch (error) {
    console.error("Generate invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: error.message,
    });
  }
};

export const finalizePeriod = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await hubRevenueService.finalizePeriod(id);

    res.json(result);
  } catch (error) {
    console.error("Finalize period error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to finalize period",
      error: error.message,
    });
  }
};

export const getRevenueSummary = async (req, res) => {
  try {
    const { hubId, startDate, endDate } = req.query;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const result = await hubRevenueService.getRevenueSummary(hubId, start, end);

    res.json(result);
  } catch (error) {
    console.error("Get revenue summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue summary",
      error: error.message,
    });
  }
};

export const getTenantPaymentHistory = async (req, res) => {
  try {
    const { tenantId, months = 12 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required",
      });
    }

    const result = await hubRevenueService.getTenantPaymentHistory(
      tenantId,
      parseInt(months)
    );

    res.json(result);
  } catch (error) {
    console.error("Get tenant payment history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};

export const applyCredits = async (req, res) => {
  try {
    const { tenantId, amountCAD, reason } = req.body;

    if (!tenantId || !amountCAD || !reason) {
      return res.status(400).json({
        success: false,
        message: "tenantId, amountCAD, and reason are required",
      });
    }

    const result = await hubRevenueService.applyCredits(
      tenantId,
      amountCAD,
      reason
    );

    res.json(result);
  } catch (error) {
    console.error("Apply credits error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply credits",
      error: error.message,
    });
  }
};
