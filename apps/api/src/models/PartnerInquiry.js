import mongoose from "mongoose";

const partnerInquirySchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    partnershipModel: {
      type: String,
      enum: [
        "Pilot Program",
        "White-Label Solution",
        "Custom Integration",
        "Not Sure",
        "",
      ],
      default: "",
    },
    organizationType: {
      type: String,
      enum: [
        "utility",
        "incubator",
        "enterprise",
        "municipality",
        "developer",
        "other",
        "",
      ],
      default: "",
    },
    message: String,
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "in_discussion",
        "qualified",
        "converted",
        "declined",
      ],
      default: "new",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    source: {
      type: String,
      default: "website",
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  },
);

// Indexes
partnerInquirySchema.index({ email: 1 });
partnerInquirySchema.index({ status: 1 });
partnerInquirySchema.index({ createdAt: -1 });
partnerInquirySchema.index({ organizationType: 1 });

const PartnerInquiry = mongoose.model("PartnerInquiry", partnerInquirySchema);

export default PartnerInquiry;
