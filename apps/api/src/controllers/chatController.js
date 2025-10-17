import { createOrUpdateSession } from "../services/chatService.js";
import { sanitizeInput, redactPII } from "../services/antiSpamService.js";
import AuditLog from "../models/AuditLog.js";

export const escalateToAI = async (req, res) => {
  try {
    const { sessionId, message, history } = req.body;

    // 🔍 Validation
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: "Session ID and message are required",
      });
    }

    // 🧹 Sanitize input
    const sanitizedMessage = sanitizeInput(message);

    if (sanitizedMessage.length < 1 || sanitizedMessage.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message must be between 1 and 500 characters",
      });
    }

    // 🪄 Create or update chat session (user message)
    await createOrUpdateSession(
      sessionId,
      req.user?.id || null,
      sanitizedMessage,
      "user",
      null,
      true,
    );

    // 🤖 Generate stub AI response (replace with Claude API in production)
    const response = generateStubAIResponse(sanitizedMessage);

    // 🪄 Save AI response
    await createOrUpdateSession(
      sessionId,
      req.user?.id || null,
      response,
      "assistant",
      "ai_escalation",
      true,
    );

    // 🧾 Safe audit log — userId optional, chat_escalation now allowed
    try {
      await AuditLog.create({
        userId: req.user?.id || null,
        action: "chat_escalation",
        entity: "ChatSession",
        entityId: sessionId ? sessionId : undefined,
        details: {
          sessionId,
          messageLength: sanitizedMessage.length,
          preview: sanitizedMessage.slice(0, 50),
        },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        status: "success",
      });
    } catch (logError) {
      console.warn("⚠️ AuditLog write skipped:", logError.message);
    }

    // ✅ Respond to frontend
    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Chat escalation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process your message. Please try again.",
    });
  }
};

// 🧠 Stub AI response generator
const generateStubAIResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // 💬 Common topics
  if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    return "I'd be happy to discuss pricing with you! Our plans start at $10-20 CAD/month for households and $100-500 CAD/month for small businesses. Enterprise pricing is customized based on your needs. Would you like me to connect you with our sales team for a detailed quote?";
  }

  if (lowerMessage.includes("demo") || lowerMessage.includes("try")) {
    return "Absolutely! We offer a pilot program where you can try Eco-Grid free for 3-6 months. This includes full platform access, dedicated support, and no long-term commitment. Would you like me to send you information about joining our pilot program?";
  }

  if (lowerMessage.includes("save") || lowerMessage.includes("savings")) {
    return "Great question! Our customers typically see 20-40% reduction in energy costs, with peak demand reductions of up to 35%. The exact savings depend on your usage patterns, devices, and energy rates. I can connect you with our team to get a personalized savings estimate.";
  }

  if (lowerMessage.includes("device") || lowerMessage.includes("compatible")) {
    return "We support a wide variety of devices including EV chargers (Tesla, ChargePoint), thermostats (Nest, Ecobee), solar systems (Enphase, SolarEdge), batteries (Tesla Powerwall), and smart plugs. We also support industrial protocols like OCPP, Modbus, and BACnet. What specific devices are you looking to connect?";
  }

  // 📩 Default response
  return "Thank you for your question! While I can help with many topics, this specific inquiry would be best addressed by our team. I'd recommend:\n\n1. Submitting a message through our contact form for a detailed response within 24 hours\n2. Emailing us directly at support@ecogrid.ca\n3. Calling us at +1 (604) 123-4567 during business hours (Mon–Fri, 9 AM – 5 PM PT)\n\nIs there anything else I can help you with today?";
};

// 📊 Admin stats (unchanged)
export const getChatStats = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const stats = await getSessionStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get chat stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
