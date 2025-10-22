import Subscription from "../models/Subscription.js";

export const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get user's subscription
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: { $in: ["trial", "active"] },
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "No active subscription found",
        code: "NO_SUBSCRIPTION",
      });
    }

    // Attach subscription to request
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify subscription",
    });
  }
};

export const checkFeatureAccess = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.subscription) {
        return res.status(403).json({
          success: false,
          message: "Subscription required",
          code: "NO_SUBSCRIPTION",
        });
      }

      const currentUsage = req.subscription.usage[feature] || 0;
      const canUse = req.subscription.canUseFeature(feature, currentUsage);

      if (!canUse) {
        return res.status(403).json({
          success: false,
          message: `Feature limit reached. Upgrade to access more.`,
          code: "FEATURE_LIMIT_REACHED",
          feature,
          currentUsage,
          planId: req.subscription.planId,
        });
      }

      next();
    } catch (error) {
      console.error("Feature access check error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify feature access",
      });
    }
  };
};

export const requirePlan = (allowedPlans) => {
  return (req, res, next) => {
    if (!req.subscription) {
      return res.status(403).json({
        success: false,
        message: "Subscription required",
        code: "NO_SUBSCRIPTION",
      });
    }

    if (!allowedPlans.includes(req.subscription.planId)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${allowedPlans.join(" or ")} plan`,
        code: "PLAN_UPGRADE_REQUIRED",
        currentPlan: req.subscription.planId,
        requiredPlans: allowedPlans,
      });
    }

    next();
  };
};
