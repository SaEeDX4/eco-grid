import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import VPPStats from "../components/vpp/VPPStats";
import PoolCard from "../components/vpp/PoolCard";
import DispatchCard from "../components/vpp/DispatchCard";
import VPPEmptyState from "../components/vpp/VPPEmptyState";
import { useVPP } from "../hooks/useVPP";
import { formatCAD } from "../lib/vppHelpers";

const VPPOverviewPage = () => {
  const navigate = useNavigate();
  const { overview, loading, error, refresh } = useVPP();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
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
            Failed to Load VPP Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if user has any pools
  const hasPools = overview?.pools && overview.pools.length > 0;

  if (!hasPools) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <VPPEmptyState type="noPools" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 overflow-hidden">
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Icons.Zap className="text-white" size={36} />
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Virtual Power Plant
                  </h1>
                </div>
                <p className="text-xl text-blue-100">
                  Aggregate your devices and participate in energy markets
                </p>
              </div>

              <button
                onClick={() => navigate("/vpp/pools")}
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-bold hover:shadow-xl transition-all"
              >
                <Icons.Plus size={20} />
                Join Pool
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="mb-12">
            <VPPStats overview={overview} />
          </div>

          {/* Revenue Summary */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Revenue Overview
              </h2>
              <button
                onClick={() => navigate("/vpp/revenue")}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
              >
                View Details
                <Icons.ArrowRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This Month */}
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                    <Icons.TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-green-700 dark:text-green-300 font-semibold">
                      This Month
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCAD(overview.revenue?.currentMonth?.totalNet || 0)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {overview.revenue?.currentMonth?.totalDispatches || 0}{" "}
                  dispatches
                </div>
              </motion.div>

              {/* Last Month */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Icons.Calendar className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                      Last Month
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCAD(overview.revenue?.lastMonth?.totalNet || 0)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {overview.revenue?.lastMonth?.totalDispatches || 0} dispatches
                </div>
              </motion.div>

              {/* All Time */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                    <Icons.Award className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                      All Time
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCAD(overview.revenue?.allTime?.totalNet || 0)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {overview.revenue?.allTime?.totalDispatches || 0} dispatches
                </div>
              </motion.div>
            </div>
          </div>

          {/* My Pools */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Pools
              </h2>
              <button
                onClick={() => navigate("/vpp/pools")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              >
                <Icons.Plus size={20} />
                Join Another Pool
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {overview.pools.map((pool, index) => (
                <motion.div
                  key={pool._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PoolCard pool={pool} userMember={true} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Dispatches */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Upcoming Dispatches
              </h2>
              <button
                onClick={() => navigate("/vpp/dispatches")}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
              >
                View All
                <Icons.ArrowRight size={20} />
              </button>
            </div>

            {overview.upcomingDispatches &&
            overview.upcomingDispatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overview.upcomingDispatches.map((dispatch, index) => (
                  <motion.div
                    key={dispatch._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <DispatchCard dispatch={dispatch} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Icons.Calendar className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No Upcoming Dispatches
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your devices are available but no events are scheduled
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VPPOverviewPage;
