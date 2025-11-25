import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatCAD } from "../../lib/vppHelpers";

const RevenueChart = ({ data, showGross = false }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400">
        No revenue data available
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((record) => ({
    month: new Date(record.month).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    net: record.net,
    gross: record.gross,
    fees: record.fees,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            {payload[0].payload.month}
          </p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-slate-600 dark:text-slate-400 capitalize">
                {entry.name}:
              </span>
              <span className="font-bold" style={{ color: entry.color }}>
                {formatCAD(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.1)"
          />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            style={{ fontSize: "12px", fontWeight: 500 }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: "12px", fontWeight: 500 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />

          {showGross && (
            <Area
              type="monotone"
              dataKey="gross"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorGross)"
            />
          )}

          <Area
            type="monotone"
            dataKey="net"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorNet)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
