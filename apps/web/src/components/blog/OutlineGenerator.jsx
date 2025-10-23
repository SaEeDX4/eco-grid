import React, { useState } from "react";
import { Lightbulb, Loader, Sparkles } from "lucide-react";
import { categories } from "../../lib/blogData";

const OutlineGenerator = ({ onOutlineGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [targetAudience, setTargetAudience] = useState("general");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const audiences = [
    { value: "general", label: "General Audience" },
    { value: "technical", label: "Technical Professionals" },
    { value: "business", label: "Business Leaders" },
    { value: "policy", label: "Policy Makers" },
    { value: "homeowners", label: "Homeowners" },
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual & Friendly" },
    { value: "academic", label: "Academic" },
    { value: "inspirational", label: "Inspirational" },
    { value: "technical", label: "Technical & Detailed" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedCategory) {
      setError("Please provide a topic and select a category");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-writer/generate-outline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          category: selectedCategory,
          targetAudience,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate outline");
      }

      onOutlineGenerated(data.outline);
    } catch (err) {
      console.error("Generate outline error:", err);
      setError(err.message || "Failed to generate outline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Lightbulb size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Step 1: Generate Outline
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Describe your article idea and let AI create a structured outline
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Article Topic *
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'How AI-powered energy optimization can reduce household energy costs by 30%' or 'The future of virtual power plants in Canada'"
            rows={4}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none disabled:opacity-50"
          />
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Be specific about your topic, key points, or angle. The more detail
            you provide, the better the outline.
          </p>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={loading}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 disabled:opacity-50
                  ${
                    selectedCategory === category.id
                      ? `border-transparent bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400"
                  }
                `}
              >
                <div className="font-semibold text-sm">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Target Audience
          </label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
          >
            {audiences.map((audience) => (
              <option key={audience.value} value={audience.value}>
                {audience.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Writing Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
          >
            {tones.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim() || !selectedCategory}
          className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Generating Outline...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Outline with AI
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
          This usually takes 10-15 seconds. The AI will create a structured
          outline with title, introduction, main sections, and conclusion.
        </p>
      </div>
    </div>
  );
};

export default OutlineGenerator;
