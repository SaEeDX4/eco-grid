import React from "react";
import ArticleCard from "./ArticleCard";
import { Loader, AlertCircle } from "lucide-react";

const ArticleGrid = ({ articles, loading, error, featuredId = null }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Loading articles...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-4">
          <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
        </div>
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          Failed to load articles
        </p>
        <p className="text-slate-600 dark:text-slate-400">{error}</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <AlertCircle className="text-slate-400" size={32} />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-semibold mb-2">
          No articles found
        </p>
        <p className="text-slate-500 dark:text-slate-500">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  // Separate featured article
  const featuredArticle = featuredId
    ? articles.find((a) => a._id === featuredId)
    : articles[0];

  const regularArticles = articles.filter(
    (a) => a._id !== featuredArticle?._id
  );

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Featured Article
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ArticleCard article={featuredArticle} featured={true} />
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      {regularArticles.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article, index) => (
              <div
                key={article._id}
                className="animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleGrid;
