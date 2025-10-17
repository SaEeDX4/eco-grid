import React from "react";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { companyMilestones } from "../../lib/teamData";
import * as LucideIcons from "lucide-react";

const CompanyTimeline = () => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-600" size={24} />;
      case "in_progress":
        return <Clock className="text-blue-600" size={24} />;
      default:
        return <Circle className="text-slate-400" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 dark:bg-green-950/20";
      case "in_progress":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950/20";
      default:
        return "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800";
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From founding to becoming Canada's leading energy management
            platform
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-slate-300 dark:to-slate-700" />

            {/* Milestones */}
            <div className="space-y-8">
              {companyMilestones.map((milestone, index) => {
                const Icon = LucideIcons[milestone.icon] || LucideIcons.Circle;
                const isLast = index === companyMilestones.length - 1;

                return (
                  <div
                    key={milestone.id}
                    className="relative pl-20 animate-in fade-in slide-in-from-left duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Status Icon */}
                    <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center z-10">
                      {getStatusIcon(milestone.status)}
                    </div>

                    {/* Content Card */}
                    <div
                      className={`
                      p-6 rounded-2xl border-2 transition-all duration-300
                      hover:shadow-xl group
                      ${getStatusColor(milestone.status)}
                    `}
                    >
                      {/* Year/Quarter */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            {milestone.year} {milestone.quarter}
                          </span>
                          <div
                            className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${
                              milestone.status === "completed"
                                ? "bg-green-500"
                                : milestone.status === "in_progress"
                                  ? "bg-blue-500"
                                  : "bg-slate-400"
                            }
                            group-hover:scale-110 transition-transform duration-300
                          `}
                          >
                            <Icon className="text-white" size={20} />
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`
                          px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            milestone.status === "completed"
                              ? "bg-green-600 text-white"
                              : milestone.status === "in_progress"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }
                        `}
                        >
                          {milestone.status === "completed" && "Completed"}
                          {milestone.status === "in_progress" && "In Progress"}
                          {milestone.status === "upcoming" && "Upcoming"}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {companyMilestones.filter((m) => m.status === "completed").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Milestones Achieved
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {
                companyMilestones.filter((m) => m.status === "in_progress")
                  .length
              }
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              In Progress
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {companyMilestones.filter((m) => m.status === "upcoming").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Upcoming
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              2030
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Vision Target
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;
