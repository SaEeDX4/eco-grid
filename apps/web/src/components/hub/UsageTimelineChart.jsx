import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatKW } from "../../lib/hubHelpers";

const UsageTimelineChart = ({
  data,
  showAllocated = true,
  showCurrent = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
        No usage data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xl">
          <p className="font-bold text-slate-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-semibold">{entry.name}:</span>{" "}
              {formatKW(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        <XAxis
          dataKey="time"
          className="text-xs text-slate-600 dark:text-slate-400"
          stroke="currentColor"
        />
        <YAxis
          className="text-xs text-slate-600 dark:text-slate-400"
          stroke="currentColor"
          tickFormatter={(value) => `${value} kW`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
        {showAllocated && (
          <Area
            type="monotone"
            dataKey="allocated"
            name="Allocated Capacity"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAllocated)"
          />
        )}
        {showCurrent && (
          <Area
            type="monotone"
            dataKey="current"
            name="Current Usage"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCurrent)"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UsageTimelineChart;
