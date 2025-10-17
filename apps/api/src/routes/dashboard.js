import express from "express";
import {
  getDashboardData,
  getRealTimeData,
} from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard - Get complete dashboard data
router.get("/", getDashboardData);

// GET /api/dashboard/realtime - Get real-time data (for WebSocket alternative)
router.get("/realtime", getRealTimeData);

export default router;
