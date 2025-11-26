/**
 * PDF Helper Utilities
 * Formatting and data manipulation functions
 */

/**
 * Safely get text value with fallback
 */
export const safeText = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return String(value);
};

/**
 * Format date to "DD Month YYYY" format
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "N/A";
  }
};

/**
 * Format datetime to "HH:MM Day, DD Mon YY"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const day = date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

    return `${time} ${day}`;
  } catch (error) {
    return "N/A";
  }
};

/**
 * Format time only "HH:MM"
 */
export const formatTime = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return "N/A";
  }
};

/**
 * Calculate duration between two dates
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "N/A";

    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
      2,
      "0"
    )}m`;
  } catch (error) {
    return "N/A";
  }
};

/**
 * Format currency with proper decimals
 */
export const formatCurrency = (amount, currency = "SAR") => {
  if (amount === null || amount === undefined) {
    return `${currency} 0.00`;
  }

  try {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return `${currency} 0.00`;

    return `${currency} ${num.toFixed(2)}`;
  } catch (error) {
    return `${currency} 0.00`;
  }
};

/**
 * Truncate text to maximum length
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return "";
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
};

/**
 * Wrap text into multiple lines based on width
 */
export const wrapText = (text, maxWidth = 80) => {
  if (!text) return [""];

  const str = String(text);
  const words = str.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [""];
};

/**
 * Get text width estimate (for positioning)
 */
export const estimateTextWidth = (text, fontSize) => {
  return String(text).length * fontSize * 0.5;
};

/**
 * Parse passenger type
 */
export const getPassengerType = (type) => {
  const typeMap = {
    adult: "Adult",
    child: "Child",
    infant: "Infant",
  };

  return typeMap[String(type).toLowerCase()] || "Adult";
};

/**
 * Format stops text
 */
export const formatStops = (stops) => {
  if (!stops && stops !== 0) return "Non Stop";

  const num = parseInt(stops);
  if (isNaN(num) || num === 0) return "Non Stop";
  if (num === 1) return "1 Stop";
  return `${num} Stops`;
};

/**
 * Get cabin class display name
 */
export const getCabinClass = (cabin) => {
  const cabinMap = {
    economy: "Economy",
    premium_economy: "Premium Economy",
    business: "Business",
    first: "First Class",
  };

  const key = String(cabin || "economy").toLowerCase();
  return cabinMap[key] || cabin || "Economy";
};
