import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    heroImage: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "clean-energy",
        "ai-optimization",
        "policy-regulation",
        "case-studies",
        "technology",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    authorId: {
      type: String,
      required: true,
      default: "team",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    // SEO
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    metaKeywords: [String],
    // AI Generation metadata
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiGenerationLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIGenerationLog",
    },
    // Version control
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArticleVersion",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
articleSchema.index({ slug: 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ title: "text", excerpt: "text", content: "text" });

// Generate slug from title
articleSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

// Set publishedAt on first publish
articleSchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Calculate reading time
articleSchema.pre("save", function (next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const words = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(words / wordsPerMinute);
  }
  next();
});

// Static method to find published articles
articleSchema.statics.findPublished = function (filters = {}) {
  return this.find({ ...filters, status: "published" }).sort({
    publishedAt: -1,
  });
};

// Static method to search articles
articleSchema.statics.search = function (query, filters = {}) {
  return this.find(
    {
      ...filters,
      status: "published",
      $text: { $search: query },
    },
    {
      score: { $meta: "textScore" },
    }
  ).sort({ score: { $meta: "textScore" } });
};

// Instance method to increment views
articleSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

const Article = mongoose.model("Article", articleSchema);

export default Article;
