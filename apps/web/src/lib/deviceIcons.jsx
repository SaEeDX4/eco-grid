import React from "react";
import {
  Zap,
  Battery,
  Sun,
  Wind,
  Thermometer,
  Droplet,
  Lightbulb,
  Plug,
  Wifi,
  Radio,
} from "lucide-react";

export const deviceIcons = {
  ev_charger: Zap,
  battery: Battery,
  solar: Sun,
  wind: Wind,
  heat_pump: Thermometer,
  thermostat: Thermometer,
  smart_plug: Plug,
  water_heater: Droplet,
  appliance: Lightbulb,
  hub: Wifi,
  sensor: Radio,
  default: Plug,
};

export const getDeviceIcon = (type) => {
  return deviceIcons[type] || deviceIcons.default;
};

export const deviceColors = {
  ev_charger: {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  battery: {
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  solar: {
    gradient: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  heat_pump: {
    gradient: "from-red-500 to-pink-500",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  thermostat: {
    gradient: "from-purple-500 to-indigo-500",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  smart_plug: {
    gradient: "from-slate-500 to-slate-600",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
  },
  water_heater: {
    gradient: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
  },
  default: {
    gradient: "from-slate-500 to-slate-600",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
  },
};

export const getDeviceColor = (type) => {
  return deviceColors[type] || deviceColors.default;
};
