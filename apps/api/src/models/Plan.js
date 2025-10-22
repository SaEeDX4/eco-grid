import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      enum: ["free", "household", "sme", "enterprise"],
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    pricing: {
      monthly: Number,
      annual: Number,
      currency: {
        type: String,
        default: "CAD",
      },
    },
    features: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    limits: {
      maxDevices: Number,
      maxUsers: Number,
      maxSites: Number,
      apiCallsPerMonth: Number,
      dataRetentionDays: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
planSchema.index({ id: 1 });
planSchema.index({ active: 1 });
planSchema.index({ sortOrder: 1 });

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
