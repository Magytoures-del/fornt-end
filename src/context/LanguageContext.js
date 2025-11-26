"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import "../config/i18n";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Helper function to get language from cookies (works on both server and client)
function getLanguageFromCookies() {
  if (typeof document === "undefined") return "ar";
  
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "i18next" || name === "language") {
      const lang = value?.trim();
      return lang === "en" ? "en" : "ar";
    }
  }
  return "ar";
}

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Initialize with language from cookies to match server-side rendering
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      // Try cookies first (matches server), then localStorage
      const cookieLang = getLanguageFromCookies();
      if (cookieLang !== "ar") {
        return cookieLang;
      }
      
      const storedLang = localStorage.getItem("language") || localStorage.getItem("i18nextLng");
      return storedLang === "en" ? "en" : "ar";
    }
    return "ar";
  });
  
  const [isRTL, setIsRTL] = useState(currentLanguage === "ar");
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const changeLanguage = useCallback(
    (languageCode) => {
      setCurrentLanguage(languageCode);
      i18n.changeLanguage(languageCode);
      
      // Only access browser APIs after mount
      if (typeof window !== "undefined") {
        localStorage.setItem("language", languageCode);
        localStorage.setItem("i18nextLng", languageCode);
        
        // Set cookie for server-side access
        // Set both i18next and language cookies for compatibility
        document.cookie = `i18next=${languageCode}; path=/; max-age=31536000; SameSite=Lax`;
        document.cookie = `language=${languageCode}; path=/; max-age=31536000; SameSite=Lax`;
      }
    },
    [i18n]
  );

  // Initialize i18n with the correct language immediately on mount
  // This ensures server and client match by reading from cookies (same source as server)
  useEffect(() => {
    // Get language from cookies first (matches server), then localStorage
    const cookieLang = getLanguageFromCookies();
    const storedLang = typeof window !== "undefined" 
      ? localStorage.getItem("language") || localStorage.getItem("i18nextLng")
      : null;
    
    const initialLang = cookieLang !== "ar" ? cookieLang : (storedLang === "en" ? "en" : "ar");
    
    // Immediately change i18n language if different
    if (initialLang !== i18n.language) {
      i18n.changeLanguage(initialLang);
      setCurrentLanguage(initialLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount - i18n is stable and doesn't need to be in deps

  useEffect(() => {
    // Only update DOM after mount to prevent hydration mismatch
    if (!isMounted) return;
    
    // Update RTL based on current language
    setIsRTL(i18n.language === "ar");

    // Update HTML attributes
    if (typeof document !== "undefined") {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

      // Update body class for styling
      document.body.className = document.body.className.replace(
        /\b(rtl|ltr)\b/g,
        ""
      );
      document.body.classList.add(i18n.language === "ar" ? "rtl" : "ltr");
    }
  }, [i18n.language, isMounted]);

  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦", nativeName: "العربية" },
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  ];

  const value = {
    currentLanguage,
    isRTL,
    changeLanguage,
    languages,
    i18n,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
