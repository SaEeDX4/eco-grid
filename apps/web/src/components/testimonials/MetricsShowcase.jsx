import React from "react";
import { DollarSign, Leaf, Zap, TrendingUp } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";

const MetricsShowcase = ({ metrics }) => {
  const showcaseMetrics = [
    {
      icon: DollarSign,
      label: "Total Cost Savings",
      value: metrics?.totalSavings || 1427000,
      prefix: "$",
      suffix: "",
      color: "from-green-500 to-emerald-600",
      decimals: 0,
    },
    {
      icon: Leaf,
      label: "CO₂ Reduced",
      value: metrics?.totalCO2 || 3920,
      prefix: "",
      suffix: " tonnes",
      color: "from-blue-500 to-cyan-600",
      decimals: 0,
    },
    {
      icon: Zap,
      label: "Energy Saved",
      value: metrics?.totalEnergy || 4750000,
      prefix: "",
      suffix: " kWh",
      color: "from-yellow-500 to-orange-600",
      decimals: 0,
    },
    {
      icon: TrendingUp,
      label: "Average ROI",
      value: metrics?.avgROI || 16,
      prefix: "",
      suffix: " months",
      color: "from-purple-500 to-pink-600",
      decimals: 0,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Collective Impact
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Real results from our growing community of energy-conscious
            organizations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {showcaseMetrics.map((metric, index) => {
            const counter = useCountUp(metric.value, 0, 2500, {
              prefix: metric.prefix,
              suffix: metric.suffix,
              separator: ",",
              decimals: metric.decimals,
              enabled: true,
            });

            const Icon = metric.icon;

            return (
              <div
                key={index}
                className="group relative animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${metric.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                />

                {/* Card */}
                <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="text-white" size={28} />
                  </div>

                  {/* Value */}
                  <div className="text-5xl font-bold text-white mb-2 font-mono">
                    {counter.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm text-blue-100 font-semibold">
                    {metric.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-blue-100 text-lg">
            Join{" "}
            <span className="font-bold text-white">127+ organizations</span>{" "}
            already making an impact
          </p>
        </div>
      </div>
    </section>
  );
};

export default MetricsShowcase;
