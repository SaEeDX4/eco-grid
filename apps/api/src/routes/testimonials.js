import express from "express";
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialStats,
} from "../controllers/testimonialsController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getTestimonials);
router.get("/stats", authenticate, authorize(["admin"]), getTestimonialStats);
router.get("/:id", getTestimonialById);

// Admin routes
router.post("/", authenticate, authorize(["admin"]), createTestimonial);
router.put("/:id", authenticate, authorize(["admin"]), updateTestimonial);
router.delete("/:id", authenticate, authorize(["admin"]), deleteTestimonial);

export default router;
