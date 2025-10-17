import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import AuditLog from "../models/AuditLog.js"; // ✅ Added for logging SSO actions

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

// ===========================================
// ✅ SSO STUB ROUTES (Google & Microsoft)
// ===========================================

// POST /api/auth/sso/google/stub - Google SSO stub
router.post("/sso/google/stub", async (req, res) => {
  try {
    // Simulate OAuth flow with mock user
    const mockUser = {
      id: "google_user_" + Date.now(),
      email: "google.user@example.com",
      name: "Google User",
      role: "user",
      ssoProvider: "google",
    };

    // Generate JWT token
    const token = jwt.sign(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Log the SSO attempt
    await AuditLog.create({
      userId: mockUser.id,
      action: "sso_login_stub",
      entity: "User",
      details: {
        provider: "google",
        email: mockUser.email,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Google SSO stub - signed in successfully",
      token,
      user: mockUser,
    });
  } catch (error) {
    console.error("Google SSO stub error:", error);
    res.status(500).json({
      success: false,
      message: "SSO authentication failed",
    });
  }
});

// POST /api/auth/sso/microsoft/stub - Microsoft SSO stub
router.post("/sso/microsoft/stub", async (req, res) => {
  try {
    // Simulate OAuth flow with mock user
    const mockUser = {
      id: "microsoft_user_" + Date.now(),
      email: "microsoft.user@example.com",
      name: "Microsoft User",
      role: "user",
      ssoProvider: "microsoft",
    };

    // Generate JWT token
    const token = jwt.sign(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Log the SSO attempt
    await AuditLog.create({
      userId: mockUser.id,
      action: "sso_login_stub",
      entity: "User",
      details: {
        provider: "microsoft",
        email: mockUser.email,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Microsoft SSO stub - signed in successfully",
      token,
      user: mockUser,
    });
  } catch (error) {
    console.error("Microsoft SSO stub error:", error);
    res.status(500).json({
      success: false,
      message: "SSO authentication failed",
    });
  }
});

export default router;
