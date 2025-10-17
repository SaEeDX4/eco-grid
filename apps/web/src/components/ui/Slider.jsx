import React, { useState } from "react";

const Slider = ({
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = "",
  showValue = true,
  color = "green",
  disabled = false,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const colors = {
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-amber-500",
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={className}>
      {/* Label */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-3">
          {label && (
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}

      {/* Slider Track */}
      <div className="relative h-3 group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Background Track */}
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full" />

        {/* Active Track */}
        <div
          className={`
            absolute inset-y-0 left-0 rounded-full
            bg-gradient-to-r ${colors[color]}
            transition-all duration-200
            ${isDragging ? "shadow-lg" : ""}
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full" />
        </div>

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            w-6 h-6 bg-white rounded-full shadow-lg
            border-2 border-slate-200 dark:border-slate-600
            transition-all duration-200
            ${isDragging ? "scale-125 shadow-xl" : "group-hover:scale-110"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          style={{ left: `calc(${percentage}% - 12px)` }}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-500">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
};

export default Slider;
