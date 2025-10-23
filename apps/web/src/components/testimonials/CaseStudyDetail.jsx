import React from "react";
import {
  Building,
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  Zap,
  Leaf,
  Clock,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { industries } from "../../lib/testimonialsData";

const CaseStudyDetail = ({ caseStudy }) => {
  const industry = industries.find((i) => i.id === caseStudy.industry);
  const IndustryIcon = industry
    ? LucideIcons[industry.icon]
    : LucideIcons.Building;

  return (
    <article className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-2xl">
          {caseStudy.heroImage ? (
            <img
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-8xl font-bold text-white opacity-50">
                {caseStudy.company.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-6 left-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 font-semibold">
              <IndustryIcon size={18} />
              {industry?.name || "Case Study"}
            </div>
          </div>
        </div>

        {/* Title & Company */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          {caseStudy.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <Building size={18} />
            <span className="font-semibold">{caseStudy.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>{caseStudy.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{caseStudy.companySize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>
              {new Date(caseStudy.publishedAt).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-3">
            <TrendingUp size={20} />
            <span className="font-semibold">Cost Savings</span>
          </div>
          <div className="text-4xl font-bold text-green-900 dark:text-green-300 mb-2">
            {caseStudy.metrics.costSavings}
          </div>
          <div className="text-sm text-green-700 dark:text-green-400">
            Annual reduction
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-3">
            <Leaf size={20} />
            <span className="font-semibold">Carbon Reduced</span>
          </div>
          <div className="text-4xl font-bold text-blue-900 dark:text-blue-300 mb-2">
            {caseStudy.metrics.carbonReduction}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-400">
            CO₂ equivalent
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-3">
            <Clock size={20} />
            <span className="font-semibold">ROI Timeline</span>
          </div>
          <div className="text-4xl font-bold text-purple-900 dark:text-purple-300 mb-2">
            {caseStudy.metrics.roi}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-400">
            Payback period
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-3">
            <Zap size={20} />
            <span className="font-semibold">Energy Saved</span>
          </div>
          <div className="text-4xl font-bold text-orange-900 dark:text-orange-300 mb-2">
            {caseStudy.metrics.energySaved || "35%"}
          </div>
          <div className="text-sm text-orange-700 dark:text-orange-400">
            Efficiency gain
          </div>
        </div>
      </div>

      {/* Challenge, Solution, Results */}
      <div className="space-y-12 mb-16">
        {/* Challenge */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            The Challenge
          </h2>
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {caseStudy.challenge}
            </p>
          </div>
        </section>

        {/* Solution */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
            The Solution
          </h2>
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {caseStudy.solution}
            </p>
          </div>
        </section>

        {/* Results */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
            The Results
          </h2>
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              {caseStudy.results}
            </p>
          </div>
        </section>
      </div>

      {/* Quote */}
      {caseStudy.quote && (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 mb-16">
          <blockquote className="text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed mb-6 italic">
            "{caseStudy.quote.text}"
          </blockquote>
          <div className="flex items-center gap-4">
            {caseStudy.quote.avatar && (
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-200 dark:ring-blue-800">
                <img
                  src={caseStudy.quote.avatar}
                  alt={caseStudy.quote.author}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                {caseStudy.quote.author}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {caseStudy.quote.role}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technologies Used */}
      {caseStudy.technologies && caseStudy.technologies.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Technologies Deployed
          </h2>
          <div className="flex flex-wrap gap-3">
            {caseStudy.technologies.map((tech, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Download CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          Want to achieve similar results?
        </h3>
        <p className="text-blue-100 mb-6 text-lg">
          Download the full case study PDF or get in touch to discuss your
          energy optimization goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl transition-all duration-200 hover:scale-105">
            Download PDF
          </button>
          <button className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-200">
            Schedule Consultation
          </button>
        </div>
      </div>
    </article>
  );
};

export default CaseStudyDetail;
