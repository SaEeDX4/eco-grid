import express from "express";
import {
  getTeamMembers,
  getAdvisors,
  submitCareerInquiry,
} from "../controllers/teamController.js";

const router = express.Router();

// GET /api/team/members - Get team members (public)
router.get("/members", getTeamMembers);

// GET /api/team/advisors - Get advisory board (public)
router.get("/advisors", getAdvisors);

// POST /api/team/careers - Submit career inquiry (public)
router.post("/careers", submitCareerInquiry);

export default router;
