import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

const MathCaptcha = ({ value, onChange, error }) => {
  const [question, setQuestion] = useState({ a: 0, b: 0, answer: 0 });

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setQuestion({ a, b, answer: a + b });
    onChange(""); // Reset user answer
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const isCorrect = value && parseInt(value) === question.answer;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Security Check <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-lg">
              {question.a} + {question.b} = ?
            </div>
            <button
              type="button"
              onClick={generateQuestion}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Generate new question"
            >
              <RefreshCw
                size={20}
                className="text-slate-600 dark:text-slate-400"
              />
            </button>
          </div>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-slate-50 dark:bg-slate-800
              border-2 
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : isCorrect
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                    : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
              }
              text-slate-900 dark:text-white
              focus:ring-2 transition-all
            `}
            placeholder="Enter the answer"
            aria-describedby={error ? "captcha-error" : undefined}
          />
          {error && (
            <p
              id="captcha-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathCaptcha;
