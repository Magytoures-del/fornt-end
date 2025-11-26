/**
 * Flight Page Constants
 * Centralized constants for flights page components
 */

// Hero Section Constants
export const HERO_SECTION = {
  IMAGE: {
    src: "/heroSection.png",
    quality: 80,
    sizes: "100vw",
  },
  HEIGHTS: {
    mobile: "50vh", // Minimum height for mobile devices
    tablet: "70vh",
    desktop: "80vh",
  },
  MARGINS: {
    mobile: "mt-16",
    tablet: "sm:mt-20",
  },
  TOAST: {
    duration: 5000,
  },
};

// Features Section Constants
export const FEATURES = [
  {
    id: "diverse_airlines",
    icon: "✈️",
    translationKey: "flights.why_flymoon.features.diverse_airlines",
    bgGradient: "from-blue-500 to-cyan-500",
    bgLight: "from-blue-50 to-cyan-50",
    shadowColor: "shadow-blue-500/20",
    hoverShadow: "group-hover:shadow-blue-500/40",
  },
  {
    id: "easy_booking",
    icon: "🔍",
    translationKey: "flights.why_flymoon.features.easy_booking",
    bgGradient: "from-purple-500 to-pink-500",
    bgLight: "from-purple-50 to-pink-50",
    shadowColor: "shadow-purple-500/20",
    hoverShadow: "group-hover:shadow-purple-500/40",
  },
  {
    id: "lowest_prices",
    icon: "🎫",
    translationKey: "flights.why_flymoon.features.lowest_prices",
    bgGradient: "from-emerald-500 to-teal-500",
    bgLight: "from-emerald-50 to-teal-50",
    shadowColor: "shadow-emerald-500/20",
    hoverShadow: "group-hover:shadow-emerald-500/40",
  },
];

export const FEATURES_ANIMATION = {
  delayMultiplier: 150, // milliseconds
  decorationCount: 3,
  decorationDelayMultiplier: 200, // milliseconds
};

// Partners Section Constants
import flynasSrc from "../assets/airlines/Flynas.png";
import saudiaSrc from "../assets/airlines/saudiArabian.png";
import qatarSrc from "../assets/airlines/qatar.png";
import kuwaitSrc from "../assets/airlines/KuwaitAirways.png";
import emiratesSrc from "../assets/airlines/emirates.png";
import egyptSrc from "../assets/airlines/EgyptAir.png";
import turkishSrc from "../assets/airlines/TurkishAirlines.png";

export const AIRLINES = [
  {
    id: "flynas",
    name: "Flynas",
    logo: flynasSrc,
    verified: true,
    rating: 4.2,
  },
  {
    id: "saudia",
    name: "Saudi Arabian Airlines",
    logo: saudiaSrc,
    verified: true,
    rating: 4.5,
  },
  {
    id: "qatar",
    name: "Qatar Airways",
    logo: qatarSrc,
    verified: true,
    rating: 4.8,
  },
  {
    id: "kuwait",
    name: "Kuwait Airways",
    logo: kuwaitSrc,
    verified: true,
    rating: 4.1,
  },
  {
    id: "emirates",
    name: "Emirates",
    logo: emiratesSrc,
    verified: true,
    rating: 4.7,
  },
  {
    id: "egypt",
    name: "EgyptAir",
    logo: egyptSrc,
    verified: true,
    rating: 4.0,
  },
  {
    id: "turkish",
    name: "Turkish Airlines",
    logo: turkishSrc,
    verified: true,
    rating: 4.6,
  },
];

export const AIRLINE_GRID = {
  priorityCount: 4, // Number of airlines to load with priority
  logoSize: {
    width: 80,
    height: 80,
  },
};

// Layout Constants
export const LAYOUT = {
  container: {
    maxWidth: "max-w-7xl",
    padding: "px-4 sm:px-6 lg:px-8",
  },
  spacing: {
    section: "space-y-0",
  },
};

