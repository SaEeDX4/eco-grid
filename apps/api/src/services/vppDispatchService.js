import VPPDispatch from "../models/VPPDispatch.js";
import VPPBid from "../models/VPPBid.js";
import VPPPool from "../models/VPPPool.js";
import DeviceVPPStatus from "../models/DeviceVPPStatus.js";
import Device from "../models/Device.js";
import marketSimulationService from "./marketSimulationService.js";
import vppRevenueService from "./vppRevenueService.js";

class VPPDispatchService {
  // Create dispatches for an accepted bid
  async createDispatchesForBid(bid) {
    const pool = await VPPPool.findById(bid.poolId);
    if (!pool) {
      throw new Error("Pool not found");
    }

    const dispatches = [];

    // Get all active members and their devices
    for (const member of pool.members) {
      if (member.status !== "active") continue;

      for (const deviceId of member.deviceIds) {
        const deviceStatus = await DeviceVPPStatus.findOne({ deviceId });
        if (!deviceStatus || !deviceStatus.vppEnabled) continue;

        // Check if device is available
        if (
          !deviceStatus.isAvailableForDispatch(
            bid.bidWindow.start,
            bid.bidWindow.end
          )
        ) {
          continue;
        }

        // Get device capacity
        const enrollment = deviceStatus.enrolledPools.find(
          (p) =>
            p.poolId.toString() === pool._id.toString() && p.status === "active"
        );

        if (!enrollment) continue;

        // Calculate dispatch allocation
        const memberContribution = enrollment.contributionKW;
        const poolTotalKW = pool.capacity.totalMW * 1000;
        const allocationRatio = memberContribution / poolTotalKW;
        const requestedKW = bid.capacityMW * 1000 * allocationRatio;

        // Create dispatch for each instruction window
        for (const instruction of bid.dispatchInstructions) {
          const dispatch = await VPPDispatch.create({
            poolId: pool._id,
            bidId: bid._id,
            userId: member.userId,
            deviceId,
            startTime: instruction.timestamp,
            endTime: new Date(
              instruction.timestamp.getTime() +
                instruction.durationMinutes * 60 * 1000
            ),
            requestedKW:
              instruction.action === "discharge" ? requestedKW : -requestedKW,
            baselineKW: 0,
            status: "scheduled",
            performance: {
              expected: requestedKW,
            },
          });

          dispatches.push(dispatch);
        }
      }
    }

    // Update bid status
    bid.status = "dispatched";
    await bid.save();

    return dispatches;
  }

  // Execute a scheduled dispatch
  async executeDispatch(dispatchId) {
    const dispatch = await VPPDispatch.findById(dispatchId)
      .populate("deviceId")
      .populate("poolId");

    if (!dispatch) {
      throw new Error("Dispatch not found");
    }

    if (dispatch.status !== "scheduled") {
      throw new Error("Dispatch is not scheduled");
    }

    // Update status to active
    dispatch.status = "active";
    dispatch.response.acceptedAt = new Date();
    await dispatch.save();

    // In production, this would send control signals to the device
    // For simulation, we'll mark it as active and schedule completion
    console.log(
      `Executing dispatch ${dispatchId} for device ${dispatch.deviceId._id}`
    );

    // Simulate dispatch completion after duration
    const durationMs = dispatch.endTime - dispatch.startTime;
    setTimeout(
      async () => {
        await this.completeDispatch(dispatchId);
      },
      Math.min(durationMs, 5000)
    ); // Cap at 5 seconds for demo

    return dispatch;
  }

  // Complete a dispatch and calculate revenue
  async completeDispatch(dispatchId) {
    const dispatch = await VPPDispatch.findById(dispatchId)
      .populate("poolId")
      .populate("bidId");

    if (!dispatch) {
      throw new Error("Dispatch not found");
    }

    // Simulate completion with market simulation service
    const completionData =
      await marketSimulationService.completeDispatch(dispatch);

    // Update dispatch with actual performance
    await dispatch.completeDispatch(
      completionData.actualKW,
      completionData.batteryImpact
    );

    // Calculate and record revenue
    const fees = {
      platformPercent: dispatch.poolId.fees.platformPercent,
      operatorPercent: dispatch.poolId.fees.operatorPercent,
    };

    const revenue = await vppRevenueService.recordDispatchRevenue(
      dispatch,
      completionData.grossRevenue,
      fees
    );

    // Update pool performance
    await this.updatePoolPerformance(dispatch.poolId._id, dispatch, revenue);

    return {
      dispatch,
      revenue,
      performance: completionData.performance,
    };
  }

  // Update pool performance metrics
  async updatePoolPerformance(poolId, dispatch, revenue) {
    const pool = await VPPPool.findById(poolId);
    if (!pool) return;

    // Update 30-day rolling revenue
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDispatches = await VPPDispatch.find({
      poolId,
      status: "completed",
      completedAt: { $gte: thirtyDaysAgo },
    });

    pool.performance.revenue30d = recentDispatches.reduce(
      (sum, d) => sum + (d.revenue?.net || 0),
      0
    );
    pool.performance.dispatches30d = recentDispatches.length;

    // Update reliability
    const reliabilityScores = recentDispatches
      .filter((d) => d.performance?.reliability)
      .map((d) => d.performance.reliability);

    if (reliabilityScores.length > 0) {
      pool.performance.reliability =
        reliabilityScores.reduce((sum, r) => sum + r, 0) /
        reliabilityScores.length;
    }

    // Update average revenue per MW
    if (pool.capacity.totalMW > 0) {
      pool.performance.avgRevenuePerMW =
        pool.performance.revenue30d / pool.capacity.totalMW;
    }

    await pool.save();
  }

  // Get upcoming dispatches for user
  async getUpcomingDispatches(userId, limit = 10) {
    return VPPDispatch.getUpcomingDispatches(userId, limit);
  }

  // Get dispatch history for user
  async getDispatchHistory(userId, options = {}) {
    return VPPDispatch.getUserDispatches(userId, options);
  }

  // Cancel a scheduled dispatch
  async cancelDispatch(dispatchId, reason) {
    const dispatch = await VPPDispatch.findById(dispatchId);
    if (!dispatch) {
      throw new Error("Dispatch not found");
    }

    if (dispatch.status !== "scheduled") {
      throw new Error("Can only cancel scheduled dispatches");
    }

    dispatch.status = "cancelled";
    dispatch.notes = reason;
    await dispatch.save();

    return dispatch;
  }

  // Get dispatch statistics for user
  async getUserDispatchStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dispatches = await VPPDispatch.find({
      userId,
      createdAt: { $gte: startDate },
    });

    const stats = {
      total: dispatches.length,
      completed: dispatches.filter((d) => d.status === "completed").length,
      cancelled: dispatches.filter((d) => d.status === "cancelled").length,
      avgReliability: 0,
      totalRevenue: 0,
      totalEnergyKWh: 0,
    };

    const completedDispatches = dispatches.filter(
      (d) => d.status === "completed"
    );

    if (completedDispatches.length > 0) {
      stats.avgReliability =
        completedDispatches.reduce(
          (sum, d) => sum + (d.performance?.reliability || 0),
          0
        ) / completedDispatches.length;

      stats.totalRevenue = completedDispatches.reduce(
        (sum, d) => sum + (d.revenue?.net || 0),
        0
      );

      stats.totalEnergyKWh = completedDispatches.reduce((sum, d) => {
        const durationHours = (d.endTime - d.startTime) / (1000 * 60 * 60);
        return sum + d.actualKW * durationHours;
      }, 0);
    }

    return stats;
  }

  // Get dispatch calendar for user (next 7 days)
  async getDispatchCalendar(userId) {
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const dispatches = await VPPDispatch.find({
      userId,
      status: { $in: ["scheduled", "active"] },
      startTime: {
        $gte: now,
        $lte: sevenDaysLater,
      },
    })
      .populate("poolId", "name")
      .populate("deviceId", "name type")
      .sort({ startTime: 1 })
      .lean();

    // Group by day
    const calendar = {};

    dispatches.forEach((dispatch) => {
      const dateKey = dispatch.startTime.toISOString().split("T")[0];

      if (!calendar[dateKey]) {
        calendar[dateKey] = [];
      }

      calendar[dateKey].push(dispatch);
    });

    return calendar;
  }
}

export default new VPPDispatchService();
