import React, { createContext, useContext, useEffect, useState } from "react";

const I18nContext = createContext({
  t: () => "",
  lang: "en",
  setLang: () => {},
});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [dict, setDict] = useState({});

  useEffect(() => {
    // Build a safe URL that works with Vite dev & prod (subpaths too)
    const base = import.meta.env.BASE_URL || "/";
    const url = `${base}locales/${lang}.json`;

    async function load() {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
        const data = await res.json();
        setDict(data);
        // console.log("[i18n] loaded", lang, Object.keys(data));
      } catch (err) {
        console.error("[i18n] load error:", err);
        setDict({});
      }
    }
    load();

    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, fallback = "") => {
    const parts = key.split(".");
    let cur = dict;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return fallback;
      }
    }
    return typeof cur === "string" ? cur : fallback;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

// (Optional) temporary alias if any old code still uses useTranslation:
export const useTranslation = useI18n;
