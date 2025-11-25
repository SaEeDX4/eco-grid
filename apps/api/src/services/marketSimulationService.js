// Service to simulate realistic energy market behavior
// In production, this would integrate with real market APIs (CAISO, AESO, etc.)

import VPPMarket from "../models/VPPMarket.js";
import VPPBid from "../models/VPPBid.js";

class MarketSimulationService {
  // Simulate market clearing prices based on time of day and conditions
  generateClearingPrice(market, product, timestamp) {
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    const month = timestamp.getMonth();

    let basePrice = 0;

    // Base prices by product type (CAD/MWh)
    switch (product) {
      case "energy":
        basePrice = 80;
        break;
      case "capacity":
        basePrice = 60;
        break;
      case "frequency-regulation":
        basePrice = 120;
        break;
      case "spinning-reserve":
        basePrice = 40;
        break;
      case "demand-response":
        basePrice = 100;
        break;
      default:
        basePrice = 80;
    }

    // Time-of-day multiplier
    let todMultiplier = 1;
    if (hour >= 17 && hour <= 21) {
      // Peak evening
      todMultiplier = 1.8;
    } else if (hour >= 7 && hour <= 9) {
      // Morning peak
      todMultiplier = 1.4;
    } else if (hour >= 0 && hour <= 6) {
      // Overnight low
      todMultiplier = 0.6;
    }

    // Seasonal multiplier
    let seasonMultiplier = 1;
    if (month >= 5 && month <= 8) {
      // Summer
      seasonMultiplier = 1.3;
    } else if (month >= 11 || month <= 1) {
      // Winter
      seasonMultiplier = 1.2;
    }

    // Weekend discount
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.85 : 1;

    // Random volatility ±15%
    const volatility = 0.85 + Math.random() * 0.3;

    const clearingPrice =
      basePrice *
      todMultiplier *
      seasonMultiplier *
      weekendMultiplier *
      volatility;

    return Math.round(clearingPrice * 100) / 100;
  }

  // Simulate bid acceptance based on market conditions
  async processBid(bid) {
    const market = await VPPMarket.findById(bid.market);
    if (!market) {
      throw new Error("Market not found");
    }

    // Generate clearing price for this bid window
    const clearingPrice = this.generateClearingPrice(
      market,
      bid.product,
      bid.bidWindow.start
    );

    bid.clearingPriceCAD = clearingPrice;

    // Accept bid if bid price is at or below clearing price
    if (bid.bidPriceCAD <= clearingPrice) {
      bid.status = "accepted";

      // Calculate forecasted revenue
      const durationHours =
        (bid.bidWindow.end - bid.bidWindow.start) / (1000 * 60 * 60);
      bid.forecastedRevenue = bid.capacityMW * clearingPrice * durationHours;

      // Generate dispatch instructions
      bid.dispatchInstructions = this.generateDispatchInstructions(
        bid.bidWindow.start,
        bid.bidWindow.end,
        bid.capacityMW,
        bid.product
      );
    } else {
      bid.status = "rejected";
    }

    await bid.save();
    return bid;
  }

  // Generate realistic dispatch instructions
  generateDispatchInstructions(startTime, endTime, capacityMW, product) {
    const instructions = [];
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);

    if (product === "energy") {
      // Single dispatch for energy
      instructions.push({
        timestamp: startTime,
        action: "discharge",
        capacityMW,
        durationMinutes: durationHours * 60,
        priceCAD: 0, // Price already in bid
      });
    } else if (product === "frequency-regulation") {
      // Multiple small dispatches for frequency regulation
      const intervalMinutes = 15;
      const numIntervals = Math.floor((durationHours * 60) / intervalMinutes);

      for (let i = 0; i < numIntervals; i++) {
        const timestamp = new Date(
          startTime.getTime() + i * intervalMinutes * 60 * 1000
        );
        const action = Math.random() > 0.5 ? "discharge" : "charge";
        const capacity = capacityMW * (0.5 + Math.random() * 0.5); // Varying capacity

        instructions.push({
          timestamp,
          action,
          capacityMW: capacity,
          durationMinutes: intervalMinutes,
        });
      }
    } else {
      // Default: standby for capacity/reserves
      instructions.push({
        timestamp: startTime,
        action: "standby",
        capacityMW,
        durationMinutes: durationHours * 60,
      });
    }

    return instructions;
  }

  // Simulate market prices for forecasting
  async getForecastPrices(marketId, product, hours = 24) {
    const market = await VPPMarket.findById(marketId);
    if (!market) {
      throw new Error("Market not found");
    }

    const prices = [];
    const now = new Date();

    for (let i = 0; i < hours; i++) {
      const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
      const price = this.generateClearingPrice(market, product, timestamp);

      prices.push({
        timestamp,
        price,
        product,
      });
    }

    return prices;
  }

  // Calculate optimal bid price based on forecasted prices
  calculateOptimalBidPrice(forecastPrices, riskTolerance = "moderate") {
    const prices = forecastPrices.map((f) => f.price);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    let bidPrice = avgPrice;

    // Adjust based on risk tolerance
    switch (riskTolerance) {
      case "conservative":
        // Bid below average to increase acceptance probability
        bidPrice = avgPrice * 0.85;
        break;
      case "aggressive":
        // Bid above average to maximize revenue
        bidPrice = avgPrice * 1.15;
        break;
      case "moderate":
      default:
        // Bid at average
        bidPrice = avgPrice;
        break;
    }

    // Clamp between min and max
    return Math.max(minPrice, Math.min(maxPrice, bidPrice));
  }

  // Simulate dispatch completion and calculate actual revenue
  async completeDispatch(dispatch) {
    // Simulate performance variance ±5%
    const performanceVariance = 0.95 + Math.random() * 0.1;
    const actualKW = dispatch.requestedKW * performanceVariance;

    // Calculate energy delivered
    const durationHours =
      (dispatch.endTime - dispatch.startTime) / (1000 * 60 * 60);
    const energyKWh = actualKW * durationHours;

    // Get bid to determine pricing
    const bid = await VPPBid.findById(dispatch.bidId);
    if (!bid) {
      throw new Error("Bid not found");
    }

    // Calculate revenue (simplified - would involve complex settlement rules)
    const revenuePerMWh = bid.clearingPriceCAD || 80;
    const grossRevenue = (energyKWh / 1000) * revenuePerMWh;

    // Simulate battery impact
    const batteryImpact = {
      cyclesUsed: 0.5, // Half cycle
      socStart: 80,
      socEnd: 50,
      depthOfDischarge: 30,
      temperature: 25,
      degradationEstimate: 0.001, // 0.001% degradation
    };

    return {
      actualKW,
      energyKWh,
      grossRevenue,
      batteryImpact,
      performance: {
        delivered: actualKW,
        expected: dispatch.requestedKW,
        reliability: Math.min(100, (actualKW / dispatch.requestedKW) * 100),
      },
    };
  }
}

export default new MarketSimulationService();
