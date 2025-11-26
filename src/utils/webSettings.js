/**
 * Utility functions for accessing web-settings data from session storage
 */

/**
 * Get web-settings data from session storage
 * @returns {Object|null} The web-settings data or null if not found
 */
export function getWebSettings() {
  try {
    const settings = sessionStorage.getItem("webSettings");
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error("Error parsing web-settings from session storage:", error);
    return null;
  }
}

/**
 * Get a specific value from web-settings
 * @param {string} key - The key to retrieve
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} The value or default value
 */
export function getWebSetting(key, defaultValue = null) {
  const settings = getWebSettings();
  if (!settings) return defaultValue;

  return settings[key] !== undefined ? settings[key] : defaultValue;
}

/**
 * Check if web-settings data exists in session storage
 * @returns {boolean} True if web-settings exist
 */
export function hasWebSettings() {
  return sessionStorage.getItem("webSettings") !== null;
}

/**
 * Clear web-settings data from session storage
 */
export function clearWebSettings() {
  sessionStorage.removeItem("webSettings");
}
