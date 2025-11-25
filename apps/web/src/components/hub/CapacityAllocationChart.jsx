import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { formatKW, formatPercent } from "../../lib/hubHelpers";

const CapacityAllocationChart = ({ hub, tenants }) => {
  if (!hub || !tenants || tenants.length === 0) return null;

  // Prepare data for pie chart
  const data = tenants.map((tenant) => ({
    name: tenant.name,
    value: tenant.capacity?.allocatedKW || 0,
    percentage:
      ((tenant.capacity?.allocatedKW || 0) / hub.capacity.totalKW) * 100,
  }));

  // Add available capacity
  if (hub.capacity.availableKW > 0) {
    data.push({
      name: "Available",
      value: hub.capacity.availableKW,
      percentage: (hub.capacity.availableKW / hub.capacity.totalKW) * 100,
    });
  }

  // Add reserved capacity
  if (hub.capacity.reservedKW > 0) {
    data.push({
      name: "Reserved (VPP)",
      value: hub.capacity.reservedKW,
      percentage: (hub.capacity.reservedKW / hub.capacity.totalKW) * 100,
    });
  }

  // Sort by value descending
  data.sort((a, b) => b.value - a.value);

  // Generate colors
  const COLORS = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#f97316", // orange
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#a855f7", // violet
    "#cbd5e1", // available (slate)
    "#fb923c", // reserved (orange)
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xl">
          <p className="font-bold text-slate-900 dark:text-white mb-2">
            {data.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Capacity:</span>{" "}
            {formatKW(data.value)}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Share:</span>{" "}
            {formatPercent(data.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-3 mt-6">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) =>
              percentage > 5 ? `${percentage.toFixed(0)}%` : ""
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CapacityAllocationChart;
