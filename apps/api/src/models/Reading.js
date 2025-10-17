import mongoose from "mongoose";

const readingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    powerW: {
      type: Number,
      required: true,
    },
    kWh: Number,
    voltage: Number,
    current: Number,
    temperature: Number,
    stateOfCharge: Number, // For batteries
    generation: Number, // For solar (negative power)
    metrics: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient time-series queries
readingSchema.index({ deviceId: 1, timestamp: -1 });
readingSchema.index({ timestamp: -1 });

// TTL index to auto-delete old readings (optional - keep 1 year)
readingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

const Reading = mongoose.model("Reading", readingSchema);

export default Reading;
