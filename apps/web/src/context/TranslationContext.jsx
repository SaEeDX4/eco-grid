import React, { createContext, useContext, useState } from "react";

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const availableLanguages = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇨🇦",
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      flag: "🇫🇷",
    },
    {
      code: "fa",
      name: "Farsi",
      nativeName: "فارسی",
      flag: "🇮🇷",
    },
  ];

  const setLanguage = (langCode) => {
    if (availableLanguages.find((l) => l.code === langCode)) {
      setCurrentLanguage(langCode);
      localStorage.setItem("language", langCode);
      // In production, this would trigger i18n to load translations
      console.log(`Language changed to: ${langCode}`);
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
