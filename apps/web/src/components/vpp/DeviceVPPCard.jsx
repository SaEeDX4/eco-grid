import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatKW, formatCAD, formatPercent } from "../../lib/vppHelpers";
import { getDeviceVPPCapacity } from "../../lib/vppHelpers";

const DeviceVPPCard = ({ device, vppStatus, onToggle, onSettings }) => {
  const capacity = getDeviceVPPCapacity(device);
  const isEnabled = vppStatus?.vppEnabled || false;
  const enrolledPools =
    vppStatus?.enrolledPools?.filter((p) => p.status === "active") || [];

  const getDeviceIcon = (type) => {
    const icons = {
      battery: "Battery",
      "ev-charger": "Car",
      thermostat: "Thermometer",
      "water-heater": "Droplets",
      "pool-pump": "Waves",
    };
    return Icons[icons[type]] || Icons.Zap;
  };

  const DeviceIcon = getDeviceIcon(device.type);

  return (
    <motion.div
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Device Icon */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              isEnabled
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-slate-400 to-slate-600"
            }`}
          >
            <DeviceIcon className="text-white" size={28} />
          </div>

          {/* Device Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {device.name}
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
              {device.type.replace("-", " ")}
            </div>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => onToggle(device._id, !isEnabled)}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            isEnabled ? "bg-green-500" : "bg-slate-300 dark:bg-slate-700"
          }`}
        >
          <motion.div
            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
            animate={{ left: isEnabled ? "28px" : "4px" }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Capacity */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 mb-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          VPP Capacity
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {formatKW(capacity)}
        </div>
      </div>

      {/* Enrolled Pools */}
      {enrolledPools.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Enrolled Pools
          </div>
          <div className="space-y-2">
            {enrolledPools.map((enrollment) => (
              <div
                key={enrollment.poolId._id}
                className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20"
              >
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {enrollment.poolId.name}
                </span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {formatKW(enrollment.contributionKW)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance */}
      {isEnabled && vppStatus?.performance && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Dispatches
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {vppStatus.performance.dispatches30d || 0}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Revenue
            </div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">
              {formatCAD(vppStatus.performance.revenue30d || 0)}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Reliability
            </div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {formatPercent(vppStatus.performance.reliability || 100)}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <button
        onClick={() => onSettings(device._id)}
        className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
      >
        <Icons.Settings size={16} />
        VPP Settings
      </button>
    </motion.div>
  );
};

export default DeviceVPPCard;
