import mongoose from "mongoose";

const revenueBreakdownSchema = new mongoose.Schema(
  {
    energyRevenue: {
      type: Number,
      default: 0,
    },
    capacityRevenue: {
      type: Number,
      default: 0,
    },
    ancillaryRevenue: {
      type: Number,
      default: 0,
    },
    performanceBonus: {
      type: Number,
      default: 0,
    },
    penalties: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const vppRevenueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    poolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VPPPool",
      required: true,
    },
    period: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      type: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "annual"],
        default: "monthly",
      },
    },
    grossRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    operatorFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    netRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    breakdown: revenueBreakdownSchema,
    dispatches: {
      count: {
        type: Number,
        default: 0,
      },
      totalKWh: {
        type: Number,
        default: 0,
      },
      avgKW: {
        type: Number,
        default: 0,
      },
    },
    availability: {
      hoursAvailable: {
        type: Number,
        default: 0,
      },
      hoursDispatched: {
        type: Number,
        default: 0,
      },
      utilizationPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    performance: {
      reliability: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      responseTime: Number,
      accuracy: Number,
    },
    status: {
      type: String,
      enum: ["accruing", "pending", "paid", "disputed"],
      default: "accruing",
    },
    paidAt: Date,
    paymentMethod: {
      type: String,
      enum: ["direct-deposit", "credit", "wallet"],
      default: "credit",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vppRevenueSchema.index({ userId: 1, "period.start": -1 });
vppRevenueSchema.index({ poolId: 1, "period.start": -1 });
vppRevenueSchema.index({ userId: 1, status: 1 });
vppRevenueSchema.index({ "period.type": 1, "period.start": -1 });

// Virtual for effective rate
vppRevenueSchema.virtual("effectiveRateCADPerKWh").get(function () {
  if (this.dispatches.totalKWh === 0) return 0;
  return this.netRevenue / this.dispatches.totalKWh;
});

// Static method to get user revenue summary
vppRevenueSchema.statics.getUserRevenueSummary = async function (userId) {
  const summary = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalGross: { $sum: "$grossRevenue" },
        totalNet: { $sum: "$netRevenue" },
        totalFees: { $sum: { $add: ["$platformFee", "$operatorFee"] } },
        totalDispatches: { $sum: "$dispatches.count" },
        totalKWh: { $sum: "$dispatches.totalKWh" },
        avgReliability: { $avg: "$performance.reliability" },
      },
    },
  ]);

  return (
    summary[0] || {
      totalGross: 0,
      totalNet: 0,
      totalFees: 0,
      totalDispatches: 0,
      totalKWh: 0,
      avgReliability: 100,
    }
  );
};

// Static method to get monthly revenue
vppRevenueSchema.statics.getMonthlyRevenue = function (userId, months = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return this.find({
    userId,
    "period.type": "monthly",
    "period.start": { $gte: startDate },
  })
    .sort({ "period.start": 1 })
    .lean();
};

// Static method to get revenue by pool
vppRevenueSchema.statics.getRevenueByPool = async function (userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$poolId",
        totalNet: { $sum: "$netRevenue" },
        totalDispatches: { $sum: "$dispatches.count" },
        avgReliability: { $avg: "$performance.reliability" },
      },
    },
    {
      $lookup: {
        from: "vpppools",
        localField: "_id",
        foreignField: "_id",
        as: "pool",
      },
    },
    { $unwind: "$pool" },
  ]);
};

// Method to calculate and update revenue
vppRevenueSchema.methods.calculateRevenue = function (dispatches, feePercents) {
  let gross = 0;
  let energyRev = 0;
  let capacityRev = 0;
  let ancillaryRev = 0;
  let totalKWh = 0;
  let totalKW = 0;

  dispatches.forEach((dispatch) => {
    gross += dispatch.revenue.gross;
    totalKWh += dispatch.energyKWh || 0;
    totalKW += dispatch.actualKW || 0;

    // Breakdown by type (would come from dispatch metadata)
    energyRev += dispatch.revenue.gross * 0.7;
    capacityRev += dispatch.revenue.gross * 0.2;
    ancillaryRev += dispatch.revenue.gross * 0.1;
  });

  this.grossRevenue = gross;
  this.platformFee = gross * (feePercents.platform / 100);
  this.operatorFee = gross * (feePercents.operator / 100);
  this.netRevenue = gross - this.platformFee - this.operatorFee;

  this.breakdown.energyRevenue = energyRev;
  this.breakdown.capacityRevenue = capacityRev;
  this.breakdown.ancillaryRevenue = ancillaryRev;

  this.dispatches.count = dispatches.length;
  this.dispatches.totalKWh = totalKWh;
  this.dispatches.avgKW =
    dispatches.length > 0 ? totalKW / dispatches.length : 0;

  return this;
};

const VPPRevenue = mongoose.model("VPPRevenue", vppRevenueSchema);

export default VPPRevenue;
