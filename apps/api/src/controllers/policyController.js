import CapacityPolicy from "../models/CapacityPolicy.js";
import hubPolicyService from "../services/hubPolicyService.js";
import hubAllocationService from "../services/hubAllocationService.js";

export const getPolicies = async (req, res) => {
  try {
    const { hubId, status, type } = req.query;

    const query = {};

    if (hubId) query.hubId = hubId;
    if (status) query.status = status;
    if (type) query.type = type;

    const policies = await CapacityPolicy.find(query)
      .populate("hubId", "name type")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      policies,
    });
  } catch (error) {
    console.error("Get policies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch policies",
      error: error.message,
    });
  }
};

export const getPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await CapacityPolicy.findById(id)
      .populate("hubId")
      .populate("createdBy", "name email")
      .lean();

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    res.json({
      success: true,
      policy,
    });
  } catch (error) {
    console.error("Get policy by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch policy",
      error: error.message,
    });
  }
};

export const getActivePolicy = async (req, res) => {
  try {
    const { hubId } = req.query;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const policy = await CapacityPolicy.getActivePolicy(hubId);

    if (!policy) {
      return res.json({
        success: true,
        policy: null,
        message: "No active policy found for this hub",
      });
    }

    res.json({
      success: true,
      policy,
    });
  } catch (error) {
    console.error("Get active policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active policy",
      error: error.message,
    });
  }
};

export const createPolicy = async (req, res) => {
  try {
    const policyData = req.body;
    const { hubId } = policyData;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const result = await hubPolicyService.createPolicy(
      hubId,
      policyData,
      req.user?.id
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Create policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create policy",
      error: error.message,
    });
  }
};

export const createFromTemplate = async (req, res) => {
  try {
    const { hubId, templateName } = req.body;

    if (!hubId || !templateName) {
      return res.status(400).json({
        success: false,
        message: "hubId and templateName are required",
      });
    }

    const result = await hubPolicyService.createFromTemplate(
      hubId,
      templateName,
      req.user?.id
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Create from template error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create policy from template",
      error: error.message,
    });
  }
};

export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const policy = await CapacityPolicy.findById(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    // Only allow updates to draft or inactive policies
    if (policy.status === "active") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot update active policy. Deactivate first or create new policy.",
      });
    }

    // Update allowed fields
    const allowedFields = [
      "name",
      "description",
      "type",
      "allocationRule",
      "enforcementRule",
      "rebalanceRule",
      "overagePolicy",
      "priorityOverrides",
      "schedule",
      "vppCoordination",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        policy[field] = updates[field];
      }
    });

    await policy.save();

    res.json({
      success: true,
      policy,
      message: "Policy updated successfully",
    });
  } catch (error) {
    console.error("Update policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update policy",
      error: error.message,
    });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await CapacityPolicy.findById(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    // Cannot delete active policy
    if (policy.status === "active") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete active policy. Deactivate first.",
      });
    }

    policy.status = "archived";
    await policy.save();

    res.json({
      success: true,
      message: "Policy archived successfully",
    });
  } catch (error) {
    console.error("Delete policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete policy",
      error: error.message,
    });
  }
};

export const applyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { hubId, override = false } = req.body;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const result = await hubAllocationService.applyPolicy(hubId, id, override);

    res.json(result);
  } catch (error) {
    console.error("Apply policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply policy",
      error: error.message,
    });
  }
};

export const evaluatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, request } = req.body;

    if (!tenantId || !request || !request.requestedKW) {
      return res.status(400).json({
        success: false,
        message: "tenantId and request with requestedKW are required",
      });
    }

    const policy = await CapacityPolicy.findById(id).populate("hubId");

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    const result = await hubPolicyService.evaluatePolicy(
      policy.hubId._id,
      tenantId,
      request
    );

    res.json(result);
  } catch (error) {
    console.error("Evaluate policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to evaluate policy",
      error: error.message,
    });
  }
};

export const simulatePolicy = async (req, res) => {
  try {
    const { hubId, policyConfig, simulationDays = 7 } = req.body;

    if (!hubId || !policyConfig) {
      return res.status(400).json({
        success: false,
        message: "hubId and policyConfig are required",
      });
    }

    const result = await hubPolicyService.simulatePolicy(
      hubId,
      policyConfig,
      parseInt(simulationDays)
    );

    res.json(result);
  } catch (error) {
    console.error("Simulate policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to simulate policy",
      error: error.message,
    });
  }
};

export const getPolicyRecommendations = async (req, res) => {
  try {
    const { hubId } = req.query;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    // Get usage patterns for analysis
    const AllocationHistory = (await import("../models/AllocationHistory.js"))
      .default;
    const patterns = await AllocationHistory.getPeakUsageTimes(hubId, 30);

    const result = await hubPolicyService.getPolicyRecommendations(
      hubId,
      patterns
    );

    res.json(result);
  } catch (error) {
    console.error("Get policy recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get policy recommendations",
      error: error.message,
    });
  }
};

export const adjustPolicy = async (req, res) => {
  try {
    const { hubId, historicalData } = req.body;

    if (!hubId) {
      return res.status(400).json({
        success: false,
        message: "hubId is required",
      });
    }

    const result = await hubPolicyService.adjustPolicyBasedOnUsage(
      hubId,
      historicalData
    );

    res.json(result);
  } catch (error) {
    console.error("Adjust policy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to adjust policy",
      error: error.message,
    });
  }
};

export const escalateViolation = async (req, res) => {
  try {
    const { tenantId, violation } = req.body;

    if (!tenantId || !violation) {
      return res.status(400).json({
        success: false,
        message: "tenantId and violation are required",
      });
    }

    const result = await hubPolicyService.escalateViolation(
      tenantId,
      violation
    );

    res.json(result);
  } catch (error) {
    console.error("Escalate violation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to escalate violation",
      error: error.message,
    });
  }
};
