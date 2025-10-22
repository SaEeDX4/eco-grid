import React from "react";
import { TrendingUp } from "lucide-react";
import { milestoneTargets } from "../../lib/suvData";
import * as LucideIcons from "lucide-react";

const SuccessMetrics = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
            <TrendingUp size={20} />
            <span className="font-semibold">Growth Trajectory</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Success Milestones
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Clear, measurable targets demonstrating our commitment to impact and
            sustainable growth
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {milestoneTargets.map((milestone, index) => {
            const Icon = LucideIcons[milestone.icon] || LucideIcons.Target;
            const progress = (milestone.current / milestone.target) * 100;

            return (
              <div
                key={milestone.id}
                className="group relative animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${milestone.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                />

                {/* Card */}
                <div className="relative p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${milestone.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="text-white" size={28} />
                  </div>

                  {/* Progress Circle */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-200 dark:text-slate-800"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={`url(#gradient-${milestone.id})`}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 56 * (1 - progress / 100)
                        }`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient
                          id={`gradient-${milestone.id}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            className={
                              milestone.color
                                ?.split(" ")[0]
                                ?.replace("from-", "text-") || "text-blue-500"
                            }
                            stopColor="currentColor"
                          />
                          <stop
                            offset="100%"
                            className={
                              milestone.color
                                ?.split(" ")[2]
                                ?.replace("to-", "text-") || "text-purple-600"
                            }
                            stopColor="currentColor"
                          />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Percentage */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                          {Math.round(progress)}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">
                          complete
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current / Target */}
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {milestone.current.toLocaleString()} {milestone.unit}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-500">
                      of {milestone.target.toLocaleString()} {milestone.unit}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">
                      {milestone.label}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Target: {milestone.targetDate}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${milestone.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Context */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              On Track for Sustainable Growth
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-center leading-relaxed">
              Our milestone targets are based on conservative market analysis
              and validated through pilot programs. We're currently ahead of
              schedule on household adoption and carbon reduction, demonstrating
              strong product-market fit and community engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessMetrics;
