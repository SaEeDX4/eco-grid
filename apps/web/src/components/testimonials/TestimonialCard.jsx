import React, { useState } from "react";
import { Play, Quote, ArrowRight } from "lucide-react";
import RatingStars from "./RatingStars";
import * as LucideIcons from "lucide-react";
import { industries } from "../../lib/testimonialsData";

const TestimonialCard = ({ testimonial, onVideoClick, onReadMore }) => {
  const [isHovered, setIsHovered] = useState(false);

  const industry = industries.find((i) => i.id === testimonial.industry);
  const IndustryIcon = industry
    ? LucideIcons[industry.icon]
    : LucideIcons.Building;

  return (
    <div
      className="group relative animate-in fade-in slide-in-from-bottom duration-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

      {/* Card */}
      <div className="relative p-8 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Video badge */}
        {testimonial.videoUrl && (
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center shadow-lg animate-pulse">
              <Play size={18} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-950/30 group-hover:ring-blue-500 transition-all duration-300">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            {testimonial.featured && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                <span className="text-white text-xs">★</span>
              </div>
            )}
          </div>

          {/* Name & Role */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
              {testimonial.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              {testimonial.role}
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
              <IndustryIcon size={14} />
              <span>{testimonial.company}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <RatingStars rating={testimonial.rating} size="md" />
        </div>

        {/* Quote */}
        <div className="relative mb-6">
          <Quote
            className="absolute -top-2 -left-2 text-blue-200 dark:text-blue-900/30"
            size={32}
          />
          <p className="relative text-lg text-slate-700 dark:text-slate-300 leading-relaxed pl-6 italic">
            "{testimonial.quote}"
          </p>
        </div>

        {/* Metrics */}
        {testimonial.metrics && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="text-xs text-green-700 dark:text-green-400 mb-1">
                Savings
              </div>
              <div className="font-bold text-sm text-green-900 dark:text-green-300">
                {testimonial.metrics.costSavings}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-700 dark:text-blue-400 mb-1">
                CO₂ Cut
              </div>
              <div className="font-bold text-sm text-blue-900 dark:text-blue-300">
                {testimonial.metrics.carbonReduction}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-purple-700 dark:text-purple-400 mb-1">
                ROI
              </div>
              <div className="font-bold text-sm text-purple-900 dark:text-purple-300">
                {testimonial.metrics.roi}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {testimonial.videoUrl && (
            <button
              onClick={() => onVideoClick(testimonial)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Play size={18} fill="white" />
              Watch Video
            </button>
          )}
          {onReadMore && (
            <button
              onClick={() => onReadMore(testimonial)}
              className={`
                ${testimonial.videoUrl ? "flex-1" : "w-full"}
                flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200
              `}
            >
              Read Story
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
