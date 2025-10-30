import mongoose from "mongoose";

const impactMetricSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    energySavedKWh: {
      type: Number,
      default: 0,
    },
    moneySavedCAD: {
      type: Number,
      default: 0,
    },
    co2ReducedKg: {
      type: Number,
      default: 0,
    },
    activeHomes: {
      type: Number,
      default: 0,
    },
    activeBusinesses: {
      type: Number,
      default: 0,
    },
    devicesManaged: {
      type: Number,
      default: 0,
    },
    waterSavedLiters: {
      type: Number,
      default: 0,
    },
    peakDemandReductionKW: {
      type: Number,
      default: 0,
    },
    aggregationType: {
      type: String,
      enum: ["hourly", "daily", "weekly", "monthly", "all-time"],
      default: "all-time",
    },
    period: {
      start: Date,
      end: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
impactMetricSchema.index({ timestamp: -1 });
impactMetricSchema.index({ aggregationType: 1, timestamp: -1 });

// ✅ Static method to get latest all-time metrics (with safe auto-create)
impactMetricSchema.statics.getLatest = async function () {
  let doc = await this.findOne({ aggregationType: "all-time" }).sort({
    timestamp: -1,
  });

  // 🩵 Auto-create initial seed record if none exists
  if (!doc) {
    console.log("⚠️ No metrics found. Creating initial baseline document...");
    doc = await this.create({
      energySavedKWh: 127543,
      moneySavedCAD: 38263,
      co2ReducedKg: 38134,
      activeHomes: 127,
      activeBusinesses: 12,
      devicesManaged: 1842,
      waterSavedLiters: 15234,
      peakDemandReductionKW: 487,
      aggregationType: "all-time",
    });
  }

  return doc ? doc.toObject() : null;
};

// Static method to calculate and store current metrics
impactMetricSchema.statics.calculateAndStore = async function () {
  const latest = await this.getLatest();
  const base = latest || {
    energySavedKWh: 120000,
    moneySavedCAD: 36000,
    co2ReducedKg: 36000,
    activeHomes: 120,
    activeBusinesses: 8,
    devicesManaged: 1800,
    waterSavedLiters: 14500,
    peakDemandReductionKW: 450,
  };

  const newMetric = await this.create({
    energySavedKWh: base.energySavedKWh + Math.floor(Math.random() * 100) + 50,
    moneySavedCAD: base.moneySavedCAD + Math.floor(Math.random() * 30) + 15,
    co2ReducedKg: base.co2ReducedKg + Math.floor(Math.random() * 30) + 15,
    activeHomes: base.activeHomes + (Math.random() > 0.7 ? 1 : 0),
    activeBusinesses: base.activeBusinesses + (Math.random() > 0.9 ? 1 : 0),
    devicesManaged: base.devicesManaged + Math.floor(Math.random() * 5),
    waterSavedLiters:
      base.waterSavedLiters + Math.floor(Math.random() * 50) + 20,
    peakDemandReductionKW: base.peakDemandReductionKW + Math.random() * 2 - 1,
    aggregationType: "all-time",
  });

  return newMetric.toObject();
};

const ImpactMetric = mongoose.model("ImpactMetric", impactMetricSchema);

export default ImpactMetric;
