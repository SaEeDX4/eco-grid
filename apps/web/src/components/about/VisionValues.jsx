import React from "react";
import { Leaf, Users, Lightbulb, Shield, Heart, Target } from "lucide-react";
import { companyValues } from "../../lib/teamData";

const iconMap = {
  Leaf,
  Users,
  Lightbulb,
  Shield,
  Heart,
  Target,
};

const VisionValues = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            The principles that guide every decision and innovation at Eco-Grid
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {companyValues.map((value, index) => {
            const Icon = iconMap[value.icon];

            return (
              <div
                key={value.id}
                className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div
                  className={`
                  w-14 h-14 rounded-xl mb-4
                  bg-gradient-to-br ${value.color}
                  flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300
                  shadow-lg
                `}
                >
                  <Icon className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VisionValues;
