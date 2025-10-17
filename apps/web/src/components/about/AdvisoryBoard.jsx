import React from "react";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import { Card } from "../ui/Card";
import { advisors } from "../../lib/teamData";

const AdvisoryBoard = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 rounded-full mb-4">
            <Award size={20} />
            <span className="font-semibold">Advisory Board</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Guided by Industry Leaders
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our advisors bring decades of experience from leading energy,
            technology, and policy organizations
          </p>
        </div>

        {/* Advisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {advisors.map((advisor, index) => (
            <Card
              key={advisor.id}
              className="group hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                    {advisor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {advisor.name}
                </h3>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">
                  {advisor.title}
                </p>

                {/* Affiliation */}
                <div className="flex items-start gap-2 mb-3 text-xs text-slate-600 dark:text-slate-400">
                  <Briefcase size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{advisor.affiliation}</span>
                </div>

                {/* Bio */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {advisor.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Advisory Benefits */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Why World-Class Advisors Matter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Strategic Guidance
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Expert advice on technology roadmap and market strategy
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Industry Connections
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Access to partnerships with utilities and government
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3">
                  <Award className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Credibility
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Validation from recognized leaders in energy and tech
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvisoryBoard;
