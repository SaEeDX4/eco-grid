import mongoose from "mongoose";
import crypto from "crypto";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "unsubscribed"],
      default: "pending",
    },
    verificationToken: {
      type: String,
    },
    unsubscribeToken: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    unsubscribedAt: {
      type: Date,
    },
    // Preferences
    categories: [
      {
        type: String,
      },
    ],
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "weekly",
    },
    // Analytics
    emailsSent: {
      type: Number,
      default: 0,
    },
    emailsOpened: {
      type: Number,
      default: 0,
    },
    linksClicked: {
      type: Number,
      default: 0,
    },
    lastEmailSentAt: {
      type: Date,
    },
    // PIPEDA compliance
    consentGiven: {
      type: Boolean,
      default: true,
    },
    consentDate: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
newsletterSubscriberSchema.index({ email: 1 });
newsletterSubscriberSchema.index({ status: 1 });
newsletterSubscriberSchema.index({ verificationToken: 1 });
newsletterSubscriberSchema.index({ unsubscribeToken: 1 });

// Generate tokens before save
newsletterSubscriberSchema.pre("save", function (next) {
  if (this.isNew) {
    this.verificationToken = crypto.randomBytes(32).toString("hex");
    this.unsubscribeToken = crypto.randomBytes(32).toString("hex");
  }
  next();
});

// Static method to find active subscribers
newsletterSubscriberSchema.statics.findActive = function () {
  return this.find({ status: "active" });
};

// Instance method to verify
newsletterSubscriberSchema.methods.verify = async function () {
  this.status = "active";
  this.verifiedAt = new Date();
  this.verificationToken = undefined;
  await this.save();
};

// Instance method to unsubscribe
newsletterSubscriberSchema.methods.unsubscribe = async function () {
  this.status = "unsubscribed";
  this.unsubscribedAt = new Date();
  await this.save();
};

const NewsletterSubscriber = mongoose.model(
  "NewsletterSubscriber",
  newsletterSubscriberSchema
);

export default NewsletterSubscriber;
