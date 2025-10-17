import React from "react";

const Label = ({ children, required, className = "", ...props }) => {
  return (
    <label
      className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
