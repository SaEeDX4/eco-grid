import mongoose from "mongoose";

const aiGenerationLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["outline", "article", "content-edit"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    // Input
    prompt: {
      type: String,
    },
    outline: {
      type: mongoose.Schema.Types.Mixed,
    },
    options: {
      category: String,
      targetAudience: String,
      tone: String,
    },
    // Output
    generatedContent: {
      type: mongoose.Schema.Types.Mixed,
    },
    // Metadata
    model: {
      type: String,
      default: "claude-sonnet-4-20250514",
    },
    tokensUsed: {
      input: Number,
      output: Number,
      total: Number,
    },
    generationTime: {
      type: Number, // milliseconds
    },
    success: {
      type: Boolean,
      default: true,
    },
    error: String,
    // Safety & Quality
    contentValidation: {
      passed: Boolean,
      issues: [String],
    },
    editorialReview: {
      reviewed: Boolean,
      reviewedBy: mongoose.Schema.Types.ObjectId,
      reviewedAt: Date,
      approved: Boolean,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
aiGenerationLogSchema.index({ userId: 1, createdAt: -1 });
aiGenerationLogSchema.index({ articleId: 1 });
aiGenerationLogSchema.index({ type: 1, success: 1 });

const AIGenerationLog = mongoose.model(
  "AIGenerationLog",
  aiGenerationLogSchema
);

export default AIGenerationLog;
