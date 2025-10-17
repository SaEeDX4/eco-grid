import React from "react";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef(
  ({ label, error, options = [], className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}

        <div className="relative group">
          <select
            ref={ref}
            className={`
            w-full px-4 py-3 pr-10
            bg-white dark:bg-slate-800
            border-2 rounded-xl
            text-slate-900 dark:text-white
            appearance-none
            transition-all duration-300
            focus:outline-none focus:ring-4
            cursor-pointer
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500/20 hover:border-green-400"
            }
            ${className}
          `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-green-600 transition-colors"
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
