import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

const EnergyChart = ({ data, period = "daily", loading = false }) => {
  const [chartType, setChartType] = useState("area"); // 'area', 'bar', 'line'

  // ✅ Fix: ensure data is safe (avoid crash if null or undefined)
  const safeData = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // ✅ Optional: fallback when no data available
  if (!safeData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400">
            No data available for this period
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xl">
          <p className="font-bold text-slate-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-slate-600 dark:text-slate-400">
                {entry.name}:
              </span>
              <span className="font-semibold" style={{ color: entry.color }}>
                {(entry?.value ?? 0).toFixed(2)} kWh
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartTypes = [
    { id: "area", label: "Area", icon: Activity },
    { id: "bar", label: "Bar", icon: BarChart3 },
    { id: "line", label: "Line", icon: TrendingUp },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Energy Consumption Trend</CardTitle>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {chartTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    chartType === type.id
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                <type.icon size={16} />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" && (
              <AreaChart data={safeData}>
                <defs>
                  <linearGradient
                    id="consumptionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="generationGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                  label={{ value: "kWh", angle: -90, position: "insideLeft" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  fill="url(#consumptionGradient)"
                  strokeWidth={3}
                  name="Consumption"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="generation"
                  stroke="#10b981"
                  fill="url(#generationGradient)"
                  strokeWidth={3}
                  name="Generation"
                  animationDuration={1500}
                />
              </AreaChart>
            )}

            {chartType === "bar" && (
              <BarChart data={safeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  dataKey="consumption"
                  fill="#3b82f6"
                  name="Consumption"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />
                <Bar
                  dataKey="generation"
                  fill="#10b981"
                  name="Generation"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            )}

            {chartType === "line" && (
              <LineChart data={safeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                  name="Consumption"
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="generation"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6 }}
                  name="Generation"
                  animationDuration={1500}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyChart;
