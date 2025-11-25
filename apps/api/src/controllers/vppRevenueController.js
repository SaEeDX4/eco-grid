import VPPRevenue from "../models/VPPRevenue.js";
import vppRevenueService from "../services/vppRevenueService.js";

export const getUserRevenueSummary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const summary = await vppRevenueService.getUserRevenueSummary(req.user._id);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Get user revenue summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue summary",
    });
  }
};

export const getRevenueByPool = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const revenueByPool = await vppRevenueService.getRevenueByPool(
      req.user._id
    );

    res.json({
      success: true,
      pools: revenueByPool,
    });
  } catch (error) {
    console.error("Get revenue by pool error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue by pool",
    });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { months = 12 } = req.query;

    const monthlyRevenue = await vppRevenueService.getMonthlyRevenueTrend(
      req.user._id,
      parseInt(months)
    );

    res.json({
      success: true,
      revenue: monthlyRevenue,
    });
  } catch (error) {
    console.error("Get monthly revenue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly revenue",
    });
  }
};

export const getRevenueHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { poolId, startDate, endDate, periodType, limit = 50 } = req.query;

    let query = { userId: req.user._id };

    if (poolId) {
      query.poolId = poolId;
    }

    if (startDate) {
      query["period.start"] = { $gte: new Date(startDate) };
    }

    if (endDate) {
      query["period.end"] = { $lte: new Date(endDate) };
    }

    if (periodType) {
      query["period.type"] = periodType;
    }

    const revenue = await VPPRevenue.find(query)
      .populate("poolId", "name region")
      .sort({ "period.start": -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      revenue,
      count: revenue.length,
    });
  } catch (error) {
    console.error("Get revenue history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue history",
    });
  }
};

export const getProjectedRevenue = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { poolId, days = 30 } = req.query;

    if (!poolId) {
      return res.status(400).json({
        success: false,
        message: "Pool ID is required",
      });
    }

    const projection = await vppRevenueService.calculateProjectedRevenue(
      req.user._id,
      poolId,
      parseInt(days)
    );

    res.json({
      success: true,
      projection,
    });
  } catch (error) {
    console.error("Get projected revenue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate projected revenue",
    });
  }
};

export const exportRevenueReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    // Get monthly revenue records
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 1);

    const revenue = await VPPRevenue.find({
      userId: req.user._id,
      "period.start": { $gte: startDate },
      "period.end": { $lte: endDate },
    })
      .populate("poolId", "name region")
      .lean();

    // Format as CSV
    let csv =
      "Pool,Region,Gross Revenue,Platform Fee,Operator Fee,Net Revenue,Dispatches,kWh,Reliability\n";

    revenue.forEach((r) => {
      csv += `${r.poolId.name},${r.poolId.region},${r.grossRevenue.toFixed(2)},${r.platformFee.toFixed(2)},${r.operatorFee.toFixed(2)},${r.netRevenue.toFixed(2)},${r.dispatches.count},${r.dispatches.totalKWh.toFixed(2)},${r.performance.reliability.toFixed(1)}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=vpp-revenue-${year}-${month}.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error("Export revenue report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export revenue report",
    });
  }
};
