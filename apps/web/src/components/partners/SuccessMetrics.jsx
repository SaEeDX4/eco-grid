import React from "react";
import { TrendingDown, DollarSign, ThumbsUp, Plug } from "lucide-react";
import { successMetrics } from "../../lib/partnerData";
import AnimatedNumber from "../ui/AnimatedNumber";
import * as LucideIcons from "lucide-react";

const SuccessMetrics = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Proven Results
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Real metrics from our partnership programs demonstrating measurable
            impact
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {successMetrics.map((metric, index) => {
            const Icon = LucideIcons[metric.icon] || LucideIcons.Award;

            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-center group animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-white" size={32} />
                </div>

                {/* Metric */}
                <div className="text-5xl font-bold mb-2">{metric.metric}</div>

                {/* Label */}
                <h3 className="text-lg font-semibold mb-3">{metric.label}</h3>

                {/* Description */}
                <p className="text-sm text-blue-100 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-4xl font-bold mb-2">4</div>
            <div className="text-blue-100">Active Partnerships</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-4xl font-bold mb-2">2</div>
            <div className="text-blue-100">Utilities Engaged</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-blue-100">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessMetrics;
