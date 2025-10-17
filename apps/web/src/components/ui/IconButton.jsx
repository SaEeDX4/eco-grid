import React from "react";

const IconButton = ({
  icon: Icon,
  onClick,
  variant = "default",
  size = "default",
  disabled = false,
  tooltip,
  className = "",
  ...props
}) => {
  const variants = {
    default:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
    primary:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
    danger:
      "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        inline-flex items-center justify-center
        rounded-xl font-medium
        transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-green-500/20
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
};

export default IconButton;
