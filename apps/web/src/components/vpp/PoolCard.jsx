import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatCAD,
  formatMW,
  formatPercent,
  getPoolStatusColor,
  getPoolStatusLabel,
  calculateFillPercentage,
} from "../../lib/vppHelpers";
import { marketInfo, riskToleranceInfo } from "../../data/vppMarkets";

const PoolCard = ({ pool, userMember = false }) => {
  const navigate = useNavigate();

  const fillPercentage = calculateFillPercentage(
    pool.capacity.totalMW,
    pool.capacity.targetMW
  );
  const marketData = marketInfo[pool.market?.code] || {};
  const riskData = riskToleranceInfo[pool.strategy?.riskTolerance] || {};

  const handleClick = () => {
    navigate(`/vpp/pools/${pool._id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {pool.name}
            </h3>
            {userMember && (
              <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-950/30 text-xs font-bold text-blue-600 dark:text-blue-400">
                Joined
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {pool.description}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`flex-shrink-0 ml-4 px-3 py-1 rounded-full bg-gradient-to-r ${getPoolStatusColor(pool.status)} text-xs font-bold text-white`}
        >
          {getPoolStatusLabel(pool.status)}
        </div>
      </div>

      {/* Market & Region */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${marketData.color || "from-slate-400 to-slate-600"} flex items-center justify-center`}
          >
            <Icons.Globe className="text-white" size={16} />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Market
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {pool.market?.name || "Unknown"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <Icons.MapPin
              className="text-slate-600 dark:text-slate-400"
              size={16}
            />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Region
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {pool.region}
            </div>
          </div>
        </div>
      </div>

      {/* Capacity Fill Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
          <span>Capacity</span>
          <span className="font-bold">
            {formatMW(pool.capacity.totalMW)} /{" "}
            {formatMW(pool.capacity.targetMW)}
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-slate-500 dark:text-slate-400">
            {pool.memberCount || 0} members
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatPercent(fillPercentage)} full
          </span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Revenue (30d)
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {formatCAD(pool.performance?.revenue30d || 0)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Avg/MW
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {formatCAD(pool.performance?.avgRevenuePerMW || 0)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Reliability
          </div>
          <div className="text-sm font-bold text-green-600 dark:text-green-400">
            {formatPercent(pool.performance?.reliability || 100)}
          </div>
        </div>
      </div>

      {/* Strategy Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {pool.strategy?.marketProducts?.slice(0, 2).map((product, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            {product.replace("-", " ")}
          </span>
        ))}
        {pool.strategy?.marketProducts?.length > 2 && (
          <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
            +{pool.strategy.marketProducts.length - 2} more
          </span>
        )}
      </div>

      {/* Risk Tolerance */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.TrendingUp
            size={14}
            className="text-slate-500 dark:text-slate-400"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Risk:
          </span>
          <span
            className={`text-xs font-semibold ${riskData.color || "text-slate-600 dark:text-slate-400"}`}
          >
            {riskData.name || pool.strategy?.riskTolerance}
          </span>
        </div>

        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-semibold">
          View Details
          <Icons.ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PoolCard;
