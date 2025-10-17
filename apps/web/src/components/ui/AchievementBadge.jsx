import React, { useState } from "react";
import { Award, Lock } from "lucide-react";

const AchievementBadge = ({
  title,
  description,
  icon: Icon = Award,
  unlocked = false,
  progress = 0,
  max = 100,
  color = "from-yellow-500 to-orange-500",
  size = "default",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16",
    default: "w-20 h-20",
    lg: "w-28 h-28",
  };

  const iconSizes = {
    sm: 24,
    default: 32,
    lg: 40,
  };

  const percentage = (progress / max) * 100;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge */}
      <div
        className={`
        ${sizeClasses[size]} rounded-full
        flex items-center justify-center
        transition-all duration-500
        ${
          unlocked
            ? `bg-gradient-to-br ${color} shadow-lg hover:shadow-xl hover:scale-110`
            : "bg-slate-200 dark:bg-slate-800 opacity-50"
        }
      `}
      >
        {unlocked ? (
          <>
            <Icon className="text-white" size={iconSizes[size]} />
            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <Lock
            className="text-slate-500 dark:text-slate-600"
            size={iconSizes[size]}
          />
        )}
      </div>

      {/* Progress Ring */}
      {!unlocked && progress > 0 && (
        <svg className="absolute inset-0 -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-blue-500"
            strokeDasharray={`${percentage * 3.14} ${314 - percentage * 3.14}`}
          />
        </svg>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl min-w-[200px]">
            <div className="font-bold mb-1">{title}</div>
            <div className="text-xs opacity-90 mb-2">{description}</div>
            {!unlocked && (
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">
                    {progress}/{max}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 dark:bg-slate-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="w-3 h-3 bg-slate-900 dark:bg-slate-100 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
