import Pilot from "../models/Pilot.js";

export const getPilots = async (req, res) => {
  try {
    const {
      region,
      deviceType,
      status,
      featured,
      bounds, // for viewport filtering: minLng,minLat,maxLng,maxLat
    } = req.query;

    let query = {};

    // Filter by region
    if (region) {
      const regions = region.split(",").filter(Boolean);
      if (regions.length > 0) {
        query.region = { $in: regions };
      }
    }

    // Filter by device type
    if (deviceType) {
      const types = deviceType.split(",").filter(Boolean);
      if (types.length > 0) {
        query.deviceTypes = { $in: types };
      }
    }

    // Filter by status
    if (status) {
      const statuses = status.split(",").filter(Boolean);
      if (statuses.length > 0) {
        query.status = { $in: statuses };
      }
    } else {
      // Default: exclude offline
      query.status = { $ne: "offline" };
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    // Filter by bounds (viewport)
    if (bounds) {
      const [minLng, minLat, maxLng, maxLat] = bounds.split(",").map(Number);
      query["coordinates.longitude"] = { $gte: minLng, $lte: maxLng };
      query["coordinates.latitude"] = { $gte: minLat, $lte: maxLat };
    }

    const pilots = await Pilot.find(query)
      .sort({ featured: -1, "metrics.energySaved": -1 })
      .lean();

    // Get aggregate metrics for filtered pilots
    const aggregateMetrics = await Pilot.getAggregateMetrics(query);

    res.json({
      success: true,
      pilots,
      count: pilots.length,
      aggregateMetrics,
    });
  } catch (error) {
    console.error("Get pilots error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pilots",
    });
  }
};

export const getPilotById = async (req, res) => {
  try {
    const { id } = req.params;

    const pilot = await Pilot.findById(id);

    if (!pilot) {
      return res.status(404).json({
        success: false,
        message: "Pilot not found",
      });
    }

    // Update last active
    pilot
      .updateLastActive()
      .catch((err) => console.error("Update last active error:", err));

    res.json({
      success: true,
      pilot,
    });
  } catch (error) {
    console.error("Get pilot error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pilot",
    });
  }
};

export const createPilot = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const pilot = await Pilot.create(req.body);

    res.status(201).json({
      success: true,
      message: "Pilot created successfully",
      pilot,
    });
  } catch (error) {
    console.error("Create pilot error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create pilot",
    });
  }
};

export const updatePilot = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const pilot = await Pilot.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pilot) {
      return res.status(404).json({
        success: false,
        message: "Pilot not found",
      });
    }

    res.json({
      success: true,
      message: "Pilot updated successfully",
      pilot,
    });
  } catch (error) {
    console.error("Update pilot error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pilot",
    });
  }
};

export const deletePilot = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const pilot = await Pilot.findByIdAndUpdate(
      id,
      { status: "offline" },
      { new: true }
    );

    if (!pilot) {
      return res.status(404).json({
        success: false,
        message: "Pilot not found",
      });
    }

    res.json({
      success: true,
      message: "Pilot set to offline",
    });
  } catch (error) {
    console.error("Delete pilot error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete pilot",
    });
  }
};

export const getAggregateMetrics = async (req, res) => {
  try {
    const { region, deviceType, status } = req.query;

    let filters = {};

    if (region) {
      const regions = region.split(",").filter(Boolean);
      if (regions.length > 0) {
        filters.region = { $in: regions };
      }
    }

    if (deviceType) {
      const types = deviceType.split(",").filter(Boolean);
      if (types.length > 0) {
        filters.deviceTypes = { $in: types };
      }
    }

    if (status) {
      const statuses = status.split(",").filter(Boolean);
      if (statuses.length > 0) {
        filters.status = { $in: statuses };
      }
    }

    const metrics = await Pilot.getAggregateMetrics(filters);

    res.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error("Get aggregate metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch metrics",
    });
  }
};
