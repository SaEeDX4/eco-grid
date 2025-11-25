import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatCAD, formatMW, formatPercent } from "../../lib/vppHelpers";

const VPPStats = ({ overview }) => {
  if (!overview) return null;

  const stats = [
    {
      label: "Total Revenue",
      value: formatCAD(overview.revenue?.allTime?.totalNet || 0),
      change: overview.revenue?.currentMonth?.totalNet || 0,
      changeLabel: "this month",
      icon: "DollarSign",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Active Pools",
      value: overview.pools?.length || 0,
      subValue:
        overview.pools
          ?.reduce((sum, p) => sum + (p.userContribution || 0), 0)
          .toFixed(1) + " kW",
      icon: "Layers",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Total Dispatches",
      value: overview.stats?.total || 0,
      subValue: `${overview.stats?.completed || 0} completed`,
      icon: "Zap",
      color: "from-purple-500 to-pink-600",
    },
    {
      label: "Reliability",
      value: formatPercent(overview.stats?.avgReliability || 100),
      subValue: overview.stats?.avgReliability >= 95 ? "Excellent" : "Good",
      icon: "Award",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = Icons[stat.icon];

        return (
          <motion.div
            key={stat.label}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="text-white" size={24} />
              </div>
            </div>

            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stat.value}
            </div>

            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {stat.label}
            </div>

            {stat.subValue && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {stat.subValue}
              </div>
            )}

            {stat.change !== undefined && stat.change > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-2">
                <Icons.TrendingUp size={12} />
                {formatCAD(stat.change)} {stat.changeLabel}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default VPPStats;
