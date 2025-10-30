import React, { useRef } from "react";
import { motion } from "framer-motion";
import { getStatusColor } from "../../lib/mapHelpers";
// FIX: Professional Lucide icons
import { SunMedium, PlugZap, BatteryFull, Flame, Zap } from "lucide-react";

const MapMarker = ({
  pilot,
  onClick,
  onHover,
  isHovered,
  renderInline = false,
}) => {
  const markerRef = useRef(null);

  const statusColor = getStatusColor(pilot.status);
  const pulseIntensity = pilot.metrics.energySaved / 100000;

  // Choose elegant icons based on type
  const renderIcon = () => {
    if (pilot.deviceTypes.includes("solar")) return <SunMedium size={20} />;
    if (pilot.deviceTypes.includes("ev-charger")) return <PlugZap size={20} />;
    if (pilot.deviceTypes.includes("battery")) return <BatteryFull size={20} />;
    if (pilot.deviceTypes.includes("heat-pump")) return <Flame size={20} />;
    return <Zap size={20} />;
  };

  return (
    <motion.div
      ref={markerRef}
      className="relative cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(pilot);
      }}
      onMouseEnter={() => onHover(pilot)}
      onMouseLeave={() => onHover(null)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isHovered ? 1.3 : 1,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Pulse animation */}
      {pilot.status === "active" && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: statusColor,
              opacity: 0.3,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: statusColor,
              opacity: 0.3,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}

      {/* Main marker */}
      <div
        className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900 text-white"
        style={{
          backgroundColor: statusColor,
          boxShadow: isHovered
            ? `0 0 30px ${statusColor}`
            : `0 0 15px ${statusColor}`,
        }}
      >
        {renderIcon()}
      </div>

      {/* Status indicator */}
      <div
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900"
        style={{ backgroundColor: statusColor }}
      />

      {/* Featured star */}
      {pilot.featured && (
        <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
          <span className="text-white text-xs">★</span>
        </div>
      )}
    </motion.div>
  );
};

export default MapMarker;
