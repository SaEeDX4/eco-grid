import React, { useState, useEffect } from "react";
import { Award, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import FeaturedTestimonial from "../components/testimonials/FeaturedTestimonial";
import TestimonialGrid from "../components/testimonials/TestimonialGrid";
import TestimonialFilters from "../components/testimonials/TestimonialFilters";
import CompanyLogos from "../components/testimonials/CompanyLogos";
import MetricsShowcase from "../components/testimonials/MetricsShowcase";
import VideoModal from "../components/testimonials/VideoModal";
import CaseStudyCard from "../components/testimonials/CaseStudyCard";
import { useTestimonials } from "../hooks/useTestimonials";
import { useCaseStudies } from "../hooks/useCaseStudies";
import ImpactTimeline from "../components/testimonials/ImpactTimeline";

const TestimonialsPage = () => {
  const [filters, setFilters] = useState({
    industries: [],
    categories: [],
    sizes: [],
  });
  const [videoModal, setVideoModal] = useState(null);

  const { testimonials, loading, error, fetchTestimonials } = useTestimonials();
  const { caseStudies } = useCaseStudies();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchTestimonials(filters);
  }, [filters]);

  const handleVideoClick = (testimonial) => {
    setVideoModal(testimonial);
  };

  const handleCloseVideo = () => {
    setVideoModal(null);
  };

  const handleReadMore = (testimonial) => {
    // Navigate to case study if available
    console.log("Read more:", testimonial);
  };

  const featuredTestimonials = testimonials.filter((t) => t.featured);
  const regularTestimonials = testimonials.filter((t) => !t.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
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
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
              <Award size={20} />
              <span className="font-semibold">Success Stories</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Real Results from Real Organizations
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Discover how leading organizations across Canada are achieving
              dramatic cost savings, carbon reductions, and operational
              improvements with Eco-Grid
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Your Success Story
                <ChevronRight size={20} />
              </Link>

              {/* ✅ FIXED BUTTON (added missing <a> tag) */}
              <a
                href="#case-studies"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                View Case Studies
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <CompanyLogos />

      {/* Featured Testimonial */}
      {featuredTestimonials.length > 0 && (
        <FeaturedTestimonial
          testimonials={featuredTestimonials}
          onVideoClick={handleVideoClick}
          onReadMore={handleReadMore}
        />
      )}

      {/* Metrics Showcase */}
      <MetricsShowcase />

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Hear directly from organizations that have transformed their
                energy management
              </p>
            </div>

            {/* Filters */}
            <div className="mb-12">
              <TestimonialFilters
                activeFilters={filters}
                onFilterChange={setFilters}
              />
            </div>

            {/* Grid */}
            <TestimonialGrid
              testimonials={regularTestimonials}
              loading={loading}
              error={error}
              onVideoClick={handleVideoClick}
              onReadMore={handleReadMore}
            />
          </div>
        </div>
      </section>

      <ImpactTimeline />

      {/* Case Studies Section */}
      {caseStudies && caseStudies.length > 0 && (
        <section id="case-studies" className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  In-Depth Case Studies
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Explore detailed analyses of successful implementations across
                  different industries
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.slice(0, 3).map((caseStudy, index) => (
                  <div
                    key={caseStudy._id}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CaseStudyCard caseStudy={caseStudy} />
                  </div>
                ))}
              </div>

              {caseStudies.length > 3 && (
                <div className="text-center mt-12">
                  <Link
                    to="/case-studies"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    View All Case Studies
                    <ChevronRight size={20} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 127+ organizations already saving money, reducing carbon, and
              optimizing energy with Eco-Grid
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl transition-all duration-200 hover:scale-105"
              >
                Schedule a Demo
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/30 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModal && (
        <VideoModal testimonial={videoModal} onClose={handleCloseVideo} />
      )}
    </div>
  );
};

export default TestimonialsPage;
