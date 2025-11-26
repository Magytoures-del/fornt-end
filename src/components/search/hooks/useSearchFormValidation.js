/**
 * Custom hook for search form validation
 */

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook to manage search form validation
 * @param {Object} searchState - Current search form state
 * @returns {Object} Validation state and functions
 */
export const useSearchFormValidation = (searchState) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Validates the entire form
   * @returns {boolean} True if form is valid
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate departure location
    if (!searchState.departure || !searchState.departure.trim()) {
      newErrors.departure = t(
        "flights.search_form.validation.departure_required",
        "Please select a departure location"
      );
    } else {
      // Validate airport code format
      const airportCodeMatch = searchState.departure.match(/\(([A-Z]{3})\)/);
      if (!airportCodeMatch) {
        newErrors.departure = t(
          "flights.search_form.validation.departure_invalid",
          "Please select a valid departure location"
        );
      }
    }

    // Validate arrival location
    if (!searchState.arrival || !searchState.arrival.trim()) {
      newErrors.arrival = t(
        "flights.search_form.validation.arrival_required",
        "Please select an arrival location"
      );
    } else {
      // Validate airport code format
      const airportCodeMatch = searchState.arrival.match(/\(([A-Z]{3})\)/);
      if (!airportCodeMatch) {
        newErrors.arrival = t(
          "flights.search_form.validation.arrival_invalid",
          "Please select a valid arrival location"
        );
      }
    }

    // Check if departure and arrival are the same
    if (
      searchState.departure &&
      searchState.arrival &&
      searchState.departure === searchState.arrival
    ) {
      newErrors.arrival = t(
        "flights.search_form.validation.same_locations",
        "Departure and arrival locations cannot be the same"
      );
    }

    // Validate start date
    if (!searchState.startDate || !searchState.startDate.trim()) {
      newErrors.startDate = t(
        "flights.search_form.validation.start_date_required",
        "Please select a departure date"
      );
    } else {
      // Validate date is not in the past
      const startDate = new Date(searchState.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = t(
          "flights.search_form.validation.start_date_past",
          "Departure date cannot be in the past"
        );
      }
    }

    // Validate end date for round trips
    if (searchState.tripType === "roundtrip") {
      if (!searchState.endDate || !searchState.endDate.trim()) {
        newErrors.endDate = t(
          "flights.search_form.validation.end_date_required",
          "Please select a return date"
        );
      } else {
        // Validate end date is after start date
        if (searchState.startDate) {
          const startDate = new Date(searchState.startDate);
          const endDate = new Date(searchState.endDate);
          if (endDate < startDate) {
            newErrors.endDate = t(
              "flights.search_form.validation.end_date_before_start",
              "Return date must be after departure date"
            );
          }
        }
      }
    }

    // Validate passengers
    const totalPassengers =
      (searchState.passengers?.adults || 0) +
      (searchState.passengers?.children || 0) +
      (searchState.passengers?.infants || 0);

    if (totalPassengers === 0) {
      newErrors.passengers = t(
        "flights.search_form.validation.passengers_required",
        "Please select at least one passenger"
      );
    }

    if (searchState.passengers?.adults === 0 && totalPassengers > 0) {
      newErrors.passengers = t(
        "flights.search_form.validation.adults_required",
        "At least one adult passenger is required"
      );
    }

    // Validate infants don't exceed adults
    if (
      searchState.passengers?.infants > (searchState.passengers?.adults || 0)
    ) {
      newErrors.passengers = t(
        "flights.search_form.validation.infants_exceed_adults",
        "Number of infants cannot exceed number of adults"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [searchState, t]);

  /**
   * Validates a specific field
   * @param {string} fieldName - Name of the field to validate
   * @param {*} value - Value to validate
   * @returns {string|null} Error message or null if valid
   */
  const validateField = useCallback(
    (fieldName, value) => {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        let errorMessage = null;

        switch (fieldName) {
          case "departure":
            if (!value || !value.trim()) {
              errorMessage = t(
                "flights.search_form.validation.departure_required",
                "Please select a departure location"
              );
              newErrors.departure = errorMessage;
            } else {
              const airportCodeMatch = value.match(/\(([A-Z]{3})\)/);
              if (!airportCodeMatch) {
                errorMessage = t(
                  "flights.search_form.validation.departure_invalid",
                  "Please select a valid departure location"
                );
                newErrors.departure = errorMessage;
              } else {
                delete newErrors.departure;
              }
            }
            break;

          case "arrival":
            if (!value || !value.trim()) {
              errorMessage = t(
                "flights.search_form.validation.arrival_required",
                "Please select an arrival location"
              );
              newErrors.arrival = errorMessage;
            } else {
              const airportCodeMatch = value.match(/\(([A-Z]{3})\)/);
              if (!airportCodeMatch) {
                errorMessage = t(
                  "flights.search_form.validation.arrival_invalid",
                  "Please select a valid arrival location"
                );
                newErrors.arrival = errorMessage;
              } else if (
                searchState.departure &&
                value === searchState.departure
              ) {
                errorMessage = t(
                  "flights.search_form.validation.same_locations",
                  "Departure and arrival locations cannot be the same"
                );
                newErrors.arrival = errorMessage;
              } else {
                delete newErrors.arrival;
              }
            }
            break;

          case "startDate":
            if (!value || !value.trim()) {
              errorMessage = t(
                "flights.search_form.validation.start_date_required",
                "Please select a departure date"
              );
              newErrors.startDate = errorMessage;
            } else {
              const startDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (startDate < today) {
                errorMessage = t(
                  "flights.search_form.validation.start_date_past",
                  "Departure date cannot be in the past"
                );
                newErrors.startDate = errorMessage;
              } else {
                delete newErrors.startDate;
              }
            }
            break;

          case "endDate":
            if (searchState.tripType === "roundtrip") {
              if (!value || !value.trim()) {
                errorMessage = t(
                  "flights.search_form.validation.end_date_required",
                  "Please select a return date"
                );
                newErrors.endDate = errorMessage;
              } else if (searchState.startDate) {
                const startDate = new Date(searchState.startDate);
                const endDate = new Date(value);
                if (endDate < startDate) {
                  errorMessage = t(
                    "flights.search_form.validation.end_date_before_start",
                    "Return date must be after departure date"
                  );
                  newErrors.endDate = errorMessage;
                } else {
                  delete newErrors.endDate;
                }
              }
            } else {
              delete newErrors.endDate;
            }
            break;

          case "passengers":
            const totalPassengers =
              (searchState.passengers?.adults || 0) +
              (searchState.passengers?.children || 0) +
              (searchState.passengers?.infants || 0);

            if (totalPassengers === 0) {
              errorMessage = t(
                "flights.search_form.validation.passengers_required",
                "Please select at least one passenger"
              );
              newErrors.passengers = errorMessage;
            } else if (searchState.passengers?.adults === 0) {
              errorMessage = t(
                "flights.search_form.validation.adults_required",
                "At least one adult passenger is required"
              );
              newErrors.passengers = errorMessage;
            } else if (
              searchState.passengers?.infants >
              (searchState.passengers?.adults || 0)
            ) {
              errorMessage = t(
                "flights.search_form.validation.infants_exceed_adults",
                "Number of infants cannot exceed number of adults"
              );
              newErrors.passengers = errorMessage;
            } else {
              delete newErrors.passengers;
            }
            break;

          default:
            break;
        }

        return newErrors;
      });
    },
    [searchState, t]
  );

  /**
   * Marks a field as touched
   * @param {string} fieldName - Name of the field
   */
  const setFieldTouched = useCallback((fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  /**
   * Marks all fields as touched
   */
  const setAllFieldsTouched = useCallback(() => {
    setTouched({
      departure: true,
      arrival: true,
      startDate: true,
      endDate: true,
      passengers: true,
    });
  }, []);

  /**
   * Clears error for a specific field
   * @param {string} fieldName - Name of the field
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Clears all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    touched,
    validateForm,
    validateField,
    setFieldTouched,
    setAllFieldsTouched,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
