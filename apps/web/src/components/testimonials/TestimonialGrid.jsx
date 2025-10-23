import React from "react";
import TestimonialCard from "./TestimonialCard";
import { Loader, AlertCircle } from "lucide-react";

const TestimonialGrid = ({
  testimonials,
  loading,
  error,
  onVideoClick,
  onReadMore,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Loading testimonials...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-4">
          <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
        </div>
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          Failed to load testimonials
        </p>
        <p className="text-slate-600 dark:text-slate-400">{error}</p>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <AlertCircle className="text-slate-400" size={32} />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-semibold mb-2">
          No testimonials found
        </p>
        <p className="text-slate-500 dark:text-slate-500">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <div
          key={testimonial.id || testimonial._id}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TestimonialCard
            testimonial={testimonial}
            onVideoClick={onVideoClick}
            onReadMore={onReadMore}
          />
        </div>
      ))}
    </div>
  );
};

export default TestimonialGrid;
