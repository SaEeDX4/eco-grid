import React from "react";
import { motion } from "framer-motion";
import MilestoneCard from "./MilestoneCard";
import { getYearProgress } from "../../lib/roadmapHelpers";

const RoadmapYear = ({ year, onMilestoneSelect }) => {
  const yearProgress = getYearProgress(year);

  return (
    <div id={`year-${year.year}`} className="relative">
      {/* Year Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-6">
          {/* Year Number */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-bold text-white">{year.year}</span>
            </div>
          </div>

          {/* Year Info */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {year.theme}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>Year Progress</span>
                  <span className="font-bold">{yearProgress}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${yearProgress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {year.milestones.length} Milestone
                {year.milestones.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        {year.milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            id={`milestone-${milestone.id}`}
          >
            <MilestoneCard milestone={milestone} onSelect={onMilestoneSelect} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapYear;
