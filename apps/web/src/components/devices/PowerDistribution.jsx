import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { getDeviceTypeName, groupDevicesByType } from "../../lib/deviceUtils";

const PowerDistribution = ({ devices = [] }) => {
  // Group devices by type and calculate total power
  const grouped = groupDevicesByType(devices);

  const data = Object.entries(grouped)
    .map(([type, deviceList]) => {
      const totalPower = deviceList.reduce(
        (sum, d) => sum + Math.abs(d.powerW || 0),
        0,
      );
      return {
        name: getDeviceTypeName(type),
        value: totalPower,
        count: deviceList.length,
      };
    })
    .filter((item) => item.value > 0);

  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
    "#6366f1", // indigo
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-slate-900 dark:text-white mb-2">
            {payload[0].name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Power:{" "}
            <span className="font-bold">
              {(payload[0].value / 1000).toFixed(2)} kW
            </span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Devices:{" "}
            <span className="font-bold">{payload[0].payload.count}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Share:{" "}
            <span className="font-bold">
              {(
                (payload[0].value / data.reduce((sum, d) => sum + d.value, 0)) *
                100
              ).toFixed(1)}
              %
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Power Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500 dark:text-slate-500">
            No active devices
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Power Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                animationBegin={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry) => (
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {value} ({entry.payload.count})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {devices.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Devices
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {
                devices.filter(
                  (d) => d.status === "active" || d.status === "charging",
                ).length
              }
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Active Now
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {(data.reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total kW
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerDistribution;
