import React from "react";
import { DollarSign, Leaf, TrendingDown, Zap } from "lucide-react";
import ComparisonCard from "../ui/ComparisonCard";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

const ComparisonCards = ({ beforeData, afterData, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Optimization Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!beforeData || !afterData) {
    return null;
  }

  const comparisons = [
    {
      title: "Daily Cost",
      before: beforeData.dailyCost,
      after: afterData.dailyCost,
      unit: "",
      prefix: "$",
      type: "cost",
      icon: DollarSign,
    },
    {
      title: "Monthly Cost",
      before: beforeData.monthlyCost,
      after: afterData.monthlyCost,
      unit: "",
      prefix: "$",
      type: "cost",
      icon: TrendingDown,
    },
    {
      title: "Annual Savings",
      before: 0,
      after: beforeData.yearlyCost - afterData.yearlyCost,
      unit: "",
      prefix: "$",
      type: "savings",
      icon: Zap,
    },
    {
      title: "CO₂ Reduced",
      before: 0,
      after: (beforeData.yearlyCost - afterData.yearlyCost) * 0.35,
      unit: " kg/year",
      prefix: "",
      type: "carbon",
      icon: Leaf,
    },
  ];

  const totalSavings = beforeData.monthlyCost - afterData.monthlyCost;
  const percentSaved =
    beforeData.monthlyCost > 0
      ? (totalSavings / beforeData.monthlyCost) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Optimization Results</CardTitle>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <TrendingDown
              className="text-green-600 dark:text-green-400"
              size={20}
            />
            <span className="font-bold text-green-700 dark:text-green-400">
              {percentSaved.toFixed(1)}% Savings
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {comparisons.map((comparison, index) => (
            <div
              key={comparison.title}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ComparisonCard {...comparison} />
            </div>
          ))}
        </div>

        {/* Summary Banner */}
        <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                Save ${totalSavings.toFixed(2)}/month
              </h3>
              <p className="text-green-100">
                That's ${(totalSavings * 12).toFixed(0)} saved annually with
                this optimization
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <div className="text-3xl font-bold">
                  {(
                    (beforeData.yearlyCost - afterData.yearlyCost) *
                    0.35
                  ).toFixed(0)}
                </div>
                <div className="text-sm text-green-100">kg CO₂/year</div>
              </div>
              <div className="text-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <div className="text-3xl font-bold">
                  {Math.floor(
                    ((beforeData.yearlyCost - afterData.yearlyCost) * 0.35) /
                      20,
                  )}
                </div>
                <div className="text-sm text-green-100">Trees Equivalent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Click Instruction */}
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          💡 Click on any card to see the detailed comparison
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonCards;
