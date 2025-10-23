import React from "react";
import {
  Calendar,
  Clock,
  User,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { categories, authors } from "../../lib/blogData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ✅ FIXED: switch to PrismLight (not full Prism) and manually register languages
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import md from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", md);

const ArticleDetail = ({ article }) => {
  const category = categories.find((c) => c.id === article.category);
  const author = authors[article.authorId] || authors.team;

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const handleShare = (platform) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareTitle
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
        return;
    }
    if (url) window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Hero Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl">
        {article.heroImage ? (
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${
              category?.color || "from-blue-500 to-purple-600"
            } flex items-center justify-center`}
          >
            <span className="text-6xl font-bold text-white opacity-50">
              {article.title.charAt(0)}
            </span>
          </div>
        )}
        {category && (
          <div className="absolute top-6 left-6">
            <div
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold shadow-lg`}
            >
              {category.name}
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
        {article.title}
      </h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          {article.excerpt}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {author.name}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {author.role}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Date */}
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Calendar size={18} />
          <span>
            {new Date(article.publishedAt).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Clock size={18} />
          <span>{article.readingTime || 5} min read</span>
        </div>

        <div className="flex-1" />

        {/* Share Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 mr-2">
            Share:
          </span>
          <button
            onClick={() => handleShare("twitter")}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter size={18} />
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook size={18} />
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={18} />
          </button>
          <button
            onClick={() => handleShare("copy")}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            aria-label="Copy link"
          >
            <LinkIcon size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-12">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-xl"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1
                id={children.toString().toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-24"
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                id={children.toString().toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-24"
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                id={children.toString().toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-24"
              >
                {children}
              </h3>
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-slate-200 dark:border-slate-800">
          <Tag size={18} className="text-slate-600 dark:text-slate-400" />
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default ArticleDetail;
