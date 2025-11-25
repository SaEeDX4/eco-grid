import mongoose from "mongoose";

const tenantDeviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    name: String,
    type: String,
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { _id: false }
);

const usageMetricsSchema = new mongoose.Schema(
  {
    currentKW: {
      type: Number,
      default: 0,
      min: 0,
    },
    peakKW: {
      type: Number,
      default: 0,
    },
    avgKW: {
      type: Number,
      default: 0,
    },
    totalKWh: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const tenantSchema = new mongoose.Schema(
  {
    hubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hub",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    businessType: {
      type: String,
      enum: [
        "retail",
        "office",
        "restaurant",
        "residential",
        "warehouse",
        "manufacturing",
        "service",
        "other",
      ],
      required: true,
    },
    contactInfo: {
      primaryContact: String,
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    location: {
      unit: String,
      floor: String,
      building: String,
      squareFootage: Number,
    },
    capacity: {
      baseKW: {
        type: Number,
        required: true,
        min: 0,
      },
      burstKW: {
        type: Number,
        default: 0,
        min: 0,
      },
      allocatedKW: {
        type: Number,
        required: true,
        min: 0,
      },
      guaranteedKW: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    usage: {
      current: usageMetricsSchema,
      today: usageMetricsSchema,
      month: usageMetricsSchema,
      lastBillingCycle: usageMetricsSchema,
    },
    priorityTier: {
      type: String,
      enum: ["standard", "priority", "critical"],
      default: "standard",
    },
    contract: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: Date,
      renewalDate: Date,
      status: {
        type: String,
        enum: ["active", "pending", "expired", "terminated"],
        default: "active",
      },
      terms: String,
    },
    billing: {
      planType: {
        type: String,
        enum: ["fixed", "usage-based", "tiered", "dynamic"],
        default: "usage-based",
      },
      rateCAD: {
        base: Number,
        perKWh: Number,
        demandCharge: Number,
      },
      billingCycle: {
        type: String,
        enum: ["monthly", "quarterly", "annual"],
        default: "monthly",
      },
      nextBillingDate: Date,
      currentBalanceCAD: {
        type: Number,
        default: 0,
      },
      paymentStatus: {
        type: String,
        enum: ["current", "overdue", "suspended"],
        default: "current",
      },
    },
    devices: [tenantDeviceSchema],
    compliance: {
      violations: {
        type: Number,
        default: 0,
      },
      lastViolation: Date,
      warningLevel: {
        type: String,
        enum: ["none", "low", "medium", "high", "critical"],
        default: "none",
      },
      notes: [String],
    },
    performance: {
      avgUtilization: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      peakDemandKW: {
        type: Number,
        default: 0,
      },
      loadFactor: {
        type: Number,
        default: 0,
      },
      reliabilityScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
    },
    preferences: {
      allowVPPParticipation: {
        type: Boolean,
        default: false,
      },
      allowDemandResponse: {
        type: Boolean,
        default: true,
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      autoPayEnabled: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "inactive", "terminated"],
      default: "active",
    },
    settings: {
      softCapEnabled: {
        type: Boolean,
        default: true,
      },
      burstAllowanceMinutes: {
        type: Number,
        default: 15,
      },
      alertThresholdPercent: {
        type: Number,
        default: 85,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
tenantSchema.index({ hubId: 1, status: 1 });
tenantSchema.index({ "contactInfo.email": 1 });
tenantSchema.index({ "contactInfo.userId": 1 });
tenantSchema.index({ priorityTier: 1 });
tenantSchema.index({ "capacity.allocatedKW": -1 });
tenantSchema.index({ "usage.current.currentKW": -1 });
tenantSchema.index({ "contract.status": 1 });

// Virtual for total allocated capacity
tenantSchema.virtual("totalCapacity").get(function () {
  return this.capacity.baseKW + this.capacity.burstKW;
});

// Virtual for available capacity
tenantSchema.virtual("availableCapacity").get(function () {
  const total = this.capacity.baseKW + this.capacity.burstKW;
  const current = this.usage.current?.currentKW || 0;
  return Math.max(0, total - current);
});

// Virtual for utilization percentage
tenantSchema.virtual("utilizationPercent").get(function () {
  if (this.capacity.allocatedKW === 0) return 0;
  const current = this.usage.current?.currentKW || 0;
  return (current / this.capacity.allocatedKW) * 100;
});

// Virtual for is over capacity
tenantSchema.virtual("isOverCapacity").get(function () {
  const current = this.usage.current?.currentKW || 0;
  const allocated = this.capacity.allocatedKW;
  return current > allocated;
});

// Method to update current usage
tenantSchema.methods.updateCurrentUsage = function (usageKW) {
  if (!this.usage.current) {
    this.usage.current = {};
  }

  this.usage.current.currentKW = usageKW;
  this.usage.current.lastUpdated = new Date();

  // Update peak if necessary
  if (usageKW > (this.usage.current.peakKW || 0)) {
    this.usage.current.peakKW = usageKW;
  }

  // Update performance metrics
  if (usageKW > this.performance.peakDemandKW) {
    this.performance.peakDemandKW = usageKW;
  }

  return this;
};

// Method to check if can request capacity
tenantSchema.methods.canRequest = function (requestedKW) {
  const current = this.usage.current?.currentKW || 0;
  const allocated = this.capacity.allocatedKW;
  const totalRequest = current + requestedKW;

  // Check base allocation
  if (totalRequest <= this.capacity.baseKW) {
    return { allowed: true, reason: "within-base" };
  }

  // Check with burst
  const totalCapacity = this.capacity.baseKW + this.capacity.burstKW;
  if (totalRequest <= totalCapacity) {
    return { allowed: true, reason: "within-burst", usingBurst: true };
  }

  return {
    allowed: false,
    reason: "exceeds-allocation",
    shortfall: totalRequest - totalCapacity,
  };
};

// Method to add violation
tenantSchema.methods.addViolation = async function (violationType, details) {
  this.compliance.violations += 1;
  this.compliance.lastViolation = new Date();

  const note = `[${new Date().toISOString()}] ${violationType}: ${details}`;
  this.compliance.notes.push(note);

  // Update warning level based on violation count
  if (this.compliance.violations >= 10) {
    this.compliance.warningLevel = "critical";
  } else if (this.compliance.violations >= 5) {
    this.compliance.warningLevel = "high";
  } else if (this.compliance.violations >= 3) {
    this.compliance.warningLevel = "medium";
  } else {
    this.compliance.warningLevel = "low";
  }

  await this.save();
  return this;
};

// Method to reset violations
tenantSchema.methods.resetViolations = async function () {
  this.compliance.violations = 0;
  this.compliance.warningLevel = "none";
  this.compliance.notes = [];
  await this.save();
  return this;
};

// Method to calculate utilization
tenantSchema.methods.calculateUtilization = function (periodKWh, periodHours) {
  if (this.capacity.allocatedKW === 0 || periodHours === 0) return 0;

  const avgKW = periodKWh / periodHours;
  return (avgKW / this.capacity.allocatedKW) * 100;
};

// Method to add device
tenantSchema.methods.addDevice = async function (
  deviceId,
  deviceName,
  deviceType
) {
  const exists = this.devices.some(
    (d) => d.deviceId.toString() === deviceId.toString()
  );

  if (!exists) {
    this.devices.push({
      deviceId,
      name: deviceName,
      type: deviceType,
      registeredAt: new Date(),
      status: "active",
    });
    await this.save();
  }

  return this;
};

// Method to remove device
tenantSchema.methods.removeDevice = async function (deviceId) {
  this.devices = this.devices.filter(
    (d) => d.deviceId.toString() !== deviceId.toString()
  );
  await this.save();
  return this;
};

// Static method to get tenants by hub
tenantSchema.statics.getByHub = function (hubId, filters = {}) {
  const query = { hubId, ...filters };
  return this.find(query)
    .populate("contactInfo.userId", "email name")
    .sort({ "capacity.allocatedKW": -1 })
    .lean();
};

// Static method to get tenant with full details
tenantSchema.statics.getFullDetails = function (tenantId) {
  return this.findById(tenantId)
    .populate("hubId")
    .populate("contactInfo.userId")
    .populate("devices.deviceId")
    .lean();
};

// Static method to get tenants over capacity
tenantSchema.statics.getOverCapacity = function (hubId) {
  return this.aggregate([
    { $match: { hubId: mongoose.Types.ObjectId(hubId), status: "active" } },
    {
      $addFields: {
        isOver: { $gt: ["$usage.current.currentKW", "$capacity.allocatedKW"] },
      },
    },
    { $match: { isOver: true } },
    { $sort: { "usage.current.currentKW": -1 } },
  ]);
};

// Static method to get tenant usage summary
tenantSchema.statics.getUsageSummary = async function (
  hubId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        hubId: mongoose.Types.ObjectId(hubId),
        status: "active",
        createdAt: { $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalAllocated: { $sum: "$capacity.allocatedKW" },
        totalCurrent: { $sum: "$usage.current.currentKW" },
        avgUtilization: { $avg: "$performance.avgUtilization" },
        tenantCount: { $sum: 1 },
      },
    },
  ]);
};

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
