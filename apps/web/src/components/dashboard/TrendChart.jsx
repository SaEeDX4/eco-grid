import React, { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { TrendingUp, Calendar } from "lucide-react";
import {
  chartConfig,
  chartColors,
  chartAnimation,
} from "../../lib/chartConfig";
import { Tabs } from "../ui/Tabs";

const TrendChart = ({ data, loading = false }) => {
  const isDark = document.documentElement.classList.contains("dark");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xl">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            {payload[0].payload.date}
          </p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-slate-600 dark:text-slate-400">
                {entry.name}:
              </span>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value.toFixed(2)}{" "}
                {entry.name === "Usage" ? "kWh" : "CAD"}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const usageTab = (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={chartConfig.margin} {...chartAnimation}>
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.primary}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={chartColors.primary}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            {...(isDark
              ? chartConfig.cartesianGridDark
              : chartConfig.cartesianGrid)}
          />
          <XAxis
            dataKey="date"
            {...(isDark ? chartConfig.xAxisDark : chartConfig.xAxis)}
          />
          <YAxis
            {...(isDark ? chartConfig.yAxisDark : chartConfig.yAxis)}
            label={{
              value: "kWh",
              angle: -90,
              position: "insideLeft",
              fill: isDark ? chartColors.textDark : chartColors.text,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="usage"
            stroke={chartColors.primary}
            fill="url(#colorUsage)"
            strokeWidth={3}
            name="Usage"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const costTab = (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={chartConfig.margin} {...chartAnimation}>
          <CartesianGrid
            {...(isDark
              ? chartConfig.cartesianGridDark
              : chartConfig.cartesianGrid)}
          />
          <XAxis
            dataKey="date"
            {...(isDark ? chartConfig.xAxisDark : chartConfig.xAxis)}
          />
          <YAxis
            {...(isDark ? chartConfig.yAxisDark : chartConfig.yAxis)}
            label={{
              value: "CAD",
              angle: -90,
              position: "insideLeft",
              fill: isDark ? chartColors.textDark : chartColors.text,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            {...chartConfig.line}
            dataKey="cost"
            stroke={chartColors.warning}
            name="Cost"
          />
          <Line
            {...chartConfig.line}
            dataKey="savings"
            stroke={chartColors.primary}
            name="Savings"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const tabs = [
    { label: "Energy Usage", content: usageTab, icon: TrendingUp },
    { label: "Cost & Savings", content: costTab, icon: Calendar },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-green-600" size={24} />
          7-Day Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs tabs={tabs} />
      </CardContent>
    </Card>
  );
};

export default TrendChart;
