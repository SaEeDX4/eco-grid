import mongoose from "mongoose";

const deviceVppStatusSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vppEnabled: {
      type: Boolean,
      default: false,
    },
    enrolledPools: [
      {
        poolId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "VPPPool",
        },
        enrolledAt: Date,
        contributionKW: Number,
        status: {
          type: String,
          enum: ["active", "paused", "removed"],
          default: "active",
        },
      },
    ],
    availability: {
      schedule: {
        monday: [{ start: String, end: String }],
        tuesday: [{ start: String, end: String }],
        wednesday: [{ start: String, end: String }],
        thursday: [{ start: String, end: String }],
        friday: [{ start: String, end: String }],
        saturday: [{ start: String, end: String }],
        sunday: [{ start: String, end: String }],
      },
      blackoutDates: [
        {
          start: Date,
          end: Date,
          reason: String,
        },
      ],
      currentStatus: {
        type: String,
        enum: ["available", "dispatched", "offline", "unavailable"],
        default: "available",
      },
    },
    constraints: {
      minSOC: {
        type: Number,
        default: 20,
        min: 0,
        max: 100,
      },
      maxSOC: {
        type: Number,
        default: 90,
        min: 0,
        max: 100,
      },
      maxDepthOfDischarge: {
        type: Number,
        default: 70,
        min: 0,
        max: 100,
      },
      maxCyclesPerDay: {
        type: Number,
        default: 2,
        min: 0,
        max: 10,
      },
      maxCyclesPerMonth: {
        type: Number,
        default: 60,
        min: 0,
        max: 300,
      },
      temperatureLimits: {
        min: Number,
        max: Number,
      },
    },
    performance: {
      dispatches30d: {
        type: Number,
        default: 0,
      },
      dispatches90d: {
        type: Number,
        default: 0,
      },
      dispatchesAllTime: {
        type: Number,
        default: 0,
      },
      revenue30d: {
        type: Number,
        default: 0,
      },
      revenue90d: {
        type: Number,
        default: 0,
      },
      revenueAllTime: {
        type: Number,
        default: 0,
      },
      reliability: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      avgResponseTimeSeconds: Number,
    },
    batteryHealth: {
      cyclesUsed: {
        type: Number,
        default: 0,
      },
      estimatedDegradation: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      warrantyCompliant: {
        type: Boolean,
        default: true,
      },
      lastHealthCheck: Date,
    },
    preferences: {
      autoAcceptDispatches: {
        type: Boolean,
        default: false,
      },
      notifyBeforeDispatch: {
        type: Boolean,
        default: true,
      },
      minNoticeMinutes: {
        type: Number,
        default: 30,
      },
      allowOverride: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
deviceVppStatusSchema.index({ userId: 1, vppEnabled: 1 });
deviceVppStatusSchema.index({ deviceId: 1 });
deviceVppStatusSchema.index({ "enrolledPools.poolId": 1 });

// Static method to get user VPP devices
deviceVppStatusSchema.statics.getUserVPPDevices = function (userId) {
  return this.find({ userId, vppEnabled: true })
    .populate("deviceId")
    .populate("enrolledPools.poolId", "name region")
    .lean();
};

// Method to enroll in pool
deviceVppStatusSchema.methods.enrollInPool = async function (
  poolId,
  contributionKW
) {
  // Check if already enrolled
  const existing = this.enrolledPools.find(
    (p) => p.poolId.toString() === poolId.toString() && p.status === "active"
  );

  if (existing) {
    throw new Error("Device is already enrolled in this pool");
  }

  this.enrolledPools.push({
    poolId,
    enrolledAt: new Date(),
    contributionKW,
    status: "active",
  });

  this.vppEnabled = true;
  await this.save();
  return this;
};

// Method to unenroll from pool
deviceVppStatusSchema.methods.unenrollFromPool = async function (poolId) {
  const enrollment = this.enrolledPools.find(
    (p) => p.poolId.toString() === poolId.toString() && p.status === "active"
  );

  if (!enrollment) {
    throw new Error("Device is not enrolled in this pool");
  }

  enrollment.status = "removed";

  // If no active pools, disable VPP
  const hasActivePools = this.enrolledPools.some((p) => p.status === "active");
  if (!hasActivePools) {
    this.vppEnabled = false;
  }

  await this.save();
  return this;
};

// Method to check if available for dispatch
deviceVppStatusSchema.methods.isAvailableForDispatch = function (
  startTime,
  endTime
) {
  // Check VPP enabled
  if (!this.vppEnabled) return false;

  // Check current status
  if (this.availability.currentStatus !== "available") return false;

  // Check blackout dates
  for (const blackout of this.availability.blackoutDates) {
    if (startTime >= blackout.start && endTime <= blackout.end) {
      return false;
    }
  }

  // Check daily cycle limit (would need to query dispatches)
  // This is a simplified check
  if (this.performance.dispatches30d / 30 > this.constraints.maxCyclesPerDay) {
    return false;
  }

  return true;
};

const DeviceVPPStatus = mongoose.model(
  "DeviceVPPStatus",
  deviceVppStatusSchema
);

export default DeviceVPPStatus;
