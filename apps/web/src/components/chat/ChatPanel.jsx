import React from "react";
import { X } from "lucide-react"; // 🧹 removed Minimize2
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChat } from "../../hooks/useChat";

const ChatPanel = ({ onClose }) => {
  // 🧹 removed onMinimize prop
  const { messages, typing, sendMessage } = useChat();

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 flex flex-col animate-in slide-in-from-bottom-4 duration-300 z-50">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold">Eco-Grid AI</h3>
            <p className="text-xs text-purple-100">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* 🧹 Removed minimize button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} typing={typing} />

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={typing} />
    </div>
  );
};

export default ChatPanel;
