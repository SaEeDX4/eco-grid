import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import {
  formatHour,
  getHourColor,
  getHourClass,
} from "../../lib/scheduleUtils";
import { getDeviceIcon, getDeviceColor } from "../../lib/deviceIcons";

const OptimizationTimeline = ({
  schedule = [],
  title = "Optimization Timeline",
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Group schedule items by hour for display
  const scheduleByHour = hours.map((hour) => {
    const devices = schedule.filter(
      (item) => hour >= item.startHour && hour < item.endHour,
    );
    return { hour, devices };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-purple-600" size={24} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Time Period Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Off-Peak (12 AM - 7 AM, 9 PM - 12 AM)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Mid-Peak (7 AM - 4 PM, 9 PM)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Peak (4 PM - 9 PM)
            </span>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hour Labels */}
            <div className="flex mb-2">
              {hours.map((hour) => {
                const colors = getHourColor(hour);
                return (
                  <div key={hour} className="flex-1 text-center">
                    <div
                      className={`
                      text-xs font-semibold py-1 rounded-t-lg
                      ${colors.bg} ${colors.text}
                    `}
                    >
                      {formatHour(hour).split(" ")[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Device Rows */}
            <div className="space-y-2">
              {schedule.map((item, index) => {
                const Icon = getDeviceIcon(item.deviceType || "default");
                const colors = getDeviceColor(item.deviceType || "default");

                return (
                  <div
                    key={`${item.deviceId}-${index}`}
                    className="relative h-16 animate-in fade-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Device Label */}
                    <div className="absolute left-0 top-0 bottom-0 w-40 flex items-center gap-2 pr-4">
                      <div
                        className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        bg-gradient-to-br ${colors.gradient} shadow-md
                      `}
                      >
                        <Icon className="text-white" size={20} />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {item.deviceName}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="ml-40 flex h-full">
                      {hours.map((hour) => {
                        const isActive =
                          hour >= item.startHour && hour < item.endHour;
                        const hourColors = getHourColor(hour);

                        return (
                          <div
                            key={hour}
                            className={`
                              flex-1 border-r border-slate-200 dark:border-slate-700
                              transition-all duration-300
                              ${isActive ? hourColors.bg : "bg-slate-50 dark:bg-slate-900"}
                            `}
                          >
                            {isActive && (
                              <div
                                className={`
                                h-full flex items-center justify-center
                                bg-gradient-to-br ${colors.gradient} opacity-80
                                hover:opacity-100 transition-opacity
                                group relative
                              `}
                              >
                                {/* Power Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity pointer-events-none">
                                  {(item.powerW / 1000).toFixed(2)} kW
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {schedule.length === 0 && (
              <div className="text-center py-12 text-slate-500 dark:text-slate-500">
                No devices scheduled. Select an optimization mode to see the
                timeline.
              </div>
            )}
          </div>
        </div>

        {/* Total Power by Hour */}
        {schedule.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Total Power Consumption by Hour
            </h4>
            <div className="flex items-end gap-1 h-24">
              {hours.map((hour) => {
                const hourDevices = schedule.filter(
                  (item) => hour >= item.startHour && hour < item.endHour,
                );
                const totalPowerKW =
                  hourDevices.reduce((sum, d) => sum + (d.powerW || 0), 0) /
                  1000;
                const maxPower = 10; // kW
                const heightPercent = Math.min(
                  (totalPowerKW / maxPower) * 100,
                  100,
                );
                const hourColors = getHourColor(hour);

                return (
                  <div
                    key={hour}
                    className="flex-1 flex flex-col items-center group relative"
                  >
                    <div
                      className={`
                        w-full rounded-t transition-all duration-500
                        ${totalPowerKW > 0 ? hourColors.bg : "bg-slate-100 dark:bg-slate-800"}
                        hover:opacity-80
                      `}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity pointer-events-none">
                        {totalPowerKW.toFixed(2)} kW
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationTimeline;
