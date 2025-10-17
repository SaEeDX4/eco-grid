import { useState } from "react";
import { useChat as useChatContext } from "../context/ChatContext";
import { findMatchingIntent } from "../lib/chatIntents";
import api from "../lib/api";

export const useChat = () => {
  const { sessionId, messages, addMessage } = useChatContext();
  const [typing, setTyping] = useState(false);

  const sendMessage = async (content) => {
    // Add user message
    addMessage({
      role: "user",
      content,
    });

    // Show typing indicator
    setTyping(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // First, try to match with local FAQ
      const matchedIntent = findMatchingIntent(content);

      if (matchedIntent) {
        // Found a match in FAQ
        setTyping(false);
        addMessage({
          role: "assistant",
          content: matchedIntent.answer,
        });
      } else {
        // No match - escalate to backend/Claude
        setTyping(false);
        addMessage({
          role: "assistant",
          content:
            "I'm connecting you to Eco-Grid AI for a more detailed response...",
        });

        // Show typing again for Claude response
        setTyping(true);

        try {
          const response = await api.post("/chat/escalate", {
            sessionId,
            message: content,
            history: messages.slice(-5), // Last 5 messages for context
          });

          setTyping(false);
          addMessage({
            role: "assistant",
            content: response.data.response,
          });
        } catch (error) {
          console.error("Chat escalation error:", error);
          setTyping(false);
          addMessage({
            role: "assistant",
            content:
              "I apologize, but I'm having trouble connecting right now. Please try again or contact our support team at support@ecogrid.ca for immediate assistance.",
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setTyping(false);
      addMessage({
        role: "assistant",
        content:
          "I encountered an error. Please try rephrasing your question or contact support@ecogrid.ca.",
      });
    }
  };

  return {
    messages,
    typing,
    sendMessage,
  };
};
