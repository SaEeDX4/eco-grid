import DeviceVPPStatus from "../models/DeviceVPPStatus.js";
import Device from "../models/Device.js";

export const getUserVPPDevices = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const devices = await DeviceVPPStatus.getUserVPPDevices(req.user._id);

    res.json({
      success: true,
      devices,
      count: devices.length,
    });
  } catch (error) {
    console.error("Get user VPP devices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch VPP devices",
    });
  }
};

export const getDeviceVPPStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    // Verify device ownership
    const device = await Device.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    let deviceStatus = await DeviceVPPStatus.findOne({ deviceId: id })
      .populate("enrolledPools.poolId", "name region")
      .lean();

    if (!deviceStatus) {
      // Create default structure — do not store in DB
      deviceStatus = {
        deviceId: device._id,
        userId: req.user._id,
        vppEnabled: false,
        enrolledPools: [],
        availability: {
          currentStatus: "unavailable",
        },
        constraints: {
          minSOC: 20,
          maxSOC: 90,
          maxDepthOfDischarge: 70,
          maxCyclesPerDay: 2,
        },
        performance: {
          dispatches30d: 0,
          revenue30d: 0,
          reliability: 100,
        },
      };
    }

    res.json({
      success: true,
      device: {
        ...device.toObject(),
        vppStatus: deviceStatus,
      },
    });
  } catch (error) {
    console.error("Get device VPP status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch device VPP status",
    });
  }
};

export const updateDeviceVPPSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { constraints, preferences, availability } = req.body;

    // Verify device ownership
    const device = await Device.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    let deviceStatus = await DeviceVPPStatus.findOne({ deviceId: id });

    if (!deviceStatus) {
      deviceStatus = await DeviceVPPStatus.create({
        deviceId: id,
        userId: req.user._id,
      });
    }

    // Update fields without destroying old settings
    if (constraints) {
      deviceStatus.constraints = {
        ...deviceStatus.constraints,
        ...constraints,
      };
    }

    if (preferences) {
      deviceStatus.preferences = {
        ...deviceStatus.preferences,
        ...preferences,
      };
    }

    if (availability) {
      deviceStatus.availability = {
        ...deviceStatus.availability,
        ...availability,
      };
    }

    await deviceStatus.save();

    res.json({
      success: true,
      message: "Device VPP settings updated successfully",
      deviceStatus,
    });
  } catch (error) {
    console.error("Update device VPP settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update device VPP settings",
    });
  }
};

export const toggleDeviceVPP = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { enabled } = req.body;

    // Verify device ownership
    const device = await Device.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    let deviceStatus = await DeviceVPPStatus.findOne({ deviceId: id });

    if (!deviceStatus) {
      deviceStatus = await DeviceVPPStatus.create({
        deviceId: id,
        userId: req.user._id,
        vppEnabled: enabled,
      });
    } else {
      deviceStatus.vppEnabled = enabled;
      await deviceStatus.save();
    }

    res.json({
      success: true,
      message: `VPP ${enabled ? "enabled" : "disabled"} for device`,
      vppEnabled: deviceStatus.vppEnabled,
    });
  } catch (error) {
    console.error("Toggle device VPP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle device VPP",
    });
  }
};
