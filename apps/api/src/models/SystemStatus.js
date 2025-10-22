import mongoose from "mongoose";

const systemStatusSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    uptime: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    apiLatency: {
      type: Number,
      required: true,
      min: 0,
    },
    activeConnections: {
      type: Number,
      default: 0,
    },
    requestsPerSecond: {
      type: Number,
      default: 0,
    },
    cpuUsage: {
      type: Number,
      min: 0,
      max: 100,
    },
    memoryUsage: {
      type: Number,
      min: 0,
      max: 100,
    },
    databaseHealth: {
      type: String,
      enum: ["healthy", "degraded", "down"],
      default: "healthy",
    },
    services: {
      api: { type: String, enum: ["up", "down"], default: "up" },
      database: { type: String, enum: ["up", "down"], default: "up" },
      cache: { type: String, enum: ["up", "down"], default: "up" },
      queue: { type: String, enum: ["up", "down"], default: "up" },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
systemStatusSchema.index({ timestamp: -1 });

// Static method to record current status
systemStatusSchema.statics.recordStatus = async function () {
  // In production, this would check actual system metrics
  const status = await this.create({
    uptime: 99.85 + Math.random() * 0.14,
    apiLatency: 120 + Math.floor(Math.random() * 60),
    activeConnections: 400 + Math.floor(Math.random() * 200),
    requestsPerSecond: 200 + Math.floor(Math.random() * 100),
    cpuUsage: 30 + Math.floor(Math.random() * 30),
    memoryUsage: 50 + Math.floor(Math.random() * 20),
    databaseHealth: "healthy",
    services: {
      api: "up",
      database: "up",
      cache: "up",
      queue: "up",
    },
  });

  return status;
};

const SystemStatus = mongoose.model("SystemStatus", systemStatusSchema);

export default SystemStatus;
