// apps/api/src/routes/ai.js
import { Router } from "express";
import { generateSmartHeadline } from "../controllers/aiController.js";
import ClaudeAdapter from "../../../../packages/ai/adapters/claude.js";

const router = Router();
const claude = new ClaudeAdapter();

// ✅ Existing route (keep it)
router.post("/smart-headline", generateSmartHeadline);

// ✅ New route — talk directly to Claude
// POST /api/ai/ask
router.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await claude.complete(prompt);
    res.json({ reply: response });
  } catch (error) {
    console.error("Claude API error:", error);
    res.status(500).json({ error: "Claude API request failed" });
  }
});

export default router;
