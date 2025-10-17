import express from "express";
import { generateSmartHeadline } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/smart-headline
router.post("/smart-headline", generateSmartHeadline);

export default router;
