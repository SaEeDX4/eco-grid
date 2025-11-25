import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  formatCAD,
  formatKWh,
  formatPercent,
  getReliabilityColor,
  getReliabilityLabel,
} from "../../lib/vppHelpers";

const PerformanceMetrics = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No performance data available
      </div>
    );
  }

  const metricCards = [
    {
      label: "Total Dispatches",
      value: metrics.total || 0,
      subValue: `${metrics.completed || 0} completed`,
      icon: "Zap",
      color: "from-purple-500 to-pink-600",
    },
    {
      label: "Energy Delivered",
      value: formatKWh(metrics.totalEnergyKWh || 0),
      icon: "Battery",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Total Revenue",
      value: formatCAD(metrics.totalRevenue || 0),
      icon: "DollarSign",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Reliability Score",
      value: formatPercent(metrics.avgReliability || 100),
      subValue: getReliabilityLabel(metrics.avgReliability || 100),
      icon: "Award",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = Icons[metric.icon];

        return (
          <motion.div
            key={metric.label}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 shadow-lg`}
            >
              <Icon className="text-white" size={24} />
            </div>

            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {metric.value}
            </div>

            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {metric.label}
            </div>

            {metric.subValue && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {metric.subValue}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PerformanceMetrics;
