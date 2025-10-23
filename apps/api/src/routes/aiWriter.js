import express from "express";
import {
  generateOutline,
  generateArticle,
  getGenerationLogs,
  getGenerationStats,
} from "../controllers/aiWriterController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication and editor/admin role
router.use(authenticate);
router.use(authorize(["admin", "editor"]));

// Generation routes
router.post("/generate-outline", generateOutline);
router.post("/generate-article", generateArticle);

// Admin analytics routes
router.get("/logs", authorize(["admin"]), getGenerationLogs);
router.get("/stats", authorize(["admin"]), getGenerationStats);

export default router;
