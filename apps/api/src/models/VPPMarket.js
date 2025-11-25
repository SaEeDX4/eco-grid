import mongoose from "mongoose";

const marketProductSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "energy",
        "capacity",
        "frequency-regulation",
        "spinning-reserve",
        "demand-response",
      ],
      required: true,
    },
    minBidMW: {
      type: Number,
      required: true,
      default: 1,
    },
    clearingPriceCAD: {
      type: Number,
      default: 0,
    },
    nextWindow: Date,
    windowDurationMinutes: Number,
  },
  { _id: false }
);

const vppMarketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    region: {
      type: String,
      required: true,
      enum: [
        "BC",
        "AB",
        "SK",
        "MB",
        "ON",
        "QC",
        "CA-WEST",
        "CA-EAST",
        "US-WEST",
        "US-EAST",
        "EUROPE",
      ],
    },
    operator: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "offline"],
      default: "active",
    },
    products: [marketProductSchema],
    integrationStatus: {
      type: String,
      enum: ["live", "simulated", "planned"],
      default: "simulated",
    },
    apiEndpoint: String,
    timezone: {
      type: String,
      default: "America/Vancouver",
    },
    currency: {
      type: String,
      default: "CAD",
    },
    description: String,
    requirements: {
      minCapacityMW: Number,
      maxCapacityMW: Number,
      settlementPeriodDays: Number,
      bidLeadTimeHours: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vppMarketSchema.index({ region: 1, status: 1 });
vppMarketSchema.index({ code: 1 });
vppMarketSchema.index({ status: 1 });

// Static method to get active markets
vppMarketSchema.statics.getActiveMarkets = function () {
  return this.find({ status: "active" }).lean();
};

// Static method to get markets by region
vppMarketSchema.statics.getByRegion = function (region) {
  return this.find({ region, status: "active" }).lean();
};

const VPPMarket = mongoose.model("VPPMarket", vppMarketSchema);

export default VPPMarket;
