import React from "react";
import { Lightbulb, Award } from "lucide-react";
import { innovationStory } from "../../lib/suvData";
import * as LucideIcons from "lucide-react";

const InnovationNarrative = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full mb-6 border border-slate-200 dark:border-slate-700">
            <Lightbulb size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Our Innovation Story
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {innovationStory.tagline}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
            {innovationStory.mission}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg">
            <Award size={20} />
            <span>Startup Visa Applicant - Innovation Category</span>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="p-8 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-2 border-white/50 dark:border-slate-700/50 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Our Vision
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 text-center leading-relaxed">
              {innovationStory.vision}
            </p>
          </div>
        </div>

        {/* Innovation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {innovationStory.pillars.map((pillar, index) => {
            const Icon = LucideIcons[pillar.icon] || LucideIcons.Star;

            return (
              <div
                key={index}
                className="group relative animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                {/* Card */}
                <div className="relative p-8 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-2 border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="text-white" size={32} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-3">
                    {pillar.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mt-2 flex-shrink-0" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl">
            <h3 className="text-2xl font-bold">
              Supporting Canada's Climate Innovation Ecosystem
            </h3>
            <p className="text-blue-100 max-w-2xl">
              Through the Startup Visa program, we're building a world-class
              team in Vancouver to deliver clean energy solutions that benefit
              all Canadians while creating high-value jobs and establishing
              Canada as a global leader in climate tech.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationNarrative;
