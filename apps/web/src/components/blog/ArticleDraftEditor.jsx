import React, { useState } from "react";
import { Save, Eye, CheckCircle, X, Image as ImageIcon } from "lucide-react";
import { categories, authors } from "../../lib/blogData";

const ArticleDraftEditor = ({
  initialDraft,
  onPublish,
  onSaveAsDraft,
  onCancel,
}) => {
  const [draft, setDraft] = useState(initialDraft);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field, value) => {
    setDraft({ ...draft, [field]: value });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await onSaveAsDraft(draft);
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    await onPublish(draft);
    setPublishing(false);
  };

  const category = categories.find((c) => c.id === draft.category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Save size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Step 4: Review & Publish
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Make final edits and add metadata before publishing
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold"
            >
              <Eye size={18} />
              {showPreview ? "Edit" : "Preview"}
            </button>
          </div>
        </div>

        {!showPreview ? (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors font-bold text-xl"
                placeholder="Enter article title"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Excerpt / Summary *
              </label>
              <textarea
                value={draft.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none"
                placeholder="Brief summary that appears in article cards (150-200 characters)"
                maxLength={200}
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {draft.excerpt?.length || 0} / 200 characters
              </p>
            </div>

            {/* Hero Image URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Hero Image URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <ImageIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="url"
                    value={draft.heroImage || ""}
                    onChange={(e) => updateField("heroImage", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              {draft.heroImage && (
                <div className="mt-3 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                  <img
                    src={draft.heroImage}
                    alt="Hero preview"
                    className="w-full aspect-video object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category & Author */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Category *
                </label>
                <select
                  value={draft.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Author *
                </label>
                <select
                  value={draft.authorId}
                  onChange={(e) => updateField("authorId", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                >
                  {Object.values(authors).map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={draft.tags?.join(", ") || ""}
                onChange={(e) =>
                  updateField(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                placeholder="e.g., Solar Energy, AI, Carbon Reduction"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Article Content (Markdown) *
              </label>
              <textarea
                value={draft.content}
                onChange={(e) => updateField("content", e.target.value)}
                rows={20}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none font-mono text-sm"
                placeholder="Article content in Markdown format..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {draft.content?.split(/\s+/).length || 0} words • ~
                {Math.ceil((draft.content?.split(/\s+/).length || 0) / 200)} min
                read
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Meta Description (SEO)
              </label>
              <textarea
                value={draft.metaDescription || ""}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none"
                placeholder="SEO-optimized description (150-160 characters)"
                maxLength={160}
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {draft.metaDescription?.length || 0} / 160 characters
              </p>
            </div>

            {/* AI Generation Info */}
            {draft.aiGenerated && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-900 dark:text-purple-300">
                  <strong>AI-Generated Content:</strong> This article was
                  created using AI assistance. All content has been reviewed and
                  can be edited before publication.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Preview Mode */
          <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="max-w-3xl mx-auto">
              {/* Preview Header */}
              <div className="mb-8">
                {category && (
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white text-sm font-semibold`}
                    >
                      {category.name}
                    </span>
                  </div>
                )}
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {draft.title || "Untitled Article"}
                </h1>
                {draft.excerpt && (
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                    {draft.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <span>
                    {authors[draft.authorId]?.name || "Unknown Author"}
                  </span>
                  <span>•</span>
                  <span>
                    {Math.ceil((draft.content?.split(/\s+/).length || 0) / 200)}{" "}
                    min read
                  </span>
                </div>
              </div>

              {/* Preview Content */}
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-slate-900 dark:text-white leading-relaxed">
                  {draft.content || "No content yet..."}
                </pre>
              </div>

              {/* Preview Tags */}
              {draft.tags && draft.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                  {draft.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          <X size={20} />
          Cancel
        </button>

        <button
          onClick={handleSaveDraft}
          disabled={saving}
          className="flex-1 px-6 py-4 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              Saving Draft...
            </>
          ) : (
            <>
              <Save size={20} />
              Save as Draft
            </>
          )}
        </button>

        <button
          onClick={handlePublish}
          disabled={
            publishing || !draft.title || !draft.content || !draft.category
          }
          className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {publishing ? (
            <>
              <span className="animate-spin">⏳</span>
              Publishing...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Publish Article
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ArticleDraftEditor;
