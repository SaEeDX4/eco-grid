import React from "react";
import { Circle } from "lucide-react";

const StatusBadge = ({
  status = "online",
  label,
  size = "default",
  showDot = true,
  className = "",
}) => {
  const statusConfig = {
    online: {
      color:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
      dot: "bg-green-500",
      label: label || "Online",
    },
    offline: {
      color:
        "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      dot: "bg-slate-400",
      label: label || "Offline",
    },
    charging: {
      color:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      dot: "bg-blue-500",
      label: label || "Charging",
    },
    active: {
      color:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      dot: "bg-purple-500",
      label: label || "Active",
    },
    idle: {
      color:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      dot: "bg-yellow-500",
      label: label || "Idle",
    },
    standby: {
      color:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      dot: "bg-orange-500",
      label: label || "Standby",
    },
    generating: {
      color:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      dot: "bg-yellow-500",
      label: label || "Generating",
    },
    error: {
      color:
        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      dot: "bg-red-500",
      label: label || "Error",
    },
  };

  const sizes = {
    sm: "text-xs px-2 py-1",
    default: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <span
      className={`
      inline-flex items-center gap-2 rounded-full font-semibold
      border transition-all duration-300
      ${config.color}
      ${sizes[size]}
      ${className}
    `}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}
          ></span>
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
