import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";

const LanguageSwitcher = ({ compact = false }) => {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation();

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
  };

  if (compact) {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Globe size={18} className="text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {currentLanguage.toUpperCase()}
          </span>
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${
                  currentLanguage === lang.code
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }
                first:rounded-t-xl last:rounded-b-xl
              `}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-semibold">{lang.name}</div>
                <div className="text-xs opacity-75">{lang.nativeName}</div>
              </div>
              {currentLanguage === lang.code && (
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2">
        <Globe size={20} className="text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Language
        </span>
      </div>

      <div className="flex-1 flex gap-2">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300
              ${
                currentLanguage === lang.code
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-md hover:scale-102"
              }
            `}
          >
            <span className="text-xl">{lang.flag}</span>
            <div className="text-left">
              <div className="text-xs font-semibold">
                {lang.code.toUpperCase()}
              </div>
              <div className="text-xs opacity-75">{lang.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
