import React, { useState } from "react";
import { FileText, Loader, Sparkles, AlertCircle } from "lucide-react";

const ArticleGenerator = ({ outline, onArticleGenerated }) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      const response = await fetch("/api/ai-writer/generate-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ outline }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate article");
      }

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        onArticleGenerated(data.article);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Generate article error:", err);
      setError(err.message || "Failed to generate article");
    } finally {
      setTimeout(() => {
        setGenerating(false);
      }, 1000);
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <FileText size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Step 3: Generate Full Article
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI will create a complete, publication-ready article from your
            outline
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Outline Preview */}
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            Ready to Generate:
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Title:
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {outline.title}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Sections:
              </div>
              <div className="text-slate-900 dark:text-white">
                {outline.sections.length} main sections with{" "}
                {outline.sections.reduce((sum, s) => sum + s.points.length, 0)}{" "}
                key points
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Estimated Length:
              </div>
              <div className="text-slate-900 dark:text-white">
                ~{Math.max(1200, outline.sections.length * 300 + 200)} words (
                {Math.ceil((outline.sections.length * 300 + 200) / 200)} min
                read)
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        {generating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Generating article...
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
              This may take 30-60 seconds. Please don't close this page.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400 mb-1">
                Generation Failed
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {generating ? (
            <>
              <Loader size={20} className="animate-spin" />
              Generating Article... ({progress}%)
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Full Article with AI
            </>
          )}
        </button>

        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>What happens next:</strong> The AI will write a complete
            article with introduction, detailed sections, examples, and
            conclusion. You'll be able to review and edit before publishing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleGenerator;
