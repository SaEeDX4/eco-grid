import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { categoryInfo } from "../../data/roadmapData";
import MilestoneProgress from "./MilestoneProgress";
import ImpactMetrics from "./ImpactMetrics";
import StakeholderQuote from "./StakeholderQuote";

const MilestoneCard = ({ milestone, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const category = categoryInfo[milestone.category];
  const Icon = Icons[milestone.icon] || Icons.Circle;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && onSelect) {
      onSelect(milestone);
    }
  };

  return (
    <motion.div
      className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {/* Card Header */}
      <button
        onClick={handleToggle}
        className="w-full p-6 flex items-start gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        {/* Icon */}
        <div
          className={`
          flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${category?.color || "from-slate-400 to-slate-600"}
          flex items-center justify-center shadow-lg
        `}
        >
          <Icon className="text-white" size={28} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Quarter & Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              {milestone.quarter}
            </span>
            <span
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${category?.color} text-xs font-bold text-white`}
            >
              {category?.name}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
            {milestone.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {milestone.description}
          </p>
        </div>

        {/* Expand Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="text-slate-400" size={24} />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Progress */}
              <MilestoneProgress
                status={milestone.status}
                progress={milestone.progress}
              />

              {/* Full Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Overview
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Impact Metrics */}
              {milestone.impact && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    Expected Impact
                  </h4>
                  <ImpactMetrics impact={milestone.impact} />
                </div>
              )}

              {/* Challenges */}
              {milestone.challenges && milestone.challenges.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-orange-500" />
                    Key Challenges
                  </h4>
                  <ul className="space-y-2">
                    {milestone.challenges.map((challenge, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dependencies */}
              {milestone.dependencies && milestone.dependencies.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    Dependencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {milestone.dependencies.map((depId, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400"
                      >
                        {depId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stakeholder Quote */}
              {milestone.stakeholderQuote && (
                <StakeholderQuote quote={milestone.stakeholderQuote} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MilestoneCard;
