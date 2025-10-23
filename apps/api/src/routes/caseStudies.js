import express from "express";
import {
  getCaseStudies,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getCaseStudyStats,
} from "../controllers/caseStudiesController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCaseStudies);
router.get("/stats", authenticate, authorize(["admin"]), getCaseStudyStats);
router.get("/:slug", getCaseStudyBySlug);

// Admin routes
router.post("/", authenticate, authorize(["admin"]), createCaseStudy);
router.put("/:id", authenticate, authorize(["admin"]), updateCaseStudy);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCaseStudy);

export default router;
