import React from "react";
import { ArrowRight, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { industries } from "../../lib/testimonialsData";

const CaseStudyCard = ({ caseStudy }) => {
  const industry = industries.find((i) => i.id === caseStudy.industry);
  const IndustryIcon = industry
    ? LucideIcons[industry.icon]
    : LucideIcons.Building;

  return (
    <Link
      to={`/case-studies/${caseStudy.slug}`}
      className="group block animate-in fade-in slide-in-from-bottom duration-700"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Hero Image */}
        <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
          {caseStudy.heroImage ? (
            <>
              <img
                src={caseStudy.heroImage}
                alt={caseStudy.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-6xl font-bold text-white opacity-50">
                {caseStudy.company.charAt(0)}
              </span>
            </div>
          )}

          {/* Industry Badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-semibold">
              <IndustryIcon size={14} />
              {industry?.name || "Case Study"}
            </div>
          </div>

          {/* Success Badge */}
          {caseStudy.featured && (
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold shadow-lg">
                Featured
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                {new Date(caseStudy.publishedAt).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <span>•</span>
            <span>{caseStudy.readingTime || 5} min read</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {caseStudy.title}
          </h3>

          {/* Company */}
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {caseStudy.company}
          </p>

          {/* Summary */}
          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
            {caseStudy.summary}
          </p>

          {/* Key Metrics */}
          {caseStudy.metrics && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 mb-1">
                  <TrendingUp size={12} />
                  <span>Savings</span>
                </div>
                <div className="font-bold text-sm text-green-900 dark:text-green-300">
                  {caseStudy.metrics.costSavings}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-700 dark:text-blue-400 mb-1">
                  CO₂
                </div>
                <div className="font-bold text-sm text-blue-900 dark:text-blue-300">
                  {caseStudy.metrics.carbonReduction}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <div className="text-xs text-purple-700 dark:text-purple-400 mb-1">
                  ROI
                </div>
                <div className="font-bold text-sm text-purple-900 dark:text-purple-300">
                  {caseStudy.metrics.roi}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
            Read Full Case Study
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CaseStudyCard;
