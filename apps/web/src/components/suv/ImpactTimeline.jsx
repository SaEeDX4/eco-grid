import React from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { innovationStory } from "../../lib/suvData";

const ImpactTimeline = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
            <Calendar size={20} />
            <span className="font-semibold">Growth Roadmap</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Journey to Impact
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A clear, achievable timeline demonstrating our path from pilot to
            national impact
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 transform -translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {innovationStory.timeline.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } animate-in fade-in ${
                    isLeft ? "slide-in-from-left" : "slide-in-from-right"
                  } duration-700`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Content */}
                  <div
                    className={`w-full md:w-5/12 ${
                      isLeft
                        ? "md:text-right md:pr-12"
                        : "md:text-left md:pl-12"
                    }`}
                  >
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 group">
                      {/* Year & Quarter */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-bold mb-4">
                        <Calendar size={14} />
                        {item.year} {item.quarter}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>

                      {/* Milestones */}
                      <ul className="space-y-2">
                        {item.milestones.map((milestone, idx) => (
                          <li
                            key={idx}
                            className={`flex items-start gap-2 ${
                              isLeft ? "md:flex-row-reverse md:text-right" : ""
                            }`}
                          >
                            <CheckCircle
                              size={16}
                              className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {milestone}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center shadow-lg z-10 group-hover:scale-125 transition-transform duration-300">
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900" />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block w-5/12" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Vision */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white relative overflow-hidden">
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
                Beyond 2027: National Scale
              </h3>
              <p className="text-blue-100 leading-relaxed">
                By 2030, we envision Eco-Grid serving 50,000+ households and
                500+ businesses across Canada, reducing 5,000+ tonnes of CO₂
                annually, and establishing Vancouver as a global hub for
                AI-powered clean energy innovation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactTimeline;
