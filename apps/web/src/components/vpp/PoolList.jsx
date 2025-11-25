import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import PoolCard from "./PoolCard";

const PoolList = ({ pools, loading, userPoolIds = [] }) => {
  const [sortBy, setSortBy] = useState("revenue");
  const [filterRegion, setFilterRegion] = useState(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!pools || pools.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Icons.Layers className="text-slate-400" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          No Pools Available
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Check back soon for new VPP pool opportunities
        </p>
      </div>
    );
  }

  // Get unique regions
  const regions = [...new Set(pools.map((p) => p.region))].sort();

  // Filter pools
  let filteredPools = [...pools];
  if (filterRegion) {
    filteredPools = filteredPools.filter((p) => p.region === filterRegion);
  }

  // Sort pools
  filteredPools.sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return (
          (b.performance?.revenue30d || 0) - (a.performance?.revenue30d || 0)
        );
      case "capacity":
        return (b.capacity?.totalMW || 0) - (a.capacity?.totalMW || 0);
      case "reliability":
        return (
          (b.performance?.reliability || 0) - (a.performance?.reliability || 0)
        );
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <Icons.Filter
            size={20}
            className="text-slate-500 dark:text-slate-400"
          />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Region:
          </span>
          <button
            onClick={() => setFilterRegion(null)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              !filterRegion
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterRegion === region
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <Icons.ArrowUpDown
            size={20}
            className="text-slate-500 dark:text-slate-400"
          />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 border-2 border-transparent focus:border-blue-500 outline-none transition-colors"
          >
            <option value="revenue">Revenue</option>
            <option value="capacity">Capacity</option>
            <option value="reliability">Reliability</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Showing {filteredPools.length} pool
        {filteredPools.length !== 1 ? "s" : ""}
      </div>

      {/* Pool Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPools.map((pool, index) => (
          <motion.div
            key={pool._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PoolCard pool={pool} userMember={userPoolIds.includes(pool._id)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PoolList;
