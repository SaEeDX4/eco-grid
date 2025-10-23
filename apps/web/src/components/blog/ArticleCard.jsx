import React from "react";
import { Clock, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, authors } from "../../lib/blogData";

const ArticleCard = ({ article, featured = false }) => {
  const category = categories.find((c) => c.id === article.category);
  const author = authors[article.authorId] || authors.team;

  return (
    <Link
      to={`/blog/${article.slug}`}
      className={`
        group block rounded-2xl overflow-hidden bg-white dark:bg-slate-900 
        border-2 border-slate-200 dark:border-slate-800
        hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
        ${featured ? "col-span-2 row-span-2" : ""}
      `}
    >
      {/* Hero Image */}
      <div className="relative overflow-hidden aspect-video bg-slate-200 dark:bg-slate-800">
        {article.heroImage ? (
          <>
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${category?.color || "from-blue-500 to-purple-600"} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
            />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${category?.color || "from-blue-500 to-purple-600"} flex items-center justify-center`}
          >
            <span className="text-4xl font-bold text-white opacity-50">
              {article.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-semibold shadow-lg`}
            >
              {category.name}
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 rounded-full bg-yellow-500 text-white text-sm font-semibold shadow-lg">
              Featured
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-6 ${featured ? "md:p-8" : ""}`}>
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {new Date(article.publishedAt).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{article.readingTime || 5} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${featured ? "text-3xl" : "text-xl"}`}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p
          className={`text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 ${featured ? "text-lg" : ""}`}
        >
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900 dark:text-white">
                {author.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {author.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
            Read More
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
