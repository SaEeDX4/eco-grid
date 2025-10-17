// apps/api/src/server.js
import "dotenv/config"; // ✅ Load env FIRST

import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import deviceRoutes from "./routes/devices.js";
import optimizerRoutes from "./routes/optimizer.js"; // ✅ Added optimizer routes
import reportsRoutes from "./routes/reports.js"; // ✅ Added reports routes
import teamRoutes from "./routes/team.js"; // ✅ Added team routes
import partnersRoutes from "./routes/partners.js"; // ✅ Added partners routes
import contactRoutes from "./routes/contact.js"; // ✅ Added contact routes
import chatRoutes from "./routes/chat.js"; // ✅ Added chat routes

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Eco-Grid API is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/optimizer", optimizerRoutes); // ✅ Added route registration
app.use("/api/reports", reportsRoutes); // ✅ Added reports route registration
app.use("/api/team", teamRoutes); // ✅ Added team route registration
app.use("/api/partners", partnersRoutes); // ✅ Added partners route registration

// ✅ New routes for Module 9
app.use("/api/contact", contactRoutes); // ✅ Contact Routes
app.use("/api/chat", chatRoutes); // ✅ Chat Routes

// Root
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Eco-Grid API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      ai: "/api/ai",
      auth: "/api/auth",
      dashboard: "/api/dashboard",
      devices: "/api/devices",
      optimizer: "/api/optimizer", // ✅ Added to endpoints list
      reports: "/api/reports", // ✅ Added to endpoints list
      team: "/api/team", // ✅ Added to endpoints list
      partners: "/api/partners", // ✅ Added to endpoints list
      contact: "/api/contact", // ✅ Added to endpoints list
      chat: "/api/chat", // ✅ Added to endpoints list
      forecast: "/api/forecast (coming soon)",
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.url} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`✅ Eco-Grid API running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
