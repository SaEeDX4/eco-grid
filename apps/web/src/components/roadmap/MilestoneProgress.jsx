import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
} from "../../lib/roadmapHelpers";

const MilestoneProgress = ({ status, progress }) => {
  const Icon = Icons[getStatusIcon(status)];

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${getStatusColor(status)} flex items-center justify-center`}
            >
              <Icon className="text-white" size={16} />
            </div>
          )}
          <span
            className={`text-sm font-semibold bg-gradient-to-r ${getStatusColor(status)} bg-clip-text text-transparent`}
          >
            {getStatusLabel(status)}
          </span>
        </div>

        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getStatusColor(status)} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default MilestoneProgress;
