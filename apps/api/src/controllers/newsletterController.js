import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../services/newsletterService.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Check if already subscribed
    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "active") {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed",
        });
      } else if (subscriber.status === "pending") {
        // Resend verification email
        await sendVerificationEmail(subscriber);
        return res.json({
          success: true,
          message: "Verification email resent. Please check your inbox.",
        });
      } else if (subscriber.status === "unsubscribed") {
        // Reactivate subscription
        subscriber.status = "pending";
        subscriber.verificationToken = require("crypto")
          .randomBytes(32)
          .toString("hex");
        subscriber.unsubscribedAt = undefined;
        await subscriber.save();
        await sendVerificationEmail(subscriber);
        return res.json({
          success: true,
          message: "Please verify your email to reactivate your subscription",
        });
      }
    }

    // Create new subscriber
    subscriber = await NewsletterSubscriber.create({
      email,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Send verification email
    await sendVerificationEmail(subscriber);

    res.status(201).json({
      success: true,
      message: "Subscription initiated. Please check your email to verify.",
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process subscription",
    });
  }
};

export const verify = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const subscriber = await NewsletterSubscriber.findOne({
      verificationToken: token,
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (subscriber.status === "active") {
      return res.json({
        success: true,
        message: "Email already verified",
      });
    }

    // Verify subscriber
    await subscriber.verify();

    // Send welcome email
    await sendWelcomeEmail(subscriber);

    res.json({
      success: true,
      message: "Email verified successfully! Welcome to our newsletter.",
    });
  } catch (error) {
    console.error("Newsletter verify error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Unsubscribe token is required",
      });
    }

    const subscriber = await NewsletterSubscriber.findOne({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Invalid unsubscribe token",
      });
    }

    if (subscriber.status === "unsubscribed") {
      return res.json({
        success: true,
        message: "Already unsubscribed",
      });
    }

    // Unsubscribe
    await subscriber.unsubscribe();

    res.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe",
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { token } = req.params;
    const { categories, frequency } = req.body;

    const subscriber = await NewsletterSubscriber.findOne({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    if (categories) subscriber.categories = categories;
    if (frequency) subscriber.frequency = frequency;

    await subscriber.save();

    res.json({
      success: true,
      message: "Preferences updated successfully",
      subscriber: {
        email: subscriber.email,
        categories: subscriber.categories,
        frequency: subscriber.frequency,
      },
    });
  } catch (error) {
    console.error("Update newsletter preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update preferences",
    });
  }
};

export const getStats = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [
      totalSubscribers,
      activeSubscribers,
      pendingSubscribers,
      unsubscribedCount,
      recentSubscribers,
    ] = await Promise.all([
      NewsletterSubscriber.countDocuments(),
      NewsletterSubscriber.countDocuments({ status: "active" }),
      NewsletterSubscriber.countDocuments({ status: "pending" }),
      NewsletterSubscriber.countDocuments({ status: "unsubscribed" }),
      NewsletterSubscriber.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("email createdAt"),
    ]);

    // Calculate engagement rates
    const engagementData = await NewsletterSubscriber.aggregate([
      { $match: { status: "active", emailsSent: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalSent: { $sum: "$emailsSent" },
          totalOpened: { $sum: "$emailsOpened" },
          totalClicked: { $sum: "$linksClicked" },
        },
      },
    ]);

    const engagement = engagementData[0] || {
      totalSent: 0,
      totalOpened: 0,
      totalClicked: 0,
    };
    const openRate =
      engagement.totalSent > 0
        ? ((engagement.totalOpened / engagement.totalSent) * 100).toFixed(2)
        : 0;
    const clickRate =
      engagement.totalSent > 0
        ? ((engagement.totalClicked / engagement.totalSent) * 100).toFixed(2)
        : 0;

    res.json({
      success: true,
      stats: {
        total: totalSubscribers,
        active: activeSubscribers,
        pending: pendingSubscribers,
        unsubscribed: unsubscribedCount,
        openRate,
        clickRate,
        recentSubscribers,
      },
    });
  } catch (error) {
    console.error("Get newsletter stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
