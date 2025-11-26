/**
 * Number Localization Utility
 * Provides functions to format and localize numbers for Arabic and English languages
 */

/**
 * Arabic-Indic numerals (Eastern Arabic numerals)
 * ٠, ١, ٢, ٣, ٤, ٥, ٦, ٧, ٨, ٩
 */
const ARABIC_NUMERALS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Converts a number to Arabic-Indic numerals
 * @param {number|string} num - The number to convert
 * @returns {string} - The number in Arabic-Indic numerals
 * 
 * @example
 * toArabicNumerals(123) // "١٢٣"
 * toArabicNumerals("45") // "٤٥"
 */
export const toArabicNumerals = (num) => {
  if (num === null || num === undefined) return "";
  
  return num
    .toString()
    .split("")
    .map((digit) => {
      const digitIndex = parseInt(digit, 10);
      return !isNaN(digitIndex) && digitIndex >= 0 && digitIndex <= 9
        ? ARABIC_NUMERALS[digitIndex]
        : digit;
    })
    .join("");
};

/**
 * Converts Arabic-Indic numerals back to Western numerals
 * @param {string} arabicNum - The number in Arabic-Indic numerals
 * @returns {string} - The number in Western numerals
 * 
 * @example
 * fromArabicNumerals("١٢٣") // "123"
 */
export const fromArabicNumerals = (arabicNum) => {
  if (!arabicNum) return "";
  
  const numeralMap = {};
  ARABIC_NUMERALS.forEach((arabic, index) => {
    numeralMap[arabic] = index.toString();
  });

  return arabicNum
    .toString()
    .split("")
    .map((char) => numeralMap[char] || char)
    .join("");
};

/**
 * Formats a number with proper locale formatting (thousands separators, etc.)
 * @param {number|string} num - The number to format
 * @param {string} locale - The locale code (e.g., "ar-SA", "en-US")
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - The formatted number
 * 
 * @example
 * formatNumber(1234567.89, "en-US") // "1,234,567.89"
 * formatNumber(1234567.89, "ar-SA") // "١٬٢٣٤٬٥٦٧٫٨٩"
 */
export const formatNumber = (num, locale = "en-US", options = {}) => {
  if (num === null || num === undefined) return "";
  
  const numericValue = typeof num === "number" ? num : parseFloat(num);
  if (isNaN(numericValue)) return num.toString();

  try {
    return new Intl.NumberFormat(locale, {
      ...options,
    }).format(numericValue);
  } catch (error) {
    console.warn("Number formatting error:", error);
    return numericValue.toString();
  }
};

/**
 * Formats a number as currency
 * @param {number|string} amount - The amount to format
 * @param {string} currency - The currency code (e.g., "SAR", "USD")
 * @param {string} locale - The locale code (e.g., "ar-SA", "en-US")
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - The formatted currency
 * 
 * @example
 * formatCurrency(1234.56, "SAR", "en-US") // "SAR 1,234.56"
 * formatCurrency(1234.56, "SAR", "ar-SA") // "١٬٢٣٤٫٥٦ ر.س"
 */
export const formatCurrency = (
  amount,
  currency = "SAR",
  locale = "en-US",
  options = {}
) => {
  if (amount === null || amount === undefined) return "-";
  
  const numericAmount = typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(numericAmount)) return amount.toString();

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "SAR",
      minimumFractionDigits: options.minimumFractionDigits ?? 2,
      maximumFractionDigits: options.maximumFractionDigits ?? 2,
      ...options,
    }).format(numericAmount);
  } catch (error) {
    console.warn("Currency formatting error:", error);
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
};

/**
 * Localizes a number based on language preference
 * Converts to Arabic-Indic numerals if language is Arabic
 * @param {number|string} num - The number to localize
 * @param {string} language - The language code (e.g., "ar", "en")
 * @param {Object} formatOptions - Optional formatting options
 * @returns {string} - The localized number
 * 
 * @example
 * localizeNumber(1234, "ar") // "١٢٣٤"
 * localizeNumber(1234, "en") // "1,234"
 * localizeNumber(1234.56, "ar", { minimumFractionDigits: 2 }) // "١٢٣٤٫٥٦"
 */
export const localizeNumber = (num, language = "en", formatOptions = {}) => {
  if (num === null || num === undefined) return "";
  
  const isArabic = language === "ar" || language.startsWith("ar-");
  const locale = isArabic ? "ar-SA" : "en-US";
  
  // Format the number first
  const formatted = formatNumber(num, locale, formatOptions);
  
  // If Arabic, convert to Arabic-Indic numerals
  if (isArabic) {
    // Extract the number part (excluding currency symbols, separators, etc.)
    // and convert only the digits
    return formatted
      .split("")
      .map((char) => {
        const digitIndex = parseInt(char, 10);
        if (!isNaN(digitIndex) && digitIndex >= 0 && digitIndex <= 9) {
          return ARABIC_NUMERALS[digitIndex];
        }
        return char;
      })
      .join("");
  }
  
  return formatted;
};

/**
 * Localizes a currency amount based on language preference
 * @param {number|string} amount - The amount to localize
 * @param {string} currency - The currency code
 * @param {string} language - The language code (e.g., "ar", "en")
 * @param {Object} options - Formatting options
 * @returns {string} - The localized currency
 * 
 * @example
 * localizeCurrency(1234.56, "SAR", "ar") // "١٬٢٣٤٫٥٦ ر.س"
 * localizeCurrency(1234.56, "SAR", "en") // "SAR 1,234.56"
 */
export const localizeCurrency = (
  amount,
  currency = "SAR",
  language = "en",
  options = {}
) => {
  if (amount === null || amount === undefined) return "-";
  
  const isArabic = language === "ar" || language.startsWith("ar-");
  const locale = isArabic ? "ar-SA" : "en-US";
  
  const formatted = formatCurrency(amount, currency, locale, options);
  
  // If Arabic, convert digits to Arabic-Indic numerals
  if (isArabic) {
    return formatted
      .split("")
      .map((char) => {
        const digitIndex = parseInt(char, 10);
        if (!isNaN(digitIndex) && digitIndex >= 0 && digitIndex <= 9) {
          return ARABIC_NUMERALS[digitIndex];
        }
        return char;
      })
      .join("");
  }
  
  return formatted;
};

/**
 * Gets the currency symbol for a given currency code
 * @param {string} currency - The currency code
 * @param {string} locale - The locale code
 * @returns {string} - The currency symbol
 */
export const getCurrencySymbol = (currency = "SAR", locale = "en-US") => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || currency;
  } catch (error) {
    return currency;
  }
};












