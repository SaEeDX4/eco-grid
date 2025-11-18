import React from "react";
import { motion } from "framer-motion";
import { Search, HelpCircle } from "lucide-react";

const FAQEmpty = ({ searchQuery, onClearSearch }) => {
  return (
    <motion.div
      className="py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
        {searchQuery ? (
          <Search className="text-slate-400" size={48} />
        ) : (
          <HelpCircle className="text-slate-400" size={48} />
        )}
      </div>

      {searchQuery ? (
        <>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            No Results Found
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            We couldn't find any FAQs matching "
            <span className="font-semibold">{searchQuery}</span>"
          </p>
          <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">Try:</p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li>• Using different keywords</li>
              <li>• Checking your spelling</li>
              <li>• Using more general terms</li>
              <li>• Browsing by category</li>
            </ul>
          </div>
          <button
            onClick={onClearSearch}
            className="mt-8 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Clear Search
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            No FAQs Available
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Check back soon for helpful answers to common questions
          </p>
        </>
      )}
    </motion.div>
  );
};

export default FAQEmpty;
