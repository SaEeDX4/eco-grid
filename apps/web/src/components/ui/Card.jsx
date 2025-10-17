import React from "react";

export const Card = ({ className = "", children, hover = false, ...props }) => {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800/50 
        backdrop-blur-sm
        rounded-2xl 
        border border-slate-200 dark:border-slate-700
        shadow-lg
        transition-all duration-300
        ${hover ? "hover:shadow-2xl hover:scale-105 hover:border-green-500/50 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3
      className={`text-2xl font-bold text-slate-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ className = "", children, ...props }) => {
  return (
    <p
      className={`text-slate-600 dark:text-slate-400 mt-2 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 pt-0 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
};
