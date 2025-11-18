import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, TrendingUp } from "lucide-react";
import { useFAQSearch } from "../../hooks/useFAQSearch";
import { getPopularSearches } from "../../lib/faqHelpers";

const FAQSearch = ({ onSearch, onResultClick }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { searching, results, analysis, semanticSearch, clearSearch } =
    useFAQSearch();

  const popularSearches = getPopularSearches();

  // -------------------------
  // Semantic Search Debounce
  // -------------------------
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 2) semanticSearch(query);
      else clearSearch();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    clearSearch();
    onSearch("");
  };

  const handlePopularClick = (search) => {
    setQuery(search);
    onSearch(search);
    setShowSuggestions(false);
  };

  const handleResultClick = (faq) => {
    setQuery("");
    setShowSuggestions(false);
    onResultClick(faq);
  };

  // ------------------------------------------------
  // ⭐ PORTAL DROPDOWN (absolute floating element)
  // ------------------------------------------------
  const renderDropdown = () => {
    if (!showSuggestions) return null;

    // Get input position
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return null;

    return createPortal(
      <AnimatePresence>
        {(results.length > 0 || popularSearches.length > 0) && (
          <motion.div
            ref={dropdownRef}
            className="absolute p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-2xl z-[9999] max-h-[500px] overflow-y-auto"
            style={{
              top: rect.bottom + window.scrollY + 8 + "px",
              left: rect.left + window.scrollX + "px",
              width: rect.width + "px",
              position: "absolute",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* AI Results */}
            {results.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-purple-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    AI-Matched Results
                  </h3>
                </div>

                <div className="space-y-2">
                  {results.map((faq) => (
                    <button
                      key={faq._id}
                      onClick={() => handleResultClick(faq)}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">
                        {faq.question}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {faq.answer}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular searches */}
            {!query && popularSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-blue-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Popular Searches
                  </h3>
                </div>

                <div className="space-y-1">
                  {popularSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularClick(item)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Input wrapper (keeps layout stable) */}
      <div className="relative min-h-[80px]">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={24}
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ask anything... (e.g., How do I connect my solar panels?)"
              className="w-full pl-14 pr-12 py-4 text-lg rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors shadow-lg"
            />

            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {searching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Sparkles className="animate-spin text-blue-500" size={20} />
            </div>
          )}
        </form>

        {analysis && (
          <motion.div
            className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles size={16} className="text-purple-500" />
            <span>
              AI found {results.length} result
              {results.length !== 1 ? "s" : ""} for{" "}
              <span className="font-semibold">{analysis.intent}</span>
            </span>
          </motion.div>
        )}
      </div>

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setShowSuggestions(false)}
        />
      )}

      {/* 🔥 DROPDOWN PORTAL RENDERED HERE */}
      {renderDropdown()}
    </div>
  );
};

export default FAQSearch;
