/**
 * Booking Flow Constants
 * Centralized constants for booking steps, status, and configuration
 */

// Booking progress steps
export const BOOKING_STEPS = {
  SEARCH: 1,
  DETAILS: 2,
  PAYMENT: 3,
};

// Booking status values
export const BOOKING_STATUS = {
  PENDING: "pending",
  CREATED: "created",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  CANCELLED: "cancelled",
};

// Default form values
export const DEFAULT_FORM_VALUES = {
  gender: "Mr",
  emigrationCheck: false,
  mobileCountryCode: "+91",
  countryCode: "IN",
  title: "",
};

// Validation constraints
export const VALIDATION_RULES = {
  PASSPORT: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 15,
  },
  PHONE: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 15,
  },
  EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PAN_PATTERN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
};

// API endpoints
export const API_ENDPOINTS = {
  CREATE_BOOKING: "https://apib2c.flymoonsa.com/api/flights/create-itinerary",
  CHECK_PRICE: "https://apib2c.flymoonsa.com/api/flights/check_price",
};

// Default fallback values
export const FALLBACK_VALUES = {
  MOBILE: "8590055610",
  EMAIL: "robin@benzyinfotech.com",
  ADDRESS: "MRRA 4  EDAPPALLY  Edappally , EDAPPALLY , Edappally",
  STATE: "Kerala",
  CITY: "Cochin",
  PIN: "6865245",
};

