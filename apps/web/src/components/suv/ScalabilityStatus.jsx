import React from "react";
import { TrendingUp, Server, Database, Gauge } from "lucide-react";
import { scalabilityTargets } from "../../lib/suvData";
import UptimeMonitor from "./UptimeMonitor";
import LatencyGraph from "./LatencyGraph";

const ScalabilityStatus = () => {
  const {
    currentUsers,
    targetUsers,
    targetYear,
    infrastructure,
    performanceTargets,
  } = scalabilityTargets;

  const userGrowthProgress = (currentUsers / targetUsers) * 100;

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 rounded-full mb-6">
            <TrendingUp size={20} />
            <span className="font-semibold">Scalability & Performance</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Built to Scale to 1 Million Users
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Enterprise-grade infrastructure designed for exponential growth
            while maintaining world-class performance and reliability.
          </p>
        </div>

        {/* ================= USER GROWTH ================= */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                User Growth Target
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                On track to serve {targetUsers.toLocaleString()} users by{" "}
                {targetYear}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Current: {currentUsers.toLocaleString()}</span>
                <span>Target: {targetUsers.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                  style={{ width: `${Math.max(5, userGrowthProgress)}%` }}
                >
                  <span className="text-xs font-bold text-white">
                    {userGrowthProgress.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              {[10000, 100000, 500000, 1000000].map((milestone) => (
                <div
                  key={milestone}
                  className={`p-2 rounded-lg ${
                    currentUsers >= milestone
                      ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {(milestone / 1000).toLocaleString()}K
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= INFRASTRUCTURE ================= */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Infrastructure Readiness
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infrastructure.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    item.status === "Ready"
                      ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                      : item.status === "Active"
                        ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                        : "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400"
                  }`}
                >
                  {item.status}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  {item.metric}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PERFORMANCE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Uptime */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Server size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  System Uptime
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Last 90 days
                </p>
              </div>
            </div>
            <UptimeMonitor days={90} />
          </div>

          {/* Latency */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Gauge size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  API Latency
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Real-time performance
                </p>
              </div>
            </div>
            <LatencyGraph />
          </div>
        </div>

        {/* ================= PERFORMANCE TARGETS ================= */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Performance Targets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(performanceTargets).map(([key, data], index) => {
              const isMetTarget = data.current <= data.target;
              const percentage = (data.current / data.target) * 100;

              return (
                <div
                  key={key}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-center mb-4">
                    <div
                      className={`text-4xl font-bold mb-2 ${
                        isMetTarget
                          ? "text-green-600 dark:text-green-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {data.current.toLocaleString()}
                      {data.unit}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                      Target: {data.target.toLocaleString()}
                      {data.unit}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isMetTarget
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : "bg-gradient-to-r from-orange-500 to-red-600"
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="font-bold text-slate-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                        isMetTarget
                          ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                      }`}
                    >
                      {isMetTarget ? "Meeting Target" : "Above Target"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= LOAD TESTING ================= */}
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Database size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Load Testing Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      100K
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Concurrent Users Tested
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      &lt;200ms
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      P95 Response Time
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      0%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Error Rate
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our infrastructure has been stress-tested to handle 100,000
                  concurrent users with zero errors and sub-200ms response
                  times. Auto-scaling configurations ensure we can handle 10x
                  traffic spikes without service degradation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SCALABILITY STATEMENT ================= */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 text-white relative overflow-hidden">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            <div className="relative text-center">
              <h3 className="text-3xl font-bold mb-4">
                Ready for Exponential Growth
              </h3>
              <p className="text-purple-100 leading-relaxed">
                Our architecture is designed for scale from day one. With
                Kubernetes orchestration, database sharding strategies, and CDN
                distribution across multiple regions, we're ready to serve
                millions of users while maintaining high-performance
                reliability. Every component scales horizontally, and our
                monitoring systems provide real-time insights to ensure optimal
                performance at any scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScalabilityStatus;
