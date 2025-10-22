import { useState, useEffect, useRef } from "react";
import { animateValue } from "../lib/animationUtils";

export const useCountUp = (end, start = 0, duration = 2000, options = {}) => {
  const {
    decimals = 0,
    separator = ",",
    suffix = "",
    prefix = "",
    startOnMount = false,
    enabled = true,
  } = options;

  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasAnimated = useRef(false);

  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return prefix + parts.join(".") + suffix;
  };

  const startAnimation = () => {
    if (hasAnimated.current || !enabled) return;

    hasAnimated.current = true;
    setIsAnimating(true);

    animateValue(start, end, duration, (value) => {
      setCount(value);
    });

    setTimeout(() => setIsAnimating(false), duration);
  };

  useEffect(() => {
    if (startOnMount && enabled) {
      startAnimation();
    }
  }, [startOnMount, enabled]);

  return {
    value: formatNumber(count),
    rawValue: count,
    isAnimating,
    start: startAnimation,
    reset: () => {
      hasAnimated.current = false;
      setCount(start);
    },
  };
};
