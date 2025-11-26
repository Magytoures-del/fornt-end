/**
 * Constants for Calendar component
 */

export const CALENDAR_BREAKPOINTS = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
};

export const SEARCH_TYPES = {
  FLIGHT: "flight",
  HOTEL: "hotel",
};

export const TRIP_TYPES = {
  ONEWAY: "oneway",
  ROUNDTRIP: "roundtrip",
};

export const CALENDAR_CONFIG = {
  WEEKS_TO_DISPLAY: 6,
  MAX_YEARS_AHEAD: 2,
  FOCUS_DELAY: 150,
  SCROLL_DELAY: 300,
  ARBITRARY_SATURDAY: { year: 2024, month: 5, day: 1 }, // June 1, 2024 is Saturday
};

export const ARABIC_DAY_NAMES_FALLBACK = ["س", "ج", "خ", "أ", "ث", "ا", "ح"];

export const DATE_FORMAT_OPTIONS = {
  MONTH_YEAR: {
    month: "long",
    year: "numeric",
    calendar: "gregory",
  },
  WEEKDAY_NARROW: {
    weekday: "narrow",
    calendar: "gregory",
  },
};

export const LOCALES = {
  ARABIC: "ar-SA",
  ENGLISH: "en-US",
};


