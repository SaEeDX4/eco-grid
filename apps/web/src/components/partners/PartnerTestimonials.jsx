import React from "react";
import { Quote } from "lucide-react";
import { Card } from "../ui/Card";
import { testimonials } from "../../lib/partnerData";

const PartnerTestimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            What Partners Say
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Feedback from organizations that have partnered with Eco-Grid
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="group hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Quote className="text-white" size={24} />
                </div>

                {/* Quote */}
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.position}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {testimonial.company}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerTestimonials;
