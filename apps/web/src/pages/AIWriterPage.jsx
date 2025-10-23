import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";
import OutlineGenerator from "../components/blog/OutlineGenerator";
import OutlineEditor from "../components/blog/OutlineEditor";
import ArticleGenerator from "../components/blog/ArticleGenerator";
import ArticleDraftEditor from "../components/blog/ArticleDraftEditor";
import { useAIWriter } from "../hooks/useAIWriter";

const AIWriterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [outline, setOutline] = useState(null);
  const [article, setArticle] = useState(null);
  const { saveArticle, publishArticle } = useAIWriter();

  const handleOutlineGenerated = (generatedOutline) => {
    setOutline(generatedOutline);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOutlineApproved = (approvedOutline) => {
    setOutline(approvedOutline);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegenerateOutline = () => {
    setStep(1);
    setOutline(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArticleGenerated = (generatedArticle) => {
    setArticle(generatedArticle);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveAsDraft = async (draft) => {
    const saved = await saveArticle(draft, "draft");
    if (saved) {
      navigate("/blog");
    }
  };

  const handlePublish = async (draft) => {
    const published = await publishArticle(draft);
    if (published) {
      navigate(`/blog/${published.slug}`);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All progress will be lost."
      )
    ) {
      navigate("/blog");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <Sparkles size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                AI Article Writer
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Create publication-ready articles with AI assistance
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: "Generate Outline" },
              { num: 2, label: "Review & Edit" },
              { num: 3, label: "Generate Article" },
              { num: 4, label: "Publish" },
            ].map((s, index) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                    ${
                      step >= s.num
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }
                  `}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`
                    text-sm font-semibold transition-colors
                    ${
                      step >= s.num
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400"
                    }
                  `}
                  >
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <ChevronRight
                    size={20}
                    className="text-slate-300 dark:text-slate-700"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {step === 1 && (
            <OutlineGenerator onOutlineGenerated={handleOutlineGenerated} />
          )}

          {step === 2 && outline && (
            <OutlineEditor
              initialOutline={outline}
              onApprove={handleOutlineApproved}
              onRegenerate={handleRegenerateOutline}
            />
          )}

          {step === 3 && outline && (
            <ArticleGenerator
              outline={outline}
              onArticleGenerated={handleArticleGenerated}
            />
          )}

          {step === 4 && article && (
            <ArticleDraftEditor
              initialDraft={article}
              onPublish={handlePublish}
              onSaveAsDraft={handleSaveAsDraft}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWriterPage;
