import React from "react";
import { Filter, X } from "lucide-react";
import {
  industries,
  impactCategories,
  companySizes,
} from "../../lib/testimonialsData";
import * as LucideIcons from "lucide-react";

const TestimonialFilters = ({ activeFilters, onFilterChange }) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const handleIndustryToggle = (industryId) => {
    const current = activeFilters.industries || [];
    const updated = current.includes(industryId)
      ? current.filter((i) => i !== industryId)
      : [...current, industryId];

    onFilterChange({ ...activeFilters, industries: updated });
  };

  const handleCategoryToggle = (categoryId) => {
    const current = activeFilters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter((c) => c !== categoryId)
      : [...current, categoryId];

    onFilterChange({ ...activeFilters, categories: updated });
  };

  const handleSizeToggle = (sizeId) => {
    const current = activeFilters.sizes || [];
    const updated = current.includes(sizeId)
      ? current.filter((s) => s !== sizeId)
      : [...current, sizeId];

    onFilterChange({ ...activeFilters, sizes: updated });
  };

  const clearFilters = () => {
    onFilterChange({ industries: [], categories: [], sizes: [] });
  };

  const hasActiveFilters =
    (activeFilters.industries?.length || 0) > 0 ||
    (activeFilters.categories?.length || 0) > 0 ||
    (activeFilters.sizes?.length || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold"
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
              {(activeFilters.industries?.length || 0) +
                (activeFilters.categories?.length || 0) +
                (activeFilters.sizes?.length || 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold"
          >
            <X size={18} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-top duration-300">
          {/* Industries */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Industry
            </h3>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => {
                const Icon = LucideIcons[industry.icon];
                const isActive = activeFilters.industries?.includes(
                  industry.id
                );

                return (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustryToggle(industry.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105"
                      }
                    `}
                  >
                    <Icon size={16} />
                    {industry.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Impact Categories */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Impact Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {impactCategories.map((category) => {
                const isActive = activeFilters.categories?.includes(
                  category.id
                );

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`
                      px-4 py-2 rounded-xl font-semibold transition-all duration-200
                      ${
                        isActive
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105"
                      }
                    `}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company Size */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Company Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {companySizes.map((size) => {
                const isActive = activeFilters.sizes?.includes(size.id);

                return (
                  <button
                    key={size.id}
                    onClick={() => handleSizeToggle(size.id)}
                    className={`
                      px-4 py-2 rounded-xl font-semibold transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105"
                      }
                    `}
                  >
                    {size.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialFilters;
