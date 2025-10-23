import React from "react";
import { motion } from "framer-motion";
import { MapPin, Zap, Leaf, DollarSign } from "lucide-react";
import { formatMetric } from "../../lib/mapHelpers";

const MarkerTooltip = ({ pilot, position }) => {
  if (!pilot) return null;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 20,
        top: position.y - 10,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        {/* Arrow */}
        <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-slate-800" />

        {/* Tooltip card */}
        <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-700 shadow-2xl min-w-[280px]">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-start gap-2 mb-2">
              <MapPin
                size={16}
                className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                  {pilot.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {pilot.city}, {pilot.region}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <div
                className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${
                  pilot.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : pilot.status === "idle"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                      : pilot.status === "maintenance"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400"
                }
              `}
              >
                {pilot.status}
              </div>

              {pilot.featured && (
                <div className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold">
                  ★ Featured
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                <Zap size={14} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-slate-600 dark:text-slate-400">
                Energy:
              </span>
              <span className="font-bold text-slate-900 dark:text-white ml-auto">
                {formatMetric(pilot.metrics.energySaved, "energy")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                <Leaf size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-slate-600 dark:text-slate-400">CO₂:</span>
              <span className="font-bold text-slate-900 dark:text-white ml-auto">
                {formatMetric(pilot.metrics.co2Reduced, "co2")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <DollarSign
                  size={14}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <span className="text-slate-600 dark:text-slate-400">
                Savings:
              </span>
              <span className="font-bold text-slate-900 dark:text-white ml-auto">
                {formatMetric(pilot.metrics.costSavings, "currency")}
              </span>
            </div>
          </div>

          {/* Device types */}
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-1">
              {pilot.deviceTypes.map((type, index) => (
                <div
                  key={index}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  {type.replace("-", " ")}
                </div>
              ))}
            </div>
          </div>

          {/* Click hint */}
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic">
              Click for details
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarkerTooltip;
