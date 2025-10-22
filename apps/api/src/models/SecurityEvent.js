import mongoose from "mongoose";

const securityEventSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["blocked", "detected", "cleared", "warning"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "authentication",
        "authorization",
        "injection",
        "dos",
        "anomaly",
        "other",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    source: {
      ip: String,
      userAgent: String,
      userId: mongoose.Schema.Types.ObjectId,
    },
    action: {
      type: String,
      enum: ["logged", "blocked", "throttled", "alerted"],
      required: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
securityEventSchema.index({ timestamp: -1 });
securityEventSchema.index({ eventType: 1, timestamp: -1 });
securityEventSchema.index({ severity: 1, resolved: 1 });

const SecurityEvent = mongoose.model("SecurityEvent", securityEventSchema);

export default SecurityEvent;
