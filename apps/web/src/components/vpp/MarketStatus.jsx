import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { formatCAD } from "../../lib/vppHelpers";
import { marketInfo, productInfo } from "../../data/vppMarkets";
import { useVPPMarkets } from "../../hooks/useVPPMarkets";

const MarketStatus = ({ marketId, compact = false }) => {
  const { markets, loading } = useVPPMarkets();
  const [market, setMarket] = useState(null);

  useEffect(() => {
    if (markets && marketId) {
      const found = markets.find((m) => m._id === marketId);
      setMarket(found);
    }
  }, [markets, marketId]);

  if (loading || !market) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  const marketData = marketInfo[market.code] || {};

  if (compact) {
    return (
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${marketData.color || "from-slate-400 to-slate-600"} flex items-center justify-center`}
          >
            <Icons.TrendingUp className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 dark:text-white">
              {market.name}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {market.region} • {market.operator}
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-bold ${
              market.status === "active"
                ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {market.status.toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${marketData.color || "from-slate-400 to-slate-600"} flex items-center justify-center shadow-lg`}
          >
            <Icons.Globe className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {market.name}
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {market.region} • {market.operator}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              market.status === "active"
                ? "bg-green-500 animate-pulse"
                : "bg-slate-400"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              market.status === "active"
                ? "text-green-600 dark:text-green-400"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {market.status === "active" ? "Active" : "Offline"}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
          Market Products
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {market.products.map((product, index) => {
            const productData = productInfo[product.type] || {};
            const ProductIcon = Icons[productData.icon] || Icons.Zap;

            return (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${productData.color || "from-slate-400 to-slate-600"} flex items-center justify-center`}
                  >
                    <ProductIcon className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {productData.name || product.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Min: {product.minBidMW} MW
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ~{formatCAD(product.clearingPriceCAD)}/MWh
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirements */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Min Capacity
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {market.requirements?.minCapacityMW || 0} MW
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Settlement
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {market.requirements?.settlementPeriodDays || 30} days
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Bid Lead Time
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {market.requirements?.bidLeadTimeHours || 24}h
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Integration
            </div>
            <div
              className={`text-sm font-bold ${
                market.integrationStatus === "live"
                  ? "text-green-600 dark:text-green-400"
                  : market.integrationStatus === "simulated"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {market.integrationStatus}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketStatus;
