import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ArticleDetail from "../components/blog/ArticleDetail";
import ReadingProgress from "../components/blog/ReadingProgress";
import TableOfContents from "../components/blog/TableOfContents";
import RelatedArticles from "../components/blog/RelatedArticles";
import NewsletterSignup from "../components/blog/NewsletterSignup";
import { useArticleDetail } from "../hooks/useArticleDetail";
import { extractHeadings } from "../lib/mdx";

const ArticlePage = () => {
  const { slug } = useParams();
  const { article, relatedArticles, loading, error } = useArticleDetail(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 flex items-center justify-center">
        <div className="text-center max-w-lg px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Article Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error ||
              "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const headings = extractHeadings(article.content);

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="max-w-6xl mx-auto mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold"
            >
              <ArrowLeft size={18} />
              Back to Blog
            </Link>
          </div>

          {/* Main Content with Sidebar */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Article Content */}
              <div className="lg:col-span-3">
                <ArticleDetail article={article} />
              </div>

              {/* Sidebar - Table of Contents */}
              <div className="lg:col-span-1">
                <TableOfContents headings={headings} />
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="max-w-6xl mx-auto mt-20">
              <RelatedArticles
                articles={relatedArticles}
                currentArticleId={article._id}
              />
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        <NewsletterSignup inline={true} />
      </div>
    </>
  );
};

export default ArticlePage;
