/**
 * Utility functions for SearchForm component
 */

import {
  CABIN_CLASS_MAP,
  DEFAULT_CABIN_CLASS,
} from "../constants/searchFormConstants";

/**
 * Extracts airport code from location string
 * @param {string} locationString - Location string (e.g., "Cairo (CAI)")
 * @returns {string} Airport code or original string if no code found
 */
export const extractAirportCode = (locationString) => {
  if (!locationString) return "";
  const match = locationString.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : locationString;
};

/**
 * Formats date to ISO string (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateToISO = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Formats date for URL - handles both single date and date range for round trips
 * @param {string} startDate - Start date
 * @param {string} endDate - End date (optional)
 * @param {string} tripType - Trip type ("oneway" or "roundtrip")
 * @returns {string} Formatted date string for URL
 */
export const formatDateForURL = (startDate, endDate, tripType) => {
  if (!startDate) return "";

  const startDateFormatted = formatDateToISO(startDate);

  if (tripType === "roundtrip" && endDate) {
    const endDateFormatted = formatDateToISO(endDate);
    return `${startDateFormatted}_${endDateFormatted}`;
  }

  return startDateFormatted;
};

/**
 * Converts cabin class to URL parameter format
 * @param {string} cabinClass - Cabin class ("economy", "business", "first")
 * @returns {string} Cabin class code ("E", "B", "F")
 */
export const getCabinClassCode = (cabinClass) => {
  return CABIN_CLASS_MAP[cabinClass] || DEFAULT_CABIN_CLASS;
};

/**
 * Builds flight search results URL
 * @param {Object} params - Search parameters
 * @param {string} params.departure - Departure location
 * @param {string} params.arrival - Arrival location
 * @param {string} params.startDate - Start date
 * @param {string} params.endDate - End date (optional)
 * @param {string} params.tripType - Trip type
 * @param {boolean} params.directFlight - Direct flight flag
 * @param {Object} params.passengers - Passenger counts
 * @param {string} params.cabinClass - Cabin class
 * @returns {string} Complete results URL
 */
export const buildFlightSearchURL = ({
  departure,
  arrival,
  startDate,
  endDate,
  tripType,
  directFlight,
  passengers,
  cabinClass,
}) => {
  const originCode = extractAirportCode(departure);
  const destinationCode = extractAirportCode(arrival);
  const formattedDate = formatDateForURL(startDate, endDate, tripType);
  const cabinClassCode = getCabinClassCode(cabinClass);

  const searchParams = new URLSearchParams({
    adults: passengers.adults.toString(),
    children: passengers.children.toString(),
    infants: passengers.infants.toString(),
    cabinClass: cabinClassCode,
  });

  return `/flights/results/${originCode}/${destinationCode}/${formattedDate}/${
    directFlight ? "true" : "false"
  }?${searchParams.toString()}`;
};

