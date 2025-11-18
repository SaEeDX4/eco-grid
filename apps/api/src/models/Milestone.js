import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 2026,
      max: 2050,
    },
    quarter: {
      type: String,
      required: true,
      enum: ["Q1", "Q2", "Q3", "Q4"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      enum: ["product", "vpp", "hardware", "policy", "global"],
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "planned", "delayed", "cancelled"],
      default: "planned",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    impact: {
      type: Map,
      of: String,
    },
    challenges: [
      {
        type: String,
        maxlength: 500,
      },
    ],
    dependencies: [
      {
        type: String,
      },
    ],
    icon: {
      type: String,
      default: "Circle",
    },
    stakeholderQuote: {
      text: String,
      author: String,
      role: String,
    },
    completedDate: Date,
    order: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
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
milestoneSchema.index({ year: 1, quarter: 1, order: 1 });
milestoneSchema.index({ category: 1, status: 1 });
milestoneSchema.index({ status: 1, year: 1 });
milestoneSchema.index({ featured: 1 });

// Static method to get milestones by year
milestoneSchema.statics.getByYear = function (year) {
  return this.find({ year }).sort({ quarter: 1, order: 1 }).lean();
};

// Static method to get roadmap overview
milestoneSchema.statics.getOverview = async function () {
  const milestones = await this.find().lean();

  const byYear = {};
  milestones.forEach((milestone) => {
    if (!byYear[milestone.year]) {
      byYear[milestone.year] = [];
    }
    byYear[milestone.year].push(milestone);
  });

  return Object.entries(byYear)
    .map(([year, items]) => ({
      year: parseInt(year),
      milestones: items.sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.year - b.year);
};

// Instance method to update progress
milestoneSchema.methods.updateProgress = async function (progress) {
  this.progress = Math.min(Math.max(progress, 0), 100);

  if (progress >= 100 && this.status !== "completed") {
    this.status = "completed";
    this.completedDate = new Date();
  }

  await this.save();
};

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;
