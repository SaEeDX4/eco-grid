import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb } from "lucide-react"; // added Lightbulb
import { getCategoryInfo } from "../../lib/faqHelpers";

const RelatedQuestions = ({ questions, onQuestionClick }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-100 dark:border-slate-700">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        {/* Replace 💡 with Lucide Lightbulb */}
        <Lightbulb size={22} className="text-yellow-500 dark:text-yellow-400" />
        Related Questions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((question, index) => {
          const categoryInfo = getCategoryInfo(question.category);

          return (
            <motion.button
              key={question._id}
              onClick={() => onQuestionClick(question)}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 text-left group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                  flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${categoryInfo.color}
                  flex items-center justify-center text-sm
                `}
                >
                  {/* Replace emoji with Lucide icon component */}
                  {categoryInfo.Icon ? (
                    <categoryInfo.Icon size={16} className="text-white" />
                  ) : (
                    categoryInfo.icon
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {question.question}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {categoryInfo.name}
                  </p>
                </div>

                <ArrowRight
                  className="flex-shrink-0 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                  size={20}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedQuestions;
