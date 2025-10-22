import React, { useEffect, useRef } from "react";
import { Zap, DollarSign, Leaf, Droplet, Home, Battery } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import { useImpactMetrics } from "../../hooks/useImpactMetrics";
import { observeIntersection } from "../../lib/animationUtils";

const LiveImpactCounter = () => {
  const { metrics, loading } = useImpactMetrics();
  const sectionRef = useRef(null);
  const hasTriggered = useRef(false);

  const counters = [
    {
      icon: Zap,
      label: "Energy Saved",
      value: metrics?.energySavedKWh || 0,
      suffix: " kWh",
      color: "from-yellow-500 to-orange-600",
      decimals: 0,
    },
    {
      icon: DollarSign,
      label: "Money Saved",
      value: metrics?.moneySavedCAD || 0,
      prefix: "$",
      suffix: " CAD",
      color: "from-green-500 to-emerald-600",
      decimals: 0,
    },
    {
      icon: Leaf,
      label: "CO₂ Reduced",
      value: metrics?.co2ReducedKg || 0,
      suffix: " kg",
      color: "from-blue-500 to-cyan-600",
      decimals: 0,
    },
    {
      icon: Home,
      label: "Active Homes",
      value: metrics?.activeHomes || 0,
      suffix: "",
      color: "from-purple-500 to-pink-600",
      decimals: 0,
    },
    {
      icon: Battery,
      label: "Devices Managed",
      value: metrics?.devicesManaged || 0,
      suffix: "",
      color: "from-indigo-500 to-purple-600",
      decimals: 0,
    },
    {
      icon: Droplet,
      label: "Water Saved",
      value: metrics?.waterSavedLiters || 0,
      suffix: " L",
      color: "from-cyan-500 to-blue-600",
      decimals: 0,
    },
  ];

  const energyCounter = useCountUp(counters[0].value, 0, 2500, {
    suffix: counters[0].suffix,
    separator: ",",
    enabled: !loading,
  });

  const moneyCounter = useCountUp(counters[1].value, 0, 2500, {
    prefix: counters[1].prefix,
    suffix: counters[1].suffix,
    separator: ",",
    enabled: !loading,
  });

  const co2Counter = useCountUp(counters[2].value, 0, 2500, {
    suffix: counters[2].suffix,
    separator: ",",
    enabled: !loading,
  });

  const homesCounter = useCountUp(counters[3].value, 0, 2500, {
    separator: ",",
    enabled: !loading,
  });

  const devicesCounter = useCountUp(counters[4].value, 0, 2500, {
    separator: ",",
    enabled: !loading,
  });

  const waterCounter = useCountUp(counters[5].value, 0, 2500, {
    suffix: counters[5].suffix,
    separator: ",",
    enabled: !loading,
  });

  const allCounters = [
    energyCounter,
    moneyCounter,
    co2Counter,
    homesCounter,
    devicesCounter,
    waterCounter,
  ];

  useEffect(() => {
    if (!sectionRef.current || loading || hasTriggered.current) return;

    const observer = observeIntersection(
      sectionRef.current,
      () => {
        if (!hasTriggered.current) {
          hasTriggered.current = true;
          allCounters.forEach((counter) => counter.start());
        }
      },
      { threshold: 0.3 }
    );

    return () => observer.disconnect();
  }, [loading]);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "48px 48px",
            animation: "drift 20s linear infinite",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold">Live Impact Metrics</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Real-Time Community Impact
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Every kilowatt-hour saved, every dollar returned, every tonne of CO₂
            reduced—tracked in real-time across our growing community
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {counters.map((counter, index) => {
            const countData = allCounters[index];

            return (
              <div
                key={index}
                className="group relative animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${counter.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                />

                {/* Card */}
                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${counter.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <counter.icon className="text-white" size={32} />
                  </div>

                  {/* Counter */}
                  <div className="text-5xl font-bold mb-2 font-mono tracking-tight">
                    {loading ? (
                      <div className="h-14 w-32 bg-white/10 rounded-lg animate-pulse" />
                    ) : (
                      countData.value
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-lg text-blue-100 font-semibold">
                    {counter.label}
                  </div>

                  {/* Pulse Indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-blue-200">Updating live</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Context */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="text-left">
              <div className="text-sm text-blue-200 mb-1">
                Equivalent Impact
              </div>
              <div className="text-2xl font-bold">
                {Math.round((metrics?.co2ReducedKg || 0) / 21)} Trees Planted
              </div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-left">
              <div className="text-sm text-blue-200 mb-1">Community Growth</div>
              <div className="text-2xl font-bold">
                +{Math.round((metrics?.activeHomes || 0) * 0.15)} This Month
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes drift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(48px, 48px);
          }
        }
      `}</style>
    </section>
  );
};

export default LiveImpactCounter;
