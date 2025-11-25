import mongoose from "mongoose";

const batteryImpactSchema = new mongoose.Schema(
  {
    cyclesUsed: {
      type: Number,
      default: 0,
    },
    socStart: {
      type: Number,
      min: 0,
      max: 100,
    },
    socEnd: {
      type: Number,
      min: 0,
      max: 100,
    },
    depthOfDischarge: {
      type: Number,
      min: 0,
      max: 100,
    },
    temperature: Number,
    degradationEstimate: Number,
  },
  { _id: false }
);

const vppDispatchSchema = new mongoose.Schema(
  {
    poolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VPPPool",
      required: true,
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VPPBid",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    requestedKW: {
      type: Number,
      required: true,
    },
    actualKW: {
      type: Number,
      default: 0,
    },
    baselineKW: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled", "failed"],
      default: "scheduled",
    },
    performance: {
      delivered: Number,
      expected: Number,
      reliability: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    revenue: {
      gross: {
        type: Number,
        default: 0,
      },
      platformFee: {
        type: Number,
        default: 0,
      },
      net: {
        type: Number,
        default: 0,
      },
    },
    batteryImpact: batteryImpactSchema,
    response: {
      acceptedAt: Date,
      completedAt: Date,
      responseTimeSeconds: Number,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
vppDispatchSchema.index({ userId: 1, status: 1 });
vppDispatchSchema.index({ deviceId: 1, startTime: 1 });
vppDispatchSchema.index({ poolId: 1, status: 1 });
vppDispatchSchema.index({ bidId: 1 });
vppDispatchSchema.index({ startTime: 1, endTime: 1 });

// Virtual for duration
vppDispatchSchema.virtual("durationMinutes").get(function () {
  return Math.round((this.endTime - this.startTime) / 60000);
});

// Virtual for energy delivered
vppDispatchSchema.virtual("energyKWh").get(function () {
  return (this.actualKW * this.durationMinutes) / 60;
});

// Static method to get user dispatches
vppDispatchSchema.statics.getUserDispatches = function (userId, options = {}) {
  const query = { userId };

  if (options.status) {
    query.status = options.status;
  }

  if (options.startDate) {
    query.startTime = { $gte: new Date(options.startDate) };
  }

  if (options.endDate) {
    query.endTime = { $lte: new Date(options.endDate) };
  }

  return this.find(query)
    .populate("poolId", "name")
    .populate("deviceId", "name type")
    .sort({ startTime: -1 })
    .limit(options.limit || 50)
    .lean();
};

// Static method to get upcoming dispatches
vppDispatchSchema.statics.getUpcomingDispatches = function (userId) {
  return this.find({
    userId,
    status: "scheduled",
    startTime: { $gte: new Date() },
  })
    .populate("poolId", "name")
    .populate("deviceId", "name type")
    .sort({ startTime: 1 })
    .limit(10)
    .lean();
};

// Method to complete dispatch
vppDispatchSchema.methods.completeDispatch = async function (
  actualKW,
  batteryImpact
) {
  this.status = "completed";
  this.actualKW = actualKW;
  this.response.completedAt = new Date();

  // Calculate performance
  this.performance.delivered = actualKW;
  this.performance.expected = this.requestedKW;
  this.performance.reliability = Math.min(
    100,
    (actualKW / this.requestedKW) * 100
  );

  // Update battery impact
  if (batteryImpact) {
    this.batteryImpact = batteryImpact;
  }

  await this.save();
  return this;
};

const VPPDispatch = mongoose.model("VPPDispatch", vppDispatchSchema);

export default VPPDispatch;
