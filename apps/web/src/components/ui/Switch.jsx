import React from "react";

const Switch = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
          w-14 h-7 rounded-full transition-all duration-300 
          ${
            checked
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-slate-300 dark:bg-slate-600"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "group-hover:shadow-lg"}
        `}
        >
          <div
            className={`
            absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md
            transition-transform duration-300
            ${checked ? "translate-x-7" : "translate-x-0"}
            ${!disabled && "group-hover:scale-110"}
          `}
          />
        </div>
      </div>
      {label && (
        <span className="text-slate-700 dark:text-slate-300 font-medium select-none">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;
