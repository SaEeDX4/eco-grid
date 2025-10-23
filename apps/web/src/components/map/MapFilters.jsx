import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown } from "lucide-react";

const MapFilters = ({ activeFilters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const regions = [
    { id: "Lower Mainland", name: "Lower Mainland" },
    { id: "Vancouver Island", name: "Vancouver Island" },
    { id: "Interior", name: "Interior" },
    { id: "Northern BC", name: "Northern BC" },
    { id: "Kootenays", name: "Kootenays" },
  ];

  const deviceTypes = [
    { id: "solar", name: "Solar Panels", icon: "☀️" },
    { id: "ev-charger", name: "EV Chargers", icon: "🔌" },
    { id: "battery", name: "Battery Storage", icon: "🔋" },
    { id: "heat-pump", name: "Heat Pumps", icon: "♨️" },
    { id: "thermostat", name: "Smart Thermostats", icon: "🌡️" },
  ];

  const statuses = [
    { id: "active", name: "Active", color: "bg-green-500" },
    { id: "idle", name: "Idle", color: "bg-yellow-500" },
    { id: "maintenance", name: "Maintenance", color: "bg-red-500" },
  ];

  const handleRegionToggle = (regionId) => {
    const current = activeFilters.region || [];
    const updated = current.includes(regionId)
      ? current.filter((r) => r !== regionId)
      : [...current, regionId];

    onFilterChange({ ...activeFilters, region: updated });
  };

  const handleDeviceToggle = (deviceId) => {
    const current = activeFilters.deviceType || [];
    const updated = current.includes(deviceId)
      ? current.filter((d) => d !== deviceId)
      : [...current, deviceId];

    onFilterChange({ ...activeFilters, deviceType: updated });
  };

  const handleStatusToggle = (statusId) => {
    const current = activeFilters.status || [];
    const updated = current.includes(statusId)
      ? current.filter((s) => s !== statusId)
      : [...current, statusId];

    onFilterChange({ ...activeFilters, status: updated });
  };

  const clearFilters = () => {
    onFilterChange({ region: [], deviceType: [], status: [] });
  };

  const hasActiveFilters =
    (activeFilters.region?.length || 0) > 0 ||
    (activeFilters.deviceType?.length || 0) > 0 ||
    (activeFilters.status?.length || 0) > 0;

  const filterCount =
    (activeFilters.region?.length || 0) +
    (activeFilters.deviceType?.length || 0) +
    (activeFilters.status?.length || 0);

  return (
    <div className="absolute top-4 left-4 z-10">
      {/* Filter toggle button */}
      <motion.button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Filter size={20} className="text-slate-900 dark:text-white" />
        <span className="font-semibold text-slate-900 dark:text-white">
          Filters
        </span>
        {filterCount > 0 && (
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
            {filterCount}
          </div>
        )}
        <ChevronDown
          size={18}
          className={`text-slate-600 dark:text-slate-400 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
        />
      </motion.button>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="mt-3 p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-700 shadow-2xl w-[360px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header with clear button */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {filterCount} filter{filterCount !== 1 ? "s" : ""} active
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                >
                  <X size={16} />
                  Clear All
                </button>
              </div>
            )}

            {/* Regions */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                Region
              </h3>
              <div className="space-y-2">
                {regions.map((region) => {
                  const isActive = activeFilters.region?.includes(region.id);

                  return (
                    <motion.button
                      key={region.id}
                      onClick={() => handleRegionToggle(region.id)}
                      className={`
                        w-full px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200
                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {region.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Device Types */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                Device Type
              </h3>
              <div className="space-y-2">
                {deviceTypes.map((device) => {
                  const isActive = activeFilters.deviceType?.includes(
                    device.id
                  );

                  return (
                    <motion.button
                      key={device.id}
                      onClick={() => handleDeviceToggle(device.id)}
                      className={`
                        w-full px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2
                        ${
                          isActive
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{device.icon}</span>
                      {device.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                Status
              </h3>
              <div className="space-y-2">
                {statuses.map((status) => {
                  const isActive = activeFilters.status?.includes(status.id);

                  return (
                    <motion.button
                      key={status.id}
                      onClick={() => handleStatusToggle(status.id)}
                      className={`
                        w-full px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2
                        ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      {status.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapFilters;
