import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { scrollToYear } from "../../lib/roadmapHelpers";

const TimelineNavigation = ({ years }) => {
  const [activeYear, setActiveYear] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button after scrolling down
      setShowScrollTop(window.scrollY > 500);

      // Detect which year is in view
      years.forEach((year) => {
        const element = document.getElementById(`year-${year.year}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveYear(year.year);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [years]);

  const handleYearClick = (year) => {
    scrollToYear(year);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Year Navigation */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-3">
          {years.map((year, index) => (
            <motion.button
              key={year.year}
              onClick={() => handleYearClick(year.year)}
              className={`
                group relative w-12 h-12 rounded-full transition-all duration-200
                ${
                  activeYear === year.year
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                    : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500"
                }
              `}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span
                className={`
                text-sm font-bold
                ${
                  activeYear === year.year
                    ? "text-white"
                    : "text-slate-700 dark:text-slate-300"
                }
              `}
              >
                {year.year.toString().slice(2)}
              </span>

              {/* Tooltip */}
              <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold shadow-lg">
                  {year.year} - {year.theme}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </>
  );
};

export default TimelineNavigation;
