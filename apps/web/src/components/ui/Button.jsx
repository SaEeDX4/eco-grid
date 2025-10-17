import React from "react";
import { Loader2 } from "lucide-react";

const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "primary",
      size = "default",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

    const variants = {
      primary:
        "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-green-500/30",
      secondary:
        "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600",
      outline:
        "border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30",
      ghost:
        "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
      gradient:
        "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      default: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      xl: "h-16 px-10 text-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" size={18} />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
