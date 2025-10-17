import React, { useState } from "react";
import { Sparkles, Lightbulb, AlertCircle, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Badge from "../ui/Badge";

const DeviceAdvisor = ({ devices = [] }) => {
  const [expandedTip, setExpandedTip] = useState(null);

  // Generate AI tips based on device data
  const generateTips = () => {
    const tips = [];

    // Check for standby devices
    const standbyDevices = devices.filter(
      (d) => d.status === "standby" && d.powerW > 0 && d.powerW < 50,
    );
    if (standbyDevices.length > 0) {
      tips.push({
        id: "standby",
        type: "warning",
        icon: AlertCircle,
        title: "Standby Power Detected",
        description: `${standbyDevices.length} device${standbyDevices.length > 1 ? "s are" : " is"} consuming standby power`,
        details: `Devices like ${standbyDevices.map((d) => d.name).join(", ")} are using power while idle. Consider using smart plugs to completely cut power when not in use.`,
        devices: standbyDevices.map((d) => d.name),
        savings: `Save ~$${((standbyDevices.reduce((sum, d) => sum + d.powerW, 0) * 24 * 30 * 0.12) / 1000).toFixed(2)}/month`,
      });
    }

    // EV Charging optimization
    const evChargers = devices.filter(
      (d) => d.type === "ev_charger" && d.status === "charging",
    );
    if (evChargers.length > 0) {
      const currentHour = new Date().getHours();
      if (currentHour >= 9 && currentHour <= 21) {
        tips.push({
          id: "ev-timing",
          type: "info",
          icon: Lightbulb,
          title: "EV Charging Optimization",
          description: "Charge your EV during off-peak hours for better rates",
          details:
            "Schedule charging between 12 AM - 6 AM to save up to 35% on electricity costs. Your current charging session could be delayed without impacting your morning commute.",
          savings: "Save ~$45/month",
        });
      }
    }

    // Heat pump efficiency
    const heatPumps = devices.filter(
      (d) => d.type === "heat_pump" && d.status === "active",
    );
    if (heatPumps.length > 0) {
      heatPumps.forEach((hp) => {
        if (
          hp.temperature &&
          hp.targetTemperature &&
          Math.abs(hp.temperature - hp.targetTemperature) > 3
        ) {
          tips.push({
            id: `hp-${hp.id}`,
            type: "optimization",
            icon: TrendingDown,
            title: "Heat Pump Efficiency",
            description: `${hp.name} is working hard to reach target temperature`,
            details:
              "Large temperature differences reduce efficiency. Consider lowering the target by 1-2°C to reduce energy consumption by 5-10% while maintaining comfort.",
            savings: "Save ~$30/month",
          });
        }
      });
    }

    // Multiple heavy loads
    const heavyLoads = devices.filter(
      (d) =>
        d.powerW > 3000 && (d.status === "active" || d.status === "charging"),
    );
    if (heavyLoads.length > 1) {
      tips.push({
        id: "heavy-loads",
        type: "warning",
        icon: AlertCircle,
        title: "Multiple Heavy Loads Running",
        description: `${heavyLoads.length} high-power devices are active simultaneously`,
        details: `Running ${heavyLoads.map((d) => d.name).join(", ")} together increases peak demand charges. Consider staggering usage to reduce costs.`,
        devices: heavyLoads.map((d) => d.name),
        savings: "Save ~$25/month on demand charges",
      });
    }

    // Solar generation not being used
    const solar = devices.find(
      (d) => d.type === "solar" && d.status === "generating",
    );
    const battery = devices.find((d) => d.type === "battery");
    if (solar && solar.powerW < -1000 && battery && battery.batteryLevel < 80) {
      tips.push({
        id: "solar-battery",
        type: "optimization",
        icon: Lightbulb,
        title: "Solar Energy Available",
        description: "Excess solar energy could charge your battery",
        details:
          "Your solar panels are generating more power than you're using. Consider charging your home battery now to store this free energy for later use.",
        savings: "Maximize self-consumption",
      });
    }

    // Default tip if no issues found
    if (tips.length === 0) {
      tips.push({
        id: "all-good",
        type: "success",
        icon: Sparkles,
        title: "Everything Looks Great!",
        description: "Your devices are operating efficiently",
        details:
          "All devices are running optimally. Keep up the good energy management! Check back regularly for personalized tips.",
        savings: "Currently optimized",
      });
    }

    return tips;
  };

  const tips = generateTips();

  const typeConfig = {
    warning: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-700 dark:text-orange-400",
      badge: "warning",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-400",
      badge: "default",
    },
    optimization: {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-400",
      badge: "default",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-400",
      badge: "success",
    },
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles size={24} />
          AI Device Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {tips.map((tip) => {
            const config = typeConfig[tip.type];
            const isExpanded = expandedTip === tip.id;

            return (
              <div
                key={tip.id}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300
                  ${config.bg} ${config.border}
                  ${isExpanded ? "shadow-lg" : "hover:shadow-md"}
                `}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    bg-white dark:bg-slate-800 shadow-sm
                  `}
                  >
                    <tip.icon size={20} className={config.text} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {tip.title}
                      </h4>
                      <Badge variant={config.badge} className="text-xs">
                        {tip.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {tip.description}
                    </p>
                  </div>
                </div>

                {/* Expandable Details */}
                <button
                  onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                  className={`
                    w-full text-left text-sm mt-2 transition-all duration-300
                    ${config.text} hover:underline font-medium
                  `}
                >
                  {isExpanded ? "Show less" : "Learn more →"}
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-current/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                      {tip.details}
                    </p>

                    {tip.devices && tip.devices.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                          Affected Devices:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tip.devices.map((device, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
                            >
                              {device}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                      bg-white dark:bg-slate-800 ${config.text} font-semibold text-sm
                    `}
                    >
                      💰 {tip.savings}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {tips.length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Active Tips
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {
                  tips.filter(
                    (t) => t.type === "optimization" || t.type === "info",
                  ).length
                }
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Opportunities
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {tips.filter((t) => t.type === "warning").length}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Alerts
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceAdvisor;
