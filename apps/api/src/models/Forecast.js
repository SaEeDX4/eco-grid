import mongoose from "mongoose";

const forecastSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["household", "organization", "grid"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    horizon: {
      type: Date,
      required: true,
    },
    predictions: {
      demand: [Number],
      price: [Number],
      solarGeneration: [Number],
      windGeneration: [Number],
    },
    peakHours: [String],
    offPeakHours: [String],
    avgPrice: Number,
    weather: {
      temp: Number,
      condition: String,
      icon: String,
    },
    recommendation: String,
    method: {
      type: String,
      enum: ["PIML", "simple", "ml", "statistical"],
      default: "simple",
    },
    confidence: Number,
  },
  {
    timestamps: true,
  },
);

// Indexes
forecastSchema.index({ userId: 1, horizon: -1 });
forecastSchema.index({ scope: 1, timestamp: -1 });

const Forecast = mongoose.model("Forecast", forecastSchema);

export default Forecast;
