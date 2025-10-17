import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import DeviceCard from "./DeviceCard";
import {
  groupDevicesByType,
  getDeviceTypeNames,
  getDeviceIcon,
  getDeviceColor,
} from "../../lib/deviceUtils";

const DeviceGrouping = ({ devices = [], onToggle, onConfigure }) => {
  const [expandedGroups, setExpandedGroups] = useState(
    new Set(["ev_charger", "battery", "solar"]),
  );

  const grouped = groupDevicesByType(devices);
  const sortedTypes = Object.keys(grouped).sort((a, b) => {
    // Prioritize certain device types
    const priority = { solar: 0, battery: 1, ev_charger: 2 };
    return (priority[a] ?? 999) - (priority[b] ?? 999);
  });

  const toggleGroup = (type) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div className="space-y-6">
      {sortedTypes.map((type) => {
        const deviceList = grouped[type];
        const isExpanded = expandedGroups.has(type);
        const Icon = getDeviceIcon(type);
        const colors = getDeviceColor(type);
        const totalPower = deviceList.reduce(
          (sum, d) => sum + Math.abs(d.powerW || 0),
          0,
        );
        const activeCount = deviceList.filter(
          (d) =>
            d.status === "active" ||
            d.status === "charging" ||
            d.status === "generating",
        ).length;

        return (
          <div
            key={type}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(type)}
              className={`
                w-full p-4 rounded-2xl border-2 transition-all duration-300
                hover:shadow-lg group
                ${
                  isExpanded
                    ? `${colors.border} ${colors.bg}`
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    bg-gradient-to-br ${colors.gradient}
                    shadow-md group-hover:shadow-lg group-hover:scale-110
                    transition-all duration-300
                  `}
                  >
                    <Icon className="text-white" size={24} />
                  </div>

                  {/* Info */}
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {getDeviceTypeNames(type)}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span>
                        {deviceList.length} device
                        {deviceList.length !== 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span
                        className={
                          activeCount > 0
                            ? "text-green-600 dark:text-green-400 font-semibold"
                            : ""
                        }
                      >
                        {activeCount} active
                      </span>
                      {totalPower > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-semibold">
                            {(totalPower / 1000).toFixed(2)} kW
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chevron */}
                <div
                  className={`
                  transition-transform duration-300
                  ${isExpanded ? "rotate-0" : "-rotate-90"}
                `}
                >
                  <ChevronDown
                    size={24}
                    className="text-slate-600 dark:text-slate-400"
                  />
                </div>
              </div>
            </button>

            {/* Device Cards */}
            {isExpanded && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-4">
                {deviceList.map((device, index) => (
                  <div
                    key={device.id}
                    className="animate-in fade-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DeviceCard
                      device={device}
                      onToggle={onToggle}
                      onConfigure={onConfigure}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DeviceGrouping;
