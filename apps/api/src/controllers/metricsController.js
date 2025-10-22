import ImpactMetric from "../models/ImpactMetric.js";

export const getImpactMetrics = async (req, res) => {
  try {
    // Get latest all-time metrics
    let metrics = await ImpactMetric.getLatest();

    // If no metrics exist, create initial ones
    if (!metrics) {
      metrics = await ImpactMetric.create({
        energySavedKWh: 127543,
        moneySavedCAD: 38263,
        co2ReducedKg: 38134,
        activeHomes: 127,
        activeBusinesses: 12,
        devicesManaged: 1842,
        waterSavedLiters: 15234,
        peakDemandReductionKW: 487,
        aggregationType: "all-time",
      });
    }

    res.json({
      success: true,
      metrics: {
        energySavedKWh: metrics.energySavedKWh,
        moneySavedCAD: metrics.moneySavedCAD,
        co2ReducedKg: metrics.co2ReducedKg,
        activeHomes: metrics.activeHomes,
        activeBusinesses: metrics.activeBusinesses,
        devicesManaged: metrics.devicesManaged,
        waterSavedLiters: metrics.waterSavedLiters,
        peakDemandReductionKW: metrics.peakDemandReductionKW,
        lastUpdated: metrics.timestamp,
      },
    });
  } catch (error) {
    console.error("Get impact metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch impact metrics",
    });
  }
};

export const getHistoricalMetrics = async (req, res) => {
  try {
    const { period = "daily", limit = 30 } = req.query;

    const metrics = await ImpactMetric.find({
      aggregationType: period,
    })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      metrics: metrics.reverse(), // Chronological order
      period,
      count: metrics.length,
    });
  } catch (error) {
    console.error("Get historical metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch historical metrics",
    });
  }
};

export const updateMetrics = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Calculate and store new metrics
    const newMetric = await ImpactMetric.calculateAndStore();

    res.json({
      success: true,
      message: "Metrics updated successfully",
      metrics: newMetric,
    });
  } catch (error) {
    console.error("Update metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update metrics",
    });
  }
};

export const getMilestoneProgress = async (req, res) => {
  try {
    const latest = await ImpactMetric.getLatest();

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No metrics found",
      });
    }

    // Define milestone targets
    const milestones = {
      households: {
        current: latest.activeHomes,
        target: 2000,
        targetDate: "2027",
      },
      co2Saved: {
        current: Math.round(latest.co2ReducedKg / 1000), // Convert to tonnes
        target: 500,
        targetDate: "2027",
      },
      businesses: {
        current: latest.activeBusinesses,
        target: 100,
        targetDate: "2030",
      },
      energySaved: {
        current: Math.round(latest.energySavedKWh / 1000000), // Convert to MWh
        target: 10,
        targetDate: "2027",
      },
    };

    res.json({
      success: true,
      milestones,
    });
  } catch (error) {
    console.error("Get milestone progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch milestone progress",
    });
  }
};
