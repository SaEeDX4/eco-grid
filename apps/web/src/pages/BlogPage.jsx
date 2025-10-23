import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PenTool, Rss } from "lucide-react";
import ArticleGrid from "../components/blog/ArticleGrid";
import ArticleFilters from "../components/blog/ArticleFilters";
import NewsletterSignup from "../components/blog/NewsletterSignup";
import { useArticles } from "../hooks/useArticles";

const BlogPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    tags: [],
  });

  const { articles, loading, error, fetchArticles } = useArticles();

  useEffect(() => {
    fetchArticles(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />

        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full mb-6">
              <Rss size={20} />
              <span className="font-semibold">Blog & Insights</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Energy Innovation Insights
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Expert analysis, case studies, and thought leadership on clean
              energy, AI optimization, and the future of sustainable power
              systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ai-writer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PenTool size={20} />
                Write with AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <ArticleFilters onFilterChange={setFilters} activeFilters={filters} />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ArticleGrid articles={articles} loading={loading} error={error} />
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
};

export default BlogPage;
