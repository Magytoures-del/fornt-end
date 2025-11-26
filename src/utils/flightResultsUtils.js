/**
 * Utility functions for flight results page
 */

/**
 * Parse date parameter to extract start and end dates for round trips
 * @param {string} dateParam - Date parameter (single date or startDate_endDate)
 * @returns {Object} Object with startDate, endDate, and isRoundTrip flag
 */
export const parseDateParam = (dateParam) => {
  if (!dateParam) {
    return {
      startDate: null,
      endDate: null,
      isRoundTrip: false,
    };
  }

  if (dateParam.includes("_")) {
    const [start, end] = dateParam.split("_");
    return {
      startDate: start,
      endDate: end,
      isRoundTrip: true,
    };
  }

  return {
    startDate: dateParam,
    endDate: null,
    isRoundTrip: false,
  };
};

/**
 * Parse dates for overlay component
 * @param {string} date - Date parameter
 * @returns {Object} Object with departureDate and returnDate
 */
export const parseOverlayDates = (date) => {
  if (!date) {
    return { departureDate: null, returnDate: null };
  }

  if (date.includes("_")) {
    const [start, end] = date.split("_");
    return {
      departureDate: start,
      returnDate: end,
    };
  }

  return {
    departureDate: date,
    returnDate: null,
  };
};

/**
 * Get search parameters from URL with defaults
 * @param {URLSearchParams} searchParams - Next.js search params
 * @returns {Object} Search parameters object
 */
export const getSearchParams = (searchParams) => {
  return {
    adults: searchParams.get("adults") || "1",
    children: searchParams.get("children") || "0",
    infants: searchParams.get("infants") || "0",
    cabinClass: searchParams.get("cabinClass") || "E",
  };
};

/**
 * Calculate total passengers
 * @param {string} adults - Number of adults
 * @param {string} children - Number of children
 * @param {string} infants - Number of infants
 * @returns {number} Total number of passengers
 */
export const calculateTotalPassengers = (adults, children, infants) => {
  return parseInt(adults || 0, 10) + parseInt(children || 0, 10) + parseInt(infants || 0, 10);
};

/**
 * Determine trip type from flight results
 * @param {Array} results - Flight results array
 * @returns {string} Trip type ('roundtrip' or 'oneway')
 */
export const getTripType = (results) => {
  if (!results || results.length === 0) {
    return "oneway";
  }
  return results[0].isRoundTrip ? "roundtrip" : "oneway";
};

/**
 * Load search form data from localStorage
 * @returns {Object} Object with originLabel and destinationLabel
 */
export const loadSearchFormData = () => {
  try {
    const searchFormData = localStorage.getItem("flymoon_search_form");
    if (searchFormData) {
      const parsed = JSON.parse(searchFormData);
      return {
        originLabel: parsed.departure || "",
        destinationLabel: parsed.arrival || "",
      };
    }
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error loading search form data:", error);
    }
  }
  return {
    originLabel: "",
    destinationLabel: "",
  };
};



