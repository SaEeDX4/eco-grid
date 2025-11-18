import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ThumbsUp, ThumbsDown, Eye, Calendar } from "lucide-react";
import { getCategoryInfo } from "../../lib/faqHelpers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FAQItem = ({ faq, isOpen, onToggle, onFeedback, searchQuery = "" }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const categoryInfo = getCategoryInfo(faq.category);

  const handleFeedback = async (helpful) => {
    setFeedbackGiven(helpful);
    if (onFeedback) {
      await onFeedback(faq._id, helpful);
    }
  };

  const highlightText = (text) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-900/30 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div
      className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-start gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        {/* Category Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${categoryInfo.color}
          flex items-center justify-center text-xl`}
        >
          {categoryInfo.Icon ? (
            <categoryInfo.Icon size={20} className="text-white" />
          ) : (
            categoryInfo.icon
          )}
        </div>

        {/* Question */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
            {highlightText(faq.question)}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
              {categoryInfo.name}
            </span>

            {faq.views > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {faq.views.toLocaleString()} views
              </span>
            )}

            {faq.updatedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Updated {new Date(faq.updatedAt).toLocaleDateString("en-CA")}
              </span>
            )}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="text-slate-400" size={24} />
        </motion.div>
      </button>

      {/* ANSWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-20">
              {/* 🔥 FIXED MARKDOWN HERE */}
              <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-slate-900 dark:text-white">
                        {children}
                      </strong>
                    ),
                    li: ({ children }) => <li className="my-1">{children}</li>,
                  }}
                >
                  {faq.answer}
                </ReactMarkdown>
              </div>

              {/* Video */}
              {faq.videoUrl && (
                <div className="mb-6 aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={faq.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Tags */}
              {faq.tags && faq.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {faq.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Was this helpful?
                </p>

                <div className="flex items-center gap-3">
                  {/* YES */}
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackGiven !== null}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
                      ${
                        feedbackGiven === true
                          ? "bg-green-500 text-white"
                          : feedbackGiven === false
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-green-100 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400"
                      }
                    `}
                  >
                    <ThumbsUp size={16} />
                    <span>Yes</span>
                    {faq.helpful > 0 && (
                      <span className="text-xs opacity-70">
                        ({faq.helpful})
                      </span>
                    )}
                  </button>

                  {/* NO */}
                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackGiven !== null}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
                      ${
                        feedbackGiven === false
                          ? "bg-red-500 text-white"
                          : feedbackGiven === true
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
                      }
                    `}
                  >
                    <ThumbsDown size={16} />
                    <span>No</span>
                    {faq.notHelpful > 0 && (
                      <span className="text-xs opacity-70">
                        ({faq.notHelpful})
                      </span>
                    )}
                  </button>

                  {feedbackGiven !== null && (
                    <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                      Thanks for your feedback!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;
