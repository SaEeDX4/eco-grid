import React, { useState, useEffect } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Homeowner, Vancouver",
    avatar: "SC",
    rating: 5,
    text: "Eco-Grid cut my electricity bill by 42% in the first month! The AI coach gives me daily tips that actually work. Love the real-time monitoring.",
    savings: "$180/month",
  },
  {
    name: "Michael Roberts",
    role: "Small Business Owner, Burnaby",
    avatar: "MR",
    rating: 5,
    text: "As a café owner, energy costs were killing my margins. Eco-Grid optimized my refrigeration and HVAC. ROI in 3 months!",
    savings: "$520/month",
  },
  {
    name: "Priya Patel",
    role: "Tech Professional, Richmond",
    avatar: "PP",
    rating: 5,
    text: "The P2P energy trading feature is brilliant! I sell excess solar energy to my neighbors and earn extra income. Plus the carbon tracking is motivating.",
    savings: "$240/month + trading",
  },
  {
    name: "David Kim",
    role: "EV Owner, Surrey",
    avatar: "DK",
    rating: 5,
    text: "Smart EV charging during off-peak hours saves me a fortune. The app even tells me the best time to charge based on grid prices. Game changer!",
    savings: "$95/month",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, isVisible] = useScrollAnimation(0.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-950 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" ref={ref}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Loved by Vancouver Residents
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Join thousands of happy customers saving money and the planet
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <Quote size={100} className="text-green-600" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 relative z-10">
                "{currentTestimonial.text}"
              </p>

              {/* Savings Badge */}
              <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <span className="text-green-700 dark:text-green-400 font-bold">
                  💰 Saving: {currentTestimonial.savings}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {currentTestimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-lg">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {currentTestimonial.role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-110 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft
                size={24}
                className="text-slate-700 dark:text-slate-300"
              />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-green-600 w-8"
                      : "bg-slate-300 dark:bg-slate-600 hover:bg-green-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-110 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight
                size={24}
                className="text-slate-700 dark:text-slate-300"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
