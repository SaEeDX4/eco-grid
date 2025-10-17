import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    company: String,
    phone: String,
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "resolved", "spam"],
      default: "new",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    meta: {
      ipAddress: String,
      userAgent: String,
      referrer: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ referenceId: 1 });

// Generate reference ID
contactMessageSchema.pre("save", function (next) {
  if (!this.referenceId) {
    this.referenceId = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
