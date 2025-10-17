import React, { useState } from "react";
import {
  MoreVertical,
  Power,
  Settings,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card } from "../ui/Card";
import Toggle from "../ui/Toggle";
import StatusBadge from "../ui/StatusBadge";
import IconButton from "../ui/IconButton";
import Dropdown from "../ui/Dropdown";
import { getDeviceIcon, getDeviceColor } from "../../lib/deviceIcons";
import {
  formatPower,
  isStandby,
  calculateDailyCost,
} from "../../lib/deviceUtils";
import { useToast } from "../../hooks/useToast";

const DeviceCard = ({ device, onToggle, onConfigure }) => {
  const [isOn, setIsOn] = useState(device.status !== "offline");
  const { success } = useToast();

  const Icon = getDeviceIcon(device.type);
  const colors = getDeviceColor(device.type);
  const standby = isStandby(device);
  const isGenerating = device.powerW < 0;

  const handleToggle = (newState) => {
    setIsOn(newState);
    onToggle?.(device.id, newState);
    success(`${device.name} turned ${newState ? "on" : "off"}`);
  };

  const menuItems = [
    {
      label: "Configure",
      icon: Settings,
      onClick: () => onConfigure?.(device),
    },
    {
      label: "View History",
      icon: TrendingUp,
      onClick: () => success("Opening history..."),
    },
    {
      label: "Schedule",
      icon: Clock,
      onClick: () => success("Opening scheduler..."),
    },
  ];

  return (
    <Card
      hover
      className={`
        group relative overflow-hidden transition-all duration-500
        ${isOn ? "ring-2 ring-green-500/20" : ""}
      `}
    >
      {/* Standby Alert */}
      {standby && (
        <div className="absolute top-0 right-0 m-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertTriangle
              size={12}
              className="text-orange-600 dark:text-orange-400"
            />
            <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
              Standby
            </span>
          </div>
        </div>
      )}

      {/* Background Gradient */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br ${colors.gradient}
          opacity-0 group-hover:opacity-5 transition-opacity duration-500
        `}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div
            className={`
              relative w-16 h-16 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${colors.gradient}
              shadow-lg group-hover:shadow-xl group-hover:scale-110
              transition-all duration-500
            `}
          >
            <Icon className="text-white" size={32} />
            {/* Pulse effect for active devices */}
            {isOn && device.status === "active" && (
              <span className="absolute inset-0 rounded-2xl bg-white animate-ping opacity-20" />
            )}
          </div>

          {/* Menu */}
          <Dropdown
            trigger={
              <IconButton icon={MoreVertical} variant="ghost" size="sm" />
            }
            items={menuItems}
            align="right"
          />
        </div>

        {/* Device Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">
            {device.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {device.brand || "Unknown Brand"}
          </p>
        </div>

        {/* Status */}
        <div className="mb-4">
          <StatusBadge status={device.status} size="sm" />
        </div>

        {/* Power Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span
              className={`
                text-3xl font-bold
                ${isGenerating ? "text-yellow-600 dark:text-yellow-400" : "text-slate-900 dark:text-white"}
              `}
            >
              {isGenerating && "+"}
              {formatPower(Math.abs(device.powerW))}
            </span>
            {isGenerating && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                generating
              </span>
            )}
          </div>

          {/* Cost/Savings Estimate */}
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isGenerating ? (
              <span className="text-green-600 dark:text-green-400">
                Saving ~${calculateDailyCost(Math.abs(device.powerW))}/day
              </span>
            ) : (
              <span>~${calculateDailyCost(device.powerW)}/day</span>
            )}
          </div>
        </div>

        {/* Device-Specific Stats */}
        {device.type === "ev_charger" && device.batteryLevel !== undefined && (
          <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Battery
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {device.batteryLevel}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${device.batteryLevel}%` }}
              />
            </div>
            {device.estimatedTimeToFull && (
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Full in {device.estimatedTimeToFull}
              </div>
            )}
          </div>
        )}

        {device.type === "battery" && device.batteryLevel !== undefined && (
          <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Charge
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {device.batteryLevel}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${device.batteryLevel}%` }}
              />
            </div>
            {device.mode && (
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Mode: {device.mode}
              </div>
            )}
          </div>
        )}

        {device.type === "solar" && device.todayGeneration !== undefined && (
          <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-700 dark:text-yellow-400">
                Today
              </span>
              <span className="text-sm font-bold text-yellow-900 dark:text-yellow-300">
                {device.todayGeneration} kWh
              </span>
            </div>
          </div>
        )}

        {(device.type === "thermostat" || device.type === "heat_pump") &&
          device.temperature !== undefined && (
            <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Current
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {device.temperature}°C
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Target
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {device.targetTemperature}°C
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Control Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Power size={18} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Power
            </span>
          </div>
          <Toggle checked={isOn} onChange={handleToggle} size="default" />
        </div>

        {/* Last Seen */}
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-500 text-center">
          Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
};

export default DeviceCard;
