import React, { useEffect, useRef } from "react";
import { Bot, User as UserIcon } from "lucide-react";
import TypingIndicator from "./TypingIndicator";

const MessageList = ({ messages, typing }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {message.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
              <Bot className="text-white" size={18} />
            </div>
          )}

          <div
            className={`
              flex-1 px-4 py-3 rounded-2xl
              ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none ml-auto max-w-[80%]"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none"
              }
            `}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            {message.timestamp && (
              <p
                className={`
                text-xs mt-2
                ${message.role === "user" ? "text-blue-100" : "text-slate-500 dark:text-slate-500"}
              `}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {message.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <UserIcon className="text-white" size={18} />
            </div>
          )}
        </div>
      ))}

      {typing && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
            <Bot className="text-white" size={18} />
          </div>
          <TypingIndicator />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
