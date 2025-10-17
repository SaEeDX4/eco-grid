import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const TrendIndicator = ({
  value,
  suffix = "%",
  showIcon = true,
  size = "default",
}) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const absValue = Math.abs(value);

  const sizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: 14,
    default: 16,
    lg: 20,
  };

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  const colorClass = isNeutral
    ? "text-slate-500 dark:text-slate-500"
    : isPositive
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div
      className={`inline-flex items-center gap-1 font-semibold ${colorClass} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>
        {isPositive && "+"}
        {absValue.toFixed(1)}
        {suffix}
      </span>
    </div>
  );
};

export default TrendIndicator;
