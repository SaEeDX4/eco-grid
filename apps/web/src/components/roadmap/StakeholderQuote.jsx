import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const StakeholderQuote = ({ quote }) => {
  if (!quote) return null;

  return (
    <motion.div
      className="mt-6 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-100 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Quote className="text-white" size={20} />
        </div>

        <div className="flex-1">
          <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed mb-3">
            "{quote.text}"
          </p>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-400 to-slate-600 flex items-center justify-center text-white text-sm font-bold">
              {quote.author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                {quote.author}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {quote.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StakeholderQuote;
