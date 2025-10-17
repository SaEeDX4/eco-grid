import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Dropdown = ({ trigger, items, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`
          absolute top-full mt-2 min-w-[200px]
          bg-white dark:bg-slate-800 
          border border-slate-200 dark:border-slate-700
          rounded-xl shadow-2xl
          py-2 z-50
          animate-in fade-in slide-in-from-top-2 duration-200
          ${align === "right" ? "right-0" : "left-0"}
        `}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              className="
                w-full px-4 py-3 text-left
                flex items-center gap-3
                text-slate-700 dark:text-slate-300
                hover:bg-slate-50 dark:hover:bg-slate-700
                transition-colors
              "
            >
              {item.icon && <item.icon size={18} />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
