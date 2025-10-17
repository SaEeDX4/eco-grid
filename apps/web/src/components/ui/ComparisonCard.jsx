import React, { useState } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";

const ComparisonCard = ({
  title,
  before,
  after,
  unit = "",
  prefix = "",
  type = "cost", // 'cost' or 'carbon'
  highlighted = false,
}) => {
  const [flipped, setFlipped] = useState(false);
  const delta = after - before;
  const percentChange = before !== 0 ? (delta / before) * 100 : 0;
  const isImprovement = type === "cost" ? delta < 0 : delta > 0;

  return (
    <div
      className={`
        relative h-64 cursor-pointer
        perspective-1000
        ${highlighted ? "ring-4 ring-green-500/30" : ""}
      `}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`
        relative w-full h-full transition-transform duration-700
        transform-style-preserve-3d
        ${flipped ? "rotate-y-180" : ""}
      `}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div
            className={`
            h-full p-6 rounded-2xl
            bg-gradient-to-br from-white to-slate-50
            dark:from-slate-800 dark:to-slate-900
            border-2 border-slate-200 dark:border-slate-700
            shadow-lg hover:shadow-xl
            transition-all duration-300
          `}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
                  {title}
                </h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    <AnimatedNumber
                      value={before}
                      prefix={prefix}
                      suffix={unit}
                      decimals={2}
                    />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    Current
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-500 text-sm">
                <span>Click to compare</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div
            className={`
            h-full p-6 rounded-2xl
            ${
              isImprovement
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            }
            shadow-lg
            text-white
          `}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-sm font-semibold opacity-90 mb-4">
                  {title} (Optimized)
                </h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-2">
                    <AnimatedNumber
                      value={after}
                      prefix={prefix}
                      suffix={unit}
                      decimals={2}
                    />
                  </div>
                  <div className="text-xs opacity-90">After Optimization</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-sm font-medium">Change</span>
                  <div className="flex items-center gap-1">
                    {isImprovement ? (
                      <TrendingDown size={16} />
                    ) : (
                      <TrendingUp size={16} />
                    )}
                    <span className="font-bold">
                      {Math.abs(percentChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-center text-xs opacity-75">
                  Click to flip back
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
