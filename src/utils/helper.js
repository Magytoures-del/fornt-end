export const extractAirportCode = (locationString) => {
  const match = locationString.match(/\(([^)]+)\)/);
  return match[1];
};

export const decodeBookId = (bookId) => {
  return typeof bookId === "string" ? decodeURIComponent(bookId) : bookId;
};

// Error handling utilities
export const createErrorMessage = (
  error,
  defaultMessage = "An unexpected error occurred"
) => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  return defaultMessage;
};

export const isNetworkError = (error) => {
  return (
    !navigator.onLine ||
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Network Error") ||
    error?.message?.includes("fetch")
  );
};

export const shouldRetry = (error, retryCount = 0, maxRetries = 3) => {
  if (retryCount >= maxRetries) return false;

  // Retry for network errors
  if (isNetworkError(error)) return true;

  // Retry for server errors (5xx)
  if (error?.response?.status >= 500) return true;

  // Retry for timeout errors
  if (error?.code === "TIMEOUT" || error?.message?.includes("timeout"))
    return true;

  return false;
};

export const getRetryDelay = (retryCount) => {
  // Exponential backoff: 1s, 2s, 4s, 8s...
  return Math.min(1000 * Math.pow(2, retryCount), 10000);
};

export const handleApiError = (error, context = "") => {
  const errorMessage = createErrorMessage(error);
  console.error(`API Error${context ? ` in ${context}` : ""}:`, {
    message: errorMessage,
    error,
    timestamp: new Date().toISOString(),
  });
  return errorMessage;
};

// Booking progress utilities
// Re-export from constants for backward compatibility
export { BOOKING_STEPS } from "@/constants/booking";

export const getBookingStepFromPath = (pathname) => {
  if (pathname.includes("/flights/results") || pathname === "/flights") {
    return BOOKING_STEPS.SEARCH;
  }
  if (pathname.includes("/flights/details")) {
    return BOOKING_STEPS.DETAILS;
  }
  if (pathname.includes("/checkout") || pathname.includes("/payment")) {
    return BOOKING_STEPS.PAYMENT;
  }
  return BOOKING_STEPS.SEARCH;
};

export const getNextBookingStep = (currentStep) => {
  switch (currentStep) {
    case BOOKING_STEPS.SEARCH:
      return BOOKING_STEPS.DETAILS;
    case BOOKING_STEPS.DETAILS:
      return BOOKING_STEPS.PAYMENT;
    default:
      return currentStep;
  }
};

export const getPreviousBookingStep = (currentStep) => {
  switch (currentStep) {
    case BOOKING_STEPS.PAYMENT:
      return BOOKING_STEPS.DETAILS;
    case BOOKING_STEPS.DETAILS:
      return BOOKING_STEPS.SEARCH;
    default:
      return currentStep;
  }
};

export const isValidBookingStep = (step) => {
  return Object.values(BOOKING_STEPS).includes(step);
};

export const formatFullDate = (input) => {
  const date = new Date(input);
  if (isNaN(date)) {
    console.error("Invalid date:", input);
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const calculateAge = (birthDate, onwardDate) => {
  const birth = new Date(birthDate);
  const onward = new Date(onwardDate);

  if (isNaN(birth) || isNaN(onward)) {
    return 0;
  }

  let age = onward.getFullYear() - birth.getFullYear();
  const monthDiff = onward.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && onward.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

// Re-export domain functions for backward compatibility
export { transformToTraveller } from "@/domain/flights/transform";
export {
  processFlightData,
  getSSRBaggageData,
  extractPricingData,
} from "@/domain/flights/transform";

// Legacy function (deprecated - use domain/flights/transform)
const _transformToTraveller = (
  formValues,
  travellerRequirements,
  onwardDate
) => {
  const travellers = [];

  // For now, we're handling a single passenger form
  // In the future, this could be extended to handle multiple passengers
  const traveller = {
    ID: 1,
    PaxID: "ADT1",
    Operation: "0",
    Title: formValues.gender || "Mr",
    FName: formValues.name || "",
    LName: formValues.surname || "",
    Email: formValues.email || "",
    Gender: formValues.gender === "Mr" ? "M" : "F",
    PTC: "ADT", // Default to Adult
    isOptionSelected: false,
    ApproverManagers: {
      Managers: [],
      Type: "",
    },
  };

  // Conditionally include fields based on new checklist structure
  if (travellerRequirements.dateOfBirth?.required) {
    const birthDate = formValues.birthDate;
    if (birthDate?.day && birthDate?.month && birthDate?.year) {
      traveller.DOB = `${birthDate.year}-${birthDate.month.padStart(
        2,
        "0"
      )}-${birthDate.day.padStart(2, "0")}`;
      traveller.age = calculateAge(traveller.DOB, onwardDate);
    }
  }

  if (travellerRequirements.nationality?.required) {
    traveller.Nationality = formValues.nationality || "";
  }

  if (travellerRequirements.passportNumber?.required) {
    traveller.PassportNo = formValues.passportNumber || "";
  }

  if (travellerRequirements.passportExpiry?.required) {
    const passportExpDate = formValues.passportExpDate;
    if (
      passportExpDate?.day &&
      passportExpDate?.month &&
      passportExpDate?.year
    ) {
      traveller.PDOE = `${
        passportExpDate.year
      }-${passportExpDate.month.padStart(
        2,
        "0"
      )}-${passportExpDate.day.padStart(2, "0")}`;
    }
  }

  if (travellerRequirements.passportIssue?.required) {
    traveller.PLI = formValues.passportIssueLocation || "";
  }

  if (travellerRequirements.passportIssueDate?.required) {
    const passportIssueDate = formValues.passportIssueDate;
    if (
      passportIssueDate?.day &&
      passportIssueDate?.month &&
      passportIssueDate?.year
    ) {
      traveller.PDOI = `${
        passportIssueDate.year
      }-${passportIssueDate.month.padStart(
        2,
        "0"
      )}-${passportIssueDate.day.padStart(2, "0")}`;
    }
  }

  if (travellerRequirements.country?.required) {
    traveller.Country = formValues.country || "";
  }

  if (travellerRequirements.panNumber?.required) {
    traveller.PANNo = formValues.panNumber || "";
  }

  if (travellerRequirements.emigrationCheck?.required) {
    traveller.EmigrationCheck = formValues.emigrationCheck || false;
  }

  // Add phone number if available
  if (formValues.phone) {
    traveller.Phone = `${formValues.phoneCode || "+20"}${formValues.phone}`;
  }

  // Add special service requests if available
  const ssr = [];
  if (formValues.specialMeal) {
    ssr.push({ type: "MEAL", value: formValues.specialMeal });
  }
  if (formValues.seatPreference) {
    ssr.push({ type: "SEAT", value: formValues.seatPreference });
  }
  if (formValues.wheelchairAssistance) {
    ssr.push({ type: "WHEELCHAIR", value: "REQUIRED" });
  }
  if (formValues.extraBaggage) {
    ssr.push({ type: "BAGGAGE", value: "EXTRA" });
  }
  if (formValues.otherRequests) {
    ssr.push({ type: "OTHER", value: formValues.otherRequests });
  }

  if (ssr.length > 0) {
    traveller.SSR = ssr;
  }

  travellers.push(traveller);

  return travellers;
};

// (Removed duplicate local implementations of processFlightData, getSSRBaggageData, and extractPricingData
// to avoid duplicate exports. These are re-exported from domain/flights/transform above.)

// Comprehensive nationality/countries data
export const COUNTRIES_DATA = [
  // Middle East & Gulf
  { code: "SA", key: "saudi_arabia" },
  { code: "AE", key: "uae" },
  { code: "KW", key: "kuwait" },
  { code: "QA", key: "qatar" },
  { code: "BH", key: "bahrain" },
  { code: "OM", key: "oman" },
  { code: "JO", key: "jordan" },
  { code: "LB", key: "lebanon" },
  { code: "SY", key: "syria" },
  { code: "IQ", key: "iraq" },
  { code: "IR", key: "iran" },
  { code: "TR", key: "turkey" },
  { code: "IL", key: "israel" },
  { code: "PS", key: "palestine" },
  { code: "YE", key: "yemen" },

  // North Africa
  { code: "EG", key: "egypt" },
  { code: "MA", key: "morocco" },
  { code: "DZ", key: "algeria" },
  { code: "TN", key: "tunisia" },
  { code: "LY", key: "libya" },
  { code: "SD", key: "sudan" },
  { code: "SS", key: "south_sudan" },

  // Sub-Saharan Africa
  { code: "ET", key: "ethiopia" },
  { code: "KE", key: "kenya" },
  { code: "ZA", key: "south_africa" },
  { code: "NG", key: "nigeria" },
  { code: "GH", key: "ghana" },
  { code: "SN", key: "senegal" },
  { code: "TZ", key: "tanzania" },
  { code: "UG", key: "uganda" },
  { code: "RW", key: "rwanda" },
  { code: "ZW", key: "zimbabwe" },
  { code: "BW", key: "botswana" },
  { code: "NA", key: "namibia" },
  { code: "ZM", key: "zambia" },
  { code: "MW", key: "malawi" },
  { code: "MZ", key: "mozambique" },
  { code: "MG", key: "madagascar" },
  { code: "MU", key: "mauritius" },
  { code: "SC", key: "seychelles" },

  // Europe
  { code: "FR", key: "france" },
  { code: "DE", key: "germany" },
  { code: "IT", key: "italy" },
  { code: "ES", key: "spain" },
  { code: "PT", key: "portugal" },
  { code: "NL", key: "netherlands" },
  { code: "BE", key: "belgium" },
  { code: "CH", key: "switzerland" },
  { code: "AT", key: "austria" },
  { code: "SE", key: "sweden" },
  { code: "NO", key: "norway" },
  { code: "DK", key: "denmark" },
  { code: "FI", key: "finland" },
  { code: "PL", key: "poland" },
  { code: "CZ", key: "czech_republic" },
  { code: "HU", key: "hungary" },
  { code: "RO", key: "romania" },
  { code: "BG", key: "bulgaria" },
  { code: "GR", key: "greece" },
  { code: "RU", key: "russia" },
  { code: "UA", key: "ukraine" },
  { code: "BY", key: "belarus" },
  { code: "GB", key: "united_kingdom" },
  { code: "IE", key: "ireland" },
  { code: "IS", key: "iceland" },
  { code: "LU", key: "luxembourg" },
  { code: "MC", key: "monaco" },
  { code: "MT", key: "malta" },
  { code: "CY", key: "cyprus" },
  { code: "EE", key: "estonia" },
  { code: "LV", key: "latvia" },
  { code: "LT", key: "lithuania" },
  { code: "SK", key: "slovakia" },
  { code: "SI", key: "slovenia" },
  { code: "HR", key: "croatia" },
  { code: "BA", key: "bosnia_herzegovina" },
  { code: "RS", key: "serbia" },
  { code: "ME", key: "montenegro" },
  { code: "MK", key: "north_macedonia" },
  { code: "AL", key: "albania" },
  { code: "XK", key: "kosovo" },
  { code: "MD", key: "moldova" },

  // Americas
  { code: "US", key: "united_states" },
  { code: "CA", key: "canada" },
  { code: "MX", key: "mexico" },
  { code: "BR", key: "brazil" },
  { code: "AR", key: "argentina" },
  { code: "CL", key: "chile" },
  { code: "CO", key: "colombia" },
  { code: "PE", key: "peru" },
  { code: "VE", key: "venezuela" },
  { code: "EC", key: "ecuador" },
  { code: "BO", key: "bolivia" },
  { code: "PY", key: "paraguay" },
  { code: "UY", key: "uruguay" },
  { code: "GT", key: "guatemala" },
  { code: "HN", key: "honduras" },
  { code: "SV", key: "el_salvador" },
  { code: "NI", key: "nicaragua" },
  { code: "CR", key: "costa_rica" },
  { code: "PA", key: "panama" },
  { code: "CU", key: "cuba" },
  { code: "DO", key: "dominican_republic" },
  { code: "HT", key: "haiti" },
  { code: "JM", key: "jamaica" },
  { code: "TT", key: "trinidad_tobago" },
  { code: "BB", key: "barbados" },
  { code: "BS", key: "bahamas" },
  { code: "BZ", key: "belize" },
  { code: "GY", key: "guyana" },
  { code: "SR", key: "suriname" },

  // Asia
  { code: "CN", key: "china" },
  { code: "JP", key: "japan" },
  { code: "KR", key: "south_korea" },
  { code: "KP", key: "north_korea" },
  { code: "IN", key: "india" },
  { code: "PK", key: "pakistan" },
  { code: "BD", key: "bangladesh" },
  { code: "LK", key: "sri_lanka" },
  { code: "NP", key: "nepal" },
  { code: "BT", key: "bhutan" },
  { code: "MV", key: "maldives" },
  { code: "AF", key: "afghanistan" },
  { code: "KZ", key: "kazakhstan" },
  { code: "UZ", key: "uzbekistan" },
  { code: "TM", key: "turkmenistan" },
  { code: "TJ", key: "tajikistan" },
  { code: "KG", key: "kyrgyzstan" },
  { code: "MN", key: "mongolia" },
  { code: "TH", key: "thailand" },
  { code: "VN", key: "vietnam" },
  { code: "KH", key: "cambodia" },
  { code: "LA", key: "laos" },
  { code: "MM", key: "myanmar" },
  { code: "MY", key: "malaysia" },
  { code: "SG", key: "singapore" },
  { code: "ID", key: "indonesia" },
  { code: "PH", key: "philippines" },
  { code: "BN", key: "brunei" },
  { code: "TL", key: "east_timor" },
  { code: "TW", key: "taiwan" },
  { code: "HK", key: "hong_kong" },
  { code: "MO", key: "macau" },

  // Oceania
  { code: "AU", key: "australia" },
  { code: "NZ", key: "new_zealand" },
  { code: "FJ", key: "fiji" },
  { code: "PG", key: "papua_new_guinea" },
  { code: "SB", key: "solomon_islands" },
  { code: "VU", key: "vanuatu" },
  { code: "WS", key: "samoa" },
  { code: "TO", key: "tonga" },
  { code: "KI", key: "kiribati" },
  { code: "TV", key: "tuvalu" },
  { code: "NR", key: "nauru" },
  { code: "PW", key: "palau" },
  { code: "MH", key: "marshall_islands" },
  { code: "FM", key: "micronesia" },
];

// Function to get nationality options for forms
export const getNationalityOptions = (t) => {
  return COUNTRIES_DATA.map((country) => ({
    value: country.code,
    label: t(`passenger_form.countries.${country.key}`),
  })).sort((a, b) => a.label.localeCompare(b.label));
};

// Function to get country options (same as nationality for now)
export const getCountryOptions = (t) => {
  return getNationalityOptions(t);
};

// Function to get country name by code
export const getCountryNameByCode = (code, t) => {
  const country = COUNTRIES_DATA.find((c) => c.code === code);
  return country ? t(`passenger_form.countries.${country.key}`) : code;
};

// Function to get country code by key
export const getCountryCodeByKey = (key) => {
  const country = COUNTRIES_DATA.find((c) => c.key === key);
  return country ? country.code : null;
};
