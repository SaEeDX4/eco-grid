import mongoose from "mongoose";

const optimizerPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mode: {
      type: String,
      enum: ["normal", "off_peak", "partial", "custom"],
      required: true,
    },
    scenario: {
      type: String,
      default: "",
    },
    schedule: [
      {
        deviceId: String,
        deviceName: String,
        deviceType: String,
        powerW: Number,
        startHour: Number,
        endHour: Number,
        isWeekend: Boolean,
      },
    ],
    expectedSavings: {
      type: Number,
      required: true,
    },
    expectedCO2: {
      type: Number,
      default: 0,
    },
    actualSavings: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "cancelled"],
      default: "draft",
    },
    activatedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  },
);

// Indexes
optimizerPlanSchema.index({ userId: 1, status: 1 });
optimizerPlanSchema.index({ userId: 1, activatedAt: -1 });

const OptimizerPlan = mongoose.model("OptimizerPlan", optimizerPlanSchema);

export default OptimizerPlan;
