import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import useHubs from "../hooks/useHubs";
import {
  formatKW,
  formatCAD,
  formatPercent,
  getStatusBadgeColor,
  getUtilizationColor,
  getHubTypeLabel,
} from "../lib/hubHelpers";

const HubList = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { hubs, loading, error } = useHubs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-semibold">
            Loading hubs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Error Loading Hubs
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  // Filter hubs
  let filteredHubs = hubs.filter((hub) => {
    if (filterStatus !== "all" && hub.status !== filterStatus) return false;
    if (filterType !== "all" && hub.type !== filterType) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        hub.name.toLowerCase().includes(query) ||
        hub.location?.city?.toLowerCase().includes(query) ||
        hub.location?.province?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Business Energy Hubs
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage multi-tenant energy facilities
              </p>
            </div>

            <button
              onClick={() => navigate("/hub/new")}
              className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Icons.Plus size={20} />
              Create Hub
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icons.Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search hubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                />
              </div>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="residential">Residential</option>
              <option value="mixed-use">Mixed Use</option>
              <option value="institutional">Institutional</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredHubs.length}
            </span>{" "}
            of <span className="font-bold">{hubs.length}</span> hubs
          </p>

          {(filterStatus !== "all" || filterType !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterType("all");
                setSearchQuery("");
              }}
              className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Hub Grid */}
        {filteredHubs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHubs.map((hub, index) => (
              <motion.div
                key={hub._id}
                className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/hub/${hub._id}`)}
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {hub.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Icons.MapPin size={14} />
                        <span>
                          {hub.location.city}, {hub.location.province}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(hub.status)}`}
                    >
                      {hub.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {getHubTypeLabel(hub.type)}
                    </span>

                    {hub.vpp?.enabled && (
                      <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1">
                        <Icons.Zap size={12} />
                        VPP
                      </span>
                    )}
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Capacity Utilization
                    </span>
                    <span
                      className={`text-sm font-bold ${getUtilizationColor(hub.capacity.utilizationPercent)}`}
                    >
                      {formatPercent(hub.capacity.utilizationPercent)}
                    </span>
                  </div>

                  <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        hub.capacity.utilizationPercent >= 95
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : hub.capacity.utilizationPercent >= 85
                            ? "bg-gradient-to-r from-orange-500 to-orange-600"
                            : hub.capacity.utilizationPercent >= 70
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                              : "bg-gradient-to-r from-green-500 to-emerald-600"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(hub.capacity.utilizationPercent, 100)}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs text-slate-600 dark:text-slate-400">
                    <span>{formatKW(hub.capacity.allocatedKW)} allocated</span>
                    <span>{formatKW(hub.capacity.availableKW)} available</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-6 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Total
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatKW(hub.capacity.totalKW)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Tenants
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {hub.tenants?.length || 0}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Uptime
                    </div>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">
                      {formatPercent(hub.performance?.uptimePercent || 0, 0)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Revenue
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCAD(hub.performance?.revenue30d || 0)}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {hub.devices?.length || 0} devices
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/hub/${hub._id}/tenants`);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      View Tenants
                    </button>
                    <Icons.ChevronRight size={14} className="text-slate-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            <Icons.Search className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Hubs Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your filters or search query
            </p>
            {(filterStatus !== "all" ||
              filterType !== "all" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterType("all");
                  setSearchQuery("");
                }}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HubList;
