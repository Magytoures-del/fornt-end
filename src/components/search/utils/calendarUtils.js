/**
 * Utility functions for Calendar component
 */

import { CALENDAR_CONFIG, DATE_FORMAT_OPTIONS, LOCALES, ARABIC_DAY_NAMES_FALLBACK } from "../constants/calendarConstants";

/**
 * Safely creates a date object from various input types
 * @param {Date|string|null|undefined} date - Date input
 * @returns {Date|null} Valid date object or null
 */
export const safeDate = (date) => {
  if (!date) return null;

  try {
    const parsedDate = date instanceof Date ? new Date(date.getTime()) : new Date(date);

    // Check if date is valid
    if (isNaN(parsedDate.getTime())) return null;

    // Create a clean date without time component
    const cleanDate = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    );
    cleanDate.setHours(0, 0, 0, 0);
    return cleanDate;
  } catch (error) {
    console.warn("Invalid date provided:", date);
    return null;
  }
};

/**
 * Gets today's date at midnight for consistent comparison
 * @returns {Date} Today's date at midnight
 */
export const getToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Checks if two dates are the same day
 * @param {Date|string} d1 - First date
 * @param {Date|string} d2 - Second date
 * @param {Function} safeDateFn - Safe date function
 * @returns {boolean} True if dates are the same day
 */
export const isSameDate = (d1, d2, safeDateFn = safeDate) => {
  const date1 = safeDateFn(d1);
  const date2 = safeDateFn(d2);

  if (!date1 || !date2) return false;

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Checks if a date is in the past
 * @param {Date|string} date - Date to check
 * @param {Date} today - Today's date for comparison
 * @param {Function} safeDateFn - Safe date function
 * @returns {boolean} True if date is in the past
 */
export const isDateInPast = (date, today, safeDateFn = safeDate) => {
  const compareDate = safeDateFn(date);
  if (!compareDate) return false;
  return compareDate < today;
};

/**
 * Checks if a date is within a range (exclusive)
 * @param {Date|string} date - Date to check
 * @param {Date|string} startDate - Range start
 * @param {Date|string} endDate - Range end
 * @param {Function} safeDateFn - Safe date function
 * @returns {boolean} True if date is in range
 */
export const isInRange = (date, startDate, endDate, safeDateFn = safeDate) => {
  const safeSelectedDate = safeDateFn(date);
  const safeStartDate = safeDateFn(startDate);
  const safeEndDate = safeDateFn(endDate);

  if (!safeSelectedDate || !safeStartDate || !safeEndDate) return false;

  const selectedTime = safeSelectedDate.getTime();
  const startTime = safeStartDate.getTime();
  const endTime = safeEndDate.getTime();

  return selectedTime > startTime && selectedTime < endTime;
};

/**
 * Generates calendar grid for a given month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Date[][]} Array of weeks, each containing 7 dates
 */
export const generateCalendar = (year, month) => {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  // Start from the beginning of the week containing the first day
  const startDate = new Date(year, month, 1 - startDay);
  let currentDate = new Date(startDate);

  // Generate exactly 6 weeks for consistent layout
  for (let week = 0; week < CALENDAR_CONFIG.WEEKS_TO_DISPLAY; week++) {
    const weekDates = [];
    for (let day = 0; day < 7; day++) {
      weekDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(weekDates);
  }

  return weeks;
};

/**
 * Formats month and year for display
 * @param {Date} date - Date to format
 * @param {string} language - Language code
 * @returns {string} Formatted month and year
 */
export const formatMonthYear = (date, language) => {
  try {
    const locale = language === "ar" ? LOCALES.ARABIC : LOCALES.ENGLISH;
    return new Intl.DateTimeFormat(locale, DATE_FORMAT_OPTIONS.MONTH_YEAR).format(date);
  } catch (error) {
    console.warn("Error formatting month/year:", error);
    return `${date.getFullYear()}/${date.getMonth() + 1}`;
  }
};

/**
 * Gets localized day names
 * @param {string} language - Language code
 * @returns {string[]} Array of day name abbreviations
 */
export const getLocalizedDayNames = (language) => {
  try {
    const base = new Date(
      CALENDAR_CONFIG.ARBITRARY_SATURDAY.year,
      CALENDAR_CONFIG.ARBITRARY_SATURDAY.month,
      CALENDAR_CONFIG.ARBITRARY_SATURDAY.day
    );
    const result = [];
    const locale = language === "ar" ? LOCALES.ARABIC : LOCALES.ENGLISH;

    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      result.push(
        new Intl.DateTimeFormat(locale, DATE_FORMAT_OPTIONS.WEEKDAY_NARROW).format(d)
      );
    }
    return result;
  } catch (error) {
    console.warn("Error getting localized day names:", error);
    return ARABIC_DAY_NAMES_FALLBACK;
  }
};

/**
 * Formats date as YYYY-MM-DD string
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @param {number} day - Day
 * @returns {string} Formatted date string
 */
export const formatDateString = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Gets the effective trip type based on search type
 * @param {string} searchType - Search type (flight/hotel)
 * @param {string} tripType - Trip type (oneway/roundtrip)
 * @returns {string} Effective trip type
 */
export const getEffectiveTripType = (searchType, tripType) => {
  return searchType === "hotel" ? "roundtrip" : tripType;
};


