import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  formatKW,
  formatPercent,
  getStatusBadgeColor,
  getWarningLevelBadge,
  getPriorityTierInfo,
  getBusinessTypeIcon,
  formatSquareFootage,
} from "../../lib/hubHelpers";

const TenantCard = ({ tenant, onClick }) => {
  const navigate = useNavigate();

  const priorityInfo = getPriorityTierInfo(tenant.priorityTier);
  const BusinessIcon = Icons[getBusinessTypeIcon(tenant.businessType)];

  const currentUsage = tenant.usage?.current?.currentKW || 0;
  const allocatedKW = tenant.capacity?.allocatedKW || 0;
  const utilizationPercent =
    allocatedKW > 0 ? (currentUsage / allocatedKW) * 100 : 0;

  const handleClick = () => {
    if (onClick) {
      onClick(tenant);
    } else {
      navigate(`/hub/tenants/${tenant._id}`);
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Business Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
              <BusinessIcon
                className="text-slate-600 dark:text-slate-400"
                size={24}
              />
            </div>

            {/* Name & Type */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {tenant.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                {tenant.businessType?.replace("-", " ")}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(tenant.status)}`}
          >
            {tenant.status?.toUpperCase()}
          </span>
        </div>

        {/* Priority & Location */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`px-2 py-1 rounded-md ${priorityInfo.bg} ${priorityInfo.color} font-semibold`}
          >
            {priorityInfo.label}
          </span>

          {tenant.location?.squareFootage && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400">
                {formatSquareFootage(tenant.location.squareFootage)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Capacity Usage */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Capacity Usage
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {formatKW(currentUsage)} / {formatKW(allocatedKW)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              utilizationPercent >= 95
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : utilizationPercent >= 85
                  ? "bg-gradient-to-r from-orange-500 to-orange-600"
                  : utilizationPercent >= 70
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {formatPercent(utilizationPercent)} utilized
          </span>

          {utilizationPercent >= 85 && (
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Icons.AlertTriangle size={12} />
              High Usage
            </span>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Peak Demand
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {formatKW(tenant.usage?.current?.peakKW || 0)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Reliability
          </div>
          <div className="text-sm font-bold text-green-600 dark:text-green-400">
            {formatPercent(tenant.performance?.reliabilityScore || 100, 0)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Violations
          </div>
          <div
            className={`text-sm font-bold ${
              tenant.compliance?.violations > 5
                ? "text-red-600 dark:text-red-400"
                : tenant.compliance?.violations > 0
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-green-600 dark:text-green-400"
            }`}
          >
            {tenant.compliance?.violations || 0}
          </div>
        </div>
      </div>

      {/* Warning Level */}
      {tenant.compliance?.warningLevel &&
        tenant.compliance.warningLevel !== "none" && (
          <div className="px-6 pb-6">
            <div
              className={`p-3 rounded-xl ${getWarningLevelBadge(tenant.compliance.warningLevel)} flex items-center gap-2`}
            >
              <Icons.AlertCircle size={16} />
              <span className="text-sm font-semibold capitalize">
                {tenant.compliance.warningLevel} Warning Level
              </span>
            </div>
          </div>
        )}

      {/* VPP Opt-in Badge */}
      {tenant.preferences?.allowVPPParticipation && (
        <div className="absolute top-4 right-4">
          <div className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1">
            <Icons.Zap size={12} />
            VPP
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TenantCard;
