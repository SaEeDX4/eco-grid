import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import RevenueChart from "../components/vpp/RevenueChart";
import RevenueBreakdown from "../components/vpp/RevenueBreakdown";
import RevenueHistory from "../components/vpp/RevenueHistory";
import { useVPPRevenue } from "../hooks/useVPPRevenue";
import { formatCAD, formatKWh, formatPercent } from "../lib/vppHelpers";
import { aggregateRevenueByPeriod } from "../lib/vppCalculations";

const VPPRevenuePage = () => {
  const { revenue, monthlyTrend, byPool, loading, error, fetchHistory } =
    useVPPRevenue();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await fetchHistory({ periodType: "monthly", limit: 12 });
      setHistory(data);
    } catch (err) {
      console.error("Load history error:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Failed to Load Revenue Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Icons.DollarSign className="text-white" size={42} />
              <h1 className="text-5xl font-bold text-white">VPP Revenue</h1>
            </div>

            <p className="text-xl text-green-100 mb-8">
              Track your earnings from Virtual Power Plant participation
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This Month */}
              <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="text-sm text-green-100 mb-2">This Month</div>
                <div className="text-4xl font-bold text-white mb-1">
                  {formatCAD(revenue?.currentMonth?.totalNet || 0)}
                </div>
                <div className="text-sm text-green-100">
                  {revenue?.currentMonth?.totalDispatches || 0} dispatches
                </div>
              </div>

              {/* Last Month */}
              <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="text-sm text-green-100 mb-2">Last Month</div>
                <div className="text-4xl font-bold text-white mb-1">
                  {formatCAD(revenue?.lastMonth?.totalNet || 0)}
                </div>
                <div className="text-sm text-green-100">
                  {revenue?.lastMonth?.totalDispatches || 0} dispatches
                </div>
              </div>

              {/* All Time */}
              <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="text-sm text-green-100 mb-2">All Time</div>
                <div className="text-4xl font-bold text-white mb-1">
                  {formatCAD(revenue?.allTime?.totalNet || 0)}
                </div>
                <div className="text-sm text-green-100">
                  {revenue?.allTime?.totalDispatches || 0} dispatches
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts & Breakdown */}
            <div className="lg:col-span-2 space-y-8">
              {/* Revenue Trend */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Revenue Trend
                  </h2>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPeriod("monthly")}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        selectedPeriod === "monthly"
                          ? "bg-blue-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <RevenueChart data={monthlyTrend} />
              </motion.div>

              {/* All-Time Stats */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Lifetime Statistics
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Gross Revenue
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      {formatCAD(revenue?.allTime?.totalGross || 0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Total Fees
                    </div>
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatCAD(revenue?.allTime?.totalFees || 0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Net Revenue
                    </div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCAD(revenue?.allTime?.totalNet || 0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Energy Sold
                    </div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatKWh(revenue?.allTime?.totalKWh || 0)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Revenue History */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Payment History
                  </h2>

                  <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all">
                    <Icons.Download size={20} />
                    Export
                  </button>
                </div>

                {loadingHistory ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <RevenueHistory history={history} />
                )}
              </motion.div>
            </div>

            {/* Right Column - Breakdown & Pools */}
            <div className="space-y-8">
              {/* Current Month Breakdown */}
              {revenue?.currentMonth && (
                <motion.div
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    This Month Breakdown
                  </h2>

                  <RevenueBreakdown revenue={revenue.currentMonth} />
                </motion.div>
              )}

              {/* Revenue by Pool */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Revenue by Pool
                </h2>

                {byPool && byPool.length > 0 ? (
                  <div className="space-y-3">
                    {byPool.map((pool, index) => (
                      <motion.div
                        key={pool.poolId}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {pool.poolName}
                          </div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatCAD(pool.totalNet)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            {pool.totalDispatches} dispatches
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {formatPercent(pool.avgReliability)} reliability
                          </span>
                        </div>

                        <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            style={{
                              width: `${Math.min(100, (pool.totalNet / (revenue?.allTime?.totalNet || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    No pool revenue data
                  </div>
                )}
              </motion.div>

              {/* Insights */}
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-100 dark:border-slate-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icons.Lightbulb
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Revenue Insights
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  {revenue?.allTime?.totalNet > 0 && (
                    <>
                      <div className="flex items-start gap-2">
                        <Icons.TrendingUp
                          className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <div className="text-slate-700 dark:text-slate-300">
                          Your effective rate is{" "}
                          <span className="font-bold">
                            {formatCAD(
                              revenue.allTime.totalNet /
                                revenue.allTime.totalKWh || 0
                            )}
                            /kWh
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Icons.Award
                          className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <div className="text-slate-700 dark:text-slate-300">
                          You've completed{" "}
                          <span className="font-bold">
                            {revenue.allTime.totalDispatches}
                          </span>{" "}
                          dispatches successfully
                        </div>
                      </div>

                      {revenue.currentMonth?.totalNet >
                        revenue.lastMonth?.totalNet && (
                        <div className="flex items-start gap-2">
                          <Icons.ArrowUp
                            className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                            size={16}
                          />
                          <div className="text-slate-700 dark:text-slate-300">
                            Your revenue is{" "}
                            <span className="font-bold text-green-600 dark:text-green-400">
                              up{" "}
                              {formatPercent(
                                (revenue.currentMonth.totalNet /
                                  revenue.lastMonth.totalNet -
                                  1) *
                                  100
                              )}
                            </span>{" "}
                            from last month
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {(!revenue?.allTime?.totalNet ||
                    revenue.allTime.totalNet === 0) && (
                    <div className="text-slate-600 dark:text-slate-400">
                      Start participating in dispatches to earn revenue and see
                      insights here.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VPPRevenuePage;
