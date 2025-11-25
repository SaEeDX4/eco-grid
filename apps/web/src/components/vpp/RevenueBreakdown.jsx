import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatCAD, formatPercent } from "../../lib/vppHelpers";

const RevenueBreakdown = ({ revenue }) => {
  if (!revenue) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No revenue data available
      </div>
    );
  }

  const breakdown = [
    {
      label: "Energy Revenue",
      amount: revenue.breakdown?.energyRevenue || 0,
      icon: "Zap",
      color: "from-yellow-500 to-orange-600",
      description: "Wholesale energy sales",
    },
    {
      label: "Capacity Revenue",
      amount: revenue.breakdown?.capacityRevenue || 0,
      icon: "Battery",
      color: "from-blue-500 to-cyan-600",
      description: "Grid reliability payments",
    },
    {
      label: "Ancillary Services",
      amount: revenue.breakdown?.ancillaryRevenue || 0,
      icon: "Activity",
      color: "from-green-500 to-emerald-600",
      description: "Frequency regulation & reserves",
    },
    {
      label: "Performance Bonus",
      amount: revenue.breakdown?.performanceBonus || 0,
      icon: "Award",
      color: "from-purple-500 to-pink-600",
      description: "High reliability incentives",
    },
  ];

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      {breakdown.map((item, index) => {
        const Icon = Icons[item.icon];
        const percentage = total > 0 ? (item.amount / total) * 100 : 0;

        return (
          <motion.div
            key={item.label}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}
              >
                <Icon className="text-white" size={24} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </h4>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCAD(item.amount)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {item.description}
                </p>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-12 text-right">
                    {formatPercent(percentage)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Total */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-2 border-slate-300 dark:border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Total Gross Revenue
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCAD(total)}
          </span>
        </div>
      </div>

      {/* Fees */}
      {(revenue.platformFee > 0 || revenue.operatorFee > 0) && (
        <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Platform Fee
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              -{formatCAD(revenue.platformFee)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Operator Fee
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              -{formatCAD(revenue.operatorFee)}
            </span>
          </div>
          <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-900 dark:text-white">Net Revenue</span>
            <span className="text-green-600 dark:text-green-400">
              {formatCAD(revenue.netRevenue)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueBreakdown;
