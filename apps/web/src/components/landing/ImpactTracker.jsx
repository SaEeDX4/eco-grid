import React from "react";
import { DollarSign, Leaf, Car, Home, Droplets, Battery } from "lucide-react";
import { Card } from "../ui/Card";
import { useCountUp } from "../../hooks/useCountUp";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const ImpactCard = ({
  icon: Icon,
  value,
  label,
  prefix = "",
  suffix = "",
  delay = 0,
}) => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const animatedValue = useCountUp(isVisible ? value : 0, 2000);

  return (
    <div
      ref={ref}
      className="animate-in fade-in slide-in-from-bottom-4 duration-1000"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card hover className="p-6 text-center group">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
          <Icon size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {prefix}
          {animatedValue.toLocaleString()}
          {suffix}
        </div>
        <div className="text-slate-600 dark:text-slate-400 font-medium">
          {label}
        </div>
      </Card>
    </div>
  );
};

const ImpactTracker = () => {
  const [ref] = useScrollAnimation(0.2);

  // Mock real-time data — in production, feed these from API
  const impacts = [
    {
      icon: DollarSign,
      value: 2847650,
      label: "Saved (CAD)",
      prefix: "$",
      delay: 0,
    },
    { icon: Leaf, value: 1254, label: "CO₂ Reduced (tons)", delay: 100 },
    { icon: Car, value: 5420, label: "EV Kilometers", suffix: "k", delay: 200 },
    { icon: Home, value: 2150, label: "Homes Powered", delay: 300 },
    {
      icon: Droplets,
      value: 847,
      label: "Water Saved (liters)",
      suffix: "k",
      delay: 400,
    },
    { icon: Battery, value: 1680, label: "Battery Cycles", delay: 500 },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" ref={ref}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Community Impact
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Join over 2,000 households in Vancouver making a real difference
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full animate-in fade-in duration-1000 delay-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 dark:text-green-400 font-semibold text-sm">
              Updated in real-time
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {impacts.map((impact, index) => (
            <ImpactCard key={index} {...impact} />
          ))}
        </div>

        {/* Additional Stats Bar */}
        <div className="mt-16 p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                2,000+
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                Active Users
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                4.8★
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                User Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                40%
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                Avg. Savings
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                24/7
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">
                AI Monitoring
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactTracker;
