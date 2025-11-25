import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatCAD, formatKWh } from "../../lib/hubHelpers";

const RevenueSummary = ({ summary, period }) => {
  if (!summary) return null;

  const metrics = [
    {
      label: "Total Revenue",
      value: formatCAD(summary.totalTenantRevenueCAD || 0),
      icon: "DollarSign",
      gradient: "from-green-500 to-emerald-600",
      trend: summary.revenueChange,
    },
    {
      label: "Operating Costs",
      value: formatCAD(summary.totalOperatingCostsCAD || 0),
      icon: "TrendingDown",
      gradient: "from-red-500 to-orange-600",
      trend: null,
    },
    {
      label: "Net Profit",
      value: formatCAD(summary.netRevenueCAD || 0),
      icon: "TrendingUp",
      gradient: "from-blue-500 to-cyan-600",
      trend: null,
    },
    {
      label: "Profit Margin",
      value: `${(summary.profitMarginPercent || 0).toFixed(1)}%`,
      icon: "Percent",
      gradient: "from-purple-500 to-pink-600",
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Period Info */}
      {period && (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Icons.Calendar size={16} />
          <span>
            {new Date(period.start).toLocaleDateString("en-CA")} -{" "}
            {new Date(period.end).toLocaleDateString("en-CA")}
          </span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = Icons[metric.icon];

          return (
            <motion.div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mb-4 shadow-md`}
              >
                <Icon className="text-white" size={24} />
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {metric.label}
              </div>

              {/* Value */}
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {metric.value}
              </div>

              {/* Trend */}
              {metric.trend && (
                <div
                  className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold ${
                    metric.trend > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {metric.trend > 0 ? (
                    <Icons.TrendingUp size={14} />
                  ) : (
                    <Icons.TrendingDown size={14} />
                  )}
                  {Math.abs(metric.trend)}%
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      {summary.totalEnergyKWh && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.Zap
                className="text-slate-600 dark:text-slate-400"
                size={24}
              />
              <div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Total Energy
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatKWh(summary.totalEnergyKWh)}
                </div>
              </div>
            </div>

            {summary.avgRevenuePerTenant && (
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Avg Revenue/Tenant
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCAD(summary.avgRevenuePerTenant)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueSummary;
