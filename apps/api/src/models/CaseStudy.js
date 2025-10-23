import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
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
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
      enum: [
        "residential",
        "commercial",
        "industrial",
        "government",
        "education",
      ],
    },
    companySize: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
      maxlength: 300,
    },
    challenge: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    results: {
      type: String,
      required: true,
    },
    heroImage: {
      type: String,
    },
    metrics: {
      costSavings: String,
      carbonReduction: String,
      roi: String,
      energySaved: String,
    },
    quote: {
      text: String,
      author: String,
      role: String,
      avatar: String,
    },
    technologies: [String],
    featured: {
      type: Boolean,
      default: false,
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
    pdfUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
caseStudySchema.index({ slug: 1 });
caseStudySchema.index({ status: 1, featured: -1, publishedAt: -1 });
caseStudySchema.index({ industry: 1, status: 1 });

// Generate slug from title
caseStudySchema.pre("validate", function (next) {
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
caseStudySchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Calculate reading time
caseStudySchema.pre("save", function (next) {
  const totalContent = `${this.challenge} ${this.solution} ${this.results}`;
  const words = totalContent.trim().split(/\s+/).length;
  this.readingTime = Math.ceil(words / 200);
  next();
});

// Static method to find published
caseStudySchema.statics.findPublished = function (filters = {}) {
  return this.find({ ...filters, status: "published" }).sort({
    featured: -1,
    publishedAt: -1,
  });
};

// Instance method to increment views
caseStudySchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);

export default CaseStudy;
