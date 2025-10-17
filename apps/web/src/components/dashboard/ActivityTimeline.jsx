import React from "react";
import { Clock, Zap, Cpu, FileText, Leaf } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

const ActivityTimeline = ({ activities = [] }) => {
  const icons = {
    device: Zap,
    optimization: Cpu,
    report: FileText,
    reward: Leaf,
  };

  const colors = {
    device: "from-blue-500 to-cyan-500",
    optimization: "from-purple-500 to-pink-500",
    report: "from-orange-500 to-amber-500",
    reward: "from-green-500 to-emerald-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-blue-600" size={24} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {/* Activity Items */}
          <div className="space-y-6">
            {activities.map((activity, index) => {
              const Icon = icons[activity.type] || Zap;
              const colorGradient = colors[activity.type] || colors.device;

              return (
                <div key={activity.id} className="relative flex gap-4 group">
                  {/* Icon */}
                  <div
                    className={`
                    relative z-10 w-12 h-12 rounded-xl flex items-center justify-center
                    bg-gradient-to-br ${colorGradient}
                    shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                  `}
                  >
                    <Icon className="text-white" size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {activity.action}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap ml-2">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <button className="w-full mt-4 py-3 text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-colors">
          View All Activity
        </button>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
