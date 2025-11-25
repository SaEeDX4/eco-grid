import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatCAD, formatKWh } from "../../lib/vppHelpers";

const RevenueHistory = ({ history }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Icons.Receipt className="text-slate-400" size={32} />
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          No revenue history available
        </p>
      </div>
    );
  }

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {history.map((record, index) => {
        const isExpanded = expandedId === record._id;
        const periodDate = new Date(record.period.start);
        const monthYear = periodDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        return (
          <motion.div
            key={record._id}
            className="rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {/* Header */}
            <button
              onClick={() => toggleExpanded(record._id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Pool Icon */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Icons.Layers className="text-white" size={20} />
                </div>

                {/* Info */}
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {record.poolId?.name || "Unknown Pool"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {monthYear} • {record.dispatches?.count || 0} dispatches
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Revenue */}
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCAD(record.netRevenue)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    net revenue
                  </div>
                </div>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icons.ChevronDown className="text-slate-400" size={20} />
                </motion.div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-slate-200 dark:border-slate-800"
              >
                <div className="p-4 space-y-4">
                  {/* Revenue Breakdown */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                      Revenue Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Gross Revenue
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCAD(record.grossRevenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Platform Fee
                        </span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          -{formatCAD(record.platformFee)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Operator Fee
                        </span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          -{formatCAD(record.operatorFee)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Net Revenue
                        </span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {formatCAD(record.netRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Energy
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatKWh(record.dispatches?.totalKWh || 0)}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Utilization
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {record.availability?.utilizationPercent?.toFixed(1) ||
                          0}
                        %
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Reliability
                      </div>
                      <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        {record.performance?.reliability?.toFixed(1) || 100}%
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Payment Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.status === "paid"
                          ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                          : record.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400"
                            : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {record.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default RevenueHistory;
