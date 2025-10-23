import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
      required: true,
      maxlength: 500,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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
      enum: ["small", "medium", "large"],
    },
    videoUrl: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    metrics: {
      costSavings: String,
      carbonReduction: String,
      roi: String,
      energySaved: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
testimonialSchema.index({ status: 1, featured: -1, order: 1 });
testimonialSchema.index({ industry: 1, status: 1 });
testimonialSchema.index({ rating: -1, status: 1 });

// Static method to get published testimonials
testimonialSchema.statics.findPublished = function (filters = {}) {
  return this.find({ ...filters, status: "published" }).sort({
    featured: -1,
    order: 1,
    createdAt: -1,
  });
};

// Instance method to increment views
testimonialSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
