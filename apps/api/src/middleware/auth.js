import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables before anything else

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token using secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure user still exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found or token invalid" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
