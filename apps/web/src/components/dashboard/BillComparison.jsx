import React from "react";
import { TrendingDown, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Progress from "../ui/Progress";
import Badge from "../ui/Badge";

const BillComparison = ({ data }) => {
  const {
    yourBill = 0,
    bcAverage = 0,
    canadaAverage = 0,
    savingsVsBC = 0,
    savingsVsCanada = 0,
    percentileBc = 0,
    percentileCanada = 0,
  } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="text-green-600" size={24} />
          Bill Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your Bill Highlight */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Award className="text-green-600" size={32} />
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Your Monthly Bill
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ${yourBill.toFixed(2)}
          </div>
          <Badge variant="success" className="mt-3">
            Better than {100 - percentileBc}% of BC residents
          </Badge>
        </div>

        {/* Comparison Bars */}
        <div className="space-y-6 mb-6">
          {/* vs BC Average */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  vs BC Average
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  ${bcAverage.toFixed(2)}/month
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  -${savingsVsBC.toFixed(2)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {((savingsVsBC / bcAverage) * 100).toFixed(0)}% lower
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center text-white font-semibold"
                  style={{ width: "100%" }}
                >
                  BC Average
                </div>
              </div>
              <div
                className="absolute top-0 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg"
                style={{ width: `${(yourBill / bcAverage) * 100}%` }}
              >
                You
              </div>
            </div>
          </div>

          {/* vs Canada Average */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  vs Canada Average
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  ${canadaAverage.toFixed(2)}/month
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  -${savingsVsCanada.toFixed(2)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {((savingsVsCanada / canadaAverage) * 100).toFixed(0)}% lower
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center text-white font-semibold"
                  style={{ width: "100%" }}
                >
                  Canada Average
                </div>
              </div>
              <div
                className="absolute top-0 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg"
                style={{ width: `${(yourBill / canadaAverage) * 100}%` }}
              >
                You
              </div>
            </div>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center gap-3">
            <Award
              className="text-green-600 dark:text-green-400 flex-shrink-0"
              size={32}
            />
            <div>
              <div className="font-semibold text-green-800 dark:text-green-300">
                Outstanding Performance! 🎉
              </div>
              <div className="text-sm text-green-700 dark:text-green-400">
                You're in the top {percentileBc}% of energy savers in BC
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Projection */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="text-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Projected Annual Savings
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${(savingsVsBC * 12).toFixed(0)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              vs BC average
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillComparison;
