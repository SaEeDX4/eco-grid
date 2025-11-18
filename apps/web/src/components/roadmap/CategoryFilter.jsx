import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { categoryInfo } from "../../data/roadmapData";
import { getAllCategories } from "../../lib/roadmapHelpers";

const CategoryFilter = ({ allYears, activeCategory, onCategoryChange }) => {
  const categories = getAllCategories(allYears);

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 justify-center">
        {/* All Categories */}
        <motion.button
          onClick={() => onCategoryChange(null)}
          className={`
            px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2
            ${
              !activeCategory
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500"
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icons.Layers size={20} />
          All Categories
        </motion.button>

        {/* Category Buttons */}
        {categories.map((category) => {
          const info = categoryInfo[category];
          if (!info) return null;

          const Icon = Icons[info.icon];
          const isActive = activeCategory === category;

          return (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2
                ${
                  isActive
                    ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                    : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {Icon && <Icon size={20} />}
              {info.name}
            </motion.button>
          );
        })}
      </div>

      {/* Category Description */}
      {activeCategory && categoryInfo[activeCategory] && (
        <motion.p
          className="text-center mt-4 text-slate-600 dark:text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categoryInfo[activeCategory].description}
        </motion.p>
      )}
    </div>
  );
};

export default CategoryFilter;
