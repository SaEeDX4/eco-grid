import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import {
  getRecommendationPriorityColor,
  getRecommendationPriorityIcon,
} from "../../lib/hubHelpers";

const RecommendationsPanel = ({ recommendations, onDismiss, onApply }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
          <Icons.CheckCircle className="text-white" size={32} />
        </div>
        <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
          All Optimized
        </h3>
        <p className="text-green-700 dark:text-green-300">
          No recommendations at this time
        </p>
      </div>
    );
  }

  // Sort by priority
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {sortedRecommendations.map((rec, index) => {
          const PriorityIcon =
            Icons[getRecommendationPriorityIcon(rec.priority)];

          return (
            <motion.div
              key={rec.id || index}
              className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  {/* Priority Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      rec.priority === "high"
                        ? "bg-red-100 dark:bg-red-950/30"
                        : rec.priority === "medium"
                          ? "bg-orange-100 dark:bg-orange-950/30"
                          : "bg-blue-100 dark:bg-blue-950/30"
                    }`}
                  >
                    <PriorityIcon
                      className={getRecommendationPriorityColor(rec.priority)}
                      size={24}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {rec.title}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          rec.priority === "high"
                            ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                            : rec.priority === "medium"
                              ? "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400"
                              : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {rec.description}
                    </p>

                    {rec.category && (
                      <div className="mt-2">
                        <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {rec.category
                            ?.split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions List */}
              {rec.actions && rec.actions.length > 0 && (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                    RECOMMENDED ACTIONS
                  </div>
                  <ul className="space-y-2">
                    {rec.actions.map((action, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <Icons.ArrowRight
                          size={16}
                          className="flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400"
                        />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buttons */}
              <div className="p-6 flex gap-3">
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(rec)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
                {onApply && (
                  <button
                    onClick={() => onApply(rec)}
                    className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.CheckCircle size={16} />
                    Apply
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationsPanel;
