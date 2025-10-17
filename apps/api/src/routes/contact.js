import express from "express";
import {
  submitContactForm,
  getContactMessages,
  updateMessageStatus,
} from "../controllers/contactController.js";
import { authenticate } from "../middleware/auth.js";
import { contactFormLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST /api/contact - Submit contact form (public, rate limited)
router.post("/", contactFormLimiter, submitContactForm);

// GET /api/contact/messages - Get all contact messages (admin only)
router.get("/messages", authenticate, getContactMessages);

// PATCH /api/contact/messages/:id - Update message status (admin only)
router.patch("/messages/:id", authenticate, updateMessageStatus);

export default router;
