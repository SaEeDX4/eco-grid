import Device from "../models/Device.js";
import Reading from "../models/Reading.js";
import AuditLog from "../models/AuditLog.js";

// Get all devices for the logged-in user
export const getDevices = async (req, res) => {
  try {
    const userId = req.user.id;

    const devices = await Device.find({ ownerId: userId }).sort({
      type: 1,
      name: 1,
    });

    res.json({
      success: true,
      devices: devices.map((d) => ({
        id: d._id,
        name: d.name,
        type: d.type,
        brand: d.brand,
        status: d.status,
        powerW: d.currentPowerW,
        lastSeen: d.lastSeen,
        settings: d.settings,
        capabilities: d.capabilities,
      })),
    });
  } catch (error) {
    console.error("Get devices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch devices",
    });
  }
};

// Get a single device and its readings
export const getDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const device = await Device.findOne({ _id: id, ownerId: userId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    // Get recent readings
    const readings = await Reading.find({ deviceId: id })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      success: true,
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        brand: device.brand,
        model: device.model,
        status: device.status,
        powerW: device.currentPowerW,
        lastSeen: device.lastSeen,
        settings: device.settings,
        capabilities: device.capabilities,
        protocols: device.protocols,
        location: device.location,
        installDate: device.installDate,
      },
      readings: readings.map((r) => ({
        timestamp: r.timestamp,
        powerW: r.powerW,
        kWh: r.kWh,
        metrics: r.metrics,
      })),
    });
  } catch (error) {
    console.error("Get device error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch device",
    });
  }
};

// Control a device (turn on/off/set mode/etc.)
export const controlDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, mode, temperature, schedule } = req.body;
    const userId = req.user.id;

    const device = await Device.findOne({ _id: id, ownerId: userId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (!device.capabilities.controllable) {
      return res.status(400).json({
        success: false,
        message: "Device is not controllable",
      });
    }

    let updates = {};
    let actionDetails = {};

    switch (action) {
      case "on":
        updates.status = "active";
        actionDetails.action = "turned_on";
        break;
      case "off":
        updates.status = "offline";
        updates.currentPowerW = 0;
        actionDetails.action = "turned_off";
        break;
      case "set_mode":
        if (mode) {
          updates["settings.mode"] = mode;
          actionDetails.action = "mode_changed";
          actionDetails.mode = mode;
        }
        break;
      case "set_temperature":
        if (temperature !== undefined) {
          updates["settings.targetTemperature"] = temperature;
          actionDetails.action = "temperature_set";
          actionDetails.temperature = temperature;
        }
        break;
      case "eco":
        updates.status = "active";
        updates["settings.mode"] = "eco";
        actionDetails.action = "eco_mode_enabled";
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action",
        });
    }

    // Apply updates
    await Device.updateOne({ _id: id }, { $set: updates });

    // Log control action
    await AuditLog.create({
      userId,
      action: "device_control",
      entity: "Device",
      entityId: id,
      details: {
        deviceName: device.name,
        ...actionDetails,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const updatedDevice = await Device.findById(id);

    res.json({
      success: true,
      message: "Device controlled successfully",
      device: {
        id: updatedDevice._id,
        name: updatedDevice.name,
        status: updatedDevice.status,
        powerW: updatedDevice.currentPowerW,
        settings: updatedDevice.settings,
      },
    });
  } catch (error) {
    console.error("Control device error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to control device",
    });
  }
};

// Add a new device
export const addDevice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, brand, model, protocols, location } = req.body;

    const device = await Device.create({
      ownerId: userId,
      name,
      type,
      brand,
      model,
      protocols: protocols || [],
      location,
      status: "offline",
      currentPowerW: 0,
      capabilities: {
        controllable: true,
        schedulable: true,
        bidirectional: type === "battery" || type === "solar",
      },
    });

    await AuditLog.create({
      userId,
      action: "device_control",
      entity: "Device",
      entityId: device._id,
      details: {
        action: "device_added",
        deviceName: name,
        deviceType: type,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      message: "Device added successfully",
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        status: device.status,
      },
    });
  } catch (error) {
    console.error("Add device error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add device",
    });
  }
};

// Remove a device
export const removeDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const device = await Device.findOne({ _id: id, ownerId: userId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    await Device.deleteOne({ _id: id });

    await AuditLog.create({
      userId,
      action: "device_control",
      entity: "Device",
      entityId: id,
      details: {
        action: "device_removed",
        deviceName: device.name,
        deviceType: device.type,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Device removed successfully",
    });
  } catch (error) {
    console.error("Remove device error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove device",
    });
  }
};

// Schedule a device
export const scheduleDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule } = req.body;
    const userId = req.user.id;

    const device = await Device.findOne({ _id: id, ownerId: userId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (!device.capabilities.schedulable) {
      return res.status(400).json({
        success: false,
        message: "Device does not support scheduling",
      });
    }

    await Device.updateOne(
      { _id: id },
      { $set: { "settings.schedule": schedule } },
    );

    await AuditLog.create({
      userId,
      action: "device_control",
      entity: "Device",
      entityId: id,
      details: {
        action: "schedule_updated",
        deviceName: device.name,
        schedule,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Schedule saved successfully",
    });
  } catch (error) {
    console.error("Schedule device error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save schedule",
    });
  }
};
