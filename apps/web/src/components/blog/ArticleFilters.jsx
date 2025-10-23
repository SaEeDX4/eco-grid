import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { categories, featuredTags } from "../../lib/blogData";

const ArticleFilters = ({ onFilterChange, activeFilters }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onFilterChange({ ...activeFilters, search: query });
  };

  const handleCategoryToggle = (categoryId) => {
    const currentCategories = activeFilters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((c) => c !== categoryId)
      : [...currentCategories, categoryId];

    onFilterChange({ ...activeFilters, categories: newCategories });
  };

  const handleTagToggle = (tag) => {
    const currentTags = activeFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    onFilterChange({ ...activeFilters, tags: newTags });
  };

  const clearFilters = () => {
    setSearchQuery("");
    onFilterChange({ search: "", categories: [], tags: [] });
  };

  const hasActiveFilters =
    searchQuery ||
    (activeFilters.categories && activeFilters.categories.length > 0) ||
    (activeFilters.tags && activeFilters.tags.length > 0);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search articles..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors text-lg"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Filter size={18} />
          <span className="font-semibold">Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
              {(activeFilters.categories?.length || 0) +
                (activeFilters.tags?.length || 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={18} />
            <span className="font-semibold">Clear All</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-top duration-300">
          {/* Categories */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
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

          {/* Tags */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {featuredTags.map((tag) => {
                const isActive = activeFilters.tags?.includes(tag);

                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`
                      px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-500 text-white shadow-lg scale-105"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105"
                      }
                    `}
                  >
                    {tag}
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

export default ArticleFilters;
