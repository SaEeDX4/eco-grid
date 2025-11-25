import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import TenantCard from "./TenantCard";

const TenantList = ({ tenants, loading, onTenantClick }) => {
  const [sortBy, setSortBy] = useState("usage");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
          <Icons.Users className="text-slate-400" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          No Tenants Found
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          This hub doesn't have any tenants yet
        </p>
      </div>
    );
  }

  // Filter tenants
  let filteredTenants = tenants.filter((tenant) => {
    // Status filter
    if (filterStatus !== "all" && tenant.status !== filterStatus) {
      return false;
    }

    // Priority filter
    if (filterPriority !== "all" && tenant.priorityTier !== filterPriority) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tenant.name.toLowerCase().includes(query) ||
        tenant.businessType?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort tenants
  filteredTenants = [...filteredTenants].sort((a, b) => {
    switch (sortBy) {
      case "usage":
        const usageA =
          (a.usage?.current?.currentKW || 0) / (a.capacity?.allocatedKW || 1);
        const usageB =
          (b.usage?.current?.currentKW || 0) / (b.capacity?.allocatedKW || 1);
        return usageB - usageA;

      case "capacity":
        return (b.capacity?.allocatedKW || 0) - (a.capacity?.allocatedKW || 0);

      case "violations":
        return (
          (b.compliance?.violations || 0) - (a.compliance?.violations || 0)
        );

      case "name":
        return a.name.localeCompare(b.name);

      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Icons.Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
          </div>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="usage">Sort by Usage</option>
          <option value="capacity">Sort by Capacity</option>
          <option value="violations">Sort by Violations</option>
          <option value="name">Sort by Name</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="standard">Standard</option>
          <option value="priority">Priority</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {filteredTenants.length}
          </span>{" "}
          of <span className="font-bold">{tenants.length}</span> tenants
        </p>

        {(filterStatus !== "all" ||
          filterPriority !== "all" ||
          searchQuery) && (
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterPriority("all");
              setSearchQuery("");
            }}
            className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Tenant Grid */}
      {filteredTenants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant, index) => (
            <motion.div
              key={tenant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TenantCard tenant={tenant} onClick={onTenantClick} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <Icons.Search className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Tenants Match Filters
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default TenantList;
