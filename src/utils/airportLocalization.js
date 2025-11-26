// Airport Localization Utility
// Maps IATA codes to localized airport and city names

// In-memory dataset. Starts with a minimal seed and can be extended at runtime
// by calling preloadAirportLocalization("ar" | "en"), which merges a large JSON
// dataset from public/data/airports/{lang}.json
const AIRPORTS = {
  // Saudi Arabia
  RUH: {
    city: { en: "Riyadh", ar: "الرياض" },
    airport: {
      en: "King Khalid International Airport",
      ar: "مطار الملك خالد الدولي",
    },
  },
  JED: {
    city: { en: "Jeddah", ar: "جدة" },
    airport: {
      en: "King Abdulaziz International Airport",
      ar: "مطار الملك عبدالعزيز الدولي",
    },
  },
  DMM: {
    city: { en: "Dammam", ar: "الدمام" },
    airport: {
      en: "King Fahd International Airport",
      ar: "مطار الملك فهد الدولي",
    },
  },

  // UAE
  DXB: {
    city: { en: "Dubai", ar: "دبي" },
    airport: { en: "Dubai International Airport", ar: "مطار دبي الدولي" },
  },
  AUH: {
    city: { en: "Abu Dhabi", ar: "أبو ظبي" },
    airport: {
      en: "Abu Dhabi International Airport",
      ar: "مطار أبو ظبي الدولي",
    },
  },

  // Egypt
  CAI: {
    city: { en: "Cairo", ar: "القاهرة" },
    airport: { en: "Cairo International Airport", ar: "مطار القاهرة الدولي" },
  },
  HRG: {
    city: { en: "Hurghada", ar: "الغردقة" },
    airport: {
      en: "Hurghada International Airport",
      ar: "مطار الغردقة الدولي",
    },
  },

  // Turkey
  IST: {
    city: { en: "Istanbul", ar: "إسطنبول" },
    airport: { en: "Istanbul Airport", ar: "مطار إسطنبول" },
  },
};

// Internal cache of load status to avoid multiple network fetches
const loadedLocales = { en: false, ar: false };

export async function preloadAirportLocalization(language = "en") {
  const lang = language === "ar" ? "ar" : "en";
  if (loadedLocales[lang]) return;

  try {
    // Expect JSON at /data/airports/{lang}.json with shape { IATA: { city: {en, ar}, airport: {en, ar} }, ... }
    // If the {lang}.json is missing (e.g. en.json), fall back to ar.json which contains both languages
    let response = await fetch(`/data/airports/${lang}.json`, {
      cache: "force-cache",
    });
    if (!response.ok && lang === "en") {
      response = await fetch(`/data/airports/ar.json`, {
        cache: "force-cache",
      });
    }
    if (!response.ok) return;
    const payload = await response.json();
    if (payload && typeof payload === "object") {
      Object.keys(payload).forEach((code) => {
        const normalized = (code || "").toUpperCase();
        const existing = AIRPORTS[normalized] || {};
        // Merge without losing other language data
        AIRPORTS[normalized] = {
          city: {
            en:
              payload[normalized]?.city?.en ||
              payload[code]?.city?.en ||
              existing.city?.en,
            ar:
              payload[normalized]?.city?.ar ||
              payload[code]?.city?.ar ||
              existing.city?.ar,
          },
          airport: {
            en:
              payload[normalized]?.airport?.en ||
              payload[code]?.airport?.en ||
              existing.airport?.en,
            ar:
              payload[normalized]?.airport?.ar ||
              payload[code]?.airport?.ar ||
              existing.airport?.ar,
          },
        };
      });
      loadedLocales[lang] = true;
    }
  } catch (err) {
    // Fail silently; seed data will be used as a fallback
  }
}

export function getLocalizedAirport(iata, language = "en") {
  const code = (iata || "").toUpperCase();
  const entry = AIRPORTS[code];
  if (!entry) return null;
  return {
    city: entry.city[language] || entry.city.en,
    airport: entry.airport[language] || entry.airport.en,
  };
}

export function getLocalizedCityByIata(iata, language = "en") {
  return getLocalizedAirport(iata, language)?.city || iata;
}

export function getLocalizedAirportNameByIata(iata, language = "en") {
  return getLocalizedAirport(iata, language)?.airport || iata;
}

export function hasAirport(iata) {
  return !!AIRPORTS[(iata || "").toUpperCase()];
}

const airportLocalizationApi = {
  getLocalizedAirport,
  getLocalizedCityByIata,
  getLocalizedAirportNameByIata,
  hasAirport,
};

export default airportLocalizationApi;
