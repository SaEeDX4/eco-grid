import React from "react";

const BillingToggle = ({ period, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span
        className={`text-sm font-semibold transition-colors ${period === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500"}`}
      >
        Monthly
      </span>

      <button
        onClick={() => onChange(period === "monthly" ? "annual" : "monthly")}
        className="relative w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`Switch to ${period === "monthly" ? "annual" : "monthly"} billing`}
      >
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg transition-transform duration-300 ${
            period === "annual" ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold transition-colors ${period === "annual" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500"}`}
        >
          Annual
        </span>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
          Save 20%
        </span>
      </div>
    </div>
  );
};

export default BillingToggle;
