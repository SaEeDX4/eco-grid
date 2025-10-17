import React from "react";
import { Zap, Battery, Sun, Thermometer, Power, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useToast } from "../../hooks/useToast";

const QuickActions = ({ devices = [] }) => {
  const { success } = useToast();

  const actions = [
    {
      icon: Zap,
      label: "Charge EV",
      color: "from-blue-500 to-cyan-500",
      action: () => success("EV charging scheduled for off-peak hours"),
    },
    {
      icon: Battery,
      label: "Optimize Battery",
      color: "from-green-500 to-emerald-500",
      action: () => success("Battery optimization started"),
    },
    {
      icon: Sun,
      label: "Solar Status",
      color: "from-yellow-500 to-orange-500",
      action: () => success("Solar panel performance: Excellent"),
    },
    {
      icon: Thermometer,
      label: "Adjust Climate",
      color: "from-red-500 to-pink-500",
      action: () => success("Climate settings adjusted"),
    },
    {
      icon: Power,
      label: "All Devices",
      color: "from-purple-500 to-indigo-500",
      action: () => success("Opening device control panel"),
    },
    {
      icon: Settings,
      label: "Auto Mode",
      color: "from-slate-500 to-slate-600",
      action: () => success("AI auto-optimization enabled"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20 transition-opacity`}
              />

              {/* Icon */}
              <div
                className={`
                relative mx-auto w-14 h-14 rounded-xl flex items-center justify-center mb-3
                bg-gradient-to-br ${action.color}
                shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300
              `}
              >
                <action.icon className="text-white" size={24} />
              </div>

              {/* Label */}
              <div className="relative text-sm font-semibold text-slate-900 dark:text-white">
                {action.label}
              </div>

              {/* Hover Effect */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-current transition-colors"
                style={{ color: "currentColor" }}
              />
            </button>
          ))}
        </div>

        {/* Device Status Summary */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Active Devices
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {
                devices.filter(
                  (d) => d.status === "active" || d.status === "charging",
                ).length
              }{" "}
              / {devices.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
