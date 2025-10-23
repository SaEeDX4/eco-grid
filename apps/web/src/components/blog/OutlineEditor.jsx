import React, { useState } from "react";
import {
  Edit3,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle,
} from "lucide-react";

const OutlineEditor = ({ initialOutline, onApprove, onRegenerate }) => {
  const [outline, setOutline] = useState(initialOutline);
  const [editingSection, setEditingSection] = useState(null);

  const updateTitle = (newTitle) => {
    setOutline({ ...outline, title: newTitle });
  };

  const updateIntroduction = (newIntro) => {
    setOutline({ ...outline, introduction: newIntro });
  };

  const updateConclusion = (newConclusion) => {
    setOutline({ ...outline, conclusion: newConclusion });
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      heading: "New Section",
      points: ["Key point 1", "Key point 2"],
    };
    setOutline({
      ...outline,
      sections: [...outline.sections, newSection],
    });
  };

  const updateSection = (sectionId, field, value) => {
    setOutline({
      ...outline,
      sections: outline.sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    });
  };

  const deleteSection = (sectionId) => {
    setOutline({
      ...outline,
      sections: outline.sections.filter((section) => section.id !== sectionId),
    });
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...outline.sections];
    [newSections[index - 1], newSections[index]] = [
      newSections[index],
      newSections[index - 1],
    ];
    setOutline({ ...outline, sections: newSections });
  };

  const moveSectionDown = (index) => {
    if (index === outline.sections.length - 1) return;
    const newSections = [...outline.sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];
    setOutline({ ...outline, sections: newSections });
  };

  const addPoint = (sectionId) => {
    setOutline({
      ...outline,
      sections: outline.sections.map((section) =>
        section.id === sectionId
          ? { ...section, points: [...section.points, "New point"] }
          : section
      ),
    });
  };

  const updatePoint = (sectionId, pointIndex, value) => {
    setOutline({
      ...outline,
      sections: outline.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              points: section.points.map((point, idx) =>
                idx === pointIndex ? value : point
              ),
            }
          : section
      ),
    });
  };

  const deletePoint = (sectionId, pointIndex) => {
    setOutline({
      ...outline,
      sections: outline.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              points: section.points.filter((_, idx) => idx !== pointIndex),
            }
          : section
      ),
    });
  };

  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Edit3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Step 2: Review & Edit Outline
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Refine the structure before generating the full article
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Article Title
          </label>
          <input
            type="text"
            value={outline.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors font-bold text-lg"
          />
        </div>

        {/* Introduction */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Introduction Summary
          </label>
          <textarea
            value={outline.introduction}
            onChange={(e) => updateIntroduction(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Sections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Main Sections
            </label>
            <button
              onClick={addSection}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-950/50 transition-colors text-sm font-semibold"
            >
              <Plus size={16} />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {outline.sections.map((section, index) => (
              <div
                key={section.id}
                className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(section.id, "heading", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="Section heading"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <MoveUp
                        size={16}
                        className="text-slate-600 dark:text-slate-400"
                      />
                    </button>
                    <button
                      onClick={() => moveSectionDown(index)}
                      disabled={index === outline.sections.length - 1}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <MoveDown
                        size={16}
                        className="text-slate-600 dark:text-slate-400"
                      />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete section"
                    >
                      <Trash2
                        size={16}
                        className="text-red-600 dark:text-red-400"
                      />
                    </button>
                  </div>
                </div>

                {/* Points */}
                <div className="space-y-2">
                  {section.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={point}
                        onChange={(e) =>
                          updatePoint(section.id, pointIndex, e.target.value)
                        }
                        className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                        placeholder="Key point"
                      />
                      <button
                        onClick={() => deletePoint(section.id, pointIndex)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2
                          size={14}
                          className="text-red-600 dark:text-red-400"
                        />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPoint(section.id)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors text-sm font-semibold"
                  >
                    <Plus size={14} />
                    Add Point
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Conclusion Summary
          </label>
          <textarea
            value={outline.conclusion}
            onChange={(e) => updateConclusion(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onRegenerate}
            className="flex-1 px-6 py-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Regenerate Outline
          </button>
          <button
            onClick={() => onApprove(outline)}
            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Approve & Generate Article
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutlineEditor;
