import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Leaf,
  DollarSign,
  MapPin,
  Activity,
  BarChart2,
  X,
} from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";

const MapDashboard = ({ metrics, pilotCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const energyCounter = useCountUp(
    metrics?.totalEnergy ? metrics.totalEnergy / 1000 : 0,
    0,
    2000,
    { suffix: " MWh", decimals: 1, enabled: !!metrics }
  );

  const co2Counter = useCountUp(metrics?.totalCO2 || 0, 0, 2000, {
    suffix: " tonnes",
    decimals: 1,
    enabled: !!metrics,
  });

  const savingsCounter = useCountUp(metrics?.totalSavings || 0, 0, 2000, {
    prefix: "$",
    separator: ",",
    decimals: 0,
    enabled: !!metrics,
  });

  const pilotsCounter = useCountUp(pilotCount || 0, 0, 1500, {
    decimals: 0,
    enabled: !!pilotCount,
  });

  const devicesCounter = useCountUp(metrics?.activeDevices || 0, 0, 1500, {
    decimals: 0,
    enabled: !!metrics,
  });

  if (!metrics) return null;

  const kpis = [
    {
      label: "Total Energy Saved",
      value: energyCounter.value,
      color: "from-green-400 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      icon: () => (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#gradEnergy)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.05, 1], opacity: [1, 0.85, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <defs>
            <linearGradient id="gradEnergy" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path d="M13 2L3 14h7v8l11-13h-8z" />
        </motion.svg>
      ),
    },
    {
      label: "CO₂ Reduced",
      value: co2Counter.value,
      color: "from-sky-400 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      icon: () => (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#gradCO2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
          animate={{ y: [0, -2, 0], opacity: [1, 0.8, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <defs>
            <linearGradient id="gradCO2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12h8M12 8v8" />
        </motion.svg>
      ),
    },
    {
      label: "Cost Savings",
      value: savingsCounter.value,
      color: "from-purple-400 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      icon: () => (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#gradMoney)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <defs>
            <linearGradient id="gradMoney" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path d="M12 1v22M8 4h8a4 4 0 110 8H8a4 4 0 100 8h8" />
        </motion.svg>
      ),
    },
    {
      label: "Active Pilots",
      value: pilotsCounter.value,
      color: "from-orange-400 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      icon: () => (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#gradPilot)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="gradPilot" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          <circle cx="12" cy="12" r="3" />
        </motion.svg>
      ),
    },
    {
      label: "Active Devices",
      value: devicesCounter.value,
      color: "from-indigo-400 to-violet-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      icon: () => (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#gradDevice)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.9, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <defs>
            <linearGradient id="gradDevice" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <circle cx="12" cy="12" r="2" />
        </motion.svg>
      ),
    },
  ];

  return (
    <>
      {/* ✅ Large screens: full dashboard */}
      <div className="hidden md:block absolute top-4 max-lg:top-20 right-11 z-10">
        <motion.div
          className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-700 shadow-2xl w-[320px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Impact Dashboard
          </h3>

          <div className="space-y-3">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={index}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${kpi.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon
                        size={20}
                        className={`bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent`}
                        style={{
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {kpi.label}
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                        {kpi.value}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Real-time data from BC pilot network
            </p>
          </div>
        </motion.div>
      </div>

      {/* ✅ Small & medium screens: icon toggle */}
      <div className="md:hidden absolute bottom-[17.3rem] right-[1.7rem] z-50">
        <motion.div
          className="relative w-14 h-14 flex items-center justify-center"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Outer glowing pulse (same as before, non-clickable) */}
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-400/30 blur-lg pointer-events-none"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/40 blur-md pointer-events-none"
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Clickable button */}
          <motion.button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl flex items-center justify-center ring-2 ring-white/30 hover:ring-4 hover:ring-emerald-400/70 transition-all overflow-hidden"
            whileTap={{ scale: 0.9 }}
          >
            {/* Animated live bars */}
            <div className="flex items-end justify-center gap-[3px] h-5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-white rounded-full"
                  animate={{
                    height: ["30%", "100%", "40%"],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* ✅ Mobile modal view */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-sm p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X size={18} className="text-slate-600 dark:text-slate-300" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Impact Dashboard
              </h3>

              <div className="space-y-3">
                {kpis.map((kpi, index) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${kpi.bgColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon
                            size={20}
                            className={`bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent`}
                            style={{
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                            {kpi.label}
                          </div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                            {kpi.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Real-time data from BC pilot network
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MapDashboard;
