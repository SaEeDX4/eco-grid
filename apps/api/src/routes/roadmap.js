import express from "express";
import {
  getRoadmap,
  getMilestoneById,
  getStatistics,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../controllers/roadmapController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getRoadmap);
router.get("/statistics", getStatistics);
router.get("/:id", getMilestoneById);

// Admin routes
router.post("/", authenticate, authorize(["admin"]), createMilestone);
router.put("/:id", authenticate, authorize(["admin"]), updateMilestone);
router.delete("/:id", authenticate, authorize(["admin"]), deleteMilestone);

export default router;
