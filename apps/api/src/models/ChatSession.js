import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        intentMatched: String,
        escalated: {
          type: Boolean,
          default: false,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "resolved", "escalated", "abandoned"],
      default: "active",
    },
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    meta: {
      ipAddress: String,
      userAgent: String,
      referrer: String,
      startedAt: {
        type: Date,
        default: Date.now,
      },
      lastActivityAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ userId: 1 });
chatSessionSchema.index({ status: 1 });
chatSessionSchema.index({ "meta.startedAt": -1 });

// Update last activity timestamp on message addition
chatSessionSchema.pre("save", function (next) {
  if (this.isModified("messages")) {
    this.meta.lastActivityAt = new Date();
  }
  next();
});

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);

export default ChatSession;
