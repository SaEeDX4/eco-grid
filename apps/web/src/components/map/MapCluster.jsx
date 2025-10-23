import React from "react";
import { motion } from "framer-motion";

const MapCluster = ({ count, onClick, isHovered }) => {
  const size = Math.min(80, 40 + Math.log(count) * 10);

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: isHovered ? 1.2 : 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Outer ring */}
      <div
        className="rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl border-4 border-white dark:border-slate-900"
        style={{
          width: size,
          height: size,
          boxShadow: isHovered
            ? "0 0 40px rgba(59, 130, 246, 0.6)"
            : "0 0 20px rgba(59, 130, 246, 0.4)",
        }}
      >
        {/* Inner content */}
        <div className="text-center">
          <div className="text-white font-bold text-2xl">{count}</div>
          <div className="text-blue-100 text-xs font-semibold">pilots</div>
        </div>
      </div>

      {/* Animated ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-blue-400"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default MapCluster;
