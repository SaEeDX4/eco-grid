import React, { useState, useEffect } from "react";
import { List } from "lucide-react";

const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (slug) => {
    const element = document.getElementById(slug);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <List size={20} className="text-slate-600 dark:text-slate-400" />
        <h3 className="font-bold text-slate-900 dark:text-white">
          Table of Contents
        </h3>
      </div>

      <nav>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li key={index}>
              <button
                onClick={() => scrollToHeading(heading.slug)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                  ${heading.level === 1 ? "pl-3" : heading.level === 2 ? "pl-6" : "pl-9"}
                  ${
                    activeId === heading.slug
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
