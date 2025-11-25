import mongoose from "mongoose";

const dispatchInstructionSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
    },
    action: {
      type: String,
      enum: ["charge", "discharge", "hold", "standby"],
      required: true,
    },
    capacityMW: {
      type: Number,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    priceCAD: Number,
  },
  { _id: false }
);

const vppBidSchema = new mongoose.Schema(
  {
    poolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VPPPool",
      required: true,
    },
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VPPMarket",
      required: true,
    },
    product: {
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
    bidWindow: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    capacityMW: {
      type: Number,
      required: true,
      min: 0,
    },
    bidPriceCAD: {
      type: Number,
      required: true,
      min: 0,
    },
    clearingPriceCAD: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "dispatched",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    forecastedRevenue: {
      type: Number,
      default: 0,
    },
    actualRevenue: {
      type: Number,
      default: 0,
    },
    dispatchInstructions: [dispatchInstructionSchema],
    performance: {
      requested: Number,
      delivered: Number,
      reliability: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    settlementDate: Date,
    settlementStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "disputed"],
      default: "pending",
    },
    metadata: {
      algorithm: String,
      confidence: Number,
      weatherConditions: String,
      gridConditions: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vppBidSchema.index({ poolId: 1, status: 1 });
vppBidSchema.index({ market: 1, "bidWindow.start": 1 });
vppBidSchema.index({ status: 1, "bidWindow.start": 1 });
vppBidSchema.index({ "bidWindow.start": 1, "bidWindow.end": 1 });

// Static method to get active bids for pool
vppBidSchema.statics.getActiveBidsForPool = function (poolId) {
  return this.find({
    poolId,
    status: { $in: ["accepted", "dispatched"] },
  })
    .populate("market")
    .sort({ "bidWindow.start": 1 })
    .lean();
};

// Static method to get recent bids
vppBidSchema.statics.getRecentBids = function (poolId, limit = 20) {
  return this.find({ poolId })
    .populate("market")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Method to calculate performance
vppBidSchema.methods.calculatePerformance = function () {
  if (!this.performance.requested || !this.performance.delivered) {
    return null;
  }

  const reliability =
    (this.performance.delivered / this.performance.requested) * 100;
  this.performance.reliability = Math.min(100, Math.max(0, reliability));

  return this.performance.reliability;
};

// Method to complete bid
vppBidSchema.methods.completeBid = async function (actualRevenue, performance) {
  this.status = "completed";
  this.actualRevenue = actualRevenue;
  this.performance = performance;
  this.settlementStatus = "processing";
  this.settlementDate = new Date();

  await this.save();
  return this;
};

const VPPBid = mongoose.model("VPPBid", vppBidSchema);

export default VPPBid;
