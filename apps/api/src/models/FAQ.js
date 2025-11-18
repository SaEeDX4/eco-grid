import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    answer: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "getting-started",
        "billing",
        "technical",
        "devices",
        "vpp",
        "privacy",
        "security",
        "api",
        "general",
      ],
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    language: {
      type: String,
      default: "en",
      enum: ["en", "fr", "fa"],
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    relatedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FAQ",
      },
    ],
    videoUrl: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
faqSchema.index({ category: 1, status: 1, order: 1 });
faqSchema.index({ status: 1, views: -1 });
faqSchema.index({ language: 1, category: 1 });
faqSchema.index({ tags: 1 });

// Text search index
faqSchema.index(
  {
    question: "text",
    answer: "text",
    tags: "text",
  },
  {
    weights: {
      question: 10,
      tags: 5,
      answer: 1,
    },
  }
);

// Virtual for helpfulness score
faqSchema.virtual("helpfulnessScore").get(function () {
  const total = this.helpful + this.notHelpful;
  if (total === 0) return 0;
  return ((this.helpful / total) * 100).toFixed(1);
});

// Static method to get popular FAQs
faqSchema.statics.getPopular = function (limit = 5, language = "en") {
  return this.find({
    status: "published",
    language,
  })
    .sort({ views: -1 })
    .limit(limit)
    .lean();
};

// Static method to search FAQs
faqSchema.statics.search = function (query, language = "en") {
  return this.find(
    {
      $text: { $search: query },
      status: "published",
      language,
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean();
};

// Instance method to increment views
faqSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

// Instance method to record feedback
faqSchema.methods.recordFeedback = async function (isHelpful) {
  if (isHelpful) {
    this.helpful += 1;
  } else {
    this.notHelpful += 1;
  }
  await this.save();
};

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;
