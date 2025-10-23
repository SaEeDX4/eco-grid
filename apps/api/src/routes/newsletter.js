import express from "express";
import {
  subscribe,
  verify,
  unsubscribe,
  updatePreferences,
  getStats,
} from "../controllers/newsletterController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/subscribe", subscribe);
router.post("/verify", verify);
router.post("/unsubscribe", unsubscribe);
router.put("/preferences/:token", updatePreferences);

// Admin routes
router.get("/stats", authenticate, authorize(["admin"]), getStats);

export default router;
