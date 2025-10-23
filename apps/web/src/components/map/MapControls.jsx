import React from "react";
import { motion } from "framer-motion";
import { Layers, Maximize2, RefreshCw } from "lucide-react";

const MapControls = ({
  onToggleHeatmap,
  heatmapEnabled,
  onFitBounds,
  onRefresh,
  loading,
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className="flex flex-col gap-2">
        {/* Heatmap toggle */}
        <motion.button
          onClick={onToggleHeatmap}
          className={`
            p-3 rounded-xl backdrop-blur-lg border-2 shadow-lg transition-all duration-200
            ${
              heatmapEnabled
                ? "bg-blue-500 border-blue-600 text-white"
                : "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Toggle heatmap"
        >
          <Layers size={24} />
        </motion.button>

        {/* Fit bounds */}
        <motion.button
          onClick={onFitBounds}
          className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Fit all pilots"
        >
          <Maximize2 size={24} />
        </motion.button>

        {/* Refresh */}
        <motion.button
          onClick={onRefresh}
          disabled={loading}
          className={`
            p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-lg
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          animate={loading ? { rotate: 360 } : {}}
          transition={
            loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}
          }
          title="Refresh data"
        >
          <RefreshCw size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default MapControls;
