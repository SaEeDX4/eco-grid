import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import api from "../lib/api";
import useHub from "../hooks/useHub";
import {
  formatKW,
  formatKWh,
  formatPercent,
  formatCAD,
} from "../lib/hubHelpers";
import { aggregateMetricsByPeriod } from "../lib/hubCalculations";

const HubAnalytics = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { hub, loading: hubLoading } = useHub(hubId);

  const [period, setPeriod] = useState("month");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [tenantBreakdown, setTenantBreakdown] = useState([]);

  useEffect(() => {
    if (hubId) {
      fetchAnalytics();
    }
  }, [hubId, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch hub metrics
      const metricsRes = await api.get(
        `/hub/hubs/${hubId}/metrics?period=${period}`
      );
      if (metricsRes.data.success) {
        setMetrics(metricsRes.data.metrics);
      }

      // Fetch allocation history
      const historyRes = await api.get(
        `/hub/allocations/history?hubId=${hubId}&limit=100`
      );
      if (historyRes.data.success) {
        const aggregated = aggregateMetricsByPeriod(
          historyRes.data.history,
          "daily"
        );
        setAllocationHistory(aggregated);
      }

      // Fetch allocation statistics
      const statsRes = await api.get(
        `/hub/allocations/statistics?hubId=${hubId}`
      );
      if (statsRes.data.success) {
        const stats = statsRes.data.statistics;
        if (stats.tenantBreakdown) {
          setTenantBreakdown(
            Object.entries(stats.tenantBreakdown).map(([name, data]) => ({
              name: name.length > 20 ? name.substring(0, 20) + "..." : name,
              allocations: data.count,
              avgGranted: data.avgGranted,
              totalGranted: data.totalGranted,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Fetch analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (hubLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!hub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Hub Not Found
          </h2>
          <button
            onClick={() => navigate("/hub/list")}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
          >
            Back to Hubs
          </button>
        </div>
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
              {typeof entry.value === "number"
                ? formatKW(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate(`/hub/${hubId}`)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Icons.ArrowLeft
                    className="text-slate-600 dark:text-slate-400"
                    size={20}
                  />
                </button>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  Hub Analytics
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 ml-[52px]">
                {hub.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
                <option value="year">Last Year</option>
              </select>

              <button
                onClick={fetchAnalytics}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Icons.RefreshCw size={20} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Avg Utilization",
              value: formatPercent(
                metrics?.avgUtilization || hub.capacity.utilizationPercent || 0
              ),
              icon: "Activity",
              gradient: "from-blue-500 to-cyan-600",
              trend: null,
            },
            {
              label: "Peak Demand",
              value: formatKW(
                metrics?.peakDemandKW || hub.capacity.peakKW || 0
              ),
              icon: "TrendingUp",
              gradient: "from-orange-500 to-red-600",
              trend: null,
            },
            {
              label: "Total Energy",
              value: formatKWh(
                metrics?.totalEnergyKWh || hub.performance?.totalEnergyKWh || 0
              ),
              icon: "Zap",
              gradient: "from-green-500 to-emerald-600",
              trend: null,
            },
            {
              label: "Efficiency Score",
              value: `${(metrics?.efficiency || 85).toFixed(0)}%`,
              icon: "Award",
              gradient: "from-purple-500 to-pink-600",
              trend: null,
            },
          ].map((metric, index) => {
            const Icon = Icons[metric.icon];
            return (
              <motion.div
                key={metric.label}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mb-4 shadow-md`}
                >
                  <Icon className="text-white" size={24} />
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {metric.label}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Allocation History Chart */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Capacity Allocation Trends
          </h2>
          {allocationHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={allocationHistory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="period"
                  className="text-xs text-slate-600 dark:text-slate-400"
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs text-slate-600 dark:text-slate-400"
                  stroke="currentColor"
                  tickFormatter={(value) => `${value} kW`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  name="Avg Allocated"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  name="Peak"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
              No allocation history available
            </div>
          )}
        </div>

        {/* Tenant Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Tenant Capacity Usage
          </h2>
          {tenantBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={tenantBreakdown}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="name"
                  className="text-xs text-slate-600 dark:text-slate-400"
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs text-slate-600 dark:text-slate-400"
                  stroke="currentColor"
                  tickFormatter={(value) => `${value} kW`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="avgGranted"
                  name="Avg Capacity"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="totalGranted"
                  name="Total Granted"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
              No tenant data available
            </div>
          )}
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Utilization Insights */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Utilization Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Off-Peak Usage
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatPercent(metrics?.offPeakPercent || 40)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Peak Hours Usage
                </span>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {formatPercent(metrics?.peakPercent || 60)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Load Factor
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatPercent(metrics?.loadFactor || 75)}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Quick Recommendations
            </h3>
            <div className="space-y-3">
              {[
                {
                  text: "Consider implementing time-based pricing to shift demand",
                  type: "info",
                },
                {
                  text: "Peak utilization approaching threshold - monitor closely",
                  type: "warning",
                },
                {
                  text: "VPP participation could generate additional revenue",
                  type: "success",
                },
              ].map((rec, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl flex items-start gap-3 ${
                    rec.type === "warning"
                      ? "bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800"
                      : rec.type === "success"
                        ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                        : "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <Icons.Lightbulb
                    size={18}
                    className={`flex-shrink-0 mt-0.5 ${
                      rec.type === "warning"
                        ? "text-orange-600 dark:text-orange-400"
                        : rec.type === "success"
                          ? "text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      rec.type === "warning"
                        ? "text-orange-700 dark:text-orange-300"
                        : rec.type === "success"
                          ? "text-green-700 dark:text-green-300"
                          : "text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {rec.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubAnalytics;
