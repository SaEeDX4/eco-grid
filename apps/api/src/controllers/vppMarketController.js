import VPPMarket from "../models/VPPMarket.js";
import marketSimulationService from "../services/marketSimulationService.js";
import vppBiddingService from "../services/vppBiddingService.js";

export const getAllMarkets = async (req, res) => {
  try {
    const { region, status } = req.query;

    let query = {};

    if (region) {
      query.region = region;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = "active";
    }

    const markets = await VPPMarket.find(query).lean();

    res.json({
      success: true,
      markets,
      count: markets.length,
    });
  } catch (error) {
    console.error("Get all markets error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch markets",
    });
  }
};

export const getMarketById = async (req, res) => {
  try {
    const { id } = req.params;

    const market = await VPPMarket.findById(id).lean();

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Market not found",
      });
    }

    res.json({
      success: true,
      market,
    });
  } catch (error) {
    console.error("Get market by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch market",
    });
  }
};

export const getMarketPrices = async (req, res) => {
  try {
    const { id } = req.params;
    const { product = "energy", hours = 24 } = req.query;

    const market = await VPPMarket.findById(id);

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Market not found",
      });
    }

    const prices = await marketSimulationService.getForecastPrices(
      id,
      product,
      parseInt(hours)
    );

    res.json({
      success: true,
      market: {
        id: market._id,
        name: market.name,
        region: market.region,
      },
      product,
      prices,
    });
  } catch (error) {
    console.error("Get market prices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch market prices",
    });
  }
};

export const getBiddingOpportunities = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { poolId } = req.query;

    if (!poolId) {
      return res.status(400).json({
        success: false,
        message: "Pool ID is required",
      });
    }

    const opportunities =
      await vppBiddingService.getBiddingOpportunities(poolId);

    res.json({
      success: true,
      opportunities,
      count: opportunities.length,
    });
  } catch (error) {
    console.error("Get bidding opportunities error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bidding opportunities",
    });
  }
};
