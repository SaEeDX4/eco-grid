import ContactMessage from "../models/ContactMessage.js";
import AuditLog from "../models/AuditLog.js";
import {
  sanitizeInput,
  containsProfanity,
  detectSpamPatterns,
} from "../services/antiSpamService.js";

export const submitContactForm = async (req, res) => {
  try {
    const { fullName, email, company, phone, subject, message, captchaAnswer } =
      req.body;

    // Validation
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
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

    // Length validation
    if (fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters",
      });
    }

    if (subject.length < 5 || subject.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Subject must be between 5 and 200 characters",
      });
    }

    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message must be between 10 and 2000 characters",
      });
    }

    // CAPTCHA validation (simple - must be provided)
    if (!captchaAnswer) {
      return res.status(400).json({
        success: false,
        message: "Please answer the security question",
      });
    }

    // Profanity check
    if (containsProfanity(message) || containsProfanity(subject)) {
      return res.status(400).json({
        success: false,
        message: "Please use appropriate language",
      });
    }

    // Spam detection
    const spamCheck = detectSpamPatterns(message);
    if (spamCheck.isSpam) {
      // Log as potential spam but don't tell user
      await AuditLog.create({
        userId: null,
        action: "contact_spam_detected",
        entity: "ContactMessage",
        details: {
          email,
          indicators: spamCheck.indicators,
        },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      return res.status(400).json({
        success: false,
        message:
          "Your message could not be sent. Please try again or contact us directly.",
      });
    }

    // Check for duplicate recent submission (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 3600000);
    const recentMessage = await ContactMessage.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: oneHourAgo },
    });

    if (recentMessage) {
      return res.status(429).json({
        success: false,
        message:
          "You have already sent a message recently. We will respond to your previous inquiry soon.",
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      fullName: sanitizeInput(fullName),
      email: email.toLowerCase().trim(),
      company: company ? sanitizeInput(company) : undefined,
      phone: phone ? sanitizeInput(phone) : undefined,
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    // Create contact message
    const contactMessage = await ContactMessage.create({
      ...sanitizedData,
      status: "new",
      meta: {
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        referrer: req.get("referer"),
      },
    });

    // Log the submission
    await AuditLog.create({
      userId: null,
      action: "contact_form_submitted",
      entity: "ContactMessage",
      entityId: contactMessage._id,
      details: {
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        referenceId: contactMessage.referenceId,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    // In production, send email notification to support team
    // await sendEmailNotification(contactMessage)

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We will respond within 24 hours.",
      referenceId: contactMessage.referenceId,
    });
  } catch (error) {
    console.error("Submit contact form error:", error);
    res.status(500).json({
      success: false,
      message:
        "Failed to send message. Please try again or email us directly at support@ecogrid.ca",
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { status, limit = 50, skip = 0 } = req.query;

    const query = {};
    if (status) query.status = status;

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select("-meta");

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      messages,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get contact messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.status = status;
    await message.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "contact_status_update",
      entity: "ContactMessage",
      entityId: message._id,
      details: {
        newStatus: status,
        referenceId: message.referenceId,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Update message status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};
