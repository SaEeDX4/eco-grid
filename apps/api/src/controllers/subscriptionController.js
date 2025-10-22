import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import AuditLog from "../models/AuditLog.js";

export const getMySubscription = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      // Create free plan subscription if none exists
      const freeSubscription = await Subscription.create({
        userId: req.user.id,
        planId: "free",
        status: "active",
        billingPeriod: "monthly",
        startDate: new Date(),
      });

      return res.json({
        success: true,
        subscription: freeSubscription,
      });
    }

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription",
    });
  }
};

export const startTrial = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { planId } = req.body;

    // Validation
    if (!["household", "sme"].includes(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan for trial",
      });
    }

    // Check if user already has a subscription
    const existingSubscription = await Subscription.findOne({
      userId: req.user.id,
    });

    if (existingSubscription && existingSubscription.status === "trial") {
      return res.status(400).json({
        success: false,
        message: "You already have an active trial",
      });
    }

    if (existingSubscription && existingSubscription.trialEndDate) {
      return res.status(400).json({
        success: false,
        message: "Trial already used",
      });
    }

    // Calculate trial end date (14 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.now() + 14);

    let subscription;

    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.planId = planId;
      existingSubscription.status = "trial";
      existingSubscription.trialEndDate = trialEndDate;
      existingSubscription.metadata.upgradedFrom = existingSubscription.planId;
      existingSubscription.metadata.upgradedAt = new Date();
      await existingSubscription.save();
      subscription = existingSubscription;
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        userId: req.user.id,
        planId,
        status: "trial",
        trialEndDate,
        billingPeriod: "monthly",
        startDate: new Date(),
      });
    }

    // Audit log
    await AuditLog.create({
      userId: req.user.id,
      action: "trial_started",
      entity: "Subscription",
      entityId: subscription._id,
      details: {
        planId,
        trialEndDate,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Trial started successfully",
      subscription,
    });
  } catch (error) {
    console.error("Start trial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start trial",
    });
  }
};

export const upgradePlan = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { planId, billingPeriod = "monthly" } = req.body;

    // Validation
    if (!["free", "household", "sme", "enterprise"].includes(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }

    if (!["monthly", "annual"].includes(billingPeriod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing period",
      });
    }

    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    // Check if downgrade
    const planHierarchy = { free: 0, household: 1, sme: 2, enterprise: 3 };
    const isDowngrade =
      planHierarchy[planId] < planHierarchy[subscription.planId];

    // Store old plan
    const oldPlanId = subscription.planId;

    // Update subscription
    subscription.planId = planId;
    subscription.billingPeriod = billingPeriod;
    subscription.status = planId === "free" ? "active" : "active";
    subscription.metadata.upgradedFrom = oldPlanId;
    subscription.metadata.upgradedAt = new Date();

    if (planId !== "free") {
      // Calculate next billing date (30 days for monthly, 365 for annual)
      const nextBillingDate = new Date();
      nextBillingDate.setDate(
        nextBillingDate.getDate() + (billingPeriod === "annual" ? 365 : 30)
      );
      subscription.nextBillingDate = nextBillingDate;
    }

    await subscription.save();

    // Audit log
    await AuditLog.create({
      userId: req.user.id,
      action: isDowngrade ? "plan_downgraded" : "plan_upgraded",
      entity: "Subscription",
      entityId: subscription._id,
      details: {
        oldPlanId,
        newPlanId: planId,
        billingPeriod,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: `Successfully ${isDowngrade ? "downgraded" : "upgraded"} to ${planId} plan`,
      subscription,
    });
  } catch (error) {
    console.error("Upgrade plan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upgrade plan",
    });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { reason } = req.body;

    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    if (subscription.status === "canceled") {
      return res.status(400).json({
        success: false,
        message: "Subscription already canceled",
      });
    }

    // Update subscription
    subscription.status = "canceled";
    subscription.canceledAt = new Date();
    subscription.cancellationReason = reason || "No reason provided";
    await subscription.save();

    // Audit log
    await AuditLog.create({
      userId: req.user.id,
      action: "subscription_canceled",
      entity: "Subscription",
      entityId: subscription._id,
      details: {
        planId: subscription.planId,
        reason: subscription.cancellationReason,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Subscription canceled successfully",
      subscription,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
    });
  }
};

export const checkFeatureLimit = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { feature } = req.params;

    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    const currentUsage = subscription.usage[feature] || 0;
    const canUse = subscription.canUseFeature(feature, currentUsage);

    res.json({
      success: true,
      canUse,
      currentUsage,
      planId: subscription.planId,
      feature,
    });
  } catch (error) {
    console.error("Check feature limit error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check feature limit",
    });
  }
};

export const updateUsage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { feature, increment = 1 } = req.body;

    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    // Update usage
    if (!subscription.usage[feature]) {
      subscription.usage[feature] = 0;
    }
    subscription.usage[feature] += increment;

    await subscription.save();

    res.json({
      success: true,
      usage: subscription.usage,
    });
  } catch (error) {
    console.error("Update usage error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update usage",
    });
  }
};
