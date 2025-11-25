import VPPPool from "../models/VPPPool.js";
import VPPBid from "../models/VPPBid.js";
import VPPMarket from "../models/VPPMarket.js";
import DeviceVPPStatus from "../models/DeviceVPPStatus.js";
import marketSimulationService from "./marketSimulationService.js";

class VPPBiddingService {
  // Calculate available capacity for a pool
  async calculatePoolCapacity(poolId) {
    const pool = await VPPPool.findById(poolId);
    if (!pool) {
      throw new Error("Pool not found");
    }

    let totalCapacityKW = 0;
    let availableCapacityKW = 0;

    // Calculate based on enrolled devices
    for (const member of pool.members) {
      if (member.status !== "active") continue;

      for (const deviceId of member.deviceIds) {
        const deviceStatus = await DeviceVPPStatus.findOne({ deviceId });

        if (deviceStatus && deviceStatus.vppEnabled) {
          const enrollment = deviceStatus.enrolledPools.find(
            (p) =>
              p.poolId.toString() === poolId.toString() && p.status === "active"
          );

          if (enrollment) {
            totalCapacityKW += enrollment.contributionKW;

            // Check if device is available
            if (deviceStatus.availability.currentStatus === "available") {
              availableCapacityKW += enrollment.contributionKW;
            }
          }
        }
      }
    }

    return {
      totalMW: totalCapacityKW / 1000,
      availableMW: availableCapacityKW / 1000,
      utilization:
        totalCapacityKW > 0 ? (availableCapacityKW / totalCapacityKW) * 100 : 0,
    };
  }

  // Generate bid for a pool
  async generateBid(poolId, product, bidWindow, options = {}) {
    const pool = await VPPPool.findById(poolId).populate("market");
    if (!pool) {
      throw new Error("Pool not found");
    }

    if (pool.status !== "active" && pool.status !== "full") {
      throw new Error("Pool is not active");
    }

    // Calculate available capacity
    const capacity = await this.calculatePoolCapacity(poolId);

    if (capacity.availableMW < pool.market.requirements.minCapacityMW) {
      throw new Error(
        `Insufficient capacity. Minimum ${pool.market.requirements.minCapacityMW} MW required`
      );
    }

    // Get price forecast
    const durationHours = (bidWindow.end - bidWindow.start) / (1000 * 60 * 60);
    const forecastPrices = await marketSimulationService.getForecastPrices(
      pool.market._id,
      product,
      Math.ceil(durationHours)
    );

    // Calculate optimal bid price
    const bidPrice = marketSimulationService.calculateOptimalBidPrice(
      forecastPrices,
      pool.strategy.riskTolerance
    );

    // Create bid
    const bid = await VPPBid.create({
      poolId: pool._id,
      market: pool.market._id,
      product,
      bidWindow,
      capacityMW: options.capacityMW || capacity.availableMW,
      bidPriceCAD: options.bidPrice || bidPrice,
      status: "pending",
      forecastedRevenue: 0,
      metadata: {
        algorithm: "price-forecast-v1",
        confidence: 0.85,
        weatherConditions: "normal",
        gridConditions: "stable",
      },
    });

    // Process bid (simulate market acceptance)
    const processedBid = await marketSimulationService.processBid(bid);

    return processedBid;
  }

  // Auto-generate bids for pool based on strategy
  async autoGenerateBids(poolId) {
    const pool = await VPPPool.findById(poolId).populate("market");
    if (!pool) {
      throw new Error("Pool not found");
    }

    if (pool.status !== "active" && pool.status !== "full") {
      return [];
    }

    const generatedBids = [];
    const now = new Date();

    // Generate bids for next 24 hours
    for (const product of pool.strategy.marketProducts) {
      // Determine bid windows based on product type
      let bidWindows = [];

      if (product === "energy") {
        // 4-hour blocks for energy
        for (let i = 0; i < 6; i++) {
          const start = new Date(now.getTime() + i * 4 * 60 * 60 * 1000);
          const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
          bidWindows.push({ start, end });
        }
      } else if (product === "frequency-regulation") {
        // 1-hour blocks for frequency regulation
        for (let i = 0; i < 24; i++) {
          const start = new Date(now.getTime() + i * 60 * 60 * 1000);
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          bidWindows.push({ start, end });
        }
      } else {
        // Daily block for capacity/reserves
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() + 1);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        bidWindows.push({ start, end });
      }

      // Generate bids for each window
      for (const window of bidWindows) {
        try {
          const bid = await this.generateBid(poolId, product, window);
          generatedBids.push(bid);
        } catch (error) {
          console.error(
            `Failed to generate bid for ${product}:`,
            error.message
          );
        }
      }
    }

    return generatedBids;
  }

  // Get optimal bidding opportunities
  async getBiddingOpportunities(poolId) {
    const pool = await VPPPool.findById(poolId).populate("market");
    if (!pool) {
      throw new Error("Pool not found");
    }

    const capacity = await this.calculatePoolCapacity(poolId);
    const opportunities = [];

    // Analyze next 48 hours
    for (const product of pool.market.products) {
      const forecastPrices = await marketSimulationService.getForecastPrices(
        pool.market._id,
        product.type,
        48
      );

      // Find high-price windows (top 25%)
      const sortedPrices = [...forecastPrices].sort(
        (a, b) => b.price - a.price
      );
      const threshold =
        sortedPrices[Math.floor(sortedPrices.length * 0.25)].price;

      const highPriceWindows = forecastPrices.filter(
        (f) => f.price >= threshold
      );

      for (const window of highPriceWindows) {
        const estimatedRevenue = capacity.availableMW * window.price * 1; // 1 hour

        opportunities.push({
          product: product.type,
          timestamp: window.timestamp,
          price: window.price,
          estimatedRevenue,
          capacityAvailable: capacity.availableMW,
          confidence: "high",
          reason: `Price ${Math.round((window.price / forecastPrices[0].price - 1) * 100)}% above current`,
        });
      }
    }

    // Sort by estimated revenue
    return opportunities
      .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
      .slice(0, 10);
  }

  // Cancel pending bid
  async cancelBid(bidId) {
    const bid = await VPPBid.findById(bidId);
    if (!bid) {
      throw new Error("Bid not found");
    }

    if (bid.status !== "pending") {
      throw new Error("Can only cancel pending bids");
    }

    bid.status = "cancelled";
    await bid.save();

    return bid;
  }

  // Get pool bidding statistics
  async getPoolBiddingStats(poolId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const bids = await VPPBid.find({
      poolId,
      createdAt: { $gte: startDate },
    });

    const stats = {
      totalBids: bids.length,
      acceptedBids: bids.filter((b) => b.status === "accepted").length,
      rejectedBids: bids.filter((b) => b.status === "rejected").length,
      completedBids: bids.filter((b) => b.status === "completed").length,
      totalForecastedRevenue: bids.reduce(
        (sum, b) => sum + b.forecastedRevenue,
        0
      ),
      totalActualRevenue: bids.reduce((sum, b) => sum + b.actualRevenue, 0),
      acceptanceRate: 0,
      avgBidPrice: 0,
      avgClearingPrice: 0,
    };

    if (stats.totalBids > 0) {
      stats.acceptanceRate = (stats.acceptedBids / stats.totalBids) * 100;
      stats.avgBidPrice =
        bids.reduce((sum, b) => sum + b.bidPriceCAD, 0) / stats.totalBids;

      const bidsWithClearing = bids.filter((b) => b.clearingPriceCAD);
      if (bidsWithClearing.length > 0) {
        stats.avgClearingPrice =
          bidsWithClearing.reduce((sum, b) => sum + b.clearingPriceCAD, 0) /
          bidsWithClearing.length;
      }
    }

    return stats;
  }
}

export default new VPPBiddingService();
