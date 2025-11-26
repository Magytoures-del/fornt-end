import arTranslation from "../locales/ar/translation.json";
import enTranslation from "../locales/en/translation.json";

const translations = {
  ar: arTranslation,
  en: enTranslation,
};

export function generateMetadata(key, language = "ar") {
  const t = translations[language] || translations.ar;

  // Helper function to get nested translation
  const getTranslation = (path) => {
    return path.split(".").reduce((obj, key) => obj && obj[key], t);
  };

  const title =
    getTranslation(key + ".title") || getTranslation("metadata.title");
  const description =
    getTranslation(key + ".description") ||
    getTranslation("metadata.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: "/",
      languages: {
        ar: "/",
        en: "/en",
      },
    },
    openGraph: {
      title: title,
      description: description,
      type: "website",
      locale: language,
      alternateLocale: language === "ar" ? "en" : "ar",
    },
    twitter: {
      title: title,
      description: description,
      card: "summary_large_image",
    },
  };
}

export function generatePageMetadata(
  pageName,
  language = "ar",
  canonicalPathOverride
) {
  const t = translations[language] || translations.ar;

  const getTranslation = (path) => {
    return path.split(".").reduce((obj, key) => obj && obj[key], t);
  };

  const pageTitle =
    getTranslation(`metadata.${pageName}_title`) ||
    getTranslation(`${pageName}.title`);
  const baseTitle = getTranslation("metadata.title");
  const description =
    getTranslation(`metadata.${pageName}_description`) ||
    getTranslation(`${pageName}.meta_description`) ||
    getTranslation("metadata.description");
  const title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
  const canonicalPath = canonicalPathOverride || `/${pageName}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: language,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
}
