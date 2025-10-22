import React from "react";
import { Leaf, Zap, Droplet, Award, MapPin } from "lucide-react";
import { greenHostingMetrics } from "../../lib/suvData";

const GreenHosting = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-950/20 dark:to-emerald-950/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full mb-6">
            <Leaf size={20} />
            <span className="font-semibold">Sustainable Infrastructure</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            100% Green Data Center Hosting
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            We practice what we preach. Our entire infrastructure runs on
            renewable energy, with carbon-neutral operations and
            industry-leading efficiency.
          </p>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Renewable Energy */}
          <div className="relative group animate-in fade-in slide-in-from-bottom duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="text-white" size={32} />
              </div>
              <div className="text-6xl font-bold text-slate-900 dark:text-white mb-2">
                {greenHostingMetrics.renewableEnergy}%
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Renewable Energy
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All electricity from renewable sources, primarily BC Hydro's
                clean hydroelectric power
              </p>
            </div>
          </div>

          {/* PUE Score */}
          <div
            className="relative group animate-in fade-in slide-in-from-bottom duration-700"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Droplet className="text-white" size={32} />
              </div>
              <div className="text-6xl font-bold text-slate-900 dark:text-white mb-2">
                {greenHostingMetrics.pue}
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                PUE Score
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Power Usage Effectiveness - industry best-in-class efficiency
                (ideal: 1.1-1.2)
              </p>
            </div>
          </div>

          {/* Carbon Neutral */}
          <div
            className="relative group animate-in fade-in slide-in-from-bottom duration-700"
            style={{ animationDelay: "200ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Certified
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Carbon Neutral
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Verified carbon-neutral operations through renewable energy and
                offset programs
              </p>
            </div>
          </div>
        </div>

        {/* Energy Source Breakdown */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Energy Source Breakdown
            </h3>

            <div className="space-y-4 mb-8">
              {greenHostingMetrics.energyBreakdown.map((source, index) => (
                <div
                  key={index}
                  className="animate-in fade-in slide-in-from-left duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {source.source}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {source.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${source.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: `${source.percentage}%`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Powered by{" "}
                <span className="font-bold text-green-600 dark:text-green-400">
                  BC Hydro
                </span>{" "}
                - one of the cleanest electricity grids in North America
              </p>
            </div>
          </div>
        </div>

        {/* Location & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Data Center Location */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MapPin className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Data Center Location
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Strategic Canadian infrastructure
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-900 dark:text-white font-semibold mb-2">
                {greenHostingMetrics.datacenterLocation}
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  98% clean electricity from hydro power
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Canadian data residency for PIPEDA compliance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Low-latency connectivity across BC
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Seismically resilient infrastructure
                </li>
              </ul>
            </div>
          </div>

          {/* Certifications */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Award className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Green Certifications
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Verified sustainability standards
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {greenHostingMetrics.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Award size={16} className="text-white" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commitment Statement */}
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            <div className="relative text-center">
              <h3 className="text-3xl font-bold mb-4">
                Our Green Hosting Commitment
              </h3>
              <p className="text-green-100 leading-relaxed mb-6">
                As a climate-tech company, we hold ourselves to the highest
                environmental standards. Every byte of data stored, every API
                call processed, and every optimization calculated runs on 100%
                renewable energy. We continuously monitor and improve our
                efficiency, and publish annual sustainability reports to
                maintain transparency.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
                  Zero Fossil Fuels
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
                  Annual Audits
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
                  Transparent Reporting
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold">
                  Continuous Improvement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreenHosting;
