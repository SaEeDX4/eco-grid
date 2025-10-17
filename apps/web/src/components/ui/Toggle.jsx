import React from "react";
import { Check, X } from "lucide-react";

const Toggle = ({
  checked,
  onChange,
  disabled = false,
  size = "default",
  showIcons = false,
  label,
  className = "",
}) => {
  const sizes = {
    sm: "w-10 h-6",
    default: "w-14 h-7",
    lg: "w-16 h-8",
  };

  const thumbSizes = {
    sm: "w-5 h-5",
    default: "w-6 h-6",
    lg: "w-7 h-7",
  };

  const translateX = {
    sm: "translate-x-4",
    default: "translate-x-7",
    lg: "translate-x-8",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex items-center rounded-full transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-green-500/20
        ${sizes[size]}
        ${
          checked
            ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
            : "bg-slate-300 dark:bg-slate-600"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-xl"}
        ${className}
      `}
    >
      {/* Track Icons */}
      {showIcons && (
        <>
          <Check
            className={`
              absolute left-1.5 text-white transition-opacity duration-300
              ${checked ? "opacity-100" : "opacity-0"}
            `}
            size={size === "sm" ? 12 : size === "lg" ? 16 : 14}
          />
          <X
            className={`
              absolute right-1.5 text-slate-500 transition-opacity duration-300
              ${checked ? "opacity-0" : "opacity-100"}
            `}
            size={size === "sm" ? 12 : size === "lg" ? 16 : 14}
          />
        </>
      )}

      {/* Thumb */}
      <span
        className={`
          inline-block rounded-full bg-white shadow-lg
          transition-all duration-300 ease-out
          ${thumbSizes[size]}
          ${checked ? translateX[size] : "translate-x-0.5"}
          ${!disabled && "group-hover:scale-110"}
        `}
      />

      {/* Label */}
      {label && (
        <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
    </button>
  );
};

export default Toggle;
