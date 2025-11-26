/**
 * Date utility functions for DateInput component
 */

export const DATE_FORMAT_OPTIONS = {
  day: "2-digit",
  month: "long",
  year: "numeric",
  calendar: "gregory",
};

/**
 * Formats a date string to localized format
 * @param {string|Date|null} date - Date to format
 * @param {string} language - Language code (e.g., 'ar', 'en')
 * @returns {string} Formatted date string or empty string
 */
export const formatDateLocalized = (date, language) => {
  if (!date) return "";

  const locale = language === "ar" ? "ar-SA" : "en-US";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    // Validate date
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date provided to formatDateLocalized:", date);
      return "";
    }

    return dateObj.toLocaleDateString(locale, DATE_FORMAT_OPTIONS);
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "";
  }
};

/**
 * Calculates scrollbar width to prevent layout shift
 * @returns {number} Scrollbar width in pixels
 */
export const getScrollbarWidth = () => {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
};

/**
 * Prevents body scroll and maintains layout
 * @param {boolean} shouldLock - Whether to lock scroll
 * @returns {Function} Cleanup function
 */
export const lockBodyScroll = (shouldLock) => {
  if (typeof document === "undefined") return () => {};

  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;

  if (shouldLock) {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  } else {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  }

  return () => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  };
};


