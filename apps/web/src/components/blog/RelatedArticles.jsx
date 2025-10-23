import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { categories } from "../../lib/blogData";

const RelatedArticles = ({ articles, currentArticleId }) => {
  const relatedArticles = articles
    .filter((a) => a._id !== currentArticleId)
    .slice(0, 3);

  if (relatedArticles.length === 0) return null;

  return (
    <section className="py-16 border-t border-slate-200 dark:border-slate-800">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Related Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article, index) => {
          const category = categories.find((c) => c.id === article.category);

          return (
            <Link
              key={article._id}
              to={`/blog/${article.slug}`}
              className="group block animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  {article.heroImage ? (
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${category?.color || "from-blue-500 to-purple-600"} flex items-center justify-center`}
                    >
                      <span className="text-2xl font-bold text-white opacity-50">
                        {article.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  {category && (
                    <div className="absolute top-3 left-3">
                      <div
                        className={`px-2 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-xs font-semibold`}
                      >
                        {category.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <Clock size={12} />
                    <span>{article.readingTime || 5} min read</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                    Read Article
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedArticles;
