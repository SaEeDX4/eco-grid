import mongoose from "mongoose";

const allocationRuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "equal-split",
        "proportional",
        "tiered",
        "priority-based",
        "time-based",
        "custom",
      ],
      required: true,
    },
    parameters: {
      baseAllocationKW: Number,
      proportionKey: String, // e.g., 'squareFootage', 'deviceCount'
      tiers: [
        {
          name: String,
          minKW: Number,
          maxKW: Number,
          costMultiplier: Number,
        },
      ],
      priorities: [
        {
          tier: String,
          allocationPercent: Number,
          guaranteedKW: Number,
        },
      ],
      timeWindows: [
        {
          start: String, // HH:MM format
          end: String,
          allocationMultiplier: Number,
        },
      ],
    },
  },
  { _id: false }
);

const enforcementRuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["soft-cap", "hard-cap", "throttle", "queue", "penalty"],
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    action: {
      type: String,
      enum: ["warn", "restrict", "cutoff", "charge-premium", "schedule"],
      required: true,
    },
    parameters: {
      warningThreshold: Number,
      criticalThreshold: Number,
      gracePeriodMinutes: Number,
      penaltyMultiplier: Number,
      throttlePercent: Number,
      queuePriority: Number,
      notificationEmail: Boolean,
      notificationSMS: Boolean,
    },
  },
  { _id: false }
);

const rebalanceRuleSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    trigger: {
      type: String,
      enum: [
        "manual",
        "scheduled",
        "threshold",
        "demand-spike",
        "tenant-change",
      ],
      default: "threshold",
    },
    conditions: {
      utilizationThreshold: Number,
      tenantCountChange: Number,
      timeOfDay: String,
      dayOfWeek: [Number],
    },
    action: {
      type: String,
      enum: ["redistribute", "scale-down", "notify-only", "defer"],
      default: "redistribute",
    },
    fairnessMetric: {
      type: String,
      enum: ["equal", "proportional", "historical", "contractual"],
      default: "proportional",
    },
  },
  { _id: false }
);

const capacityPolicySchema = new mongoose.Schema(
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
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: [
        "standard",
        "peak-management",
        "cost-optimization",
        "vpp-coordination",
        "custom",
      ],
      required: true,
    },
    allocationRule: allocationRuleSchema,
    enforcementRule: enforcementRuleSchema,
    rebalanceRule: rebalanceRuleSchema,
    overagePolicy: {
      allowed: {
        type: Boolean,
        default: true,
      },
      maxOveragePercent: {
        type: Number,
        default: 20,
        min: 0,
        max: 100,
      },
      maxOverageDurationMinutes: {
        type: Number,
        default: 15,
      },
      overageRateMultiplier: {
        type: Number,
        default: 1.5,
        min: 1,
      },
    },
    priorityOverrides: [
      {
        tenantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tenant",
        },
        priority: {
          type: String,
          enum: ["low", "normal", "high", "critical"],
        },
        guaranteedKW: Number,
        reason: String,
        expiresAt: Date,
      },
    ],
    schedule: {
      enabled: {
        type: Boolean,
        default: false,
      },
      peakHours: [
        {
          start: String,
          end: String,
          daysOfWeek: [Number],
          allocationMultiplier: Number,
        },
      ],
      offPeakHours: [
        {
          start: String,
          end: String,
          daysOfWeek: [Number],
          allocationMultiplier: Number,
        },
      ],
    },
    vppCoordination: {
      enabled: {
        type: Boolean,
        default: false,
      },
      tenantBufferPercent: {
        type: Number,
        default: 20,
        min: 0,
        max: 50,
      },
      vppPriority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
      allowDispatchDuringPeak: {
        type: Boolean,
        default: false,
      },
    },
    performance: {
      tenantsAffected: {
        type: Number,
        default: 0,
      },
      violationsCount: {
        type: Number,
        default: 0,
      },
      rebalanceCount: {
        type: Number,
        default: 0,
      },
      avgCompliancePercent: {
        type: Number,
        default: 100,
      },
      lastEvaluated: Date,
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
    },
    activatedAt: Date,
    deactivatedAt: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
capacityPolicySchema.index({ hubId: 1, status: 1 });
capacityPolicySchema.index({ type: 1 });
capacityPolicySchema.index({ status: 1, activatedAt: -1 });

// Method to evaluate policy for a tenant request
capacityPolicySchema.methods.evaluate = async function (context) {
  const { tenant, requestedKW, currentUsageKW, hub, timeOfDay, isPeak } =
    context;

  const decision = {
    approved: false,
    grantedKW: 0,
    reason: "",
    warnings: [],
    actions: [],
  };

  // 1. Check if tenant has priority override
  const override = this.priorityOverrides.find(
    (o) =>
      o.tenantId.toString() === tenant._id.toString() &&
      (!o.expiresAt || o.expiresAt > new Date())
  );

  if (override && override.priority === "critical") {
    decision.approved = true;
    decision.grantedKW = requestedKW;
    decision.reason = "Critical priority override";
    return decision;
  }

  // 2. Calculate tenant's available capacity
  const baseCapacity = tenant.capacity.baseKW;
  const burstCapacity = tenant.capacity.burstKW;
  const totalAllocated = baseCapacity + burstCapacity;
  const currentAvailable = totalAllocated - currentUsageKW;

  // 3. Check enforcement rules
  const utilizationPercent = (currentUsageKW / totalAllocated) * 100;

  if (utilizationPercent >= this.enforcementRule.threshold) {
    // Tenant at or over threshold
    if (this.enforcementRule.type === "hard-cap") {
      decision.approved = false;
      decision.reason = "Hard capacity limit reached";
      decision.actions.push("notify-tenant");
      return decision;
    }

    if (
      this.enforcementRule.type === "soft-cap" &&
      this.overagePolicy.allowed
    ) {
      // Allow overage with conditions
      const maxOverage =
        totalAllocated * (this.overagePolicy.maxOveragePercent / 100);
      const possibleOverage = currentUsageKW + requestedKW - totalAllocated;

      if (possibleOverage <= maxOverage) {
        decision.approved = true;
        decision.grantedKW = requestedKW;
        decision.reason = "Overage allowed within policy limits";
        decision.warnings.push(
          `Premium rate ${this.overagePolicy.overageRateMultiplier}x applied`
        );
        decision.actions.push("apply-overage-rate");
        return decision;
      } else {
        decision.approved = false;
        decision.reason = "Overage exceeds policy maximum";
        return decision;
      }
    }

    if (this.enforcementRule.type === "throttle") {
      // Throttle the request
      const throttlePercent =
        this.enforcementRule.parameters.throttlePercent || 80;
      const grantedKW = requestedKW * (throttlePercent / 100);

      decision.approved = true;
      decision.grantedKW = grantedKW;
      decision.reason = `Request throttled to ${throttlePercent}%`;
      decision.warnings.push("Capacity limit approaching");
      return decision;
    }
  }

  // 4. Check hub-level availability
  if (!hub.canAllocate(requestedKW)) {
    decision.approved = false;
    decision.reason = "Hub capacity insufficient";
    decision.actions.push("queue-request", "notify-admin");
    return decision;
  }

  // 5. Check time-based rules
  if (this.schedule.enabled && isPeak) {
    const peakRule = this.schedule.peakHours.find((ph) => {
      // Simplified time check (full implementation would parse HH:MM)
      return ph.daysOfWeek.includes(new Date().getDay());
    });

    if (peakRule && peakRule.allocationMultiplier < 1) {
      const adjustedRequest = requestedKW * peakRule.allocationMultiplier;

      decision.approved = true;
      decision.grantedKW = adjustedRequest;
      decision.reason = "Peak hour allocation applied";
      decision.warnings.push(
        `Reduced to ${peakRule.allocationMultiplier * 100}% during peak`
      );
      return decision;
    }
  }

  // 6. Default: approve if within limits
  if (requestedKW <= currentAvailable) {
    decision.approved = true;
    decision.grantedKW = requestedKW;
    decision.reason = "Within allocated capacity";
  } else {
    decision.approved = false;
    decision.reason = "Exceeds tenant allocation";
    decision.grantedKW = currentAvailable;
    decision.warnings.push(`Only ${currentAvailable.toFixed(1)} kW available`);
  }

  return decision;
};

// Method to calculate fair allocation for all tenants
capacityPolicySchema.methods.calculateFairAllocation = async function (
  hub,
  tenants
) {
  const allocations = [];

  switch (this.allocationRule.type) {
    case "equal-split":
      const perTenantKW = hub.capacity.totalKW / tenants.length;
      tenants.forEach((tenant) => {
        allocations.push({
          tenantId: tenant._id,
          allocatedKW: perTenantKW,
          method: "equal-split",
        });
      });
      break;

    case "proportional":
      const proportionKey =
        this.allocationRule.parameters.proportionKey || "squareFootage";
      const totalProportion = tenants.reduce(
        (sum, t) => sum + (t.location?.[proportionKey] || 1),
        0
      );

      tenants.forEach((tenant) => {
        const proportion =
          (tenant.location?.[proportionKey] || 1) / totalProportion;
        allocations.push({
          tenantId: tenant._id,
          allocatedKW: hub.capacity.totalKW * proportion,
          method: "proportional",
          basis: proportionKey,
        });
      });
      break;

    case "priority-based":
      const priorities = this.allocationRule.parameters.priorities || [];
      const totalPercent = priorities.reduce(
        (sum, p) => sum + p.allocationPercent,
        0
      );

      tenants.forEach((tenant) => {
        const priorityRule = priorities.find(
          (p) => p.tier === tenant.priorityTier
        );
        const percent = priorityRule
          ? priorityRule.allocationPercent
          : 100 / tenants.length;

        allocations.push({
          tenantId: tenant._id,
          allocatedKW: hub.capacity.totalKW * (percent / 100),
          method: "priority-based",
          tier: tenant.priorityTier,
        });
      });
      break;

    case "tiered":
      // Implement tiered allocation based on usage patterns
      tenants.forEach((tenant) => {
        const tier = this.allocationRule.parameters.tiers?.find(
          (t) =>
            tenant.usage.month?.avgKW >= t.minKW &&
            tenant.usage.month?.avgKW <= t.maxKW
        );

        const allocatedKW = tier
          ? tier.maxKW
          : this.allocationRule.parameters.baseAllocationKW || 10;

        allocations.push({
          tenantId: tenant._id,
          allocatedKW,
          method: "tiered",
          tierName: tier?.name,
        });
      });
      break;

    default:
      // Fallback to equal split
      const fallbackKW = hub.capacity.totalKW / tenants.length;
      tenants.forEach((tenant) => {
        allocations.push({
          tenantId: tenant._id,
          allocatedKW: fallbackKW,
          method: "default",
        });
      });
  }

  return allocations;
};

// Method to check if rebalance is needed
capacityPolicySchema.methods.shouldRebalance = function (hub, trigger) {
  if (!this.rebalanceRule.enabled) return false;

  // Check trigger type
  if (
    this.rebalanceRule.trigger !== "manual" &&
    this.rebalanceRule.trigger !== trigger
  ) {
    return false;
  }

  // Check utilization threshold
  if (trigger === "threshold") {
    const utilizationThreshold =
      this.rebalanceRule.conditions.utilizationThreshold || 85;
    if (hub.capacity.utilizationPercent < utilizationThreshold) {
      return false;
    }
  }

  return true;
};

// Static method to get active policy for hub
capacityPolicySchema.statics.getActivePolicy = function (hubId) {
  return this.findOne({
    hubId,
    status: "active",
  }).lean();
};

// Static method to create from template
capacityPolicySchema.statics.createFromTemplate = async function (
  hubId,
  templateName,
  createdBy
) {
  const templates = {
    "equal-share": {
      name: "Equal Share Policy",
      type: "standard",
      allocationRule: {
        type: "equal-split",
        parameters: {},
      },
      enforcementRule: {
        type: "soft-cap",
        threshold: 90,
        action: "warn",
        parameters: {
          warningThreshold: 85,
          gracePeriodMinutes: 15,
        },
      },
    },
    "priority-tiered": {
      name: "Priority Tiered Policy",
      type: "peak-management",
      allocationRule: {
        type: "priority-based",
        parameters: {
          priorities: [
            { tier: "critical", allocationPercent: 40, guaranteedKW: 0 },
            { tier: "priority", allocationPercent: 35, guaranteedKW: 0 },
            { tier: "standard", allocationPercent: 25, guaranteedKW: 0 },
          ],
        },
      },
      enforcementRule: {
        type: "throttle",
        threshold: 95,
        action: "restrict",
        parameters: {
          throttlePercent: 80,
        },
      },
    },
  };

  const template = templates[templateName];
  if (!template) {
    throw new Error("Template not found");
  }

  return this.create({
    hubId,
    ...template,
    createdBy,
    status: "draft",
  });
};

const CapacityPolicy = mongoose.model("CapacityPolicy", capacityPolicySchema);

export default CapacityPolicy;
