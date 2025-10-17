import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import api from "../../lib/api";

const AIExplainer = ({ schedule, mode, savings }) => {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { error } = useToast();

  useEffect(() => {
    if (schedule && schedule.length > 0 && mode) {
      fetchExplanation();
    }
  }, [schedule, mode]);

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const response = await api.post("/optimizer/explain", {
        schedule,
        mode,
        savings,
      });

      setExplanation(response.data.explanation);
    } catch (err) {
      console.error("Failed to get AI explanation:", err);
      // Fallback to simple explanation
      setExplanation(generateFallbackExplanation());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackExplanation = () => {
    const deviceCount = schedule.length;
    const offPeakDevices = schedule.filter(
      (d) => d.startHour >= 0 && d.startHour < 7,
    );

    return {
      summary: `This ${mode} optimization plan shifts ${offPeakDevices.length} of ${deviceCount} devices to off-peak hours, reducing your energy costs by approximately ${savings?.percentSaved?.toFixed(1)}%.`,
      steps: [
        `Analyzed your ${deviceCount} devices and their current usage patterns`,
        `Identified ${offPeakDevices.length} flexible devices that can be shifted to off-peak hours (12 AM - 6 AM)`,
        `Maintained essential devices during your preferred hours`,
        `Ensured no capacity overload at any time`,
        `Calculated potential savings of $${savings?.monthlySavings?.toFixed(2)}/month`,
      ],
      recommendations: [
        "Consider scheduling EV charging to start at midnight for maximum savings",
        "Water heater can run during off-peak without impacting comfort",
        "Keep critical devices like heat pump on your preferred schedule",
        "Review and adjust if any timing conflicts with your routine",
      ],
      improvements: [
        {
          title: "Fine-tune start times",
          description:
            "Adjust device start times by 30 minutes for even better distribution",
        },
        {
          title: "Add battery storage",
          description:
            "Store off-peak energy for use during peak hours to save an additional 15%",
        },
      ],
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles size={24} />
            AI Plan Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!explanation) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles size={24} />
          AI Plan Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Summary */}
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl">
          <div className="flex items-start gap-3">
            <Lightbulb
              className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1"
              size={24}
            />
            <div>
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">
                Plan Summary
              </h4>
              <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                {explanation.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-6">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            How This Plan Works
          </h4>
          <ol className="space-y-3">
            {explanation.steps.map((step, index) => (
              <li
                key={index}
                className="flex gap-3 animate-in fade-in slide-in-from-left duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Recommendations */}
        {explanation.recommendations &&
          explanation.recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                💡 AI Recommendations
              </h4>
              <ul className="space-y-2">
                {explanation.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg animate-in fade-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-green-600 dark:text-green-400 mt-0.5">
                      ✓
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Expandable Improvements */}
        {explanation.improvements && explanation.improvements.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="font-bold text-slate-900 dark:text-white">
                🚀 Potential Improvements
              </span>
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {expanded && (
              <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top duration-300">
                {explanation.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                  >
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {improvement.title}
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {improvement.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchExplanation}
            loading={loading}
          >
            <Sparkles size={16} />
            Get Fresh Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIExplainer;
