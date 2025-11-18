import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FAQItem from "./FAQItem";
import { Search } from "lucide-react"; // added

const FAQAccordion = ({ faqs, onFeedback, searchQuery = "" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  // Auto-open first result when searching
  useEffect(() => {
    if (searchQuery && faqs.length > 0) {
      setOpenIndex(0);
    }
  }, [searchQuery, faqs]);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);

    // Scroll to opened FAQ
    if (openIndex !== index) {
      setTimeout(() => {
        const element = document.getElementById(`faq-${index}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        {/* Replaced 🔍 with Lucide Search icon */}
        <div className="mb-4 flex justify-center">
          <Search size={48} className="text-slate-500 dark:text-slate-400" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          No FAQs Found
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={faq._id} id={`faq-${index}`}>
          <FAQItem
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            onFeedback={onFeedback}
            searchQuery={searchQuery}
          />
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
