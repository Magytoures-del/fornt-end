/**
 * Date utility functions for hotel searches
 */

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    calendar: "gregory"
  });
};

/**
 * Calculate nights between two dates
 * @param {string} checkIn - Check-in date
 * @param {string} checkOut - Check-out date
 * @returns {number} Number of nights
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

