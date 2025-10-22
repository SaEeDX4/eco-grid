import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: String,
      required: true,
      enum: ["free", "household", "sme", "enterprise"],
    },
    status: {
      type: String,
      enum: ["trial", "active", "canceled", "expired", "suspended"],
      default: "trial",
    },
    billingPeriod: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    trialEndDate: Date,
    nextBillingDate: Date,
    canceledAt: Date,
    cancellationReason: String,
    usage: {
      devicesConnected: {
        type: Number,
        default: 0,
      },
      usersActive: {
        type: Number,
        default: 1,
      },
      sitesManaged: {
        type: Number,
        default: 1,
      },
      apiCallsThisMonth: {
        type: Number,
        default: 0,
      },
    },
    billing: {
      lastPaymentDate: Date,
      lastPaymentAmount: Number,
      paymentMethod: String,
      nextPaymentAmount: Number,
    },
    metadata: {
      upgradedFrom: String,
      upgradedAt: Date,
      couponCode: String,
      referralSource: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ planId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });

// Check if subscription is active
subscriptionSchema.methods.isActive = function () {
  return ["trial", "active"].includes(this.status);
};

// Check if trial is active
subscriptionSchema.methods.isTrialActive = function () {
  if (this.status !== "trial") return false;
  if (!this.trialEndDate) return false;
  return new Date() < this.trialEndDate;
};

// Check if feature is allowed
subscriptionSchema.methods.canUseFeature = function (feature, currentUsage) {
  // Get plan limits (in production, fetch from Plan model)
  const planLimits = {
    free: { maxDevices: 5, maxUsers: 1, maxSites: 1, apiCallsPerMonth: 0 },
    household: {
      maxDevices: 999,
      maxUsers: 5,
      maxSites: 1,
      apiCallsPerMonth: 1000,
    },
    sme: {
      maxDevices: 9999,
      maxUsers: 50,
      maxSites: 10,
      apiCallsPerMonth: 50000,
    },
    enterprise: {
      maxDevices: 999999,
      maxUsers: 9999,
      maxSites: 9999,
      apiCallsPerMonth: 999999999,
    },
  };

  const limits = planLimits[this.planId];
  if (!limits) return false;

  return currentUsage < limits[feature];
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
