import ChatSession from "../models/ChatSession.js";
import { redactPII } from "./antiSpamService.js";

export const createOrUpdateSession = async (
  sessionId,
  userId,
  message,
  role,
  intentMatched = null,
  escalated = false,
) => {
  try {
    let session = await ChatSession.findOne({ sessionId });

    const messageObj = {
      role,
      content: message,
      intentMatched,
      escalated,
      timestamp: new Date(),
    };

    if (session) {
      // Update existing session
      session.messages.push(messageObj);
      session.meta.lastActivityAt = new Date();
      await session.save();
    } else {
      // Create new session
      session = await ChatSession.create({
        sessionId,
        userId: userId || null,
        messages: [messageObj],
        status: "active",
        meta: {
          startedAt: new Date(),
          lastActivityAt: new Date(),
        },
      });
    }

    return session;
  } catch (error) {
    console.error("Chat service error:", error);
    throw error;
  }
};

export const getSessionHistory = async (sessionId) => {
  try {
    const session = await ChatSession.findOne({ sessionId });
    return session ? session.messages : [];
  } catch (error) {
    console.error("Get session history error:", error);
    return [];
  }
};

export const closeSession = async (sessionId, status = "resolved") => {
  try {
    const session = await ChatSession.findOne({ sessionId });
    if (session) {
      session.status = status;
      await session.save();
    }
  } catch (error) {
    console.error("Close session error:", error);
  }
};

export const getSessionStats = async () => {
  try {
    const [
      totalSessions,
      activeSessions,
      escalatedSessions,
      avgMessagesPerSession,
    ] = await Promise.all([
      ChatSession.countDocuments(),
      ChatSession.countDocuments({ status: "active" }),
      ChatSession.countDocuments({ status: "escalated" }),
      ChatSession.aggregate([
        { $project: { messageCount: { $size: "$messages" } } },
        { $group: { _id: null, avg: { $avg: "$messageCount" } } },
      ]),
    ]);

    return {
      total: totalSessions,
      active: activeSessions,
      escalated: escalatedSessions,
      avgMessages: avgMessagesPerSession[0]?.avg || 0,
    };
  } catch (error) {
    console.error("Get session stats error:", error);
    return null;
  }
};

export const logChatMessage = async (
  sessionId,
  userId,
  userMessage,
  botResponse,
  intentMatched = null,
) => {
  try {
    // Redact PII before logging
    const redactedUserMessage = redactPII(userMessage);
    const redactedBotResponse = redactPII(botResponse);

    // Save user message
    await createOrUpdateSession(
      sessionId,
      userId,
      redactedUserMessage,
      "user",
      intentMatched,
      false,
    );

    // Save bot response
    await createOrUpdateSession(
      sessionId,
      userId,
      redactedBotResponse,
      "assistant",
      intentMatched,
      false,
    );
  } catch (error) {
    console.error("Log chat message error:", error);
  }
};
