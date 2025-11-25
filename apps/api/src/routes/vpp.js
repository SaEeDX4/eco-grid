import express from "express";
import {
  getAllPools,
  getPoolById,
  getUserPools,
  joinPool,
  leavePool,
  getPoolPerformance,
  createPool,
  updatePool,
  deletePool,
} from "../controllers/vppPoolController.js";
import {
  getUserRevenueSummary,
  getRevenueByPool,
  getMonthlyRevenue,
  getRevenueHistory,
  getProjectedRevenue,
  exportRevenueReport,
} from "../controllers/vppRevenueController.js";
import {
  getUpcomingDispatches,
  getDispatchHistory,
  getDispatchCalendar,
  getDispatchStats,
  cancelDispatch,
  getDispatchById,
} from "../controllers/vppDispatchController.js";
import {
  getAllMarkets,
  getMarketById,
  getMarketPrices,
  getBiddingOpportunities,
} from "../controllers/vppMarketController.js";
import {
  getUserVPPDevices,
  getDeviceVPPStatus,
  updateDeviceVPPSettings,
  toggleDeviceVPP,
} from "../controllers/vppDeviceController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Pool routes
router.get("/pools", getAllPools);
router.get("/pools/user", authenticate, getUserPools);
router.get("/pools/:id", getPoolById);
router.get("/pools/:id/performance", getPoolPerformance);
router.post("/pools/:id/join", authenticate, joinPool);
router.post("/pools/:id/leave", authenticate, leavePool);

// Admin pool routes
router.post("/pools", authenticate, authorize(["admin"]), createPool);
router.put("/pools/:id", authenticate, authorize(["admin"]), updatePool);
router.delete("/pools/:id", authenticate, authorize(["admin"]), deletePool);

// Revenue routes
router.get("/revenue/summary", authenticate, getUserRevenueSummary);
router.get("/revenue/by-pool", authenticate, getRevenueByPool);
router.get("/revenue/monthly", authenticate, getMonthlyRevenue);
router.get("/revenue/history", authenticate, getRevenueHistory);
router.get("/revenue/projected", authenticate, getProjectedRevenue);
router.get("/revenue/export", authenticate, exportRevenueReport);

// Dispatch routes
router.get("/dispatches/upcoming", authenticate, getUpcomingDispatches);
router.get("/dispatches/history", authenticate, getDispatchHistory);
router.get("/dispatches/calendar", authenticate, getDispatchCalendar);
router.get("/dispatches/stats", authenticate, getDispatchStats);
router.get("/dispatches/:id", authenticate, getDispatchById);
router.post("/dispatches/:id/cancel", authenticate, cancelDispatch);

// Market routes
router.get("/markets", getAllMarkets);
router.get("/markets/:id", getMarketById);
router.get("/markets/:id/prices", getMarketPrices);
router.get("/markets/opportunities", authenticate, getBiddingOpportunities);

// Device routes
router.get("/devices", authenticate, getUserVPPDevices);
router.get("/devices/:id", authenticate, getDeviceVPPStatus);
router.put("/devices/:id/settings", authenticate, updateDeviceVPPSettings);
router.post("/devices/:id/toggle", authenticate, toggleDeviceVPP);

export default router;
