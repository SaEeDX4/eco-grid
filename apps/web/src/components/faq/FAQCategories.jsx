import React from "react";
import { motion } from "framer-motion";
import { getCategoryInfo } from "../../lib/faqHelpers";

const FAQCategories = ({
  categories,
  activeCategory,
  onCategoryChange,
  counts = {},
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* All Categories */}
      <motion.button
        onClick={() => onCategoryChange(null)}
        className={`
          px-6 py-3 rounded-xl font-semibold transition-all duration-200
          ${
            !activeCategory
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        All Categories
      </motion.button>

      {/* Category Buttons */}
      {categories.map((category) => {
        const info = getCategoryInfo(category);
        const isActive = activeCategory === category;
        const count = counts[category] || 0;

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2
              ${
                isActive
                  ? `bg-gradient-to-r ${info.color} text-white shadow-lg scale-105`
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Icon wrapper — upgraded to Lucide component */}
            <span className="text-lg flex items-center justify-center">
              {info.Icon ? (
                <info.Icon
                  size={18}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-700 dark:text-slate-300"
                  }
                />
              ) : (
                info.icon
              )}
            </span>

            <span>{info.name}</span>

            {count > 0 && (
              <span
                className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive ? "bg-white/30" : "bg-slate-200 dark:bg-slate-700"}
              `}
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FAQCategories;
