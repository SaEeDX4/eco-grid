import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MapIcon, Target, Sparkles, Download } from "lucide-react";
import RoadmapTimeline from "../components/roadmap/RoadmapTimeline";
import CategoryFilter from "../components/roadmap/CategoryFilter";
import TimelineNavigation from "../components/roadmap/TimelineNavigation";
import NewsletterSignup from "../components/roadmap/NewsletterSignup";
import { useRoadmap } from "../hooks/useRoadmap";
import {
  calculateOverallProgress,
  getMilestonesByStatus,
} from "../lib/roadmapHelpers";

const RoadmapPage = () => {
  const { years, allYears, activeCategory, setCategory, selectMilestone } =
    useRoadmap();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const overallProgress = calculateOverallProgress(allYears);
  const completedMilestones = getMilestonesByStatus(allYears, "completed");
  const inProgressMilestones = getMilestonesByStatus(allYears, "in-progress");
  const plannedMilestones = getMilestonesByStatus(allYears, "planned");

  const totalMilestones =
    completedMilestones.length +
    inProgressMilestones.length +
    plannedMilestones.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Our Roadmap
              </h1>
            </div>

            <p className="text-xl text-blue-100 mb-8">
              The path from BC pilots to global energy transformation
            </p>

            {/* Vision Statement */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-lg font-semibold mb-8">
              <Target size={20} />
              10M Users by 2032
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <motion.div
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {totalMilestones}
                </div>
                <div className="text-sm text-blue-100">Total Milestones</div>
              </motion.div>

              <motion.div
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {completedMilestones.length}
                </div>
                <div className="text-sm text-blue-100">Completed</div>
              </motion.div>

              <motion.div
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {inProgressMilestones.length}
                </div>
                <div className="text-sm text-blue-100">In Progress</div>
              </motion.div>

              <motion.div
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {overallProgress}%
                </div>
                <div className="text-sm text-blue-100">Overall Progress</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                <Sparkles size={16} />
                Transparent & Ambitious
              </div>

              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Building the Future of Energy, One Milestone at a Time
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Our roadmap is more than dates and features—it's a commitment to
                transparency, realistic planning, and measurable impact. We're
                building infrastructure that will power millions of homes while
                reducing global carbon emissions by millions of tonnes.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Download size={20} />
                  Download PDF
                </button>

                {/* FIXED A TAG */}
                <a
                  href="#newsletter"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Get Updates
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <CategoryFilter
            allYears={allYears}
            activeCategory={activeCategory}
            onCategoryChange={setCategory}
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {years.length > 0 ? (
            <RoadmapTimeline
              years={years}
              onMilestoneSelect={selectMilestone}
            />
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                No Milestones Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Try selecting a different category
              </p>
              <button
                onClick={() => setCategory(null)}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              >
                Show All Milestones
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              We're not just building software—we're building the energy
              infrastructure of the future. Every milestone brings us closer to
              a world where clean, affordable energy is accessible to everyone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* FIXED A TAG */}
              <a
                href="/contact"
                className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:shadow-2xl transition-all"
              >
                Partner With Us
              </a>

              {/* FIXED A TAG */}
              <a
                href="/about"
                className="px-8 py-4 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-slate-900 transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Navigation */}
      <TimelineNavigation years={years} />
    </div>
  );
};

export default RoadmapPage;
