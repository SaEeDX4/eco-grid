// Load environment variables explicitly from apps/api/.env
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This ensures the correct .env file is loaded no matter where npm is run (root or api)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import helmet from "helmet";

import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import deviceRoutes from "./routes/devices.js";
import optimizerRoutes from "./routes/optimizer.js";
import reportsRoutes from "./routes/reports.js";
import teamRoutes from "./routes/team.js";
import partnersRoutes from "./routes/partners.js";
import contactRoutes from "./routes/contact.js";
import chatRoutes from "./routes/chat.js";

// FAQ routes (Module 15)
import faqRoutes from "./routes/faq.js";
import faqAdminRoutes from "./routes/faqAdmin.js";

// Added new pricing & subscription routes
import pricingRoutes from "./routes/pricing.js";
import subscriptionRoutes from "./routes/subscriptions.js";

// Added metrics and system routes + service
import metricsRoutes from "./routes/metrics.js";
import systemRoutes from "./routes/system.js";
import { startMetricsCollection } from "./services/metricsService.js";

// Added Blog & Content Routes
import articlesRoutes from "./routes/articles.js";
import newsletterRoutes from "./routes/newsletter.js";
import aiWriterRoutes from "./routes/aiWriter.js";

// Added Testimonials & Case Studies Routes (Module 13)
import testimonialsRoutes from "./routes/testimonials.js";
import caseStudiesRoutes from "./routes/caseStudies.js";

// Added Pilots Routes (Module 14)
import pilotsRoutes from "./routes/pilots.js";

import roadmapRoutes from "./routes/roadmap.js";

// VPP routes (Module 17)
import vppRoutes from "./routes/vpp.js";

// Hub routes (Module 18)
import hubRoutes from "./routes/hub.js";

import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Check if env loaded properly
if (!process.env.MONGODB_URI) {
  console.warn(
    "⚠️  Warning: MONGODB_URI is missing. Make sure it's set in Render environment variables."
  );
}

// Security middleware
app.use(helmet());

// CORS — allow your local + Render frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://eco-grid.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`🚫 Blocked CORS request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Start background metrics after DB connection
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected successfully");

  // Start background metrics collection
  startMetricsCollection();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Eco-Grid API is running",
    timestamp: new Date().toISOString(),
  });
});

// =============================
// 📌 API ROUTES
// =============================
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/optimizer", optimizerRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);

// FAQ routes (Module 15)
app.use("/api/faq", faqRoutes);
app.use("/api/faq/admin", faqAdminRoutes);

// Added new Pricing and Subscription routes
app.use("/api/pricing", pricingRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Metrics and System Routes
app.use("/api/metrics", metricsRoutes);
app.use("/api/system", systemRoutes);

// Blog & Content Routes
app.use("/api/articles", articlesRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/ai-writer", aiWriterRoutes);

// Testimonials & Case Studies Routes (Module 13)
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/case-studies", caseStudiesRoutes);

// Pilots Routes (Module 14)
app.use("/api/pilots", pilotsRoutes);

// Roadmap Routes (Module 16)
app.use("/api/roadmap", roadmapRoutes);

// VPP routes (Module 17 — Virtual Power Plant)
app.use("/api/vpp", vppRoutes);

// Hub routes (Module 18)
app.use("/api/hub", hubRoutes);

// =============================
// 📌 ROOT DOC
// =============================
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
      optimizer: "/api/optimizer",
      reports: "/api/reports",
      team: "/api/team",
      partners: "/api/partners",
      contact: "/api/contact",
      chat: "/api/chat",
      pricing: "/api/pricing",
      subscriptions: "/api/subscriptions",
      metrics: "/api/metrics",
      system: "/api/system",
      articles: "/api/articles",
      newsletter: "/api/newsletter",
      "ai-writer": "/api/ai-writer",
      testimonials: "/api/testimonials",
      "case-studies": "/api/case-studies",
      pilots: "/api/pilots",
      roadmap: "/api/roadmap",
      hub: "/api/hub",
      faq: "/api/faq",
      faqAdmin: "/api/faq/admin",
      vpp: "/api/vpp",
      forecast: "/api/forecast (coming soon)",
    },
  });
});

// =============================
// 📌 404 HANDLER
// =============================
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.url} not found`,
  });
});

// =============================
// 📌 Global Error Handler
// =============================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// =============================
// 📌 Start server
// =============================
app.listen(PORT, () => {
  console.log(`✅ Eco-Grid API running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);

  // Claude API
  if (process.env.ANTHROPIC_API_KEY) {
    console.log("🤖 Claude API key detected successfully ✅");
  } else {
    console.warn("❌ Anthropic API key missing. Check apps/api/.env");
  }
});
