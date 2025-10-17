import React from "react";
import {
  Zap,
  DollarSign,
  TrendingDown,
  Battery,
  Sun,
  Droplet,
} from "lucide-react";
import { Card } from "../ui/Card";
import AnimatedNumber from "../ui/AnimatedNumber";
import TrendIndicator from "../ui/TrendIndicator";

const MetricsGrid = ({ metrics, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      label: "Total Energy",
      value: metrics.totalEnergy,
      unit: " kWh",
      trend: metrics.energyTrend,
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Total Cost",
      value: metrics.totalCost,
      unit: "",
      prefix: "$",
      trend: metrics.costTrend,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "Savings",
      value: metrics.totalSavings,
      unit: "",
      prefix: "$",
      trend: metrics.savingsTrend,
      icon: TrendingDown,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      label: "Peak Usage",
      value: metrics.peakUsage,
      unit: " kW",
      trend: metrics.peakTrend,
      icon: Battery,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      label: "Solar Gen",
      value: metrics.solarGeneration,
      unit: " kWh",
      trend: metrics.solarTrend,
      icon: Sun,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      label: "Water Usage",
      value: metrics.waterUsage,
      unit: " L",
      trend: metrics.waterTrend,
      icon: Droplet,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metricCards.map((metric, index) => (
        <div
          key={metric.label}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Card className="group hover:shadow-lg transition-all duration-300">
            <div className={`p-4 rounded-2xl ${metric.bgColor}`}>
              {/* Icon */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-br ${metric.color}
                  shadow-lg group-hover:shadow-xl group-hover:scale-110
                  transition-all duration-300
                `}
                >
                  <metric.icon className="text-white" size={24} />
                </div>
                {metric.trend !== undefined && (
                  <TrendIndicator value={metric.trend} size="sm" />
                )}
              </div>

              {/* Value */}
              <div className="mb-1">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  <AnimatedNumber
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.unit}
                    decimals={metric.unit === " kWh" ? 1 : 2}
                    duration={1500}
                  />
                </div>
              </div>

              {/* Label */}
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {metric.label}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
