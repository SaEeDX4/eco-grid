import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          rows={1}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none disabled:opacity-50"
          placeholder="Type your message..."
          style={{ minHeight: "48px", maxHeight: "120px" }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
};

export default ChatInput;
