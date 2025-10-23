import mongoose from "mongoose";

const articleVersionSchema = new mongoose.Schema(
  {
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    title: String,
    excerpt: String,
    content: String,
    heroImage: String,
    category: String,
    tags: [String],
    authorId: String,
    metaDescription: String,
    // Change metadata
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeNote: String,
    changedFields: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes
articleVersionSchema.index({ articleId: 1, versionNumber: -1 });

const ArticleVersion = mongoose.model("ArticleVersion", articleVersionSchema);

export default ArticleVersion;
