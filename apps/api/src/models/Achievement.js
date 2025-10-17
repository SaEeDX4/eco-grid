import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    achievementId: {
      type: String,
      required: true,
    },
    title: String,
    description: String,
    category: {
      type: String,
      enum: ["energy", "savings", "environmental", "social", "streak"],
    },
    unlocked: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0,
    },
    maxProgress: {
      type: Number,
      required: true,
    },
    unlockedAt: Date,
    notified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
achievementSchema.index({ userId: 1, unlocked: 1 });

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
