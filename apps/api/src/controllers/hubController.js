import Hub from "../models/Hub.js";
import hubAllocationService from "../services/hubAllocationService.js";
import hubUsageMetricsService from "../services/hubUsageMetricsService.js";
import hubDispatchService from "../services/hubDispatchService.js";

export const getHubs = async (req, res) => {
  try {
    const { organizationId } = req.query;

    const query = {};
    if (organizationId) {
      query.organizationId = organizationId;
    } else if (req.user) {
      query.organizationId = req.user.id;
    }

    const hubs = await Hub.find(query)
      .populate("tenants", "name businessType status")
      .populate("activePolicyId", "name type")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      hubs,
    });
  } catch (error) {
    console.error("Get hubs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hubs",
      error: error.message,
    });
  }
};

export const getHubById = async (req, res) => {
  try {
    const { id } = req.params;

    const hub = await Hub.getFullDetails(id);

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    res.json({
      success: true,
      hub,
    });
  } catch (error) {
    console.error("Get hub by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hub",
      error: error.message,
    });
  }
};

export const createHub = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      location,
      capacity,
      devices,
      billing,
      vpp,
      settings,
    } = req.body;

    const hub = await Hub.create({
      name,
      description,
      organizationId: req.user.id,
      type,
      location,
      capacity: {
        totalKW: capacity.totalKW,
        allocatedKW: 0,
        availableKW: capacity.totalKW,
        reservedKW: 0,
      },
      devices: devices || [],
      billing: billing || {},
      vpp: vpp || { enabled: false },
      settings: settings || {},
      status: "active",
    });

    res.status(201).json({
      success: true,
      hub,
      message: "Hub created successfully",
    });
  } catch (error) {
    console.error("Create hub error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create hub",
      error: error.message,
    });
  }
};

export const updateHub = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hub = await Hub.findById(id);

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    // Update allowed fields
    const allowedFields = [
      "name",
      "description",
      "location",
      "billing",
      "vpp",
      "settings",
      "alerts",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        hub[field] = updates[field];
      }
    });

    await hub.save();

    res.json({
      success: true,
      hub,
      message: "Hub updated successfully",
    });
  } catch (error) {
    console.error("Update hub error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update hub",
      error: error.message,
    });
  }
};

export const deleteHub = async (req, res) => {
  try {
    const { id } = req.params;

    const hub = await Hub.findById(id);

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    // Soft delete by setting status to decommissioned
    hub.status = "decommissioned";
    await hub.save();

    res.json({
      success: true,
      message: "Hub decommissioned successfully",
    });
  } catch (error) {
    console.error("Delete hub error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete hub",
      error: error.message,
    });
  }
};

export const getHubOverview = async (req, res) => {
  try {
    const { id } = req.params;

    const hub = await Hub.findById(id)
      .populate("tenants", "name businessType capacity usage status compliance")
      .populate("activePolicyId", "name type");

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    // Get real-time snapshot
    const snapshot = await hubUsageMetricsService.getRealtimeSnapshot(id);

    // Get allocation recommendations
    const recommendations = await hubAllocationService.getRecommendations(id);

    // Get dispatch readiness if VPP enabled
    let vppReadiness = null;
    if (hub.vpp.enabled) {
      const bidWindow = {
        start: new Date(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000), // Next 2 hours
      };
      const readiness = await hubDispatchService.assessVPPReadiness(
        id,
        bidWindow
      );
      vppReadiness = readiness.assessment;
    }

    res.json({
      success: true,
      overview: {
        hub,
        snapshot: snapshot.snapshot,
        recommendations: recommendations.recommendations,
        vppReadiness,
      },
    });
  } catch (error) {
    console.error("Get hub overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hub overview",
      error: error.message,
    });
  }
};

export const getHubMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = "month" } = req.query;

    const utilization = await hubUsageMetricsService.calculateUtilization(
      id,
      period
    );

    res.json({
      success: true,
      metrics: utilization.utilization,
    });
  } catch (error) {
    console.error("Get hub metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hub metrics",
      error: error.message,
    });
  }
};

export const getHubAlerts = async (req, res) => {
  try {
    const { id } = req.params;

    const snapshot = await hubUsageMetricsService.getRealtimeSnapshot(id);

    res.json({
      success: true,
      alerts: snapshot.snapshot.alerts,
    });
  } catch (error) {
    console.error("Get hub alerts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hub alerts",
      error: error.message,
    });
  }
};

export const rebalanceHub = async (req, res) => {
  try {
    const { id } = req.params;
    const { method = "proportional", trigger = "manual" } = req.body;

    const result = await hubAllocationService.rebalanceCapacity(id, trigger, {
      method,
    });

    res.json(result);
  } catch (error) {
    console.error("Rebalance hub error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to rebalance hub",
      error: error.message,
    });
  }
};

export const calculateFairShare = async (req, res) => {
  try {
    const { id } = req.params;
    const { method = "proportional", options = {} } = req.body;

    const result = await hubAllocationService.calculateFairShare(
      id,
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

export const getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await hubAllocationService.getRecommendations(id);

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
