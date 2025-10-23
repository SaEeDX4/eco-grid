import React from "react";
import { motion } from "framer-motion";
import { Zap, Leaf, DollarSign, MapPin, Activity } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import { formatMetric } from "../../lib/mapHelpers";

const MapDashboard = ({ metrics, pilotCount }) => {
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
      icon: Zap,
      label: "Total Energy Saved",
      value: energyCounter.value,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100 dark:bg-green-950/30",
    },
    {
      icon: Leaf,
      label: "CO₂ Reduced",
      value: co2Counter.value,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-100 dark:bg-blue-950/30",
    },
    {
      icon: DollarSign,
      label: "Cost Savings",
      value: savingsCounter.value,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-100 dark:bg-purple-950/30",
    },
    {
      icon: MapPin,
      label: "Active Pilots",
      value: pilotsCounter.value,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-100 dark:bg-orange-950/30",
    },
    {
      icon: Activity,
      label: "Active Devices",
      value: devicesCounter.value,
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-950/30",
    },
  ];

  return (
    <div className="absolute top-4 right-4 z-10">
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
  );
};

export default MapDashboard;
