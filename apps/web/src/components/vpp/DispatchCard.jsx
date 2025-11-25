import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  formatKW,
  formatKWh,
  formatDispatchDuration,
  formatTimeRemaining,
  getDispatchStatusColor,
  getDispatchStatusLabel,
} from "../../lib/vppHelpers";

const DispatchCard = ({ dispatch, showActions = false, onCancel }) => {
  const startTime = new Date(dispatch.startTime);
  const endTime = new Date(dispatch.endTime);
  const now = new Date();

  const isUpcoming = startTime > now;
  const isActive = startTime <= now && endTime > now;
  const isCompleted = dispatch.status === "completed";

  const getActionIcon = () => {
    if (dispatch.requestedKW > 0) return "BatteryCharging";
    if (dispatch.requestedKW < 0) return "Battery";
    return "Minus";
  };

  const ActionIcon = Icons[getActionIcon()];

  return (
    <motion.div
      className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            isActive
              ? "bg-gradient-to-br from-green-500 to-emerald-600 animate-pulse"
              : isUpcoming
                ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                : "bg-gradient-to-br from-slate-400 to-slate-600"
          }`}
        >
          <ActionIcon className="text-white" size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                {dispatch.poolId?.name || "VPP Dispatch"}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {dispatch.deviceId?.name || "Device"}
              </div>
            </div>

            <span
              className={`px-2 py-1 rounded-md text-xs font-bold ${getDispatchStatusColor(dispatch.status)}`}
            >
              {getDispatchStatusLabel(dispatch.status)}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
            <Icons.Clock size={14} />
            <span>
              {startTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
              {" - "}
              {endTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span>
              {formatDispatchDuration(dispatch.startTime, dispatch.endTime)}
            </span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Requested
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {formatKW(Math.abs(dispatch.requestedKW))}
              </div>
            </div>

            {isCompleted && (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Delivered
                </div>
                <div className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatKW(Math.abs(dispatch.actualKW || 0))}
                </div>
              </div>
            )}
          </div>

          {/* Performance */}
          {isCompleted && dispatch.performance?.reliability && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
              <Icons.CheckCircle
                size={14}
                className="text-green-600 dark:text-green-400"
              />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                {dispatch.performance.reliability.toFixed(1)}% reliability
              </span>
            </div>
          )}

          {/* Time Remaining */}
          {isUpcoming && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Icons.Timer
                size={14}
                className="text-blue-600 dark:text-blue-400"
              />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Starts in {formatTimeRemaining(dispatch.startTime)}
              </span>
            </div>
          )}

          {/* Active Indicator */}
          {isActive && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                Dispatch in progress
              </span>
            </div>
          )}

          {/* Revenue */}
          {isCompleted && dispatch.revenue?.net > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Revenue Earned
              </span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                +${dispatch.revenue.net.toFixed(2)}
              </span>
            </div>
          )}

          {/* Actions */}
          {showActions && isUpcoming && onCancel && (
            <button
              onClick={() => onCancel(dispatch._id)}
              className="mt-3 w-full py-2 rounded-lg bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors"
            >
              Cancel Dispatch
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DispatchCard;
