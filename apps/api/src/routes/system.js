import express from "express";
import {
  getSystemStatus,
  getUptimeHistory,
  getLatencyHistory,
  getSecurityEvents,
  getSecurityStats,
  recordSystemStatus,
} from "../controllers/systemController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// GET /api/system/status - Get current system status (public)
router.get("/status", getSystemStatus);

// GET /api/system/uptime - Get uptime history (public)
router.get("/uptime", getUptimeHistory);

// GET /api/system/latency - Get latency history (public)
router.get("/latency", getLatencyHistory);

// GET /api/system/security/events - Get security events (admin only)
router.get("/security/events", authenticate, getSecurityEvents);

// GET /api/system/security/stats - Get security stats (admin only)
router.get("/security/stats", authenticate, getSecurityStats);

// POST /api/system/status/record - Record status (admin only)
router.post("/status/record", authenticate, recordSystemStatus);

export default router;
