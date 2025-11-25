import VPPPool from "../models/VPPPool.js";
import VPPMarket from "../models/VPPMarket.js";
import DeviceVPPStatus from "../models/DeviceVPPStatus.js";
import Device from "../models/Device.js";
import vppBiddingService from "../services/vppBiddingService.js";

export const getAllPools = async (req, res) => {
  try {
    const { region, status, market } = req.query;

    let query = {};

    if (region) {
      query.region = region;
    }

    if (status) {
      query.status = status;
    } else {
      // Default: show active and full pools
      query.status = { $in: ["active", "full"] };
    }

    if (market) {
      query.market = market;
    }

    const pools = await VPPPool.find(query)
      .populate("market", "name code region operator")
      .sort({ "performance.revenue30d": -1 })
      .lean();

    // Add computed fields
    const poolsWithExtras = pools.map((pool) => ({
      ...pool,
      memberCount: pool.members.filter((m) => m.status === "active").length,
      fillPercentage: Math.round(
        (pool.capacity.totalMW / pool.capacity.targetMW) * 100
      ),
      availableSlots: Math.max(
        0,
        pool.capacity.targetMW - pool.capacity.totalMW
      ),
    }));

    res.json({
      success: true,
      pools: poolsWithExtras,
      count: poolsWithExtras.length,
    });
  } catch (error) {
    console.error("Get all pools error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pools",
    });
  }
};

export const getPoolById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await VPPPool.findById(id).populate("market").lean();

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: "Pool not found",
      });
    }

    // Get bidding statistics
    const biddingStats = await vppBiddingService.getPoolBiddingStats(
      pool._id,
      30
    );

    // Check if user is a member
    let userMembership = null;
    if (req.user) {
      const member = pool.members.find(
        (m) =>
          m.userId.toString() === req.user._id.toString() &&
          m.status === "active"
      );

      if (member) {
        userMembership = {
          joinedAt: member.joinedAt,
          contributionKW: member.contributionKW,
          devices: member.deviceIds.length,
          reliability: member.reliability,
        };
      }
    }

    res.json({
      success: true,
      pool: {
        ...pool,
        memberCount: pool.members.filter((m) => m.status === "active").length,
        fillPercentage: Math.round(
          (pool.capacity.totalMW / pool.capacity.targetMW) * 100
        ),
        biddingStats,
        userMembership,
      },
    });
  } catch (error) {
    console.error("Get pool by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pool",
    });
  }
};

export const getUserPools = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const pools = await VPPPool.getUserPools(req.user._id);

    // Enrich with user-specific data
    const enrichedPools = await Promise.all(
      pools.map(async (pool) => {
        const member = pool.members.find(
          (m) => m.userId.toString() === req.user._id.toString()
        );

        return {
          ...pool,
          userContribution: member?.contributionKW || 0,
          userDevices: member?.deviceIds.length || 0,
          userReliability: member?.reliability || 100,
          joinedAt: member?.joinedAt,
        };
      })
    );

    res.json({
      success: true,
      pools: enrichedPools,
      count: enrichedPools.length,
    });
  } catch (error) {
    console.error("Get user pools error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user pools",
    });
  }
};

export const joinPool = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { deviceIds } = req.body;

    if (!deviceIds || deviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one device is required",
      });
    }

    // Get pool
    const pool = await VPPPool.findById(id);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: "Pool not found",
      });
    }

    // Check if pool is accepting members
    if (pool.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Pool is closed to new members",
      });
    }

    // Verify device ownership and calculate total contribution
    let totalContributionKW = 0;
    const verifiedDeviceIds = [];

    for (const deviceId of deviceIds) {
      const device = await Device.findOne({
        _id: deviceId,
        userId: req.user._id,
      });

      if (!device) {
        return res.status(400).json({
          success: false,
          message: `Device ${deviceId} not found or not owned by user`,
        });
      }

      // Check device type is allowed
      if (
        pool.requirements.deviceTypes.length > 0 &&
        !pool.requirements.deviceTypes.includes(device.type)
      ) {
        return res.status(400).json({
          success: false,
          message: `Device type ${device.type} not allowed in this pool`,
        });
      }

      // Get or create device VPP status
      let deviceStatus = await DeviceVPPStatus.findOne({
        deviceId: device._id,
      });

      if (!deviceStatus) {
        deviceStatus = await DeviceVPPStatus.create({
          deviceId: device._id,
          userId: req.user._id,
          vppEnabled: false,
        });
      }

      // Calculate contribution based on device capacity
      let contributionKW = 0;
      if (device.type === "battery") {
        contributionKW = device.settings?.capacity || 10;
      } else if (device.type === "ev-charger") {
        contributionKW = device.settings?.maxPower || 7;
      } else if (device.type === "thermostat") {
        contributionKW = 2;
      } else if (device.type === "water-heater") {
        contributionKW = 4;
      }

      totalContributionKW += contributionKW;
      verifiedDeviceIds.push(device._id);

      // Enroll device in pool
      await deviceStatus.enrollInPool(pool._id, contributionKW);
    }

    // Check minimum capacity
    if (totalContributionKW < pool.requirements.minCapacityKW) {
      return res.status(400).json({
        success: false,
        message: `Total capacity ${totalContributionKW}kW is below minimum ${pool.requirements.minCapacityKW}kW`,
      });
    }

    // Add member to pool
    await pool.addMember(req.user._id, verifiedDeviceIds, totalContributionKW);

    res.json({
      success: true,
      message: "Successfully joined pool",
      pool: {
        id: pool._id,
        name: pool.name,
        contribution: totalContributionKW,
        devices: verifiedDeviceIds.length,
      },
    });
  } catch (error) {
    console.error("Join pool error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to join pool",
    });
  }
};

export const leavePool = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const pool = await VPPPool.findById(id);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: "Pool not found",
      });
    }

    // Get member info before removing
    const member = pool.members.find(
      (m) =>
        m.userId.toString() === req.user._id.toString() && m.status === "active"
    );

    if (!member) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this pool",
      });
    }

    // Unenroll devices
    for (const deviceId of member.deviceIds) {
      const deviceStatus = await DeviceVPPStatus.findOne({ deviceId });
      if (deviceStatus) {
        await deviceStatus.unenrollFromPool(pool._id);
      }
    }

    // Remove member from pool
    await pool.removeMember(req.user._id);

    res.json({
      success: true,
      message: "Successfully left pool",
    });
  } catch (error) {
    console.error("Leave pool error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to leave pool",
    });
  }
};

export const getPoolPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const pool = await VPPPool.findById(id);
    if (!pool) {
      return res.status(404).json({
        success: false,
        message: "Pool not found",
      });
    }

    // Get bidding stats
    const biddingStats = await vppBiddingService.getPoolBiddingStats(
      pool._id,
      days
    );

    // Get capacity utilization
    const capacity = await vppBiddingService.calculatePoolCapacity(pool._id);

    res.json({
      success: true,
      performance: {
        revenue: {
          last30d: pool.performance.revenue30d,
          last90d: pool.performance.revenue90d,
          allTime: pool.performance.revenueAllTime,
          avgPerMW: pool.performance.avgRevenuePerMW,
        },
        dispatches: {
          last30d: pool.performance.dispatches30d,
        },
        reliability: pool.performance.reliability,
        capacity: {
          total: capacity.totalMW,
          available: capacity.availableMW,
          utilization: capacity.utilization,
        },
        bidding: biddingStats,
      },
    });
  } catch (error) {
    console.error("Get pool performance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pool performance",
    });
  }
};

// Admin endpoints

export const createPool = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const poolData = req.body;

    // Verify market exists
    const market = await VPPMarket.findById(poolData.market);
    if (!market) {
      return res.status(400).json({
        success: false,
        message: "Market not found",
      });
    }

    const pool = await VPPPool.create(poolData);

    res.status(201).json({
      success: true,
      message: "Pool created successfully",
      pool,
    });
  } catch (error) {
    console.error("Create pool error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create pool",
    });
  }
};

export const updatePool = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const pool = await VPPPool.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: "Pool not found",
      });
    }

    res.json({
      success: true,
      message: "Pool updated successfully",
      pool,
    });
  } catch (error) {
    console.error("Update pool error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pool",
    });
  }
};

export const deletePool = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const pool = await VPPPool.findByIdAndUpdate(
      id,
      { status: "closed" },
      { new: true }
    );

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: "Pool not found",
      });
    }

    res.json({
      success: true,
      message: "Pool closed successfully",
    });
  } catch (error) {
    console.error("Delete pool error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to close pool",
    });
  }
};
