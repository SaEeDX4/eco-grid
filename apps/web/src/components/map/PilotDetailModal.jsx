import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  Zap,
  Leaf,
  DollarSign,
  Activity,
  TrendingUp,
} from "lucide-react";
import { formatMetric } from "../../lib/mapHelpers";

const PilotDetailModal = ({ pilot, onClose }) => {
  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!pilot) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-slate-900 dark:text-white" />
          </button>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="relative p-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: "48px 48px",
                  }}
                />
              </div>

              <div className="relative">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-white flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {pilot.name}
                    </h2>
                    <p className="text-blue-100 text-lg">
                      {pilot.city}, {pilot.region}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div
                    className={`
                    px-4 py-2 rounded-xl font-semibold text-sm
                    ${
                      pilot.status === "active"
                        ? "bg-green-500 text-white"
                        : pilot.status === "idle"
                          ? "bg-yellow-500 text-white"
                          : pilot.status === "maintenance"
                            ? "bg-red-500 text-white"
                            : "bg-slate-500 text-white"
                    }
                  `}
                  >
                    {pilot.status}
                  </div>
                </div>

                {pilot.description && (
                  <p className="text-blue-50 leading-relaxed">
                    {pilot.description}
                  </p>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Performance Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Energy Saved */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-3">
                    <Zap size={20} />
                    <span className="font-semibold">Energy Saved</span>
                  </div>
                  <div className="text-4xl font-bold text-green-900 dark:text-green-300 mb-2">
                    {formatMetric(pilot.metrics.energySaved, "energy")}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    Total since launch
                  </div>
                </div>

                {/* CO₂ Reduced */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-3">
                    <Leaf size={20} />
                    <span className="font-semibold">Carbon Reduced</span>
                  </div>
                  <div className="text-4xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                    {formatMetric(pilot.metrics.co2Reduced, "co2")}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    CO₂ equivalent
                  </div>
                </div>

                {/* Cost Savings */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-3">
                    <DollarSign size={20} />
                    <span className="font-semibold">Cost Savings</span>
                  </div>
                  <div className="text-4xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                    {formatMetric(pilot.metrics.costSavings, "currency")}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-400">
                    Total saved
                  </div>
                </div>
              </div>

              {/* Additional Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Active Devices */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Active Devices
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {pilot.metrics.activeDevices} /{" "}
                        {pilot.metrics.totalDevices}
                      </div>
                    </div>
                    <Activity className="text-slate-400" size={32} />
                  </div>
                </div>

                {/* Uptime */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        System Uptime
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {pilot.metrics.uptime}%
                      </div>
                    </div>
                    <TrendingUp className="text-slate-400" size={32} />
                  </div>
                </div>

                {/* Start Date */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Operational Since
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {new Date(pilot.startDate).toLocaleDateString("en-CA", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <Calendar className="text-slate-400" size={32} />
                  </div>
                </div>
              </div>

              {/* Device Types */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Installed Devices
                </h3>
                <div className="flex flex-wrap gap-3">
                  {pilot.deviceTypes.map((type, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg"
                    >
                      {type
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              {pilot.contactInfo && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-3">
                    {pilot.contactInfo.manager && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                          <User
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Manager
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {pilot.contactInfo.manager}
                          </div>
                        </div>
                      </div>
                    )}

                    {pilot.contactInfo.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                          <Mail
                            size={20}
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Email
                          </div>
                          <a
                            href={`mailto:${pilot.contactInfo.email}`}
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {pilot.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {pilot.contactInfo.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                          <Phone
                            size={20}
                            className="text-green-600 dark:text-green-400"
                          />
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Phone
                          </div>
                          <a
                            href={`tel:${pilot.contactInfo.phone}`}
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {pilot.contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Last active:{" "}
                  {new Date(pilot.lastActive).toLocaleString("en-CA")}
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PilotDetailModal;
