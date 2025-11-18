import express from "express";
import {
  getFAQs,
  getFAQById,
  semanticSearchFAQs,
  getPopularFAQs,
  recordFeedback,
  getCategories,
} from "../controllers/faqController.js";

const router = express.Router();

// Public routes
router.get("/", getFAQs);
router.get("/popular", getPopularFAQs);
router.get("/categories", getCategories);
router.post("/search", semanticSearchFAQs);
router.get("/:id", getFAQById);
router.post("/:id/feedback", recordFeedback);

export default router;
