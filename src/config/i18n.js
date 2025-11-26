import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import arTranslation from "../locales/ar/translation.json";
import enTranslation from "../locales/en/translation.json";

const resources = {
  ar: {
    translation: arTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

// Helper to get language from cookies synchronously (client-side only)
function getLanguageFromCookie() {
  if (typeof document === "undefined") return "ar";
  
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "i18next" || name === "language") {
      const lang = value?.trim();
      return lang === "en" ? "en" : "ar";
    }
  }
  return null; // Return null if no cookie found, let detector handle it
}

// Get initial language from cookie if available (for client-side initialization)
const initialLanguage = typeof document !== "undefined" ? getLanguageFromCookie() : null;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage || "ar", // Use cookie value if available, otherwise default to Arabic
    fallbackLng: "ar",

    detection: {
      order: [
        "cookie", // Check cookies first (available on server)
        "localStorage", // Then localStorage (client only)
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"],
      lookupCookie: "i18next", // Cookie name to check
      lookupLocalStorage: "i18nextLng", // localStorage key
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: false,
    },

    // Language switching configuration
    supportedLngs: ["ar", "en"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",

    // RTL configuration
    rtl: {
      ar: true,
      en: false,
    },
  });

export default i18n;
