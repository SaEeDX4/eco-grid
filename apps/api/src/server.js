// ✅ Load environment variables explicitly from apps/api/.env
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ This ensures the correct .env file is loaded no matter where npm is run (root or api)
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

// ✅ Added new pricing & subscription routes (Claude instruction)
import pricingRoutes from "./routes/pricing.js";
import subscriptionRoutes from "./routes/subscriptions.js";

import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Check if env loaded properly
if (!process.env.MONGODB_URI) {
  console.warn(
    "⚠️  Warning: MONGODB_URI is missing. Make sure it's set in Render environment variables."
  );
}

// ✅ Security middleware
app.use(helmet());

// ✅ CORS — allow your local + Render frontend
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://eco-grid.onrender.com", // Render static frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow if no origin (like Postman) or in allowed list
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

// ✅ Connect to MongoDB
connectDB();

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Eco-Grid API is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Routes
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

// ✅ Added new Pricing and Subscription routes (Claude instruction)
app.use("/api/pricing", pricingRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// ✅ Root
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
      forecast: "/api/forecast (coming soon)",
    },
  });
});

// ✅ 404
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.url} not found`,
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Eco-Grid API running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);

  // ✅ Quick confirmation for Anthropic key (no exposure)
  if (process.env.ANTHROPIC_API_KEY) {
    console.log("🤖 Claude API key detected successfully ✅");
  } else {
    console.warn("❌ Anthropic API key missing. Check apps/api/.env");
  }
});
