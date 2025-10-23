import React from "react";
import { Star } from "lucide-react";

const RatingStars = ({
  rating,
  size = "md",
  showNumber = false,
  interactive = false,
  onChange,
}) => {
  const sizes = {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 32,
  };

  const iconSize = sizes[size];

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          disabled={!interactive}
          className={`
            ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
            ${!interactive && "pointer-events-none"}
          `}
        >
          <Star
            size={iconSize}
            className={`
              ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300 dark:text-slate-600"
              }
              ${interactive && star <= rating && "drop-shadow-lg"}
            `}
          />
        </button>
      ))}
      {showNumber && (
        <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
