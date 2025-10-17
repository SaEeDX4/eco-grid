import React from "react";
import { ExternalLink, MapPin, Award } from "lucide-react";
import { Card } from "../ui/Card";
import { incubators } from "../../lib/partnerData";

const IncubatorShowcase = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-4">
            <Award size={20} />
            <span className="font-semibold">
              Supported By Leading Organizations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Incubators & Accelerators
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Backed by BC's top innovation programs, validating our technology
            and market approach
          </p>
        </div>

        {/* Incubators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {incubators.map((incubator, index) => (
            <Card
              key={incubator.id}
              className="group hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                {/* Logo Placeholder */}
                <div className="mb-4 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {incubator.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {incubator.name}
                    </h3>

                    {/* ✅ Fixed: added missing <a> tag */}
                    <a
                      href={incubator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{incubator.location}</span>
                    </div>
                    <div className="px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                      {incubator.type}
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {incubator.description}
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-semibold">
                    <Award size={16} />
                    {incubator.relationship}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Why Incubators Choose Eco-Grid
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Award className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Proven Technology
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Working product with real users and measurable impact
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Award className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Market Validation
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Strong partnerships with utilities and enterprise customers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Award className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Climate Impact
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Quantifiable carbon reduction aligned with clean energy
                    goals
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Award className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Scalable Business
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Clear path to profitability and national expansion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncubatorShowcase;
