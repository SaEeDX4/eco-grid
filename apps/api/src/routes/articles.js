import express from "express";
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleVersions,
  restoreArticleVersion,
  getPopularArticles,
} from "../controllers/articlesController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getArticles);
router.get("/popular", getPopularArticles);
router.get("/:slug", getArticleBySlug);

// Protected routes (admin/editor only)
router.post("/", authenticate, authorize(["admin", "editor"]), createArticle);
router.put("/:id", authenticate, authorize(["admin", "editor"]), updateArticle);
router.delete("/:id", authenticate, authorize(["admin"]), deleteArticle);

// Version control routes
router.get(
  "/:id/versions",
  authenticate,
  authorize(["admin", "editor"]),
  getArticleVersions
);
router.post(
  "/:id/versions/:versionId/restore",
  authenticate,
  authorize(["admin"]),
  restoreArticleVersion
);

export default router;
