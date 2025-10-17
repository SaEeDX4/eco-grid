import express from "express";
import {
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  getPartnershipStats,
} from "../controllers/partnersController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/partners/inquiries - Submit partner inquiry (public)
router.post("/inquiries", submitInquiry);

// GET /api/partners/inquiries - Get all inquiries (admin only)
router.get("/inquiries", authenticate, getInquiries);

// PATCH /api/partners/inquiries/:id - Update inquiry status (admin only)
router.patch("/inquiries/:id", authenticate, updateInquiryStatus);

// GET /api/partners/stats - Get partnership statistics (admin only)
router.get("/stats", authenticate, getPartnershipStats);

export default router;
