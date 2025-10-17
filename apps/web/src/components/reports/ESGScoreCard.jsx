import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import CircularProgress from "../ui/CircularProgress";
import { Leaf, Users, Shield, Award } from "lucide-react";

const ESGScoreCard = ({ esgData, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ESG Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const categories = [
    {
      label: "Environmental",
      score: esgData.environmental,
      icon: Leaf,
      color: "#10b981",
      description: "Carbon footprint, renewable energy, efficiency",
    },
    {
      label: "Social",
      score: esgData.social,
      icon: Users,
      color: "#3b82f6",
      description: "Community impact, accessibility, education",
    },
    {
      label: "Governance",
      score: esgData.governance,
      icon: Shield,
      color: "#8b5cf6",
      description: "Transparency, compliance, data security",
    },
  ];

  const overallScore = Math.round(
    (esgData.environmental + esgData.social + esgData.governance) / 3,
  );

  const getRating = (score) => {
    if (score >= 90)
      return {
        label: "Excellent",
        color: "text-green-600 dark:text-green-400",
      };
    if (score >= 75)
      return { label: "Good", color: "text-blue-600 dark:text-blue-400" };
    if (score >= 60)
      return { label: "Fair", color: "text-yellow-600 dark:text-yellow-400" };
    return {
      label: "Needs Improvement",
      color: "text-orange-600 dark:text-orange-400",
    };
  };

  const rating = getRating(overallScore);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="text-purple-600" size={24} />
            ESG Performance Score
          </CardTitle>
          <div
            className={`px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 ${rating.color} font-bold`}
          >
            {rating.label}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="flex justify-center mb-8 animate-in fade-in zoom-in duration-1000">
          <CircularProgress
            value={overallScore}
            max={100}
            size={200}
            strokeWidth={16}
            color="#8b5cf6"
            showValue={true}
            label="Overall ESG"
            animate={true}
          />
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {categories.map((category, index) => (
            <div
              key={category.label}
              className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon & Score */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: category.color }}
                >
                  <category.icon className="text-white" size={24} />
                </div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: category.color }}
                >
                  {category.score}
                </div>
              </div>

              {/* Label */}
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                {category.label}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {category.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${category.score}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Improvement Tips */}
        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span>💡</span>
            How to Improve Your ESG Score
          </h4>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">
                ✓
              </span>
              <span>
                Increase renewable energy usage by 10% to boost Environmental
                score
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>
                Share energy-saving tips with neighbors to improve Social impact
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-0.5">
                ✓
              </span>
              <span>
                Enable two-factor authentication for better Governance rating
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESGScoreCard;
