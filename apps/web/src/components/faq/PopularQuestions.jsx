import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Eye } from "lucide-react";
import api from "../../lib/api";
import { getCategoryInfo } from "../../lib/faqHelpers";

const PopularQuestions = ({ onQuestionClick }) => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    try {
      const response = await api.get("/faq/popular?limit=5");

      if (response.data.success) {
        setPopular(response.data.faqs);
      }
    } catch (error) {
      console.error("Fetch popular FAQs error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (popular.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-blue-500" size={28} />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Most Popular Questions
        </h2>
      </div>

      <div className="grid grid-cols-1">
        {popular.map((faq, index) => {
          const categoryInfo = getCategoryInfo(faq.category);

          return (
            <React.Fragment key={faq._id}>
              <motion.button
                onClick={() => onQuestionClick(faq)}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 text-left group
             hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                whileHover={{
                  y: -2, // ⬆️ micro-lift
                  transition: {
                    type: "tween",
                    duration: 0.18,
                    ease: [0.25, 0.1, 0.25, 1.0], // Apple-like easing
                  },
                }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div
                    className={`
                      flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${categoryInfo.color}
                      flex items-center justify-center text-lg
                    `}
                  >
                    {categoryInfo.Icon && (
                      <categoryInfo.Icon size={20} className="text-white" />
                    )}
                  </div>

                  {/* Question text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {faq.question}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                        {categoryInfo.name}
                      </span>

                      {faq.views > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {faq.views.toLocaleString()} views
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Apple-style subtle divider */}
              {index !== popular.length - 1 && (
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PopularQuestions;
