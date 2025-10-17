import express from "express";
import {
  calculateOptimization,
  explainPlan,
  acceptPlan,
  getActivePlan,
} from "../controllers/optimizerController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All optimizer routes require authentication
router.use(authenticate);

// POST /api/optimizer/calculate - Calculate optimization
router.post("/calculate", calculateOptimization);

// POST /api/optimizer/explain - Get AI explanation of plan
router.post("/explain", explainPlan);

// POST /api/optimizer/accept - Accept and activate plan
router.post("/accept", acceptPlan);

// GET /api/optimizer/active - Get currently active plan
router.get("/active", getActivePlan);

export default router;
