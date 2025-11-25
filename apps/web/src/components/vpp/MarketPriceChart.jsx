import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCAD } from "../../lib/vppHelpers";

const MarketPriceChart = ({ prices, product = "energy" }) => {
  if (!prices || prices.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
        No price data available
      </div>
    );
  }

  // Format data for chart
  const chartData = prices.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    price: p.price,
  }));

  const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const maxPrice = Math.max(...prices.map((p) => p.price));
  const minPrice = Math.min(...prices.map((p) => p.price));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
            {payload[0].payload.time}
          </p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCAD(payload[0].value)}/MWh
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Current
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatCAD(prices[0]?.price || 0)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Average
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCAD(avgPrice)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Peak
          </div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatCAD(maxPrice)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.1)"
            />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              style={{ fontSize: "11px" }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: "11px" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              fill="url(#colorPrice)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketPriceChart;
