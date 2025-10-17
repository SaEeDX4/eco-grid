import React from "react";
import { Zap, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Progress from "../ui/Progress";

const EnergyMonitor = ({
  currentUsage = 3.2,
  capacity = 10,
  status = "normal",
}) => {
  const percentage = (currentUsage / capacity) * 100;

  const statusConfig = {
    normal: {
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
      label: "Normal",
      icon: Activity,
    },
    high: {
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      label: "High Usage",
      icon: Zap,
    },
    critical: {
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/30",
      label: "Critical",
      icon: Zap,
    },
  };

  const config = statusConfig[status] || statusConfig.normal;
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-green-600" size={24} />
            Real-Time Monitor
          </CardTitle>
          <div
            className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}
          `}
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className={`text-sm font-semibold ${config.color}`}>
              Live
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Current Usage Display */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Animated Circle */}
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress Circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {currentUsage}
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                kW
              </div>
              <div
                className={`
                mt-2 px-3 py-1 rounded-full flex items-center gap-2
                ${config.bg}
              `}
              >
                <StatusIcon size={14} className={config.color} />
                <span className={`text-xs font-semibold ${config.color}`}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {capacity} kW
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Capacity
            </div>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Utilization
            </div>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Usage Status
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-500">
              Updated just now
            </span>
          </div>
          <Progress
            value={percentage}
            variant={
              percentage > 80
                ? "danger"
                : percentage > 60
                  ? "warning"
                  : "success"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyMonitor;
