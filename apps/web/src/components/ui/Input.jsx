import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const Input = React.forwardRef(
  (
    {
      className = "",
      type = "text",
      label,
      error,
      success,
      helperText,
      icon: Icon,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Icon */}
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
              <Icon size={20} />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={actualType}
            className={`
            w-full px-4 py-3 ${Icon ? "pl-11" : ""} ${isPassword ? "pr-11" : ""}
            bg-white dark:bg-slate-800
            border-2 rounded-xl
            text-slate-900 dark:text-white
            placeholder:text-slate-400
            transition-all duration-300
            focus:outline-none focus:ring-4
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : success
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : "border-slate-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500/20 hover:border-green-400"
            }
            ${isFocused ? "scale-[1.02]" : ""}
            ${className}
          `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {/* Status Icon */}
          {(error || success) && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {error ? (
                <AlertCircle size={20} className="text-red-500" />
              ) : (
                <CheckCircle size={20} className="text-green-500" />
              )}
            </div>
          )}
        </div>

        {/* Helper/Error Text */}
        {(error || helperText || success) && (
          <p
            className={`mt-2 text-sm flex items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-300 ${
              error
                ? "text-red-600 dark:text-red-400"
                : success
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
