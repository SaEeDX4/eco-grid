import React from "react";
import { Calendar, TrendingUp, Award, Target } from "lucide-react";

const ImpactTimeline = ({ milestones }) => {
  const defaultMilestones = [
    {
      date: "Q1 2024",
      title: "Platform Launch",
      description: "50 pilot participants across BC",
      icon: "Calendar",
      color: "from-blue-500 to-cyan-600",
    },
    {
      date: "Q2 2024",
      title: "First Million Saved",
      description: "Collective savings reached $1M",
      icon: "TrendingUp",
      color: "from-green-500 to-emerald-600",
    },
    {
      date: "Q3 2024",
      title: "Industry Recognition",
      description: "CleanTech BC Innovation Award",
      icon: "Award",
      color: "from-yellow-500 to-orange-600",
    },
    {
      date: "Q4 2024",
      title: "1000+ Organizations",
      description: "Reached 1000 active participants",
      icon: "Target",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const items = milestones || defaultMilestones;

  const iconMap = {
    Calendar,
    TrendingUp,
    Award,
    Target,
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Impact Journey
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Key milestones in building a more sustainable future
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />

            <div className="space-y-12">
              {items.map((milestone, index) => {
                const Icon = iconMap[milestone.icon] || Calendar;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`
                      flex items-center gap-8
                      ${isEven ? "flex-row" : "flex-row-reverse"}
                      animate-in fade-in slide-in-from-bottom duration-700
                    `}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Content */}
                    <div
                      className={`flex-1 ${isEven ? "text-right" : "text-left"}`}
                    >
                      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                          {milestone.date}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="relative z-10">
                      <div
                        className={`
                        w-16 h-16 rounded-full
                        bg-gradient-to-br ${milestone.color}
                        flex items-center justify-center
                        shadow-lg
                        ring-4 ring-white dark:ring-slate-950
                      `}
                      >
                        <Icon className="text-white" size={28} />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactTimeline;
