import mongoose from "mongoose";

const performanceMetricSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    powerOutputKW: Number,
    efficiency: Number,
    temperature: Number,
    voltage: Number,
    operatingHours: Number,
  },
  { _id: false }
);

const maintenanceRecordSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["routine", "repair", "upgrade", "inspection", "emergency"],
      required: true,
    },
    description: String,
    performedBy: String,
    cost: Number,
    nextScheduled: Date,
    notes: String,
  },
  { _id: false }
);

const hubDeviceSchema = new mongoose.Schema(
  {
    hubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hub",
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "solar",
        "battery",
        "grid",
        "ev-charger",
        "generator",
        "hvac",
        "lighting",
      ],
      required: true,
    },
    manufacturer: String,
    model: String,
    serialNumber: String,
    capacity: {
      ratedKW: {
        type: Number,
        required: true,
        min: 0,
      },
      usableKW: {
        type: Number,
        required: true,
        min: 0,
      },
      degradationPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    allocation: {
      sharedPercent: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      dedicatedTenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
      },
      priority: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
      },
    },
    status: {
      operational: {
        type: String,
        enum: ["online", "offline", "standby", "maintenance", "fault"],
        default: "online",
      },
      health: {
        type: String,
        enum: ["excellent", "good", "fair", "poor", "critical"],
        default: "good",
      },
      lastOnline: {
        type: Date,
        default: Date.now,
      },
      lastOffline: Date,
    },
    performance: {
      current: performanceMetricSchema,
      peak: performanceMetricSchema,
      average: performanceMetricSchema,
      history: [performanceMetricSchema],
    },
    maintenance: {
      lastMaintenance: Date,
      nextMaintenance: Date,
      maintenanceIntervalDays: {
        type: Number,
        default: 90,
      },
      records: [maintenanceRecordSchema],
      warrantyExpiry: Date,
    },
    vpp: {
      eligible: {
        type: Boolean,
        default: false,
      },
      enrolled: {
        type: Boolean,
        default: false,
      },
      maxContributionKW: Number,
      constraints: {
        minSOC: Number,
        maxSOC: Number,
        maxCyclesPerDay: Number,
      },
    },
    telemetry: {
      reportingIntervalSeconds: {
        type: Number,
        default: 300,
      },
      lastReportedAt: Date,
      dataQuality: {
        type: String,
        enum: ["excellent", "good", "fair", "poor"],
        default: "good",
      },
    },
    location: {
      building: String,
      floor: String,
      room: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    metadata: {
      installDate: Date,
      commissionDate: Date,
      decommissionDate: Date,
      cost: Number,
      supplier: String,
      notes: String,
      tags: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
hubDeviceSchema.index({ hubId: 1, status: 1 });
hubDeviceSchema.index({ deviceId: 1 });
hubDeviceSchema.index({ type: 1 });
hubDeviceSchema.index({ "status.operational": 1 });
hubDeviceSchema.index({ "vpp.enrolled": 1 });

// Virtual for effective capacity
hubDeviceSchema.virtual("effectiveCapacity").get(function () {
  const degradation = 1 - this.capacity.degradationPercent / 100;
  const sharing = this.allocation.sharedPercent / 100;
  return this.capacity.ratedKW * degradation * sharing;
});

// Virtual for availability percentage
hubDeviceSchema.virtual("availabilityPercent").get(function () {
  if (!this.status.lastOffline) return 100;

  const now = Date.now();
  const lastOnline = this.status.lastOnline?.getTime() || now;
  const lastOffline = this.status.lastOffline.getTime();

  const totalTime = now - lastOffline;
  const onlineTime = now - lastOnline;

  return (onlineTime / totalTime) * 100;
});

// Method to update performance metrics
hubDeviceSchema.methods.updatePerformance = function (metrics) {
  this.performance.current = {
    timestamp: new Date(),
    ...metrics,
  };

  // Update peak if current exceeds it
  if (
    !this.performance.peak ||
    metrics.powerOutputKW > (this.performance.peak.powerOutputKW || 0)
  ) {
    this.performance.peak = { ...this.performance.current };
  }

  // Add to history (keep last 100 records)
  if (!this.performance.history) {
    this.performance.history = [];
  }
  this.performance.history.push({ ...this.performance.current });
  if (this.performance.history.length > 100) {
    this.performance.history.shift();
  }

  // Update telemetry
  this.telemetry.lastReportedAt = new Date();

  return this;
};

// Method to calculate average performance
hubDeviceSchema.methods.calculateAveragePerformance = function (hours = 24) {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  const recentHistory = this.performance.history.filter(
    (h) => h.timestamp >= cutoff
  );

  if (recentHistory.length === 0) return null;

  const sum = recentHistory.reduce(
    (acc, h) => ({
      powerOutputKW: acc.powerOutputKW + (h.powerOutputKW || 0),
      efficiency: acc.efficiency + (h.efficiency || 0),
      temperature: acc.temperature + (h.temperature || 0),
    }),
    { powerOutputKW: 0, efficiency: 0, temperature: 0 }
  );

  this.performance.average = {
    timestamp: new Date(),
    powerOutputKW: sum.powerOutputKW / recentHistory.length,
    efficiency: sum.efficiency / recentHistory.length,
    temperature: sum.temperature / recentHistory.length,
  };

  return this.performance.average;
};

// Method to check if maintenance is due
hubDeviceSchema.methods.isMaintenanceDue = function () {
  if (!this.maintenance.nextMaintenance) return false;
  return new Date() >= this.maintenance.nextMaintenance;
};

// Method to schedule maintenance
hubDeviceSchema.methods.scheduleMaintenance = async function (daysFromNow) {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysFromNow);

  this.maintenance.nextMaintenance = nextDate;
  await this.save();

  return this;
};

// Method to record maintenance
hubDeviceSchema.methods.recordMaintenance = async function (maintenanceData) {
  this.maintenance.records.push({
    date: new Date(),
    ...maintenanceData,
  });

  this.maintenance.lastMaintenance = new Date();

  // Schedule next maintenance
  const intervalDays = this.maintenance.maintenanceIntervalDays || 90;
  await this.scheduleMaintenance(intervalDays);

  return this;
};

// Method to assess health
hubDeviceSchema.methods.assessHealth = function () {
  let score = 100;

  // Deduct for degradation
  score -= this.capacity.degradationPercent;

  // Deduct for efficiency
  if (this.performance.average?.efficiency) {
    const efficiencyLoss = 100 - this.performance.average.efficiency;
    score -= efficiencyLoss * 0.5;
  }

  // Deduct for overdue maintenance
  if (this.isMaintenanceDue()) {
    const daysOverdue = Math.floor(
      (Date.now() - this.maintenance.nextMaintenance.getTime()) /
        (24 * 60 * 60 * 1000)
    );
    score -= Math.min(20, daysOverdue * 2);
  }

  // Deduct for offline status
  if (this.status.operational !== "online") {
    score -= 30;
  }

  score = Math.max(0, score);

  // Assign health rating
  if (score >= 90) this.status.health = "excellent";
  else if (score >= 75) this.status.health = "good";
  else if (score >= 60) this.status.health = "fair";
  else if (score >= 40) this.status.health = "poor";
  else this.status.health = "critical";

  return this.status.health;
};

// Static method to get devices by hub
hubDeviceSchema.statics.getByHub = function (hubId, filters = {}) {
  const query = { hubId, ...filters };
  return this.find(query)
    .populate("allocation.dedicatedTenantId", "name")
    .lean();
};

// Static method to get available capacity
hubDeviceSchema.statics.getAvailableCapacity = async function (hubId) {
  const devices = await this.find({
    hubId,
    "status.operational": "online",
  });

  return devices.reduce((sum, device) => {
    return sum + device.effectiveCapacity;
  }, 0);
};

const HubDevice = mongoose.model("HubDevice", hubDeviceSchema);

export default HubDevice;
