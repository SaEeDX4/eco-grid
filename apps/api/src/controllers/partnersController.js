import PartnerInquiry from "../models/PartnerInquiry.js";
import AuditLog from "../models/AuditLog.js";

export const submitInquiry = async (req, res) => {
  try {
    const {
      organizationName,
      contactName,
      email,
      phone,
      partnershipModel,
      organizationType,
      message,
    } = req.body;

    // Validation
    if (!organizationName || !contactName || !email) {
      return res.status(400).json({
        success: false,
        message: "Organization name, contact name, and email are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check for duplicate recent inquiry (within 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentInquiry = await PartnerInquiry.findOne({
      email,
      createdAt: { $gte: oneDayAgo },
    });

    if (recentInquiry) {
      return res.status(429).json({
        success: false,
        message:
          "You have already submitted an inquiry recently. We will be in touch soon.",
      });
    }

    // Create inquiry
    const inquiry = await PartnerInquiry.create({
      organizationName,
      contactName,
      email,
      phone,
      partnershipModel,
      organizationType,
      message,
      source: "website",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // Log the inquiry
    await AuditLog.create({
      userId: null,
      action: "partner_inquiry",
      entity: "PartnerInquiry",
      entityId: inquiry._id,
      details: {
        organizationName,
        email,
        partnershipModel,
        organizationType,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // In production, send email notification to sales team
    // await sendEmailNotification(inquiry)

    res.status(201).json({
      success: true,
      message:
        "Thank you for your inquiry! Our partnerships team will contact you within 24 hours.",
      inquiryId: inquiry._id,
    });
  } catch (error) {
    console.error("Submit inquiry error:", error);
    res.status(500).json({
      success: false,
      message:
        "Failed to submit inquiry. Please try again or email us directly at partnerships@ecogrid.ca",
    });
  }
};

export const getInquiries = async (req, res) => {
  try {
    // Only accessible to admin users
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { status, organizationType, limit = 50, skip = 0 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (organizationType) query.organizationType = organizationType;

    const inquiries = await PartnerInquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await PartnerInquiry.countDocuments(query);

    res.json({
      success: true,
      inquiries: inquiries.map((i) => ({
        id: i._id,
        organizationName: i.organizationName,
        contactName: i.contactName,
        email: i.email,
        phone: i.phone,
        partnershipModel: i.partnershipModel,
        organizationType: i.organizationType,
        status: i.status,
        createdAt: i.createdAt,
      })),
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    // Only accessible to admin users
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;
    const { status, note } = req.body;

    const inquiry = await PartnerInquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Update status
    inquiry.status = status;

    // Add note if provided
    if (note) {
      inquiry.notes.push({
        author: req.user.id,
        content: note,
      });
    }

    await inquiry.save();

    // Log the update
    await AuditLog.create({
      userId: req.user.id,
      action: "inquiry_status_update",
      entity: "PartnerInquiry",
      entityId: inquiry._id,
      details: {
        oldStatus: inquiry.status,
        newStatus: status,
        hasNote: !!note,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Inquiry status updated successfully",
    });
  } catch (error) {
    console.error("Update inquiry status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update inquiry status",
    });
  }
};

export const getPartnershipStats = async (req, res) => {
  try {
    // Only accessible to admin users
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [
      totalInquiries,
      newInquiries,
      qualifiedInquiries,
      convertedInquiries,
      byType,
      byModel,
    ] = await Promise.all([
      PartnerInquiry.countDocuments(),
      PartnerInquiry.countDocuments({ status: "new" }),
      PartnerInquiry.countDocuments({ status: "qualified" }),
      PartnerInquiry.countDocuments({ status: "converted" }),
      PartnerInquiry.aggregate([
        { $group: { _id: "$organizationType", count: { $sum: 1 } } },
      ]),
      PartnerInquiry.aggregate([
        { $group: { _id: "$partnershipModel", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        total: totalInquiries,
        new: newInquiries,
        qualified: qualifiedInquiries,
        converted: convertedInquiries,
        byOrganizationType: byType,
        byPartnershipModel: byModel,
      },
    });
  } catch (error) {
    console.error("Get partnership stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partnership stats",
    });
  }
};
