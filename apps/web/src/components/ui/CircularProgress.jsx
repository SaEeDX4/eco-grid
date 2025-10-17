import React, { useEffect, useState } from "react";

const CircularProgress = ({
  value = 0,
  max = 100,
  size = 200,
  strokeWidth = 12,
  color = "#10b981",
  backgroundColor = "#e5e7eb",
  showValue = true,
  label = "",
  animate = true,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (displayValue / max) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))",
          }}
        />

        {/* Pulsing Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 4}
          stroke={color}
          strokeWidth={2}
          fill="none"
          opacity={0.3}
          className="animate-ping"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <div className="text-center">
            <div className="text-4xl font-bold" style={{ color }}>
              {Math.round(displayValue)}
            </div>
            {label && (
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
