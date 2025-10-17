import React from "react";
import { Check, X } from "lucide-react";

const PasswordStrength = ({ password }) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const strengthPercent = (strength / 5) * 100;

  const strengthColors = {
    0: "bg-slate-200",
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-green-500",
    5: "bg-emerald-500",
  };

  const strengthLabels = {
    0: "No password",
    1: "Very weak",
    2: "Weak",
    3: "Fair",
    4: "Good",
    5: "Strong",
  };

  if (!password) return null;

  return (
    <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Password Strength
          </span>
          <span
            className={`text-sm font-semibold ${
              strength >= 4
                ? "text-green-600"
                : strength >= 3
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {strengthLabels[strength]}
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthColors[strength]} transition-all duration-500 ease-out`}
            style={{ width: `${strengthPercent}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { key: "length", label: "At least 8 characters" },
          { key: "uppercase", label: "One uppercase letter" },
          { key: "lowercase", label: "One lowercase letter" },
          { key: "number", label: "One number" },
          { key: "special", label: "One special character" },
        ].map(({ key, label }) => (
          <div
            key={key}
            className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
              checks[key]
                ? "text-green-600 dark:text-green-400"
                : "text-slate-400"
            }`}
          >
            <div
              className={`
              w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
              ${
                checks[key]
                  ? "bg-green-500 scale-100"
                  : "bg-slate-200 dark:bg-slate-700 scale-90"
              }
            `}
            >
              {checks[key] ? (
                <Check size={14} className="text-white" />
              ) : (
                <X size={14} className="text-slate-400" />
              )}
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
