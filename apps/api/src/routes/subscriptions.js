import express from "express";
import {
  getMySubscription,
  startTrial,
  upgradePlan,
  cancelSubscription,
  checkFeatureLimit,
  updateUsage,
} from "../controllers/subscriptionController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All subscription routes require authentication
router.use(authenticate);

// GET /api/subscriptions/me - Get current user's subscription
router.get("/me", getMySubscription);

// POST /api/subscriptions/trial - Start a trial
router.post("/trial", startTrial);

// PUT /api/subscriptions/upgrade - Upgrade/downgrade plan
router.put("/upgrade", upgradePlan);

// POST /api/subscriptions/cancel - Cancel subscription
router.post("/cancel", cancelSubscription);

// GET /api/subscriptions/feature/:feature - Check feature limit
router.get("/feature/:feature", checkFeatureLimit);

// POST /api/subscriptions/usage - Update usage metrics
router.post("/usage", updateUsage);

export default router;
