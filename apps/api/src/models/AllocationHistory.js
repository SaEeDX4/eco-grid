import mongoose from "mongoose";

const allocationHistorySchema = new mongoose.Schema(
  {
    hubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hub",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "allocation-granted",
        "allocation-denied",
        "allocation-adjusted",
        "overage-allowed",
        "overage-denied",
        "throttled",
        "rebalanced",
        "violation",
        "manual-override",
        "policy-applied",
        "emergency-cutoff",
      ],
      required: true,
    },
    request: {
      requestedKW: {
        type: Number,
        required: true,
      },
      deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
      deviceType: String,
      purpose: String,
    },
    decision: {
      approved: {
        type: Boolean,
        required: true,
      },
      grantedKW: {
        type: Number,
        default: 0,
      },
      deniedKW: {
        type: Number,
        default: 0,
      },
      reason: {
        type: String,
        required: true,
      },
      method: String,
    },
    context: {
      tenantCurrentUsageKW: Number,
      tenantAllocatedKW: Number,
      tenantUtilizationPercent: Number,
      hubAvailableKW: Number,
      hubUtilizationPercent: Number,
      timeOfDay: String,
      isPeakPeriod: Boolean,
      dayOfWeek: Number,
    },
    policy: {
      policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CapacityPolicy",
      },
      policyName: String,
      policyType: String,
      ruleApplied: String,
    },
    financial: {
      rateAppliedCAD: Number,
      isOverageRate: Boolean,
      rateMultiplier: Number,
      estimatedCostCAD: Number,
    },
    compliance: {
      isViolation: {
        type: Boolean,
        default: false,
      },
      violationType: String,
      severityLevel: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
      },
      actionTaken: String,
    },
    performance: {
      responseTimeMs: Number,
      evaluationTimeMs: Number,
      successful: {
        type: Boolean,
        default: true,
      },
    },
    metadata: {
      triggeredBy: {
        type: String,
        enum: ["device", "tenant", "admin", "system", "policy", "vpp"],
      },
      triggeredById: mongoose.Schema.Types.ObjectId,
      source: String,
      notes: String,
      tags: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
allocationHistorySchema.index({ hubId: 1, createdAt: -1 });
allocationHistorySchema.index({ tenantId: 1, createdAt: -1 });
allocationHistorySchema.index({ eventType: 1, createdAt: -1 });
allocationHistorySchema.index({ "decision.approved": 1, createdAt: -1 });
allocationHistorySchema.index({ "compliance.isViolation": 1, createdAt: -1 });
allocationHistorySchema.index({ "policy.policyId": 1, createdAt: -1 });
allocationHistorySchema.index({ createdAt: -1 });

// Compound index for common queries
allocationHistorySchema.index({
  hubId: 1,
  tenantId: 1,
  createdAt: -1,
});

// Static method to record allocation
allocationHistorySchema.statics.recordAllocation = async function (data) {
  const startTime = Date.now();

  const record = await this.create({
    hubId: data.hubId,
    tenantId: data.tenantId,
    eventType: data.eventType || "allocation-granted",
    request: data.request,
    decision: data.decision,
    context: data.context,
    policy: data.policy,
    financial: data.financial,
    compliance: data.compliance,
    metadata: data.metadata,
    performance: {
      responseTimeMs: Date.now() - startTime,
      evaluationTimeMs: data.evaluationTimeMs,
      successful: true,
    },
  });

  return record;
};

// Static method to get tenant history
allocationHistorySchema.statics.getTenantHistory = function (
  tenantId,
  options = {}
) {
  const { startDate, endDate, eventTypes, limit = 100, skip = 0 } = options;

  const query = { tenantId };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  if (eventTypes && eventTypes.length > 0) {
    query.eventType = { $in: eventTypes };
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("policy.policyId", "name type")
    .lean();
};

// Static method to get hub history
allocationHistorySchema.statics.getHubHistory = function (hubId, options = {}) {
  const { startDate, endDate, eventTypes, limit = 100, skip = 0 } = options;

  const query = { hubId };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  if (eventTypes && eventTypes.length > 0) {
    query.eventType = { $in: eventTypes };
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("tenantId", "name businessType")
    .populate("policy.policyId", "name type")
    .lean();
};

// Static method to get violations
allocationHistorySchema.statics.getViolations = function (
  hubId,
  tenantId = null,
  options = {}
) {
  const { startDate, endDate, severityLevels, limit = 50 } = options;

  const query = {
    hubId,
    "compliance.isViolation": true,
  };

  if (tenantId) {
    query.tenantId = tenantId;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }

  if (severityLevels && severityLevels.length > 0) {
    query["compliance.severityLevel"] = { $in: severityLevels };
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("tenantId", "name businessType contactInfo.email")
    .lean();
};

// Static method to aggregate statistics
allocationHistorySchema.statics.getStatistics = async function (
  hubId,
  startDate,
  endDate
) {
  const stats = await this.aggregate([
    {
      $match: {
        hubId: mongoose.Types.ObjectId(hubId),
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        approvedRequests: {
          $sum: { $cond: ["$decision.approved", 1, 0] },
        },
        deniedRequests: {
          $sum: { $cond: ["$decision.approved", 0, 1] },
        },
        totalRequestedKW: { $sum: "$request.requestedKW" },
        totalGrantedKW: { $sum: "$decision.grantedKW" },
        totalViolations: {
          $sum: { $cond: ["$compliance.isViolation", 1, 0] },
        },
        avgResponseTimeMs: { $avg: "$performance.responseTimeMs" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalRequests: 0,
      approvedRequests: 0,
      deniedRequests: 0,
      totalRequestedKW: 0,
      totalGrantedKW: 0,
      totalViolations: 0,
      avgResponseTimeMs: 0,
    }
  );
};

// Static method to get usage patterns
allocationHistorySchema.statics.getUsagePatterns = async function (
  tenantId,
  days = 7
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const patterns = await this.aggregate([
    {
      $match: {
        tenantId: mongoose.Types.ObjectId(tenantId),
        createdAt: { $gte: startDate },
        "decision.approved": true,
      },
    },
    {
      $group: {
        _id: {
          hour: { $hour: "$createdAt" },
          dayOfWeek: { $dayOfWeek: "$createdAt" },
        },
        avgGrantedKW: { $avg: "$decision.grantedKW" },
        maxGrantedKW: { $max: "$decision.grantedKW" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.dayOfWeek": 1, "_id.hour": 1 },
    },
  ]);

  return patterns;
};

// Static method to detect anomalies
allocationHistorySchema.statics.detectAnomalies = async function (
  tenantId,
  threshold = 2
) {
  const recentHistory = await this.find({
    tenantId,
    "decision.approved": true,
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  })
    .select("decision.grantedKW createdAt")
    .lean();

  if (recentHistory.length < 10) {
    return {
      anomalies: [],
      message: "Insufficient data for anomaly detection",
    };
  }

  // Calculate mean and standard deviation
  const values = recentHistory.map((h) => h.decision.grantedKW);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  // Identify anomalies (values beyond threshold * stdDev from mean)
  const anomalies = recentHistory.filter((h) => {
    const zScore = Math.abs((h.decision.grantedKW - mean) / stdDev);
    return zScore > threshold;
  });

  return {
    anomalies,
    statistics: {
      mean,
      stdDev,
      threshold,
      totalRecords: recentHistory.length,
      anomalyCount: anomalies.length,
    },
  };
};

// Static method to get peak usage times
allocationHistorySchema.statics.getPeakUsageTimes = async function (
  hubId,
  days = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const peaks = await this.aggregate([
    {
      $match: {
        hubId: mongoose.Types.ObjectId(hubId),
        createdAt: { $gte: startDate },
        "decision.approved": true,
      },
    },
    {
      $group: {
        _id: {
          hour: { $hour: "$createdAt" },
          dayOfWeek: { $dayOfWeek: "$createdAt" },
        },
        totalGrantedKW: { $sum: "$decision.grantedKW" },
        avgGrantedKW: { $avg: "$decision.grantedKW" },
        requestCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalGrantedKW: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  return peaks;
};

const AllocationHistory = mongoose.model(
  "AllocationHistory",
  allocationHistorySchema
);

export default AllocationHistory;
