import Tenant from "../models/Tenant.js";
import Hub from "../models/Hub.js";
import hubAllocationService from "../services/hubAllocationService.js";
import hubUsageMetricsService from "../services/hubUsageMetricsService.js";

export const getTenants = async (req, res) => {
  try {
    const { hubId, status, businessType } = req.query;

    const query = {};

    if (hubId) {
      query.hubId = hubId;
    }

    if (status) {
      query.status = status;
    }

    if (businessType) {
      query.businessType = businessType;
    }

    const tenants = await Tenant.find(query)
      .populate("hubId", "name type location")
      .populate("contactInfo.userId", "name email")
      .sort({ "capacity.allocatedKW": -1 })
      .lean();

    res.json({
      success: true,
      tenants,
    });
  } catch (error) {
    console.error("Get tenants error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenants",
      error: error.message,
    });
  }
};

export const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.getFullDetails(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error("Get tenant by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant",
      error: error.message,
    });
  }
};

export const createTenant = async (req, res) => {
  try {
    const {
      hubId,
      name,
      description,
      businessType,
      contactInfo,
      location,
      capacity,
      priorityTier,
      contract,
      billing,
    } = req.body;

    // Verify hub exists and has capacity
    const hub = await Hub.findById(hubId);

    if (!hub) {
      return res.status(404).json({
        success: false,
        message: "Hub not found",
      });
    }

    // Check if hub has available capacity
    if (!hub.canAllocate(capacity.allocatedKW)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient hub capacity available",
        available: hub.capacity.availableKW,
        requested: capacity.allocatedKW,
      });
    }

    // Create tenant
    const tenant = await Tenant.create({
      hubId,
      name,
      description,
      businessType,
      contactInfo,
      location,
      capacity: {
        baseKW: capacity.allocatedKW * 0.8, // 80% base
        burstKW: capacity.allocatedKW * 0.2, // 20% burst
        allocatedKW: capacity.allocatedKW,
        guaranteedKW: capacity.guaranteedKW || 0,
      },
      priorityTier: priorityTier || "standard",
      contract: {
        startDate: contract?.startDate || new Date(),
        endDate: contract?.endDate,
        status: "active",
        terms: contract?.terms,
      },
      billing: billing || {},
      status: "active",
    });

    // Allocate capacity in hub
    await hub.allocateCapacity(tenant._id, capacity.allocatedKW);

    res.status(201).json({
      success: true,
      tenant,
      message: "Tenant created successfully",
    });
  } catch (error) {
    console.error("Create tenant error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create tenant",
      error: error.message,
    });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Handle capacity change separately
    if (
      updates.capacity &&
      updates.capacity.allocatedKW !== tenant.capacity.allocatedKW
    ) {
      const hub = await Hub.findById(tenant.hubId);
      const capacityDelta =
        updates.capacity.allocatedKW - tenant.capacity.allocatedKW;

      if (capacityDelta > 0) {
        // Increasing allocation
        if (!hub.canAllocate(capacityDelta)) {
          return res.status(400).json({
            success: false,
            message: "Insufficient hub capacity for increase",
            available: hub.capacity.availableKW,
            requested: capacityDelta,
          });
        }
      }

      // Update hub capacity
      if (capacityDelta > 0) {
        await hub.allocateCapacity(tenant._id, capacityDelta);
      } else {
        await hub.deallocateCapacity(tenant._id, Math.abs(capacityDelta));
      }

      // Update tenant capacity
      tenant.capacity.allocatedKW = updates.capacity.allocatedKW;
      tenant.capacity.baseKW = updates.capacity.allocatedKW * 0.8;
      tenant.capacity.burstKW = updates.capacity.allocatedKW * 0.2;
    }

    // Update other allowed fields
    const allowedFields = [
      "name",
      "description",
      "contactInfo",
      "location",
      "priorityTier",
      "contract",
      "billing",
      "preferences",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        tenant[field] = updates[field];
      }
    });

    await tenant.save();

    res.json({
      success: true,
      tenant,
      message: "Tenant updated successfully",
    });
  } catch (error) {
    console.error("Update tenant error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update tenant",
      error: error.message,
    });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Deallocate capacity from hub
    const hub = await Hub.findById(tenant.hubId);
    if (hub) {
      await hub.deallocateCapacity(tenant._id, tenant.capacity.allocatedKW);
    }

    // Soft delete
    tenant.status = "terminated";
    tenant.contract.status = "terminated";
    await tenant.save();

    res.json({
      success: true,
      message: "Tenant terminated successfully",
    });
  } catch (error) {
    console.error("Delete tenant error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete tenant",
      error: error.message,
    });
  }
};

export const getTenantUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = "month" } = req.query;

    const result = await hubUsageMetricsService.aggregateTenantUsage(
      id,
      period
    );

    res.json(result);
  } catch (error) {
    console.error("Get tenant usage error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant usage",
      error: error.message,
    });
  }
};

export const getTenantHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100, skip = 0, eventTypes } = req.query;

    const AllocationHistory = (await import("../models/AllocationHistory.js"))
      .default;

    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip),
    };

    if (eventTypes) {
      options.eventTypes = eventTypes.split(",");
    }

    const history = await AllocationHistory.getTenantHistory(id, options);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get tenant history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenant history",
      error: error.message,
    });
  }
};

export const requestCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestedKW, deviceId, deviceType, purpose } = req.body;

    if (!requestedKW || requestedKW <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid capacity request",
      });
    }

    const result = await hubAllocationService.enforceCapacityLimits(
      id,
      requestedKW,
      deviceId,
      {
        deviceType,
        purpose,
        triggeredBy: "tenant",
        triggeredById: req.user?.id,
      }
    );

    res.json(result);
  } catch (error) {
    console.error("Request capacity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process capacity request",
      error: error.message,
    });
  }
};

export const getTenantViolations = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, severityLevels } = req.query;

    const AllocationHistory = (await import("../models/AllocationHistory.js"))
      .default;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    const options = {};

    if (startDate) options.startDate = new Date(startDate);
    if (endDate) options.endDate = new Date(endDate);
    if (severityLevels) options.severityLevels = severityLevels.split(",");

    const violations = await AllocationHistory.getViolations(
      tenant.hubId,
      id,
      options
    );

    res.json({
      success: true,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        totalViolations: tenant.compliance.violations,
        warningLevel: tenant.compliance.warningLevel,
      },
      violations,
    });
  } catch (error) {
    console.error("Get tenant violations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch violations",
      error: error.message,
    });
  }
};

export const addDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { deviceId, deviceName, deviceType } = req.body;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    await tenant.addDevice(deviceId, deviceName, deviceType);

    res.json({
      success: true,
      tenant,
      message: "Device added to tenant",
    });
  } catch (error) {
    console.error("Add device error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add device",
      error: error.message,
    });
  }
};

export const removeDevice = async (req, res) => {
  try {
    const { id, deviceId } = req.params;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    await tenant.removeDevice(deviceId);

    res.json({
      success: true,
      tenant,
      message: "Device removed from tenant",
    });
  } catch (error) {
    console.error("Remove device error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove device",
      error: error.message,
    });
  }
};

export const resetViolations = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    await tenant.resetViolations();

    res.json({
      success: true,
      tenant,
      message: "Violations reset successfully",
    });
  } catch (error) {
    console.error("Reset violations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset violations",
      error: error.message,
    });
  }
};
