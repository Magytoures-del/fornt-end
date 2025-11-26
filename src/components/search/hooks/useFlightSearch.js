/**
 * Custom hook for handling flight search logic
 */

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { buildFlightSearchURL } from "../utils/searchFormUtils";

/**
 * Hook to handle flight search submission
 * @param {Object} searchState - Current search form state
 * @param {Object} actions - Search form actions
 * @param {Function} showOverlay - Function to show search overlay
 * @param {Function} validateForm - Function to validate the form
 * @param {Function} setAllFieldsTouched - Function to mark all fields as touched
 * @returns {Object} Search handler functions
 */
export const useFlightSearch = (
  searchState,
  actions,
  showOverlay,
  validateForm,
  setAllFieldsTouched
) => {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    departure,
    arrival,
    startDate,
    endDate,
    tripType,
    passengers,
    cabinClass,
    directFlight,
  } = searchState;

  /**
   * Performs flight search in current tab
   */
  const handleSearch = () => {
    // Validate form before proceeding
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      if (setAllFieldsTouched) {
        setAllFieldsTouched();
      }
      return;
    }

    // Show overlay immediately
    showOverlay();

    // Try context-provided submit handler; proceed only if not handled
    const handled = actions.handleSubmit && actions.handleSubmit();
    if (handled) return;

    // Fallback: navigate in same tab
    const resultsUrl = buildFlightSearchURL({
      departure,
      arrival,
      startDate,
      endDate,
      tripType,
      directFlight,
      passengers,
      cabinClass,
    });

    router.push(resultsUrl);
  };

  /**
   * Performs flight search in new tab
   * @param {Event} e - Event object
   */
  const handleSearchNewTab = (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      if (setAllFieldsTouched) {
        setAllFieldsTouched();
      }
      return;
    }

    const resultsUrl = buildFlightSearchURL({
      departure,
      arrival,
      startDate,
      endDate,
      tripType,
      directFlight,
      passengers,
      cabinClass,
    });

    window.open(resultsUrl, "_blank");
  };

  return {
    handleSearch,
    handleSearchNewTab,
  };
};
