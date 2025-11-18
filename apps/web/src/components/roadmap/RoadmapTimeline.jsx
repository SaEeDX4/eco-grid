import React from "react";
import { motion } from "framer-motion";
import RoadmapYear from "./RoadmapYear";

const RoadmapTimeline = ({ years, onMilestoneSelect }) => {
  return (
    <div className="relative">
      {/* Vertical Timeline Line */}
      <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden lg:block" />

      {/* Years */}
      <div className="space-y-20">
        {years.map((year, index) => (
          <motion.div
            key={year.year}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <RoadmapYear year={year} onMilestoneSelect={onMilestoneSelect} />
          </motion.div>
        ))}
      </div>

      {/* ❌ Removed: End of Timeline Marker (rocket + extra spacing) */}
      {/* Nothing here now */}
    </div>
  );
};

export default RoadmapTimeline;
