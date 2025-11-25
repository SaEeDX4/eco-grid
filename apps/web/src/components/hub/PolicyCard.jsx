import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  getAllocationMethodLabel,
  getStatusBadgeColor,
} from "../../lib/hubHelpers";

const PolicyCard = ({ policy, isActive, onApply, onEdit, onSimulate }) => {
  const getPolicyTypeInfo = (type) => {
    const info = {
      standard: {
        icon: "Settings",
        gradient: "from-blue-500 to-cyan-600",
        label: "Standard",
      },
      "peak-management": {
        icon: "TrendingUp",
        gradient: "from-orange-500 to-red-600",
        label: "Peak Management",
      },
      "cost-optimization": {
        icon: "DollarSign",
        gradient: "from-green-500 to-emerald-600",
        label: "Cost Optimization",
      },
      "vpp-coordination": {
        icon: "Zap",
        gradient: "from-purple-500 to-pink-600",
        label: "VPP Coordination",
      },
      custom: {
        icon: "Sliders",
        gradient: "from-slate-500 to-slate-600",
        label: "Custom",
      },
    };
    return info[type] || info.standard;
  };

  const typeInfo = getPolicyTypeInfo(policy.type);
  const Icon = Icons[typeInfo.icon];

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 ${
        isActive
          ? "border-blue-500 dark:border-blue-500"
          : "border-slate-200 dark:border-slate-800"
      } hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Active Badge */}
      {isActive && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1">
            <Icons.CheckCircle size={12} />
            ACTIVE
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeInfo.gradient} flex items-center justify-center shadow-md`}
          >
            <Icon className="text-white" size={28} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {policy.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {typeInfo.label}
            </p>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(policy.status)}`}
          >
            {policy.status?.toUpperCase()}
          </span>
        </div>

        {policy.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            {policy.description}
          </p>
        )}
      </div>

      {/* Policy Details */}
      <div className="p-6 space-y-4">
        {/* Allocation Method */}
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Allocation Method
          </div>
          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white">
            {getAllocationMethodLabel(policy.allocationRule?.type)}
          </div>
        </div>

        {/* Enforcement */}
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Enforcement
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                policy.enforcementRule?.type === "hard-cap"
                  ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                  : policy.enforcementRule?.type === "soft-cap"
                    ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400"
                    : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
              }`}
            >
              {policy.enforcementRule?.type
                ?.split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              @ {policy.enforcementRule?.threshold}%
            </div>
          </div>
        </div>

        {/* Overage Policy */}
        {policy.overagePolicy?.allowed && (
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Overage Allowed
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              Up to{" "}
              <span className="font-bold">
                {policy.overagePolicy.maxOveragePercent}%
              </span>{" "}
              for{" "}
              <span className="font-bold">
                {policy.overagePolicy.maxOverageDurationMinutes} minutes
              </span>{" "}
              @{" "}
              <span className="font-bold">
                {policy.overagePolicy.overageRateMultiplier}x
              </span>{" "}
              rate
            </div>
          </div>
        )}

        {/* Rebalancing */}
        {policy.rebalanceRule?.enabled && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
              <Icons.RefreshCw size={14} />
              <span className="font-semibold">Auto-rebalancing enabled</span>
            </div>
          </div>
        )}

        {/* VPP Coordination */}
        {policy.vppCoordination?.enabled && (
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-sm text-purple-900 dark:text-purple-100">
              <Icons.Zap size={14} />
              <span className="font-semibold">VPP coordination active</span>
            </div>
          </div>
        )}
      </div>

      {/* Performance */}
      {policy.performance && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Tenants
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {policy.performance.tenantsAffected || 0}
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Violations
              </div>
              <div
                className={`text-lg font-bold ${
                  policy.performance.violationsCount > 10
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {policy.performance.violationsCount || 0}
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Compliance
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {(policy.performance.avgCompliancePercent || 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 pt-0 flex gap-3">
        {!isActive && policy.status === "draft" && (
          <button
            onClick={() => onEdit?.(policy)}
            className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Edit size={16} />
            Edit
          </button>
        )}

        {!isActive && policy.status !== "archived" && (
          <button
            onClick={() => onApply?.(policy)}
            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Icons.CheckCircle size={16} />
            Apply Policy
          </button>
        )}

        {policy.status !== "archived" && (
          <button
            onClick={() => onSimulate?.(policy)}
            className="flex-1 py-3 rounded-xl bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-200 dark:hover:bg-purple-950/50 transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Play size={16} />
            Simulate
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PolicyCard;
