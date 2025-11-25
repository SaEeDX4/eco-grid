import AllocationHistory from "../models/AllocationHistory.js";
import hubAllocationService from "../services/hubAllocationService.js";

export const getAllocationHistory = async (req, res) => {
  try {
    const {
      hubId,
      tenantId,
      startDate,
      endDate,
      eventTypes,
      limit = 100,
      skip = 0,
    } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip),
    };

    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    if (eventTypes) options.eventTypes = eventTypes.split(",");

    let history;

    if (tenantId) {
      history = await AllocationHistory.getTenantHistory(tenantId, options);
    } else if (hubId) {
      history = await AllocationHistory.getHubHistory(hubId, options);
    } else {
      return res.status(400).json({
        success: false,
        message: "Either hubId or tenantId is required",
      });
    }

    res.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error("Get allocation history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch allocation history",
      error: error.message,
    });
  }
};

export const getAllocationStatistics = async (req, res) => {
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
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const statistics = await AllocationHistory.getStatistics(hubId, start, end);

    res.json({
      success: true,
      period: {
        start,
        end,
      },
      statistics,
    });
  } catch (error) {
    console.error("Get allocation statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

export const getViolations = async (req, res) => {
  try {
    const {
      hubId,
      tenantId,
      startDate,
      endDate,
      severityLevels,
      limit = 50,
    } = req.query;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const options = {
      limit: parseInt(limit),
    };

    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    if (severityLevels) options.severityLevels = severityLevels.split(",");

    const violations = await AllocationHistory.getViolations(
      hubId,
      tenantId,
      options
    );

    res.json({
      success: true,
      violations,
      count: violations.length,
    });
  } catch (error) {
    console.error("Get violations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch violations",
      error: error.message,
    });
  }
};

export const getUsagePatterns = async (req, res) => {
  try {
    const { tenantId, days = 7 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required",
      });
    }

    const patterns = await AllocationHistory.getUsagePatterns(
      tenantId,
      parseInt(days)
    );

    res.json({
      success: true,
      tenantId,
      days: parseInt(days),
      patterns,
    });
  } catch (error) {
    console.error("Get usage patterns error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch usage patterns",
      error: error.message,
    });
  }
};

export const detectAnomalies = async (req, res) => {
  try {
    const { tenantId, threshold = 2 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "tenantId is required",
      });
    }

    const detection = await AllocationHistory.detectAnomalies(
      tenantId,
      parseFloat(threshold)
    );

    res.json({
      success: true,
      tenantId,
      threshold: parseFloat(threshold),
      ...detection,
    });
  } catch (error) {
    console.error("Detect anomalies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to detect anomalies",
      error: error.message,
    });
  }
};

export const enforceCapacity = async (req, res) => {
  try {
    const { tenantId, requestedKW, deviceId, deviceType, purpose } = req.body;

    if (!tenantId || !requestedKW) {
      return res.status(400).json({
        success: false,
        message: "tenantId and requestedKW are required",
      });
    }

    const result = await hubAllocationService.enforceCapacityLimits(
      tenantId,
      requestedKW,
      deviceId,
      {
        deviceType,
        purpose,
        triggeredBy: req.user?.role || "system",
        triggeredById: req.user?.id,
        source: "allocation-controller",
      }
    );

    res.json(result);
  } catch (error) {
    console.error("Enforce capacity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enforce capacity",
      error: error.message,
    });
  }
};

export const calculateFairShare = async (req, res) => {
  try {
    const { hubId, method = "proportional", options = {} } = req.body;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const result = await hubAllocationService.calculateFairShare(
      hubId,
      method,
      options
    );

    res.json(result);
  } catch (error) {
    console.error("Calculate fair share error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate fair share",
      error: error.message,
    });
  }
};

export const rebalanceCapacity = async (req, res) => {
  try {
    const { hubId, trigger = "manual", method, options = {} } = req.body;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    if (method) {
      options.method = method;
    }

    const result = await hubAllocationService.rebalanceCapacity(
      hubId,
      trigger,
      options
    );

    res.json(result);
  } catch (error) {
    console.error("Rebalance capacity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to rebalance capacity",
      error: error.message,
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { hubId } = req.query;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const result = await hubAllocationService.getRecommendations(hubId);

    res.json(result);
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
      error: error.message,
    });
  }
};
