import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.get("/subscriptions/me");
      if (response.data.success) {
        setSubscription(response.data.subscription);
      }
    } catch (err) {
      console.error("Fetch subscription error:", err);
      setError("Failed to load subscription");
    } finally {
      setLoading(false);
    }
  };

  const startTrial = async (planId) => {
    try {
      const response = await api.post("/subscriptions/trial", { planId });
      if (response.data.success) {
        setSubscription(response.data.subscription);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error("Start trial error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to start trial",
      };
    }
  };

  const upgradePlan = async (planId, billingPeriod = "monthly") => {
    try {
      const response = await api.put("/subscriptions/upgrade", {
        planId,
        billingPeriod,
      });
      if (response.data.success) {
        setSubscription(response.data.subscription);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error("Upgrade plan error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to upgrade plan",
      };
    }
  };

  const cancelSubscription = async (reason) => {
    try {
      const response = await api.post("/subscriptions/cancel", { reason });
      if (response.data.success) {
        setSubscription(response.data.subscription);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error("Cancel subscription error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to cancel subscription",
      };
    }
  };

  const checkFeatureLimit = async (feature) => {
    try {
      const response = await api.get(`/subscriptions/feature/${feature}`);
      if (response.data.success) {
        return response.data;
      }
      return { canUse: false };
    } catch (err) {
      console.error("Check feature limit error:", err);
      return { canUse: false };
    }
  };

  const isPlanActive = () => {
    return subscription && ["trial", "active"].includes(subscription.status);
  };

  const isFeatureAvailable = (feature) => {
    if (!subscription) return false;

    const planFeatures = {
      free: ["devices:5", "basicReports", "communitySupport"],
      household: [
        "devices:unlimited",
        "aiOptimization",
        "advancedReports",
        "emailSupport",
        "vpp",
        "p2p",
      ],
      sme: [
        "devices:unlimited",
        "aiOptimization",
        "advancedReports",
        "prioritySupport",
        "api",
        "multiSite",
        "vpp",
        "p2p",
      ],
      enterprise: ["all"],
    };

    const features = planFeatures[subscription.planId] || [];
    return features.includes("all") || features.includes(feature);
  };

  return {
    subscription,
    loading,
    error,
    startTrial,
    upgradePlan,
    cancelSubscription,
    checkFeatureLimit,
    isPlanActive,
    isFeatureAvailable,
    refetch: fetchSubscription,
  };
};
