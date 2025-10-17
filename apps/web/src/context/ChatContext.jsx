import React, { createContext, useContext, useState, useEffect } from "react";
import { getWelcomeMessage } from "../lib/chatIntents";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );
  const [messages, setMessages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          role: "assistant",
          content: getWelcomeMessage(),
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const addMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const clearMessages = () => {
    setMessages([
      {
        role: "assistant",
        content: getWelcomeMessage(),
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        messages,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
