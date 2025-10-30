import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  ChevronUp,
  SunMedium,
  PlugZap,
  BatteryFull,
  Flame,
  Thermometer,
} from "lucide-react"; // FIX: Added Lucide icons

const MapLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusItems = [
    { color: "#10b981", label: "Active", description: "Operating normally" },
    { color: "#f59e0b", label: "Idle", description: "Low activity" },
    {
      color: "#ef4444",
      label: "Maintenance",
      description: "Under maintenance",
    },
    { color: "#6b7280", label: "Offline", description: "Not operational" },
  ];

  // FIX: Replaced emojis with Lucide icons
  const markerInfo = [
    { icon: <SunMedium size={16} />, label: "Solar panels" },
    { icon: <PlugZap size={16} />, label: "EV chargers" },
    { icon: <BatteryFull size={16} />, label: "Battery storage" },
    { icon: <Flame size={16} />, label: "Heat pumps" },
    { icon: <Thermometer size={16} />, label: "Smart thermostats" },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <motion.div
        className="rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Map Legend
            </span>
          </div>
          <ChevronUp
            size={20}
            className={`text-slate-600 dark:text-slate-400 transition-transform duration-200 ${
              isExpanded ? "" : "rotate-180"
            }`}
          />
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="px-4 pb-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Status indicators */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Status Indicators
                </h4>
                <div className="space-y-2">
                  {statusItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device types */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Device Types
                </h4>
                <div className="space-y-1">
                  {markerInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.icon}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special markers */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Special Markers
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                      <span className="text-white text-xs">★</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Featured pilot
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-900">
                      3+
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      Cluster (click to expand)
                    </span>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  💡 Click markers for details, hover for quick stats
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MapLegend;
