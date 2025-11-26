/**
 * SearchBar Component Configuration
 * Centralized constants for the SearchBar component
 */

// Translation keys for form labels
export const TRANSLATION_KEYS = {
  TRIP_TYPE: "flights.trip_type.label",
  PASSENGERS: "flights.passengers.label",
  CABIN_CLASS: "flights.cabin_class.label",
  DIRECT_FLIGHT: "flights.direct_flight.label",
};

// Form field configuration
export const FORM_FIELDS = [
  {
    id: "trip-type",
    translationKey: TRANSLATION_KEYS.TRIP_TYPE,
    component: "TripTypeSelector",
    showLabelOnMobile: false,
    showOnMobile: false,
  },
  {
    id: "passengers",
    translationKey: TRANSLATION_KEYS.PASSENGERS,
    component: "PassengerSelector",
    showLabelOnMobile: false,
    showOnMobile: false,
  },
  {
    id: "cabin-class",
    translationKey: TRANSLATION_KEYS.CABIN_CLASS,
    component: "CabinClassSelector",
    showLabelOnMobile: false,
    showOnMobile: false,
  },
  {
    id: "direct-flight",
    translationKey: TRANSLATION_KEYS.DIRECT_FLIGHT,
    component: "DirectFlightSelector",
    showLabelOnMobile: false,
    showOnMobile: false,
  },
];

// Responsive breakpoints (matching styled-components breakpoints)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

