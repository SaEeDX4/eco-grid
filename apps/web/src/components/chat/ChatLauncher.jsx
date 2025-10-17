import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

const ChatLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <ChatPanel
          onClose={() => setIsOpen(false)}
          onMinimize={() => setIsOpen(false)}
        />
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 w-16 h-16 rounded-full
          bg-gradient-to-r from-purple-500 to-pink-600
          text-white shadow-2xl
          hover:scale-110 transition-all duration-300
          flex items-center justify-center
          z-50
          ${isOpen ? "rotate-0" : "hover:rotate-12"}
        `}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={28} className="animate-in spin-in duration-300" />
        ) : (
          <MessageCircle
            size={28}
            className="animate-in zoom-in duration-300"
          />
        )}

        {/* Notification Badge (optional) */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <span className="text-xs font-bold">1</span>
          </div>
        )}
      </button>
    </>
  );
};

export default ChatLauncher;
