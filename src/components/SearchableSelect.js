"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { RiArrowDownSLine, RiSearchLine, RiCheckLine } from "react-icons/ri";

const SearchableSelect = ({
  options = [],
  value = "",
  onChange,
  placeholder = "",
  searchPlaceholder = "",
  className = "",
  error = false,
  disabled = false,
  label = "",
  required = false,
  enableCountrySearch = false,
  showCountryLabels = false,
  noLanguageOption = false,
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  useEffect(() => {
    let filtered = options;

    if (searchTerm) {
      filtered = options.filter((option) => {
        const searchLower = searchTerm.toLowerCase();
        const labelMatch = option.label.toLowerCase().includes(searchLower);

        // If country search is enabled, also search in country field and value
        if (enableCountrySearch) {
          const countryMatch = option.country
            ? option.country.toLowerCase().includes(searchLower)
            : false;
          const valueMatch = option.value
            ? option.value.toLowerCase().includes(searchLower)
            : false;
          return labelMatch || countryMatch || valueMatch;
        }

        return labelMatch;
      });
    }

    // Add "no language" option if enabled and no search term
    if (noLanguageOption && !searchTerm) {
      filtered = [
        { value: "no_language", label: t("common.no_language", "No Language") },
        ...filtered,
      ];
    }

    setFilteredOptions(filtered);
  }, [searchTerm, options, enableCountrySearch, noLanguageOption, t]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label
          className={`block text-sm font-semibold text-gray-700 mb-2 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {label} {t("common.required", "Required")}
          {required && (
            <span className={`text-red-500 ${isRTL ? "ml-1" : "mr-1"}`}>*</span>
          )}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3.5 bg-white border-2 rounded-xl
          focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-300 ease-in-out
          shadow-sm hover:shadow-md
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
          ${isRTL ? "text-start" : "text-end"}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
      >
        <div className={`flex items-center justify-between `}>
          <span
            className={`font-medium transition-colors duration-200 ${
              selectedOption ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <RiArrowDownSLine
            className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
              isOpen ? "rotate-180 text-blue-500" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl
            max-h-60 overflow-hidden backdrop-blur-sm
            animate-in fade-in-0 zoom-in-95 duration-200
            ${isRTL ? "text-start" : "text-end"}
          `}
          role="listbox"
          aria-label={`${label || placeholder} options`}
          style={{
            position: "absolute",
            zIndex: 10007,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <RiSearchLine
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors ${
                  isRTL ? "left-3" : "right-3"
                }`}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchPlaceholder ||
                  (enableCountrySearch
                    ? t(
                        "common.search_country_code_or_name",
                        "Search country code, name, or value..."
                      )
                    : t("common.search", "Search..."))
                }
                className={`
                   w-full py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                   transition-all duration-200
                   px-5
                 
                 `}
                aria-label={`Search ${label || placeholder}`}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={value === option.value}
                  className={`
                    w-full px-5 py-3 hover:bg-blue-50 focus:bg-blue-50
                    focus:outline-none transition-all duration-200
                    border-b border-gray-50 last:border-b-0
                    group relative
                    ${
                      value === option.value
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:text-gray-900"
                    }
                  `}
                >
                  <div className={`flex items-center justify-between`}>
                    <div className="flex flex-col">
                      <span className="truncate">{option.label}</span>

                      <span className="text-xs text-gray-500 truncate">
                        {option.country}
                      </span>
                    </div>
                    {value === option.value && (
                      <RiCheckLine className={`w-4 h-4 text-blue-600 `} />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div
                className={`px-4 py-8 text-center ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div className="text-gray-400 text-sm">
                  <RiSearchLine className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">
                    {t("common.no_results", "No results found")}
                  </p>
                  <p className="text-xs mt-1 opacity-75">
                    {t(
                      "common.try_different_search",
                      "Try a different search term"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <span
          className={`mt-2 text-sm font-medium text-red-600 flex items-center gap-2 ${
            !isRTL ? "text-right flex-row-reverse" : "text-left"
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

SearchableSelect.displayName = "SearchableSelect";

export default SearchableSelect;
