"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { RiArrowDownSLine, RiSearchLine, RiPhoneLine } from "react-icons/ri";
import {
  countries,
  findCountryByPhoneCode,
  filterCountries,
} from "../data/countries";
import FlagImage from "./FlagImage";

const PhoneNumberInput = ({
  value = "",
  onChange,
  phoneCode = "+966",
  onPhoneCodeChange,
  placeholder = "",
  className = "",
  error = false,
  disabled = false,
  t,
  isRTL = false,
  required = false,
  minLength = 7,
  maxLength = 15,
  validateOnBlur = true,
  customValidator = null,
  errorMessage = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [hasBlurred, setHasBlurred] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Memoized filtered countries for better performance
  const filteredCountries = useMemo(() => {
    return filterCountries(countries, searchTerm, t);
  }, [searchTerm, t]);

  // Memoized selected country
  const selectedCountry = useMemo(() => {
    return findCountryByPhoneCode(phoneCode);
  }, [phoneCode]);

  // Memoized event handlers for better performance
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
      setFocusedIndex(-1);
    }
  }, [disabled, isOpen]);

  const handleCountrySelect = useCallback(
    (country) => {
      onPhoneCodeChange(country.phoneCode);
      setIsOpen(false);
      setSearchTerm("");
      setFocusedIndex(-1);
    },
    [onPhoneCodeChange]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(-1); // Reset focus when searching
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
        // Return focus to the trigger button
        const trigger = dropdownRef.current?.querySelector("button");
        if (trigger) trigger.focus();
      } else if (isOpen && filteredCountries.length > 0) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredCountries.length - 1 ? prev + 1 : 0
          );
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCountries.length - 1
          );
        } else if (event.key === "Enter" && focusedIndex >= 0) {
          event.preventDefault();
          handleCountrySelect(filteredCountries[focusedIndex]);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, filteredCountries, focusedIndex, handleCountrySelect]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Phone number validation
  const validatePhoneNumber = useCallback(
    (phoneValue) => {
      // Remove all non-numeric characters for validation
      const numericValue = phoneValue.replace(/\D/g, "");

      // Check if required
      if (required && !numericValue.trim()) {
        return errorMessage
          ? t(errorMessage, errorMessage)
          : t("common.phone_required", "Phone number is required");
      }

      // Check minimum length
      if (numericValue && numericValue.length < minLength) {
        return t("common.phone_too_short", {
          defaultValue: `Phone number must be at least ${minLength} digits`,
          minLength,
        });
      }

      // Check maximum length
      if (numericValue && numericValue.length > maxLength) {
        return t("common.phone_too_long", {
          defaultValue: `Phone number must not exceed ${maxLength} digits`,
          maxLength,
        });
      }

      // Custom validator
      if (customValidator && numericValue) {
        const customError = customValidator(numericValue, phoneCode);
        if (customError) return customError;
      }

      // Basic format validation - should contain only digits (after sanitization)
      if (numericValue && !/^\d+$/.test(numericValue)) {
        return errorMessage
          ? t(errorMessage, errorMessage)
          : t("common.phone_invalid", "Please enter a valid phone number");
      }

      return null;
    },
    [
      required,
      minLength,
      maxLength,
      customValidator,
      errorMessage,
      t,
      phoneCode,
    ]
  );

  // Sanitize input - allow only numbers and common formatting characters
  const sanitizePhoneInput = useCallback((input) => {
    // Allow numbers, spaces, dashes, parentheses, and plus (though plus should be in country code)
    return input.replace(/[^\d\s\-()]/g, "");
  }, []);

  const handlePhoneChange = useCallback(
    (e) => {
      const rawValue = e.target.value;
      const sanitizedValue = sanitizePhoneInput(rawValue);
      onChange(sanitizedValue);

      // Real-time validation if user has already blurred the field
      if (hasBlurred || validateOnBlur === false) {
        const error = validatePhoneNumber(sanitizedValue);
        setValidationError(error);
      } else {
        // Clear error while typing if not yet blurred
        setValidationError(null);
      }
    },
    [
      onChange,
      sanitizePhoneInput,
      validatePhoneNumber,
      hasBlurred,
      validateOnBlur,
    ]
  );

  const handlePhoneBlur = useCallback(() => {
    setIsFocused(false);
    setHasBlurred(true);
    const error = validatePhoneNumber(value);
    setValidationError(error);
  }, [value, validatePhoneNumber]);

  // Update validation error when value or phoneCode changes externally
  useEffect(() => {
    if (hasBlurred || validateOnBlur === false) {
      const error = validatePhoneNumber(value);
      setValidationError(error);
    }
  }, [value, phoneCode, validatePhoneNumber, hasBlurred, validateOnBlur]);

  // Determine if there's an error (from props or internal validation)
  const hasError = error || !!validationError;

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Code Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleToggle}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            aria-label={t("common.select_country", "Select country")}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={`
              relative flex items-center px-2 sm:px-4 py-4 gap-2 sm:gap-3 border-2 transition-all duration-200
              focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500
              hover:shadow-md group min-w-[120px] sm:min-w-[140px] h-[60px]
              active:scale-[0.98] touch-manipulation
              ${
                hasError
                  ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
              ${
                disabled
                  ? "bg-gray-50 cursor-not-allowed opacity-60"
                  : "hover:bg-gray-50/50"
              }
              ${isRTL ? "rounded-r-xl border-l-1" : "rounded-l-xl border-r-0"}
            `}
          >
            {/* Flag Container */}
            <div className="flex items-center justify-center w-7 h-5 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
              <FlagImage
                src={selectedCountry?.flag}
                alt={`${selectedCountry?.name} flag`}
                className="w-full h-full object-cover"
                fallback="🌍"
                width={28}
                height={20}
              />
            </div>

            {/* Phone Code */}
            <span className="text-sm font-semibold text-gray-700 select-none">
              {selectedCountry?.phoneCode}
            </span>

            {/* Dropdown Arrow */}
            <RiArrowDownSLine
              className={`w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-gray-600 ${
                isOpen ? "rotate-180 text-blue-500" : ""
              }`}
            />
          </button>

          {/* Country Popup Modal */}
          {isOpen && (
            <>
              {/* Modal Overlay */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in-0 duration-300"
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              />

              {/* Modal Content */}
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("common.country_list", "Country list")}
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    relative w-full max-w-md bg-white rounded-2xl shadow-2xl
                    transform transition-all duration-300
                    animate-in zoom-in-95 slide-in-from-bottom-4 fade-in-0
                    max-h-[90vh] flex flex-col
                  `}
                  style={{
                    boxShadow:
                      "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {/* Modal Header */}
                  <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {t("common.select_country", "Select Country")}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        aria-label={t("common.close", "Close")}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <RiSearchLine
                        className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${
                          isRTL ? "right-3" : "left-3"
                        }`}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder={t("common.search", "Search countries...")}
                        aria-label={t(
                          "common.search_countries",
                          "Search countries"
                        )}
                        className={`
                          w-full py-3 ${
                            isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                          } border-2 border-gray-200 rounded-lg bg-white
                          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                          transition-all duration-200 text-sm font-medium
                        `}
                      />
                    </div>
                  </div>

                  {/* Countries List */}
                  <div
                    role="listbox"
                    className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
                  >
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country, index) => (
                        <button
                          key={country.code}
                          type="button"
                          role="option"
                          aria-selected={phoneCode === country.phoneCode}
                          onClick={() => handleCountrySelect(country)}
                          onMouseEnter={() => setFocusedIndex(index)}
                          className={`
                            w-full px-5 py-4 hover:bg-blue-50 focus:bg-blue-50 group
                            focus:outline-none transition-all duration-150 border-b border-gray-50
                            ${
                              phoneCode === country.phoneCode
                                ? "bg-blue-100 text-blue-700 shadow-sm"
                                : focusedIndex === index
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:text-blue-600"
                            }
                            ${
                              index === filteredCountries.length - 1
                                ? "border-b-0"
                                : ""
                            }
                          `}
                        >
                          <div className={`flex items-center gap-3 `}>
                            {/* Flag */}
                            <div className="flex items-center justify-center w-9 h-7 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <FlagImage
                                src={country.flag}
                                alt={`${country.name} flag`}
                                className="w-full h-full object-cover"
                                fallback="🌍"
                                width={36}
                                height={28}
                              />
                            </div>

                            {/* Country Name */}
                            <span className="flex-1 text-left font-medium text-sm">
                              {t(
                                `passenger_form.countries.${country.name}`,
                                country.name
                              )}
                            </span>

                            {/* Phone Code */}
                            <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-500 min-w-[60px] text-right">
                              {country.phoneCode}
                            </span>

                            {/* Selected Check */}
                            {phoneCode === country.phoneCode && (
                              <svg
                                className="w-5 h-5 text-blue-600 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-12 text-gray-500 text-sm text-center">
                        <div className="flex flex-col items-center gap-3">
                          <RiSearchLine className="w-12 h-12 text-gray-300" />
                          <span className="font-medium text-base">
                            {t("common.no_results", "No results found")}
                          </span>
                          <span className="text-xs text-gray-400">
                            {t(
                              "common.try_different_search",
                              "Try a different search term"
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <RiPhoneLine
            className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 ${
              isRTL ? "left-3 sm:left-4" : "right-3 sm:right-4"
            }`}
          />
          <input
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handlePhoneBlur}
            placeholder={
              placeholder || t("common.phone_number", "Enter phone number")
            }
            disabled={disabled}
            aria-label={t("common.phone_number", "Phone number")}
            aria-invalid={hasError}
            aria-describedby={hasError ? "phone-error" : undefined}
            className={`
              w-full h-[60px] border-2 transition-all duration-200 font-medium
              focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500
              hover:shadow-md touch-manipulation text-base
              ${
                hasError
                  ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
              ${
                disabled
                  ? "bg-gray-50 cursor-not-allowed opacity-60"
                  : "hover:bg-gray-50/30"
              }
              ${
                isRTL
                  ? "border-r-0 rounded-l-xl pr-4 pl-12 text-end"
                  : "border-l-0 rounded-r-xl pl-4 pr-12 text-start"
              }
            `}
          />
        </div>
      </div>

      {/* Enhanced Focus Ring */}
      <div
        className={`
          absolute inset-0 rounded-xl pointer-events-none transition-all duration-200
          ${isOpen || isFocused ? "ring-3 ring-blue-100 ring-offset-1" : ""}
        `}
        data-phone-input
      />

      {/* Error Message */}
      {/* {hasError && validationError && (
        <div
          id="phone-error"
          className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm"
          role="alert"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p>{validationError}</p>
        </div>
      )} */}
    </div>
  );
};

// PropTypes for better type checking
PhoneNumberInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  phoneCode: PropTypes.string,
  onPhoneCodeChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  t: PropTypes.func.isRequired,
  isRTL: PropTypes.bool,
  required: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  validateOnBlur: PropTypes.bool,
  customValidator: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default PhoneNumberInput;
