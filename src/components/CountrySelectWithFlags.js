"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { RiArrowDownSLine, RiSearchLine, RiCheckLine } from "react-icons/ri";
import { countries } from "../data/countries";
import FlagImage from "./FlagImage";
import { useLanguage } from "../context/LanguageContext";

const CountrySelectWithFlags = ({
  options = [],
  value = "",
  onChange,
  placeholder = "",
  className = "",
  error = false,
  disabled = false,
  label = "",
  required = false,
  t: translationFunc,
  isRTL: isRTLProp,
  style = {},
}) => {
  const { t: useTranslationT, i18n } = useTranslation();
  const { isRTL: contextRTL } = useLanguage();
  const t = translationFunc || useTranslationT;
  const isRTL = isRTLProp !== undefined ? isRTLProp : contextRTL;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Create a map of country codes to country data (including flags)
  const countryDataMap = useMemo(() => {
    const map = new Map();
    countries.forEach((country) => {
      map.set(country.code, country);
    });
    return map;
  }, []);

  // Enhanced options with flag data
  const enhancedOptions = useMemo(() => {
    return options.map((option) => {
      const countryData = countryDataMap.get(option.value);
      return {
        ...option,
        flag: countryData?.flag || null,
        code: option.value,
      };
    });
  }, [options, countryDataMap]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return enhancedOptions;

    const searchLower = searchTerm.toLowerCase();
    return enhancedOptions.filter((option) => {
      const labelMatch = option.label?.toLowerCase().includes(searchLower);
      const valueMatch = option.value?.toLowerCase().includes(searchLower);
      return labelMatch || valueMatch;
    });
  }, [searchTerm, enhancedOptions]);

  // Find selected option
  const selectedOption = useMemo(() => {
    return enhancedOptions.find((option) => option.value === value);
  }, [value, enhancedOptions]);

  // Memoized event handlers
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
      setFocusedIndex(-1);
    }
  }, [disabled, isOpen]);

  const handleSelect = useCallback(
    (option) => {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm("");
      setFocusedIndex(-1);
    },
    [onChange]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(-1);
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
        const trigger = dropdownRef.current?.querySelector("button");
        if (trigger) trigger.focus();
      } else if (isOpen && filteredOptions.length > 0) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        } else if (event.key === "Enter" && focusedIndex >= 0) {
          event.preventDefault();
          handleSelect(filteredOptions[focusedIndex]);
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
  }, [isOpen, filteredOptions, focusedIndex, handleSelect]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} style={style} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label
          clذassName={`block text-sm font-semibold text-gray-700 mb-2 ${
            !isRTL ? "text-right" : "text-left"
          }`}
        >
          {label}
          {required && (
            <span className={`text-red-500 ${!isRTL ? "mr-1" : "ml-1"}`}>
              *
            </span>
          )}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-label={placeholder || label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`
          w-full px-4 py-3.5 bg-white border-2 rounded-xl
          focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-300 ease-in-out
          shadow-sm hover:shadow-md
          flex items-center justify-between gap-3
          min-h-[60px]
          ${
            error
              ? "border-red-500 bg-red-50"
              : "border-gray-200 hover:border-gray-300"
          }
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed opacity-60"
              : "hover:bg-gray-50"
          }
          ${isOpen ? "border-blue-500 shadow-lg ring-4 ring-blue-500/20" : ""}
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Flag Container */}
          {selectedOption?.flag && (
            <div className="flex items-center justify-center w-7 h-5 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
              <FlagImage
                src={selectedOption.flag}
                alt={`${selectedOption.label} flag`}
                className="w-full h-full object-cover"
                fallback="🌍"
                width={28}
                height={20}
              />
            </div>
          )}

          {/* Selected Value or Placeholder */}
          <span
            className={`font-medium transition-colors duration-200 flex-1 truncate ${
              selectedOption ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        {/* Dropdown Arrow */}
        <RiArrowDownSLine
          className={`w-5 h-5 text-gray-400 transition-all duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </button>

      {/* Modal Dropdown */}
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
              aria-label={label || placeholder}
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
                    {label || t("common.select_country", "Select Country")}
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
                    placeholder={t("common.search", "Search...")}
                    aria-label={t("common.search", "Search")}
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

              {/* Options List */}
              <div
                role="listbox"
                className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={value === option.value}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`
                        w-full px-5 py-4 hover:bg-blue-50 focus:bg-blue-50 group
                        focus:outline-none transition-all duration-150 border-b border-gray-50
                        ${
                          value === option.value
                            ? "bg-blue-100 text-blue-700 shadow-sm"
                            : focusedIndex === index
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:text-blue-600"
                        }
                        ${
                          index === filteredOptions.length - 1
                            ? "border-b-0"
                            : ""
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Flag */}
                        {option.flag && (
                          <div className="flex items-center justify-center w-9 h-7 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <FlagImage
                              src={option.flag}
                              alt={`${option.label} flag`}
                              className="w-full h-full object-cover"
                              fallback="🌍"
                              width={36}
                              height={28}
                            />
                          </div>
                        )}

                        {/* Country Name */}
                        <span
                          className={`flex-1 font-medium text-sm ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {option.label}
                        </span>

                        {/* Selected Check */}
                        {value === option.value && (
                          <RiCheckLine className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div
                    className={`px-5 py-12 text-gray-500 text-sm text-center ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
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

      {/* Error Message */}
      {error && (
        <span
          className={`mt-2 text-sm font-medium text-red-600 flex items-center gap-2 ${
            isRTL ? "text-right flex-row-reverse" : "text-left"
          }`}
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#ef4444",
            marginTop: "0.5rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "16px",
              height: "16px",
              background: "#ef4444",
              color: "white",
              borderRadius: "50%",
              fontSize: "0.75rem",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            !
          </span>
          <span>
            {typeof error === "string"
              ? error
              : t("common.field_required", "This field is required")}
          </span>
        </span>
      )}
    </div>
  );
};

CountrySelectWithFlags.displayName = "CountrySelectWithFlags";

export default CountrySelectWithFlags;
