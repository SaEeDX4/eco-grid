import express from "express";
import {
  generateReportData,
  getESGData,
  exportReport,
  getAchievements,
  getReportHistory,
} from "../controllers/reportsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All report routes require authentication
router.use(authenticate);

// POST /api/reports/generate - Generate report data
router.post("/generate", generateReportData);

// GET /api/reports/esg - Get ESG performance data
router.get("/esg", getESGData);

// POST /api/reports/export - Export report (PDF/CSV/JSON)
router.post("/export", exportReport);

// GET /api/reports/achievements - Get user achievements
router.get("/achievements", getAchievements);

// GET /api/reports/history - Get report generation history
router.get("/history", getReportHistory);

export default router;
