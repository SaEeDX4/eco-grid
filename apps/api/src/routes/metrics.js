import express from "express";
import {
  getImpactMetrics,
  getHistoricalMetrics,
  updateMetrics,
  getMilestoneProgress,
} from "../controllers/metricsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// GET /api/metrics/impact - Get current impact metrics (public)
router.get("/impact", getImpactMetrics);

// GET /api/metrics/historical - Get historical metrics (public)
router.get("/historical", getHistoricalMetrics);

// GET /api/metrics/milestones - Get milestone progress (public)
router.get("/milestones", getMilestoneProgress);

// POST /api/metrics/update - Update metrics (admin only)
router.post("/update", authenticate, updateMetrics);

export default router;
