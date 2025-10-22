import express from "express";
import {
  getPlans,
  getPlanById,
  calculateSavings,
} from "../controllers/pricingController.js";

const router = express.Router();

// GET /api/pricing/plans - Get all plans (public)
router.get("/plans", getPlans);

// GET /api/pricing/plans/:id - Get specific plan (public)
router.get("/plans/:id", getPlanById);

// POST /api/pricing/calculate - Calculate savings (public)
router.post("/calculate", calculateSavings);

export default router;
