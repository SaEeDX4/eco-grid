import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import PoolJoinFlow from "../components/vpp/PoolJoinFlow";
import MarketStatus from "../components/vpp/MarketStatus";
import {
  formatCAD,
  formatMW,
  formatPercent,
  calculateFillPercentage,
  isPoolJoinable,
} from "../lib/vppHelpers";
import { riskToleranceInfo, productInfo } from "../data/vppMarkets";
import api from "../lib/api";

const VPPPoolDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJoinFlow, setShowJoinFlow] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isUserMember, setIsUserMember] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPool = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/vpp/pools/${id}`);

      if (response.data.success) {
        setPool(response.data.pool);
        setIsUserMember(!!response.data.pool.userMembership);
      }
    } catch (err) {
      console.error("Fetch pool error:", err);
      setError(err.response?.data?.message || "Failed to load pool");
    } finally {
      setLoading(false);
    }
  };

  const handleLeavePool = async () => {
    try {
      const response = await api.post(`/vpp/pools/${id}/leave`);

      if (response.data.success) {
        navigate("/vpp/pools");
      }
    } catch (err) {
      console.error("Leave pool error:", err);
      setError(err.response?.data?.message || "Failed to leave pool");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Pool Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || "The requested pool could not be found"}
          </p>
          <button
            onClick={() => navigate("/vpp/pools")}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Back to Pools
          </button>
        </div>
      </div>
    );
  }

  const fillPercentage = calculateFillPercentage(
    pool.capacity.totalMW,
    pool.capacity.targetMW
  );
  const riskData = riskToleranceInfo[pool.strategy?.riskTolerance] || {};
  const canJoin = isPoolJoinable(pool) && !isUserMember;

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

        <div className="container mx-auto px-4 pt-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate("/vpp/pools")}
              className="flex items-center gap-2 text-white mb-6 hover:gap-3 transition-all"
            >
              <Icons.ArrowLeft size={20} />
              Back to Pools
            </button>

            {/* Pool Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {pool.name}
                  </h1>
                  {isUserMember && (
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-bold text-white">
                      Member
                    </span>
                  )}
                </div>

                <p className="text-xl text-blue-100 mb-4">{pool.description}</p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <div className="text-sm text-blue-100">Region</div>
                    <div className="text-lg font-bold text-white">
                      {pool.region}
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <div className="text-sm text-blue-100">Members</div>
                    <div className="text-lg font-bold text-white">
                      {pool.memberCount}
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <div className="text-sm text-blue-100">Capacity</div>
                    <div className="text-lg font-bold text-white">
                      {formatMW(pool.capacity.totalMW)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {canJoin ? (
                  <button
                    onClick={() => setShowJoinFlow(true)}
                    className="w-full lg:w-auto px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Plus size={24} />
                    Join This Pool
                  </button>
                ) : isUserMember ? (
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="w-full lg:w-auto px-8 py-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.LogOut size={24} />
                    Leave Pool
                  </button>
                ) : (
                  <div className="px-8 py-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-center">
                    Pool Full
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Capacity */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Capacity Overview
                </h2>

                <div className="space-y-6">
                  {/* Fill Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Pool Fill Status
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatMW(pool.capacity.totalMW)} /{" "}
                        {formatMW(pool.capacity.targetMW)}
                      </span>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${fillPercentage}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {formatPercent(fillPercentage)} full
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatMW(
                          pool.capacity.targetMW - pool.capacity.totalMW
                        )}{" "}
                        available
                      </span>
                    </div>
                  </div>

                  {/* Capacity Breakdown */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Total
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {formatMW(pool.capacity.totalMW)}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Available
                      </div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatMW(pool.capacity.availableMW)}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Committed
                      </div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatMW(pool.capacity.committedMW)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Performance */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Performance Metrics
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Revenue (30d)
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCAD(pool.performance?.revenue30d || 0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Avg/MW
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatCAD(pool.performance?.avgRevenuePerMW || 0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Dispatches
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {pool.performance?.dispatches30d || 0}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Reliability
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatPercent(pool.performance?.reliability || 100)}
                    </div>
                  </div>
                </div>

                {/* Bidding Stats */}
                {pool.biddingStats && (
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Bidding Performance
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {pool.biddingStats.totalBids}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Total Bids
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatPercent(pool.biddingStats.acceptanceRate)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Acceptance Rate
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCAD(pool.biddingStats.avgBidPrice)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Avg Bid Price
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {formatCAD(pool.biddingStats.avgClearingPrice)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Avg Clearing
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Strategy */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Pool Strategy
                </h2>

                {/* Risk Tolerance */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icons.TrendingUp
                      size={20}
                      className="text-slate-600 dark:text-slate-400"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Risk Tolerance
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
                      riskData.bgColor
                    }`}
                  >
                    <span className={`text-lg font-bold ${riskData.color}`}>
                      {riskData.name}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      • {riskData.description}
                    </span>
                  </div>
                </div>

                {/* Market Products */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icons.Grid
                      size={20}
                      className="text-slate-600 dark:text-slate-400"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Market Products
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pool.strategy?.marketProducts?.map((product, index) => {
                      const productData = productInfo[product] || {};
                      return (
                        <div
                          key={index}
                          className={`px-4 py-2 rounded-xl bg-gradient-to-r ${
                            productData.color || "from-slate-400 to-slate-600"
                          } text-white font-semibold text-sm`}
                        >
                          {productData.name || product}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SOC Limits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Min SOC
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pool.strategy?.socLimits?.min || 20}%
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Max SOC
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pool.strategy?.socLimits?.max || 90}%
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* User Membership */}
              {isUserMember && pool.userMembership && (
                <motion.div
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Your Participation
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Joined
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {new Date(
                          pool.userMembership.joinedAt
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Contribution
                      </div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {pool.userMembership.contributionKW.toFixed(1)} kW
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Devices
                      </div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {pool.userMembership.devices}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Reliability
                      </div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatPercent(pool.userMembership.reliability)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Market & Fees */}
            <div className="space-y-6">
              {/* Market Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MarketStatus marketId={pool.market?._id} />
              </motion.div>

              {/* Fees */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Fee Structure
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Platform Fee
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {pool.fees?.platformPercent || 0}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Operator Fee
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {pool.fees?.operatorPercent || 0}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">
                      Your Net Revenue
                    </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {100 -
                        (pool.fees?.platformPercent || 0) -
                        (pool.fees?.operatorPercent || 0)}
                      %
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Requirements
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Icons.CheckCircle
                      className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                      size={16}
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Minimum Capacity
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        {pool.requirements?.minCapacityKW || 0} kW required
                      </div>
                    </div>
                  </div>

                  {pool.requirements?.deviceTypes &&
                    pool.requirements.deviceTypes.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Icons.CheckCircle
                          className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            Allowed Devices
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 capitalize">
                            {pool.requirements.deviceTypes
                              .map((t) => t.replace("-", " "))
                              .join(", ")}
                          </div>
                        </div>
                      </div>
                    )}

                  {pool.requirements?.locationRestrictions &&
                    pool.requirements.locationRestrictions.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Icons.MapPin
                          className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            Location
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            {pool.requirements.locationRestrictions.join(", ")}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Flow Modal */}
      <AnimatePresence>
        {showJoinFlow && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowJoinFlow(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PoolJoinFlow
                pool={pool}
                onSuccess={() => {
                  setShowJoinFlow(false);
                  fetchPool();
                }}
                onCancel={() => setShowJoinFlow(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Confirmation Modal */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLeaveConfirm(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
                  <Icons.AlertCircle
                    className="text-red-600 dark:text-red-400"
                    size={32}
                  />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Leave Pool?
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to leave {pool.name}? Your devices will
                  be unenrolled and you'll stop earning revenue from this pool.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeaveConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLeavePool}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                  >
                    Leave Pool
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VPPPoolDetailPage;
