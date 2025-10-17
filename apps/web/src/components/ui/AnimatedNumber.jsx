import React, { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({
  value,
  duration = 1000,
  prefix = "",
  suffix = "",
  decimals = 2,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef();
  const startTimeRef = useRef();
  const startValueRef = useRef(0);

  useEffect(() => {
    if (value === displayValue) return;

    setIsAnimating(true);
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (currentTime) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function - ease out cubic
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const current =
        startValueRef.current + (value - startValueRef.current) * easeOutCubic;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration, displayValue]);

  return (
    <span
      className={`${className} ${isAnimating ? "animate-pulse-subtle" : ""}`}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
