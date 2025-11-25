import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  formatKW,
  formatCAD,
  formatPercent,
  getUtilizationColor,
} from "../../lib/hubHelpers";

const HubStats = ({ hub, snapshot }) => {
  if (!hub) return null;

  const stats = [
    {
      label: "Total Capacity",
      value: formatKW(hub.capacity.totalKW),
      subvalue: `${formatKW(hub.capacity.availableKW)} available`,
      icon: "Zap",
      gradient: "from-blue-500 to-cyan-600",
      change: null,
    },
    {
      label: "Active Tenants",
      value: hub.tenants?.length || 0,
      subvalue: `${formatKW(hub.capacity.allocatedKW)} allocated`,
      icon: "Users",
      gradient: "from-purple-500 to-pink-600",
      change: null,
    },
    {
      label: "Utilization",
      value: formatPercent(hub.capacity.utilizationPercent || 0),
      subvalue: hub.capacity.utilizationPercent >= 85 ? "High usage" : "Normal",
      icon: "Activity",
      gradient: "from-green-500 to-emerald-600",
      change: null,
    },
    {
      label: "Revenue (30d)",
      value: formatCAD(hub.performance?.revenue30d || 0),
      subvalue: hub.vpp?.enabled ? "VPP enabled" : "VPP disabled",
      icon: "DollarSign",
      gradient: "from-orange-500 to-red-600",
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = Icons[stat.icon];

        return (
          <motion.div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-md`}
            >
              <Icon className="text-white" size={24} />
            </div>

            {/* Label */}
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {stat.label}
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stat.value}
            </div>

            {/* Subvalue */}
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {stat.subvalue}
            </div>

            {/* Change indicator (if applicable) */}
            {stat.change && (
              <div
                className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold ${
                  stat.change > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.change > 0 ? (
                  <Icons.TrendingUp size={14} />
                ) : (
                  <Icons.TrendingDown size={14} />
                )}
                {Math.abs(stat.change)}%
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default HubStats;
