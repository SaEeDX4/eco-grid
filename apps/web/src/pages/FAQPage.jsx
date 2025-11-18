import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Sparkles } from "lucide-react";
import FAQSearch from "../components/faq/FAQSearch";
import FAQCategories from "../components/faq/FAQCategories";
import FAQAccordion from "../components/faq/FAQAccordion";
import PopularQuestions from "../components/faq/PopularQuestions";
import RelatedQuestions from "../components/faq/RelatedQuestions";
import ContactEscalation from "../components/faq/ContactEscalation";
import FAQEmpty from "../components/faq/FAQEmpty";
import { useFAQs } from "../hooks/useFAQs";
import { searchFAQs } from "../lib/faqHelpers";
import api from "../lib/api";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [selectedFAQ, setSelectedFAQ] = useState(null);

  const {
    faqs,
    loading,
    error,
    category,
    setCategory,
    fetchFAQs,
    recordFeedback,
  } = useFAQs();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter FAQs based on search query
    if (searchQuery) {
      const results = searchFAQs(faqs, searchQuery);
      setFilteredFAQs(results);
    } else {
      setFilteredFAQs(faqs);
    }
  }, [faqs, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/faq/categories");

      if (response.data.success) {
        const cats = response.data.categories;
        setCategories(cats.map((c) => c.name));

        const counts = {};
        cats.forEach((c) => {
          counts[c.name] = c.count;
        });
        setCategoryCounts(counts);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCategory(null); // Clear category filter when searching
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchQuery(""); // Clear search when changing category
  };

  const handleFAQClick = async (faq) => {
    setSelectedFAQ(faq);

    // Fetch related questions
    try {
      const response = await api.get(`/faq/${faq._id}`);

      if (response.data.success && response.data.relatedQuestions) {
        setRelatedQuestions(response.data.relatedQuestions);
      }
    } catch (error) {
      console.error("Fetch related questions error:", error);
    }

    // Scroll to top of FAQ section
    setTimeout(() => {
      document.getElementById("faq-accordion")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCategory(null);
  };

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
                How Can We Help?
              </h1>
            </div>

            <p className="text-xl text-blue-100 mb-8">
              Find answers to common questions or get in touch with our support
              team
            </p>

            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold mb-8">
              <Sparkles size={16} />
              AI-Powered Semantic Search
            </div>

            {/* Search Bar */}
            <FAQSearch onSearch={handleSearch} onResultClick={handleFAQClick} />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Popular Questions (shown when no search/category active) */}
          {!searchQuery && !category && (
            <PopularQuestions onQuestionClick={handleFAQClick} />
          )}

          {/* Category Filter */}
          <div className="mb-12">
            <FAQCategories
              categories={categories}
              activeCategory={category}
              onCategoryChange={handleCategoryChange}
              counts={categoryCounts}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading FAQs...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
              <button
                onClick={() => fetchFAQs()}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* FAQ Accordion */}
          {!loading && !error && (
            <div id="faq-accordion">
              {filteredFAQs.length > 0 ? (
                <>
                  <FAQAccordion
                    faqs={filteredFAQs}
                    onFeedback={recordFeedback}
                    searchQuery={searchQuery}
                  />

                  {/* Related Questions */}
                  {relatedQuestions.length > 0 && (
                    <RelatedQuestions
                      questions={relatedQuestions}
                      onQuestionClick={handleFAQClick}
                    />
                  )}
                </>
              ) : (
                <FAQEmpty
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              )}
            </div>
          )}

          {/* Contact Escalation */}
          {!loading && !error && (
            <ContactEscalation searchQuery={searchQuery} category={category} />
          )}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
