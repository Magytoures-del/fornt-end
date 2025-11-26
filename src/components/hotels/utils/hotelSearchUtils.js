/**
 * Format date from YYYY-MM-DD to MM/DD/YYYY
 */
export const formatDateToMMDDYYYY = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
};

/**
 * Format date for display (e.g., "Mon, Jan 1")
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
};

/**
 * Convert date to YYYY-MM-DD format
 */
export const convertToYYYYMMDD = (date) => {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  } else if (typeof date === "string") {
    return date.includes("T") ? date.split("T")[0] : date;
  }
  return date;
};

/**
 * Extract country code from location object
 */
export const extractCountryCode = (selectedLocation, defaultCode = "AE") => {
  if (!selectedLocation) return defaultCode;

  if (selectedLocation.countryCode) {
    return selectedLocation.countryCode;
  } else if (selectedLocation.country?.code) {
    return selectedLocation.country.code;
  } else if (
    selectedLocation.country &&
    typeof selectedLocation.country === "string"
  ) {
    const countryStr = selectedLocation.country.trim().toUpperCase();
    if (countryStr.length === 2) {
      return countryStr;
    }
  }
  return defaultCode;
};

/**
 * Build rooms array from guests data
 */
export const buildRoomsArray = (guests, childrenAges) => {
  const roomsArray = [];
  const adultsPerRoom = Math.floor(guests.adults / guests.rooms);
  const childrenPerRoom = Math.floor(guests.children / guests.rooms);
  const remainingAdults = guests.adults % guests.rooms;
  const remainingChildren = guests.children % guests.rooms;

  let childAgeIndex = 0;
  for (let i = 0; i < guests.rooms; i++) {
    const roomAdults = adultsPerRoom + (i === 0 ? remainingAdults : 0);
    const roomChildren = childrenPerRoom + (i === 0 ? remainingChildren : 0);

    // Assign child ages to this room
    const roomChildAges = [];
    for (let j = 0; j < roomChildren; j++) {
      if (childAgeIndex < childrenAges.length) {
        roomChildAges.push(String(childrenAges[childAgeIndex]));
        childAgeIndex++;
      } else {
        roomChildAges.push("1"); // Default to 1 if age not specified
      }
    }

    roomsArray.push({
      adults: String(roomAdults),
      children: String(roomChildren),
      childAges: roomChildAges,
    });
  }
  return roomsArray;
};

/**
 * Get display text from suggestion object
 */
export const getSuggestionDisplayText = (suggestion) => {
  if (!suggestion) return "";

  return (
    suggestion.name ||
    suggestion.label ||
    suggestion.city ||
    suggestion.destination ||
    suggestion.fullName ||
    String(suggestion)
  );
};

/**
 * Build location parts from suggestion
 */
export const buildLocationParts = (suggestion) => {
  const locationParts = [];
  if (suggestion.type === "hotel" && suggestion.city) {
    locationParts.push(suggestion.city);
  }
  if (suggestion.state) {
    locationParts.push(suggestion.state);
  }
  if (suggestion.country) {
    locationParts.push(suggestion.country);
  }
  return locationParts;
};

/**
 * Highlight matching text in search results
 */
export const renderHighlighted = (text, term) => {
  if (!term) return text;
  try {
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = String(text).split(new RegExp(`(${safe})`, "ig"));
    return parts.map((part, idx) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span
          key={idx}
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "0 2px",
            borderRadius: "4px",
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  } catch {
    return text;
  }
};

/**
 * Parse suggestions from API response
 */
export const parseSuggestionsResponse = (response) => {
  let suggestionsData = [];

  // Handle the nested response structure
  if (response.data.success && response.data.data) {
    const innerData = response.data.data;
    if (innerData.success && innerData.data && innerData.data.locations) {
      suggestionsData = Array.isArray(innerData.data.locations)
        ? innerData.data.locations
        : [];
    } else if (Array.isArray(innerData)) {
      suggestionsData = innerData;
    } else if (innerData.locations && Array.isArray(innerData.locations)) {
      suggestionsData = innerData.locations;
    } else if (Array.isArray(innerData.suggestions)) {
      suggestionsData = innerData.suggestions;
    }
  } else if (response.data.data && response.data.data.locations) {
    suggestionsData = Array.isArray(response.data.data.locations)
      ? response.data.data.locations
      : [];
  } else if (Array.isArray(response.data)) {
    suggestionsData = response.data;
  }

  return suggestionsData;
};

/**
 * Extract search ID from API response
 */
export const extractSearchId = (response) => {
  return (
    response.data.data?.searchId ||
    response.data.data?.data?.searchId ||
    response.data.data?.search_id
  );
};

/**
 * Extract search tracing key from API response
 */
export const extractSearchTracingKey = (response) => {
  return (
    response.data.data?.searchTracingKey ||
    response.data.data?.data?.searchTracingKey ||
    response.data.data?.search_tracing_key
  );
};

