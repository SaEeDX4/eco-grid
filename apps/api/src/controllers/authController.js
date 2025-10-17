import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto";

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      accountType: accountType || "household",
      verificationToken,
    });

    // Log audit
    await AuditLog.create({
      userId: user._id,
      action: "register",
      entity: "User",
      entityId: user._id,
      details: { accountType: user.accountType },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // TODO: Send verification email (to be implemented later)
    console.log(`📧 Verification token for ${email}: ${verificationToken}`);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user & return JWT token
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Ensure backward compatibility between bcrypt and bcryptjs
    let isPasswordValid = false;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch {
      isPasswordValid = false;
    }

    if (!isPasswordValid) {
      // Log failed attempt
      await AuditLog.create({
        userId: user._id,
        action: "login",
        entity: "User",
        entityId: user._id,
        status: "failure",
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update login stats
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Log successful login
    await AuditLog.create({
      userId: user._id,
      action: "login",
      entity: "User",
      entityId: user._id,
      status: "success",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Get user error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Log out user
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // Log logout
    await AuditLog.create({
      userId: req.user.id,
      action: "logout",
      entity: "User",
      entityId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
