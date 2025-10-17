import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["energy_summary", "energy_data", "esg_report", "custom"],
      required: true,
    },
    format: {
      type: String,
      enum: ["pdf", "csv", "json", "xlsx"],
      required: true,
    },
    dateRange: {
      start: Date,
      end: Date,
    },
    fileSize: Number,
    downloadCount: {
      type: Number,
      default: 0,
    },
    sharedWith: [
      {
        email: String,
        sharedAt: Date,
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
reportSchema.index({ userId: 1, generatedAt: -1 });
reportSchema.index({ userId: 1, reportType: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
