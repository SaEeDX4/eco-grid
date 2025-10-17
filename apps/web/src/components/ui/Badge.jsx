import React from "react";

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default:
      "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
    success:
      "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300",
    error: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300",
    primary: "bg-green-600 text-white",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
        transition-all duration-300 hover:scale-105
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
