import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatImpactMetric } from "../../lib/roadmapHelpers";

const ImpactMetrics = ({ impact }) => {
  if (!impact) return null;

  const metricIcons = {
    users: "Users",
    energySaved: "Zap",
    co2Reduced: "Leaf",
    revenue: "DollarSign",
    capacity: "Battery",
    coverage: "Map",
    marketShare: "TrendingUp",
    engagement: "Activity",
    satisfaction: "Star",
    retention: "UserCheck",
    partners: "Handshake",
    integration: "Plug",
    distribution: "Package",
    developers: "Code",
    apps: "Grid",
    funding: "Banknote",
    team: "Users",
    recognition: "Award",
    batteryLife: "BatteryCharging",
    gridStability: "Network",
    accuracy: "Target",
    privacy: "Shield",
    efficiency: "Gauge",
    credits: "Coins",
    marketplace: "ShoppingCart",
    transparency: "Eye",
    automation: "Bot",
    gridServices: "Workflow",
    markets: "Globe",
    partnerships: "Handshake",
    standards: "FileCheck",
    advisory: "Users",
    influence: "Radio",
    emissions: "Wind",
    offset: "TreePine",
    certification: "BadgeCheck",
    licenses: "Key",
    reach: "Antenna",
    avgROI: "TrendingUp",
  };

  const metrics = Object.entries(impact);

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map(([key, value], index) => {
        const IconComponent = Icons[metricIcons[key]] || Icons.ArrowRight;

        return (
          <motion.div
            key={key}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <IconComponent
                  size={16}
                  className="text-slate-600 dark:text-slate-400"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatImpactMetric(key, value)}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ImpactMetrics;
