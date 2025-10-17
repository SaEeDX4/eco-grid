import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  Wrench, // ✅ FIX: replaced Tool → Wrench
  Trophy,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import api from "../../lib/api";

const AICoach = ({ tips = [] }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [loading, setLoading] = useState(false);
  const { success } = useToast();

  // ✅ Update icon mapping
  const icons = {
    clock: Clock,
    tool: Wrench,
    trophy: Trophy,
    default: Sparkles,
  };

  const priorityColors = {
    high: "border-red-500 bg-red-50 dark:bg-red-950/20",
    medium: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
    low: "border-green-500 bg-green-50 dark:bg-green-950/20",
  };

  const tip = tips[currentTip] || {};
  const Icon = icons[tip.icon] || icons.default;

  const handleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // TODO: Call API to get fresh AI tip
      await new Promise((resolve) => setTimeout(resolve, 1500));
      success("Fresh tips loaded!");
    } catch (error) {
      console.error("Failed to refresh tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTip = () => {
    success("Optimization scheduled!");
    handleNextTip();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles size={24} />
            AI Energy Coach
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            loading={loading}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Tip Card */}
        <div
          className={`
          m-4 p-6 rounded-2xl border-2 transition-all duration-500
          ${priorityColors[tip.priority] || priorityColors.low}
        `}
        >
          {/* Priority Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                <Icon size={20} className="text-purple-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {tip.priority} Priority
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-500">
              Tip {currentTip + 1} of {tips.length}
            </span>
          </div>

          {/* Tip Message */}
          <p className="text-lg leading-relaxed text-slate-900 dark:text-white font-medium mb-4">
            {tip.message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {tip.actionable && (
              <Button
                variant="gradient"
                size="sm"
                onClick={handleApplyTip}
                className="flex-1"
              >
                Apply Now
                <ChevronRight size={16} />
              </Button>
            )}
            {tips.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextTip}
                className="flex-1"
              >
                Next Tip
              </Button>
            )}
          </div>
        </div>

        {/* Tip Indicators */}
        <div className="flex items-center justify-center gap-2 pb-4">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${
                  index === currentTip
                    ? "w-8 bg-purple-600"
                    : "w-2 bg-slate-300 dark:bg-slate-600 hover:bg-purple-400"
                }
              `}
            />
          ))}
        </div>

        {/* Coach Stats */}
        <div className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700">
          <div className="bg-white dark:bg-slate-800 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">24</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Tips Given
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Applied
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">$45</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Saved
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoach;
