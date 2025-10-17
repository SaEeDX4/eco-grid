import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../ui/Card";
import { useCountUp } from "../../hooks/useCountUp";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import Tooltip from "../ui/Tooltip";

const KPICard = ({
  icon: Icon,
  title,
  value,
  unit = "",
  prefix = "",
  trend,
  trendLabel,
  color = "green",
  loading = false,
  tooltip,
}) => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const animatedValue = useCountUp(isVisible && !loading ? value : 0, 1500);

  const colors = {
    green: {
      bg: "from-green-500 to-emerald-500",
      text: "text-green-600 dark:text-green-400",
      icon: "bg-green-100 dark:bg-green-900/30",
    },
    blue: {
      bg: "from-blue-500 to-cyan-500",
      text: "text-blue-600 dark:text-blue-400",
      icon: "bg-blue-100 dark:bg-blue-900/30",
    },
    purple: {
      bg: "from-purple-500 to-pink-500",
      text: "text-purple-600 dark:text-purple-400",
      icon: "bg-purple-100 dark:bg-purple-900/30",
    },
    orange: {
      bg: "from-orange-500 to-amber-500",
      text: "text-orange-600 dark:text-orange-400",
      icon: "bg-orange-100 dark:bg-orange-900/30",
    },
  };

  const colorScheme = colors[color] || colors.green;

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
      </Card>
    );
  }

  return (
    <div ref={ref}>
      <Card hover className="p-6 group transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${colorScheme.icon}
            group-hover:scale-110 transition-transform duration-300
          `}
          >
            <Icon size={24} className={colorScheme.text} />
          </div>

          {trend !== undefined && (
            <div
              className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold
              ${
                trend >= 0
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }
            `}
            >
              {trend >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div
            className={`
            text-4xl font-bold ${colorScheme.text}
            group-hover:scale-105 transition-transform duration-300 inline-block
          `}
          >
            {prefix}
            {animatedValue.toLocaleString()}
            {unit}
          </div>
        </div>

        {/* Title & Trend Label */}
        <div className="flex items-center justify-between">
          <Tooltip content={tooltip || title}>
            <h3 className="text-slate-600 dark:text-slate-400 font-medium">
              {title}
            </h3>
          </Tooltip>
          {trendLabel && (
            <span className="text-xs text-slate-500 dark:text-slate-500">
              {trendLabel}
            </span>
          )}
        </div>

        {/* Gradient Line */}
        <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`
            h-full bg-gradient-to-r ${colorScheme.bg}
            transition-all duration-1000 ease-out
          `}
            style={{ width: isVisible ? "100%" : "0%" }}
          />
        </div>
      </Card>
    </div>
  );
};

export default KPICard;
