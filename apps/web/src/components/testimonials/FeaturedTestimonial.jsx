import React, { useState, useEffect } from "react";
import {
  Play,
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import RatingStars from "./RatingStars";
import * as LucideIcons from "lucide-react";
import { industries } from "../../lib/testimonialsData";

const FeaturedTestimonial = ({ testimonials, onVideoClick, onReadMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featured = testimonials.filter((t) => t.featured);
  const currentTestimonial = featured[currentIndex];

  useEffect(() => {
    if (!isAutoPlaying || featured.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featured.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  if (!currentTestimonial) return null;

  const industry = industries.find((i) => i.id === currentTestimonial.industry);
  const IndustryIcon = industry
    ? LucideIcons[industry.icon]
    : LucideIcons.Building;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <span className="text-white font-semibold">
                Featured Success Story
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div className="relative p-10 rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom duration-700">
            {/* Navigation Arrows */}
            {featured.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 text-white"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 text-white"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div className="text-white">
                {/* Quote Icon */}
                <Quote className="mb-6 opacity-50" size={48} />

                {/* Quote Text */}
                <blockquote className="text-3xl font-bold leading-relaxed mb-8">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Rating */}
                <div className="mb-6">
                  <RatingStars rating={currentTestimonial.rating} size="lg" />
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/30">
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xl font-bold mb-1">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-blue-100 mb-1">
                      {currentTestimonial.role}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-200">
                      <IndustryIcon size={14} />
                      <span>{currentTestimonial.company}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {currentTestimonial.videoUrl && (
                    <button
                      onClick={() => onVideoClick(currentTestimonial)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-bold hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      <Play size={20} fill="currentColor" />
                      Watch Video
                    </button>
                  )}
                  {onReadMore && (
                    <button
                      onClick={() => onReadMore(currentTestimonial)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold hover:bg-white/30 transition-all duration-200"
                    >
                      Read Full Story
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Metrics */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Impact Metrics
                </h3>

                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="text-sm text-blue-100 mb-2">
                      Annual Cost Savings
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {currentTestimonial.metrics.costSavings}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="text-sm text-blue-100 mb-2">
                      Carbon Reduction
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {currentTestimonial.metrics.carbonReduction}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="text-sm text-blue-100 mb-2">
                      Return on Investment
                    </div>
                    <div className="text-4xl font-bold text-white">
                      {currentTestimonial.metrics.roi}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            {featured.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {featured.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${
                        index === currentIndex
                          ? "bg-white w-8"
                          : "bg-white/40 hover:bg-white/60"
                      }
                    `}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTestimonial;
