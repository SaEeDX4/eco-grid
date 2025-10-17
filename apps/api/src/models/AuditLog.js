import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ optional for anonymous chat users
    },
    action: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "register",
        "password_reset",
        "profile_update",
        "device_control",
        "settings_change",
        "consent_update",
        "sso_login_stub", // ✅ added (for Google/Microsoft SSO stubs)
        "contact_submit", // ✅ added (for contact form submissions)
        "chat_message", // ✅ added (for normal chatbot interactions)
        "chat_escalation", // ✅ added (for AI escalation events)
      ],
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed, // ✅ FIXED: supports string session IDs & ObjectIds
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
    },
  },
  {
    timestamps: true,
  },
);

// ✅ Indexes for efficient querying
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
