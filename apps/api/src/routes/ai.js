// apps/api/src/routes/ai.js
import { Router } from "express";
import { generateSmartHeadline } from "../controllers/aiController.js";

const router = Router();

// POST /api/ai/smart-headline
router.post("/smart-headline", generateSmartHeadline);

export default router;
