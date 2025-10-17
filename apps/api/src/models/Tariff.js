import mongoose from "mongoose";

const tariffSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
    },
    planType: {
      type: String,
      required: true,
      enum: ["residential", "commercial", "industrial"],
    },
    planName: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "CAD",
    },
    rates: {
      peak: {
        rate: Number,
        hours: [Number],
        days: [String],
      },
      midPeak: {
        rate: Number,
        hours: [Number],
        days: [String],
      },
      offPeak: {
        rate: Number,
        hours: [Number],
        days: [String],
      },
    },
    touWindows: [
      {
        name: String,
        startHour: Number,
        endHour: Number,
        rate: Number,
        days: [String],
      },
    ],
    seasonalRates: [
      {
        season: String,
        startMonth: Number,
        endMonth: Number,
        rates: mongoose.Schema.Types.Mixed,
      },
    ],
    demandCharges: {
      enabled: Boolean,
      rate: Number,
      unit: String,
    },
    fixedCharges: {
      monthly: Number,
      daily: Number,
    },
    effectiveDate: {
      type: Date,
      required: true,
    },
    expiryDate: Date,
    provider: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
tariffSchema.index({ region: 1, planType: 1, isActive: 1 });
tariffSchema.index({ effectiveDate: -1 });

const Tariff = mongoose.model("Tariff", tariffSchema);

export default Tariff;
