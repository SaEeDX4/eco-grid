import React from "react";
import { motion } from "framer-motion";
import {
  formatKW,
  formatPercent,
  getUtilizationColor,
} from "../../lib/hubHelpers";

const HubCapacityGauge = ({ hub }) => {
  if (!hub) return null;

  const { totalKW, allocatedKW, availableKW, reservedKW, utilizationPercent } =
    hub.capacity;

  const allocatedPercent = (allocatedKW / totalKW) * 100;
  const reservedPercent = (reservedKW / totalKW) * 100;
  const availablePercent = (availableKW / totalKW) * 100;

  // Circular gauge parameters
  const size = 280;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke dash offsets for segments
  const allocatedOffset =
    circumference - (allocatedPercent / 100) * circumference;
  const reservedOffset =
    circumference -
    ((allocatedPercent + reservedPercent) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Circular Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
          />

          {/* Allocated capacity (blue) */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#gradient-allocated)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={allocatedOffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: allocatedOffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Reserved capacity (orange) */}
          {reservedKW > 0 && (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#gradient-reserved)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={reservedOffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: allocatedOffset }}
              animate={{ strokeDashoffset: reservedOffset }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          )}

          {/* Gradients */}
          <defs>
            <linearGradient
              id="gradient-allocated"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient
              id="gradient-reserved"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`text-5xl font-bold ${getUtilizationColor(utilizationPercent)}`}
          >
            {utilizationPercent.toFixed(0)}%
          </div>
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
            Utilization
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-md">
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Allocated
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatKW(allocatedKW)}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
            {formatPercent(allocatedPercent, 0)}
          </div>
        </div>

        {reservedKW > 0 && (
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Reserved
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {formatKW(reservedKW)}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
              {formatPercent(reservedPercent, 0)}
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Available
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatKW(availableKW)}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
            {formatPercent(availablePercent, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubCapacityGauge;
