import express from "express";
import {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAnalytics,
} from "../controllers/faqAdminController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(["admin"]));

router.get("/", getAllFAQs);
router.get("/analytics", getAnalytics);
router.post("/", createFAQ);
router.put("/:id", updateFAQ);
router.delete("/:id", deleteFAQ);

export default router;
