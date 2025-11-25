import mongoose from "mongoose";

/**
 * TENANT CHARGE SUBDOCUMENT
 */
const tenantChargeSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    tenantName: String,
    charges: {
      baseCAD: { type: Number, default: 0 },
      usageCAD: { type: Number, default: 0 },
      demandCAD: { type: Number, default: 0 },
      overageCAD: { type: Number, default: 0 },
      creditsCAD: { type: Number, default: 0 },
    },
    usage: {
      energyKWh: { type: Number, default: 0 },
      peakDemandKW: { type: Number, default: 0 },
      avgDemandKW: { type: Number, default: 0 },
      overageKWh: { type: Number, default: 0 },
    },
    totalCAD: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "finalized", "invoiced", "paid", "overdue"],
      default: "draft",
    },
  },
  { _id: false }
);

/**
 * VPP REVENUE SUBDOCUMENT
 */
const vppRevenueSchema = new mongoose.Schema(
  {
    poolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VPPPool",
    },
    poolName: String,
    grossCAD: { type: Number, default: 0 },
    feesCAD: { type: Number, default: 0 },
    netCAD: { type: Number, default: 0 },
    dispatches: { type: Number, default: 0 },
    energyKWh: { type: Number, default: 0 },
  },
  { _id: false }
);

/**
 * HUB REVENUE ROOT DOCUMENT
 */
const hubRevenueSchema = new mongoose.Schema(
  {
    hubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hub",
      required: true,
    },
    period: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      type: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "annual"],
        default: "monthly",
      },
    },

    tenantCharges: [tenantChargeSchema],

    vppRevenue: vppRevenueSchema,

    operatingCosts: {
      maintenanceCAD: { type: Number, default: 0 },
      energyCAD: { type: Number, default: 0 },
      platformFeeCAD: { type: Number, default: 0 },
      otherCAD: { type: Number, default: 0 },
      totalCAD: { type: Number, default: 0 },
    },

    summary: {
      totalTenantRevenueCAD: { type: Number, default: 0 },
      totalVPPRevenueCAD: { type: Number, default: 0 },
      totalOperatingCostsCAD: { type: Number, default: 0 },
      netRevenueCAD: { type: Number, default: 0 },
      profitMarginPercent: { type: Number, default: 0 },
    },

    energy: {
      totalGeneratedKWh: { type: Number, default: 0 },
      totalConsumedKWh: { type: Number, default: 0 },
      totalExportedKWh: { type: Number, default: 0 },
      totalImportedKWh: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["draft", "finalized", "invoiced", "reconciled", "closed"],
      default: "draft",
    },

    invoices: [
      {
        tenantId: mongoose.Schema.Types.ObjectId,
        invoiceNumber: String,
        invoiceDate: Date,
        dueDate: Date,
        amountCAD: Number,
        paidDate: Date,
        status: String,
      },
    ],

    reconciliation: {
      reconciledAt: Date,
      reconciledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      discrepancyCAD: Number,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * INDEXES
 */
hubRevenueSchema.index({ hubId: 1, "period.start": -1 });
hubRevenueSchema.index({ hubId: 1, "period.type": 1, "period.start": -1 });
hubRevenueSchema.index({ status: 1 });
hubRevenueSchema.index({ "tenantCharges.tenantId": 1 });

/**
 * INSTANCE METHODS
 */

// === TOTALS CALCULATION ===
hubRevenueSchema.methods.calculateTotals = function () {
  // Tenant revenue
  this.summary.totalTenantRevenueCAD = this.tenantCharges.reduce(
    (sum, charge) => sum + (charge.totalCAD || 0),
    0
  );

  // VPP revenue
  this.summary.totalVPPRevenueCAD = this.vppRevenue?.netCAD || 0;

  // Operating costs
  this.operatingCosts.totalCAD =
    (this.operatingCosts.maintenanceCAD || 0) +
    (this.operatingCosts.energyCAD || 0) +
    (this.operatingCosts.platformFeeCAD || 0) +
    (this.operatingCosts.otherCAD || 0);

  this.summary.totalOperatingCostsCAD = this.operatingCosts.totalCAD;

  // Net revenue
  const totalRevenue =
    this.summary.totalTenantRevenueCAD + this.summary.totalVPPRevenueCAD;

  this.summary.netRevenueCAD =
    totalRevenue - this.summary.totalOperatingCostsCAD;

  // Profit margin
  if (totalRevenue > 0) {
    this.summary.profitMarginPercent =
      (this.summary.netRevenueCAD / totalRevenue) * 100;
  } else {
    this.summary.profitMarginPercent = 0;
  }

  return this;
};

// === ADD TENANT CHARGE (FIXED) ===
hubRevenueSchema.methods.addTenantCharge = function (tenantCharge) {
  const existingIndex = this.tenantCharges.findIndex(
    (tc) => tc.tenantId.toString() === tenantCharge.tenantId.toString()
  );

  if (existingIndex >= 0) {
    // Replace entire object (Claude’s logic preserved)
    this.tenantCharges[existingIndex] = tenantCharge;
  } else {
    // Add new (broken syntax fixed here)
    this.tenantCharges.push(tenantCharge);
  }

  this.calculateTotals();
  return this;
};

// === FINALIZE PERIOD ===
hubRevenueSchema.methods.finalize = async function () {
  if (this.status !== "draft") {
    throw new Error("Only draft revenue records can be finalized");
  }

  this.calculateTotals();
  this.status = "finalized";

  await this.save();
  return this;
};

// === GENERATE INVOICES ===
hubRevenueSchema.methods.generateInvoices = async function () {
  if (this.status !== "finalized") {
    throw new Error("Revenue must be finalized before generating invoices");
  }

  const invoices = [];

  for (const charge of this.tenantCharges) {
    if (charge.status !== "invoiced" && charge.totalCAD > 0) {
      const invoiceNumber = `INV-${this.hubId}-${Date.now()}-${charge.tenantId}`;
      const invoiceDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      invoices.push({
        tenantId: charge.tenantId,
        invoiceNumber,
        invoiceDate,
        dueDate,
        amountCAD: charge.totalCAD,
        status: "pending",
      });

      charge.status = "invoiced";
    }
  }

  this.invoices.push(...invoices);
  this.status = "invoiced";

  await this.save();
  return invoices;
};

// === RECORD PAYMENT ===
hubRevenueSchema.methods.recordPayment = async function (
  tenantId,
  amountCAD,
  paymentDate = new Date()
) {
  const invoice = this.invoices.find(
    (inv) =>
      inv.tenantId.toString() === tenantId.toString() &&
      inv.status === "pending"
  );

  if (!invoice) {
    throw new Error("No pending invoice found for this tenant");
  }

  invoice.paidDate = paymentDate;
  invoice.status = "paid";

  const charge = this.tenantCharges.find(
    (tc) => tc.tenantId.toString() === tenantId.toString()
  );

  if (charge) charge.status = "paid";

  await this.save();
  return invoice;
};

// === RECONCILE PERIOD ===
hubRevenueSchema.methods.reconcile = async function (
  userId,
  discrepancyCAD = 0,
  notes = ""
) {
  if (this.status !== "invoiced") {
    throw new Error("Revenue must be invoiced before reconciliation");
  }

  this.reconciliation = {
    reconciledAt: new Date(),
    reconciledBy: userId,
    discrepancyCAD,
    notes,
  };

  this.status = "reconciled";

  await this.save();
  return this;
};

/**
 * STATIC METHODS
 */

// === GET BY PERIOD ===
hubRevenueSchema.statics.getByPeriod = function (hubId, startDate, endDate) {
  return this.find({
    hubId,
    "period.start": { $gte: startDate, $lte: endDate },
  })
    .populate("tenantCharges.tenantId", "name businessType")
    .sort({ "period.start": -1 })
    .lean();
};

// === CURRENT MONTH ===
hubRevenueSchema.statics.getCurrentPeriod = function (hubId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return this.findOne({
    hubId,
    "period.start": startOfMonth,
    "period.end": endOfMonth,
    "period.type": "monthly",
  }).populate("tenantCharges.tenantId", "name businessType contactInfo.email");
};

// === CREATE PERIOD ===
hubRevenueSchema.statics.createMonthlyPeriod = async function (
  hubId,
  year,
  month
) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const existing = await this.findOne({
    hubId,
    "period.start": startDate,
    "period.end": endDate,
  });

  if (existing) return existing;

  return this.create({
    hubId,
    period: { start: startDate, end: endDate, type: "monthly" },
    tenantCharges: [],
    status: "draft",
  });
};

// === SUMMARY AGGREGATION ===
hubRevenueSchema.statics.getRevenueSummary = async function (
  hubId,
  startDate,
  endDate
) {
  const summary = await this.aggregate([
    {
      $match: {
        hubId: mongoose.Types.ObjectId(hubId),
        "period.start": { $gte: startDate, $lte: endDate },
        status: { $in: ["finalized", "invoiced", "reconciled", "closed"] },
      },
    },
    {
      $group: {
        _id: null,
        totalTenantRevenue: { $sum: "$summary.totalTenantRevenueCAD" },
        totalVPPRevenue: { $sum: "$summary.totalVPPRevenueCAD" },
        totalOperatingCosts: { $sum: "$summary.totalOperatingCostsCAD" },
        totalNetRevenue: { $sum: "$summary.netRevenueCAD" },
        periodCount: { $sum: 1 },
        avgProfitMargin: { $avg: "$summary.profitMarginPercent" },
      },
    },
  ]);

  return (
    summary[0] || {
      totalTenantRevenue: 0,
      totalVPPRevenue: 0,
      totalOperatingCosts: 0,
      totalNetRevenue: 0,
      periodCount: 0,
      avgProfitMargin: 0,
    }
  );
};

// === TENANT REVENUE HISTORY ===
hubRevenueSchema.statics.getTenantRevenueHistory = async function (
  tenantId,
  months = 12
) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return this.aggregate([
    {
      $match: {
        "period.start": { $gte: startDate },
        "tenantCharges.tenantId": mongoose.Types.ObjectId(tenantId),
      },
    },
    { $unwind: "$tenantCharges" },
    {
      $match: {
        "tenantCharges.tenantId": mongoose.Types.ObjectId(tenantId),
      },
    },
    {
      $project: {
        periodStart: "$period.start",
        periodEnd: "$period.end",
        totalCAD: "$tenantCharges.totalCAD",
        usageKWh: "$tenantCharges.usage.energyKWh",
        peakDemandKW: "$tenantCharges.usage.peakDemandKW",
        status: "$tenantCharges.status",
      },
    },
    { $sort: { periodStart: 1 } },
  ]);
};

// MODEL EXPORT
const HubRevenue = mongoose.model("HubRevenue", hubRevenueSchema);
export default HubRevenue;
