import express from "express";
import { escalateToAI, getChatStats } from "../controllers/chatController.js";
import { authenticate } from "../middleware/auth.js";
import { chatLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST /api/chat/escalate - Escalate to AI (public, rate limited)
router.post("/escalate", chatLimiter, escalateToAI);

// GET /api/chat/stats - Get chat statistics (admin only)
router.get("/stats", authenticate, getChatStats);

export default router;
