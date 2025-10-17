import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-none max-w-[80px]">
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
