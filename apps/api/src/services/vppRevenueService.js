import VPPRevenue from "../models/VPPRevenue.js";
import VPPDispatch from "../models/VPPDispatch.js";
import VPPPool from "../models/VPPPool.js";
import DeviceVPPStatus from "../models/DeviceVPPStatus.js";

class VPPRevenueService {
  // Calculate and record revenue for a completed dispatch
  async recordDispatchRevenue(dispatch, grossRevenue, fees) {
    const platformFee = grossRevenue * (fees.platformPercent / 100);
    const operatorFee = grossRevenue * (fees.operatorPercent / 100);
    const netRevenue = grossRevenue - platformFee - operatorFee;

    // Update dispatch revenue
    dispatch.revenue = {
      gross: grossRevenue,
      platformFee,
      net: netRevenue,
    };
    await dispatch.save();

    // Update or create revenue record for this period
    await this.updatePeriodRevenue(
      dispatch.userId,
      dispatch.poolId,
      dispatch.startTime,
      "monthly",
      {
        grossRevenue,
        platformFee,
        operatorFee,
        netRevenue,
        dispatch,
      }
    );

    // Update device performance stats
    await this.updateDevicePerformance(dispatch.deviceId, netRevenue);

    return { grossRevenue, platformFee, operatorFee, netRevenue };
  }

  // Update monthly revenue record
  async updatePeriodRevenue(
    userId,
    poolId,
    timestamp,
    periodType,
    revenueData
  ) {
    // Calculate period boundaries
    const period = this.getPeriodBoundaries(timestamp, periodType);

    // Find or create revenue record
    let revenueRecord = await VPPRevenue.findOne({
      userId,
      poolId,
      "period.type": periodType,
      "period.start": period.start,
      "period.end": period.end,
    });

    if (!revenueRecord) {
      revenueRecord = new VPPRevenue({
        userId,
        poolId,
        period: {
          start: period.start,
          end: period.end,
          type: periodType,
        },
        grossRevenue: 0,
        platformFee: 0,
        operatorFee: 0,
        netRevenue: 0,
        breakdown: {
          energyRevenue: 0,
          capacityRevenue: 0,
          ancillaryRevenue: 0,
          performanceBonus: 0,
          penalties: 0,
        },
        dispatches: {
          count: 0,
          totalKWh: 0,
          avgKW: 0,
        },
        availability: {
          hoursAvailable: 0,
          hoursDispatched: 0,
          utilizationPercent: 0,
        },
        performance: {
          reliability: 100,
          responseTime: 0,
          accuracy: 0,
        },
        status: "accruing",
      });
    }

    // Update totals
    revenueRecord.grossRevenue += revenueData.grossRevenue;
    revenueRecord.platformFee += revenueData.platformFee;
    revenueRecord.operatorFee += revenueData.operatorFee;
    revenueRecord.netRevenue += revenueData.netRevenue;

    // Update dispatch count and energy
    revenueRecord.dispatches.count += 1;
    if (revenueData.dispatch) {
      const energyKWh =
        revenueData.dispatch.actualKW *
        ((revenueData.dispatch.endTime - revenueData.dispatch.startTime) /
          (1000 * 60 * 60));
      revenueRecord.dispatches.totalKWh += energyKWh;
      revenueRecord.dispatches.avgKW =
        revenueRecord.dispatches.totalKWh /
        ((Date.now() - period.start) / (1000 * 60 * 60));
    }

    // Update breakdown (simplified - would use actual product types)
    revenueRecord.breakdown.energyRevenue += revenueData.grossRevenue * 0.7;
    revenueRecord.breakdown.capacityRevenue += revenueData.grossRevenue * 0.2;
    revenueRecord.breakdown.ancillaryRevenue += revenueData.grossRevenue * 0.1;

    await revenueRecord.save();
    return revenueRecord;
  }

  // Get period boundaries
  getPeriodBoundaries(timestamp, periodType) {
    const date = new Date(timestamp);
    let start, end;

    switch (periodType) {
      case "daily":
        start = new Date(date);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
        break;

      case "weekly":
        start = new Date(date);
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(end.getDate() + 7);
        break;

      case "monthly":
        start = new Date(date.getFullYear(), date.getMonth(), 1);
        end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        break;

      case "quarterly":
        const quarter = Math.floor(date.getMonth() / 3);
        start = new Date(date.getFullYear(), quarter * 3, 1);
        end = new Date(date.getFullYear(), (quarter + 1) * 3, 1);
        break;

      case "annual":
        start = new Date(date.getFullYear(), 0, 1);
        end = new Date(date.getFullYear() + 1, 0, 1);
        break;

      default:
        throw new Error("Invalid period type");
    }

    return { start, end };
  }

  // Update device performance stats
  async updateDevicePerformance(deviceId, revenue) {
    const deviceStatus = await DeviceVPPStatus.findOne({ deviceId });
    if (!deviceStatus) return;

    deviceStatus.performance.dispatches30d += 1;
    deviceStatus.performance.dispatchesAllTime += 1;
    deviceStatus.performance.revenue30d += revenue;
    deviceStatus.performance.revenueAllTime += revenue;

    await deviceStatus.save();
  }

  // Get user revenue summary
  async getUserRevenueSummary(userId) {
    const now = new Date();

    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    // All time
    const allTimeRevenue = await VPPRevenue.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalGross: { $sum: "$grossRevenue" },
          totalNet: { $sum: "$netRevenue" },
          totalFees: { $sum: { $add: ["$platformFee", "$operatorFee"] } },
          totalDispatches: { $sum: "$dispatches.count" },
          totalKWh: { $sum: "$dispatches.totalKWh" },
        },
      },
    ]);

    // Current month
    const currentMonthRevenue = await VPPRevenue.aggregate([
      {
        $match: {
          userId: userId,
          "period.start": { $gte: currentMonthStart },
          "period.end": { $lte: currentMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalGross: { $sum: "$grossRevenue" },
          totalNet: { $sum: "$netRevenue" },
          totalDispatches: { $sum: "$dispatches.count" },
        },
      },
    ]);

    // Last month
    const lastMonthRevenue = await VPPRevenue.aggregate([
      {
        $match: {
          userId: userId,
          "period.start": { $gte: lastMonthStart },
          "period.end": { $lte: lastMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalGross: { $sum: "$grossRevenue" },
          totalNet: { $sum: "$netRevenue" },
          totalDispatches: { $sum: "$dispatches.count" },
        },
      },
    ]);

    return {
      allTime: allTimeRevenue[0] || {
        totalGross: 0,
        totalNet: 0,
        totalFees: 0,
        totalDispatches: 0,
        totalKWh: 0,
      },
      currentMonth: currentMonthRevenue[0] || {
        totalGross: 0,
        totalNet: 0,
        totalDispatches: 0,
      },
      lastMonth: lastMonthRevenue[0] || {
        totalGross: 0,
        totalNet: 0,
        totalDispatches: 0,
      },
    };
  }

  // Get revenue by pool
  async getRevenueByPool(userId) {
    const revenueByPool = await VPPRevenue.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$poolId",
          totalNet: { $sum: "$netRevenue" },
          totalGross: { $sum: "$grossRevenue" },
          totalDispatches: { $sum: "$dispatches.count" },
          avgReliability: { $avg: "$performance.reliability" },
        },
      },
      {
        $lookup: {
          from: "vpppools",
          localField: "_id",
          foreignField: "_id",
          as: "pool",
        },
      },
      { $unwind: "$pool" },
      {
        $project: {
          poolId: "$_id",
          poolName: "$pool.name",
          region: "$pool.region",
          totalNet: 1,
          totalGross: 1,
          totalDispatches: 1,
          avgReliability: 1,
        },
      },
    ]);

    return revenueByPool;
  }

  // Get monthly revenue trend
  async getMonthlyRevenueTrend(userId, months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const monthlyRevenue = await VPPRevenue.find({
      userId,
      "period.type": "monthly",
      "period.start": { $gte: startDate },
    })
      .sort({ "period.start": 1 })
      .lean();

    return monthlyRevenue.map((r) => ({
      month: r.period.start,
      gross: r.grossRevenue,
      net: r.netRevenue,
      fees: r.platformFee + r.operatorFee,
      dispatches: r.dispatches.count,
    }));
  }

  // Process end-of-month settlement
  async processMonthlySettlement(userId, poolId, month, year) {
    const period = this.getPeriodBoundaries(
      new Date(year, month - 1, 15),
      "monthly"
    );

    const revenueRecord = await VPPRevenue.findOne({
      userId,
      poolId,
      "period.type": "monthly",
      "period.start": period.start,
      "period.end": period.end,
    });

    if (!revenueRecord) {
      throw new Error("No revenue record found for this period");
    }

    if (revenueRecord.status !== "accruing") {
      throw new Error("Revenue already processed");
    }

    // Mark as pending payment
    revenueRecord.status = "pending";
    await revenueRecord.save();

    // In production, this would trigger actual payment processing
    // For now, we'll simulate instant payment
    setTimeout(async () => {
      revenueRecord.status = "paid";
      revenueRecord.paidAt = new Date();
      await revenueRecord.save();
    }, 1000);

    return revenueRecord;
  }

  // Calculate projected revenue
  async calculateProjectedRevenue(userId, poolId, days = 30) {
    // Get historical average
    const historical = await VPPRevenue.aggregate([
      {
        $match: {
          userId: userId,
          poolId: poolId,
          "period.type": "daily",
        },
      },
      {
        $group: {
          _id: null,
          avgDailyRevenue: { $avg: "$netRevenue" },
          avgDailyDispatches: { $avg: "$dispatches.count" },
        },
      },
    ]);

    if (!historical || historical.length === 0) {
      return {
        projectedRevenue: 0,
        projectedDispatches: 0,
        confidence: "low",
      };
    }

    const avgDaily = historical[0].avgDailyRevenue || 0;
    const avgDispatches = historical[0].avgDailyDispatches || 0;

    return {
      projectedRevenue: avgDaily * days,
      projectedDispatches: Math.round(avgDispatches * days),
      avgDailyRevenue: avgDaily,
      confidence: "moderate",
    };
  }
}

export default new VPPRevenueService();
