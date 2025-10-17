import React from "react";

const Progress = ({
  value = 0,
  max = 100,
  size = "default",
  variant = "default",
  showLabel = false,
  label,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4",
  };

  const variants = {
    default: "from-green-500 to-emerald-500",
    success: "from-green-500 to-emerald-600",
    warning: "from-yellow-500 to-orange-500",
    danger: "from-red-500 to-rose-600",
    info: "from-blue-500 to-cyan-500",
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`
        w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden
        ${sizes[size]}
      `}
      >
        <div
          className={`
            h-full bg-gradient-to-r ${variants[variant]}
            transition-all duration-500 ease-out
            relative overflow-hidden
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default Progress;
