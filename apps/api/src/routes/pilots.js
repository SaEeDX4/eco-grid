import express from "express";
import {
  getPilots,
  getPilotById,
  createPilot,
  updatePilot,
  deletePilot,
  getAggregateMetrics,
} from "../controllers/pilotsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getPilots);
router.get("/metrics", getAggregateMetrics);
router.get("/:id", getPilotById);

// Admin routes
router.post("/", authenticate, authorize(["admin"]), createPilot);
router.put("/:id", authenticate, authorize(["admin"]), updatePilot);
router.delete("/:id", authenticate, authorize(["admin"]), deletePilot);

export default router;
