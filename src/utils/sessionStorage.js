/**
 * Session Storage Utility for Travel Data Management
 * Provides secure and type-safe methods for storing travel-related data
 */

// Session storage keys
export const SESSION_KEYS = {
  TRAVEL_DATA: "flymoon_travel_data",
  BOOKING_DATA: "flymoon_booking_data",
  PASSENGER_DATA: "flymoon_passenger_data",
  PRICING_DATA: "flymoon_pricing_data",
  FLIGHT_DETAILS: "flymoon_flight_details",
  SEARCH_PARAMS: "flymoon_search_params",
};

/**
 * Safely parse JSON from session storage
 * @param {string} key - Session storage key
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed data or default value
 */
const safeParseJSON = (key, defaultValue = null) => {
  try {
    if (typeof window === "undefined") return defaultValue;

    const item = sessionStorage.getItem(key);
    if (!item) return defaultValue;

    return JSON.parse(item);
  } catch (error) {
    console.warn(`Failed to parse session storage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely stringify and store data in session storage
 * @param {string} key - Session storage key
 * @param {any} data - Data to store
 * @returns {boolean} Success status
 */
const safeSetItem = (key, data) => {
  try {
    if (typeof window === "undefined") return false;

    sessionStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn(`Failed to store session storage item "${key}":`, error);
    return false;
  }
};

/**
 * Travel Data Management
 */
export const travelDataStorage = {
  /**
   * Store complete travel data package
   * @param {Object} travelData - Complete travel data object
   */
  set: (travelData) => {
    const dataToStore = {
      ...travelData,
      timestamp: Date.now(),
      version: "1.0.0",
    };
    return safeSetItem(SESSION_KEYS.TRAVEL_DATA, dataToStore);
  },

  /**
   * Get complete travel data package
   * @returns {Object|null} Travel data or null
   */
  get: () => {
    return safeParseJSON(SESSION_KEYS.TRAVEL_DATA);
  },

  /**
   * Update specific fields in travel data
   * @param {Object} updates - Fields to update
   */
  update: (updates) => {
    const currentData = travelDataStorage.get() || {};
    const updatedData = {
      ...currentData,
      ...updates,
      lastUpdated: Date.now(),
    };
    return travelDataStorage.set(updatedData);
  },

  /**
   * Clear travel data
   */
  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.TRAVEL_DATA);
    }
  },

  /**
   * Check if travel data exists and is valid
   * @param {number} maxAge - Maximum age in milliseconds (default: 1 hour)
   * @returns {boolean} Whether data exists and is valid
   */
  isValid: (maxAge = 60 * 60 * 1000) => {
    const data = travelDataStorage.get();
    if (!data || !data.timestamp) return false;

    return Date.now() - data.timestamp < maxAge;
  },
};

/**
 * Booking Data Management
 */
export const bookingDataStorage = {
  set: (bookingData) => {
    const dataToStore = {
      ...bookingData,
      timestamp: Date.now(),
    };
    return safeSetItem(SESSION_KEYS.BOOKING_DATA, dataToStore);
  },

  get: () => {
    return safeParseJSON(SESSION_KEYS.BOOKING_DATA);
  },

  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.BOOKING_DATA);
    }
  },
};

/**
 * Passenger Data Management
 */
export const passengerDataStorage = {
  set: (passengerData) => {
    const dataToStore = {
      ...passengerData,
      timestamp: Date.now(),
    };
    return safeSetItem(SESSION_KEYS.PASSENGER_DATA, dataToStore);
  },

  get: () => {
    return safeParseJSON(SESSION_KEYS.PASSENGER_DATA);
  },

  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.PASSENGER_DATA);
    }
  },
};

/**
 * Pricing Data Management
 */
export const pricingDataStorage = {
  set: (pricingData) => {
    const dataToStore = {
      ...pricingData,
      timestamp: Date.now(),
    };
    return safeSetItem(SESSION_KEYS.PRICING_DATA, dataToStore);
  },

  get: () => {
    return safeParseJSON(SESSION_KEYS.PRICING_DATA);
  },

  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.PRICING_DATA);
    }
  },
};

/**
 * Flight Details Management
 */
export const flightDetailsStorage = {
  set: (flightDetails) => {
    const dataToStore = {
      ...flightDetails,
      timestamp: Date.now(),
    };
    return safeSetItem(SESSION_KEYS.FLIGHT_DETAILS, dataToStore);
  },

  get: () => {
    return safeParseJSON(SESSION_KEYS.FLIGHT_DETAILS);
  },

  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.FLIGHT_DETAILS);
    }
  },
};

/**
 * Search Parameters Management
 */
export const searchParamsStorage = {
  set: (searchParams) => {
    const dataToStore = {
      ...searchParams,
      timestamp: Date.now(),
    };
    return safeSetItem(SESSION_KEYS.SEARCH_PARAMS, dataToStore);
  },

  get: () => {
    return safeParseJSON(SESSION_KEYS.SEARCH_PARAMS);
  },

  clear: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEYS.SEARCH_PARAMS);
    }
  },
};

/**
 * Clear all travel-related session storage
 */
export const clearAllTravelData = () => {
  if (typeof window !== "undefined") {
    Object.values(SESSION_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }
};

/**
 * Get all travel-related session storage data
 * @returns {Object} All travel data
 */
export const getAllTravelData = () => {
  return {
    travelData: travelDataStorage.get(),
    bookingData: bookingDataStorage.get(),
    passengerData: passengerDataStorage.get(),
    pricingData: pricingDataStorage.get(),
    flightDetails: flightDetailsStorage.get(),
    searchParams: searchParamsStorage.get(),
  };
};

/**
 * Check if user has any travel data in session
 * @returns {boolean} Whether any travel data exists
 */
export const hasTravelData = () => {
  const allData = getAllTravelData();
  return Object.values(allData).some((data) => data !== null);
};

/**
 * Export session storage size information
 * @returns {Object} Storage usage information
 */
export const getStorageInfo = () => {
  if (typeof window === "undefined") {
    return { totalSize: 0, itemCount: 0, items: {} };
  }

  const items = {};
  let totalSize = 0;

  Object.entries(SESSION_KEYS).forEach(([name, key]) => {
    const item = sessionStorage.getItem(key);
    const size = item ? new Blob([item]).size : 0;
    items[name] = { key, size, exists: !!item };
    totalSize += size;
  });

  return {
    totalSize,
    itemCount: Object.values(items).filter((item) => item.exists).length,
    items,
  };
};

