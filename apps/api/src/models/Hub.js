import mongoose from "mongoose";

const hubDeviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: false, // 🔥 allow missing deviceId for seed
    },
    type: {
      type: String,
      enum: ["solar", "battery", "grid", "ev-charger", "generator"],
      required: true,
    },
    capacityKW: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "online",
        "offline",
        "maintenance",
        "degraded",
        "standby", // 🔥 ADDED so seed works
      ],
      default: "online",
    },
    sharedPercent: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    lastMaintenance: Date,
    nextMaintenance: Date,
  },
  { _id: false }
);

const hubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "commercial",
        "industrial",
        "residential",
        "mixed-use",
        "institutional",
      ],
      required: true,
    },
    location: {
      address: String,
      city: String,
      province: String,
      postalCode: String,
      country: {
        type: String,
        default: "Canada",
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    capacity: {
      totalKW: {
        type: Number,
        required: true,
        min: 0,
      },
      allocatedKW: {
        type: Number,
        default: 0,
        min: 0,
      },
      availableKW: {
        type: Number,
        default: 0,
        min: 0,
      },
      reservedKW: {
        type: Number,
        default: 0,
        min: 0,
      },
      peakKW: {
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
    devices: [hubDeviceSchema],
    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
      },
    ],
    activePolicyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CapacityPolicy",
    },
    billing: {
      model: {
        type: String,
        enum: [
          "equal-split",
          "proportional",
          "tiered",
          "dynamic",
          "usage-based", // 🔥 ADDED so seed works
        ],
        default: "proportional",
      },
      baseFeeCAD: {
        type: Number,
        default: 0,
      },
      ratePerKWhCAD: {
        type: Number,
        default: 0.15,
      },
      demandChargePerKWCAD: {
        type: Number,
        default: 10,
      },
    },
    vpp: {
      enabled: {
        type: Boolean,
        default: false,
      },
      poolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VPPPool",
      },
      maxContributionKW: {
        type: Number,
        default: 0,
      },
      revenueSharePercent: {
        type: Number,
        default: 20,
        min: 0,
        max: 100,
      },
      tenantOptIn: {
        type: Boolean,
        default: false,
      },
    },
    performance: {
      uptimePercent: {
        type: Number,
        default: 100,
      },
      avgUtilization: {
        type: Number,
        default: 0,
      },
      peakDemandKW: {
        type: Number,
        default: 0,
      },
      totalEnergyKWh: {
        type: Number,
        default: 0,
      },
      revenue30d: {
        type: Number,
        default: 0,
      },
    },
    alerts: {
      capacityThreshold: {
        type: Number,
        default: 90,
      },
      alertEmail: String,
      alertSMS: String,
      enableAlerts: {
        type: Boolean,
        default: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "offline", "decommissioned"],
      default: "active",
    },
    settings: {
      allowTenantOverage: {
        type: Boolean,
        default: true,
      },
      overageRateMultiplier: {
        type: Number,
        default: 1.5,
      },
      autoRebalance: {
        type: Boolean,
        default: true,
      },
      maintenanceWindow: {
        start: String,
        end: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
hubSchema.index({ organizationId: 1 });
hubSchema.index({ status: 1 });
hubSchema.index({ "location.city": 1 });
hubSchema.index({ type: 1 });
hubSchema.index({ "capacity.utilizationPercent": 1 });

// Virtual for tenant count
hubSchema.virtual("tenantCount").get(function () {
  return this.tenants.length;
});

// Virtual for capacity utilization
hubSchema.virtual("capacityUtilization").get(function () {
  if (this.capacity.totalKW === 0) return 0;
  return (this.capacity.allocatedKW / this.capacity.totalKW) * 100;
});

// Method to update available capacity
hubSchema.methods.updateAvailableCapacity = function () {
  this.capacity.availableKW =
    this.capacity.totalKW -
    this.capacity.allocatedKW -
    this.capacity.reservedKW;
  this.capacity.availableKW = Math.max(0, this.capacity.availableKW);
  return this.capacity.availableKW;
};

// Method to check if can allocate capacity
hubSchema.methods.canAllocate = function (requestedKW) {
  this.updateAvailableCapacity();
  return this.capacity.availableKW >= requestedKW;
};

// Method to allocate capacity to tenant
hubSchema.methods.allocateCapacity = async function (tenantId, capacityKW) {
  if (!this.canAllocate(capacityKW)) {
    throw new Error("Insufficient hub capacity available");
  }

  // Add tenant if not already present
  if (!this.tenants.includes(tenantId)) {
    this.tenants.push(tenantId);
  }

  this.capacity.allocatedKW += capacityKW;
  this.updateAvailableCapacity();

  await this.save();
  return this;
};

// Method to deallocate capacity
hubSchema.methods.deallocateCapacity = async function (tenantId, capacityKW) {
  this.capacity.allocatedKW -= capacityKW;
  this.capacity.allocatedKW = Math.max(0, this.capacity.allocatedKW);

  // Remove tenant from hub
  this.tenants = this.tenants.filter(
    (t) => t.toString() !== tenantId.toString()
  );

  this.updateAvailableCapacity();
  await this.save();
  return this;
};

// Method to calculate total device capacity
hubSchema.methods.calculateDeviceCapacity = function () {
  return this.devices.reduce((sum, device) => {
    if (device.status === "online") {
      return sum + device.capacityKW * (device.sharedPercent / 100);
    }
    return sum;
  }, 0);
};

// Method to get VPP available capacity
hubSchema.methods.getVPPAvailableCapacity = function () {
  if (!this.vpp.enabled) return 0;

  // VPP can use unreserved capacity
  const tenantBuffer = this.capacity.allocatedKW * 0.2; // 20% buffer for tenants
  const vppCapacity =
    this.capacity.totalKW - this.capacity.allocatedKW - tenantBuffer;

  return Math.min(Math.max(0, vppCapacity), this.vpp.maxContributionKW);
};

// Static method to get hubs by organization
hubSchema.statics.getByOrganization = function (organizationId) {
  return this.find({ organizationId, status: { $ne: "decommissioned" } })
    .populate("tenants")
    .populate("activePolicyId")
    .lean();
};

// Static method to get hub with full details
hubSchema.statics.getFullDetails = function (hubId) {
  return this.findById(hubId)
    .populate({
      path: "tenants",
      populate: { path: "devices" },
    })
    .populate("activePolicyId")
    .populate("vpp.poolId")
    .lean();
};

const Hub = mongoose.model("Hub", hubSchema);

export default Hub;
