"use client";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import React, { useState, useEffect, useRef } from "react";
import {
  LuChevronUp,
  LuChevronDown,
  LuX,
  LuSearch,
  LuDollarSign,
  LuStar,
  LuGift,
  LuBuilding,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import SARCurrencyIcon from "../common/SARCurrencyIcon";

export default function HotelFiltersSidebar({
  filters,
  onFilterChange,
  searchQuery = "",
  onSearchChange,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    price: true,
    rating: true,
    freebies: true,
    amenities: true,
  });

  const [localFilters, setLocalFilters] = useState(
    filters || {
      priceRange: [50, 10000], // Default to max to not filter by price
      rating: null,
      freebies: [],
      amenities: [],
    }
  );

  const [priceInputs, setPriceInputs] = useState({
    min: filters?.priceRange?.[0] || 50,
    max: filters?.priceRange?.[1] || 10000,
  });

  // Ref to track if we're updating filters internally to prevent infinite loop
  const isInternalUpdateRef = useRef(false);
  const previousFiltersRef = useRef(filters);

  // Sync local filters with props when filters change externally
  useEffect(() => {
    // Skip sync if this is an internal update
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      previousFiltersRef.current = filters;
      return;
    }

    // Only sync if filters actually changed (deep comparison)
    if (filters) {
      const prevFilters = previousFiltersRef.current;
      const filtersChanged =
        !prevFilters ||
        JSON.stringify(prevFilters.priceRange) !==
          JSON.stringify(filters.priceRange) ||
        prevFilters.rating !== filters.rating ||
        JSON.stringify(prevFilters.freebies) !==
          JSON.stringify(filters.freebies) ||
        JSON.stringify(prevFilters.amenities) !==
          JSON.stringify(filters.amenities);

      if (filtersChanged) {
        setLocalFilters(filters);
        setPriceInputs({
          min: filters.priceRange?.[0] || 50,
          max: filters.priceRange?.[1] || 10000,
        });
        previousFiltersRef.current = filters;
      }
    }
  }, [filters]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (value) => {
    const newFilters = {
      ...localFilters,
      priceRange: [localFilters.priceRange[0], value],
    };
    setLocalFilters(newFilters);
    setPriceInputs({ ...priceInputs, max: value });
    if (onFilterChange) {
      isInternalUpdateRef.current = true;
      onFilterChange(newFilters);
    }
  };

  const handleMinPriceInput = (value) => {
    const numValue = parseInt(value) || 50;
    setPriceInputs({ ...priceInputs, min: numValue });

    if (numValue >= 50 && numValue < localFilters.priceRange[1] - 50) {
      const newFilters = {
        ...localFilters,
        priceRange: [numValue, localFilters.priceRange[1]],
      };
      setLocalFilters(newFilters);
      if (onFilterChange) {
        isInternalUpdateRef.current = true;
        onFilterChange(newFilters);
      }
    } else if (numValue < 50) {
      setPriceInputs({ ...priceInputs, min: 50 });
    }
  };

  const handleMaxPriceInput = (value) => {
    const numValue = parseInt(value) || 10000;
    setPriceInputs({ ...priceInputs, max: numValue });

    if (numValue > localFilters.priceRange[0] + 50 && numValue <= 50000) {
      const newFilters = {
        ...localFilters,
        priceRange: [localFilters.priceRange[0], numValue],
      };
      setLocalFilters(newFilters);
      if (onFilterChange) {
        isInternalUpdateRef.current = true;
        onFilterChange(newFilters);
      }
    } else if (numValue > 50000) {
      setPriceInputs({ ...priceInputs, max: 50000 });
    }
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...localFilters, rating };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      isInternalUpdateRef.current = true;
      onFilterChange(newFilters);
    }
  };

  const handleFreebieToggle = (freebie) => {
    const newFreebies = localFilters.freebies.includes(freebie)
      ? localFilters.freebies.filter((f) => f !== freebie)
      : [...localFilters.freebies, freebie];
    const newFilters = { ...localFilters, freebies: newFreebies };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      isInternalUpdateRef.current = true;
      onFilterChange(newFilters);
    }
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter((a) => a !== amenity)
      : [...localFilters.amenities, amenity];
    const newFilters = { ...localFilters, amenities: newAmenities };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      isInternalUpdateRef.current = true;
      onFilterChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    const resetFilters = {
      priceRange: [50, 10000], // Reset to max to not filter by price
      rating: null,
      freebies: [],
      amenities: [],
    };
    setLocalFilters(resetFilters);
    setPriceInputs({ min: 50, max: 10000 });
    if (onFilterChange) {
      isInternalUpdateRef.current = true;
      onFilterChange(resetFilters);
    }
    if (onSearchChange) onSearchChange("");
  };

  const hasActiveFilters =
    searchQuery ||
    localFilters.rating !== null ||
    localFilters.freebies.length > 0 ||
    localFilters.amenities.length > 0 ||
    localFilters.priceRange[1] < 10000; // Only consider price filter active if max is less than 10000

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (localFilters.rating !== null) count++;
    if (localFilters.freebies.length > 0) count += localFilters.freebies.length;
    if (localFilters.amenities.length > 0)
      count += localFilters.amenities.length;
    if (localFilters.priceRange[1] < 10000) count++; // Only count price filter if max is less than 10000
    return count;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col lg:h-[calc(100vh-120px)] lg:sticky lg:top-4 h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            {t("hotels.results.filters.title")}
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <LuX className="w-4 h-4" />
              {t("common.clear_all")}
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
              {getActiveFilterCount()} {t("common.active") || "Active"}
            </span>
          </div>
        )}
      </div>

      {/* Filters Content */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        {/* Search Bar */}
        {onSearchChange && (
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("search")}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-2">
                <LuSearch className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {t("hotels.results.filters.search")}
                </span>
                {searchQuery && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    1
                  </span>
                )}
              </div>
              {expandedSections.search ? (
                <LuChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              ) : (
                <LuChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              )}
            </button>
            {expandedSections.search && (
              <div className="relative mt-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery || ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t("hotels.results.filters.search_placeholder")}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white text-sm shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <LuX className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        {onSearchChange && <div className="border-t border-gray-200" />}

        {/* Price Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-2">
              <LuDollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                {t("hotels.results.filters.price")}
              </span>
              {localFilters.priceRange[1] < 10000 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  1
                </span>
              )}
            </div>
            {expandedSections.price ? (
              <LuChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            ) : (
              <LuChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-4 pt-3">
              {/* Price Range Input Cards */}
              <div className="flex items-center justify-between gap-3">
                {/* Min Price Input */}
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">
                    {t("common.min")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      max={localFilters.priceRange[1] - 50}
                      value={priceInputs.min}
                      onChange={(e) =>
                        setPriceInputs({ ...priceInputs, min: e.target.value })
                      }
                      onBlur={(e) => handleMinPriceInput(e.target.value)}
                      className="w-full bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 font-semibold text-base transition-all outline-none"
                      placeholder="50"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                      <SARCurrencyIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 items-center h-full">
                  {!isRTL ? (
                    <FaArrowRightLong className="w-4 h-4" />
                  ) : (
                    <FaArrowLeftLong className="w-4 h-4" />
                  )}
                </div>

                {/* Max Price Input */}
                <div className="flex-1">
                  <label className="text-xs text-blue-600 font-medium block mb-1.5">
                    {t("common.max")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={localFilters.priceRange[0] + 50}
                      max="50000"
                      value={priceInputs.max}
                      onChange={(e) =>
                        setPriceInputs({ ...priceInputs, max: e.target.value })
                      }
                      onBlur={(e) => handleMaxPriceInput(e.target.value)}
                      className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-3 py-2.5 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-600 font-semibold text-base transition-all outline-none"
                      placeholder="10000"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 font-medium pointer-events-none">
                      <SARCurrencyIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="relative px-1" dir="ltr">
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                      ((localFilters.priceRange[1] - 50) / 9950) * 100
                    }%, #e5e7eb ${
                      ((localFilters.priceRange[1] - 50) / 9950) * 100
                    }%, #e5e7eb 100%)`,
                  }}
                />
                {/* Price markers */}
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-gray-400 font-medium">50</span>
                  <span className="text-xs text-gray-400 font-medium">
                    2.5K
                  </span>
                  <span className="text-xs text-gray-400 font-medium">5K</span>
                  <span className="text-xs text-gray-400 font-medium">
                    7.5K
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    10K+
                  </span>
                </div>
              </div>

              {/* Per Night Label */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="font-medium">
                  {t("hotels.results.filters.price_per_night")}
                </span>
              </div>

              {/* Validation Message */}
              {priceInputs.min >= priceInputs.max && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">
                    Min price must be less than max price
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Rating Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-2">
              <LuStar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                {t("hotels.results.filters.rating")}
              </span>
              {localFilters.rating !== null && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  1
                </span>
              )}
            </div>
            {expandedSections.rating ? (
              <LuChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            ) : (
              <LuChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </button>
          {expandedSections.rating && (
            <div className="flex flex-wrap gap-2 pt-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    handleRatingChange(
                      localFilters.rating === rating ? null : rating
                    )
                  }
                  className={`flex-1 min-w-[60px] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    localFilters.rating === rating
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  {rating}⭐
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Freebies Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("freebies")}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-2">
              <LuGift className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                {t("hotels.results.filters.freebies")}
              </span>
              {localFilters.freebies.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {localFilters.freebies.length}
                </span>
              )}
            </div>
            {expandedSections.freebies ? (
              <LuChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            ) : (
              <LuChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </button>
          {expandedSections.freebies && (
            <div className="space-y-2 pt-2">
              {[
                {
                  key: "breakfast",
                  label: t("hotels.results.filters.free_breakfast"),
                  icon: "🍳",
                },
                {
                  key: "parking",
                  label: t("hotels.results.filters.free_parking"),
                  icon: "🅿️",
                },
                {
                  key: "internet",
                  label: t("hotels.results.filters.free_internet"),
                  icon: "📶",
                },
                {
                  key: "shuttle",
                  label: t("hotels.results.filters.free_airport_shuttle"),
                  icon: "🚐",
                },
                {
                  key: "cancellation",
                  label: t("hotels.results.filters.free_cancellation"),
                  icon: "✓",
                },
              ].map(({ key, label, icon }) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all ${
                    localFilters.freebies.includes(key)
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={localFilters.freebies.includes(key)}
                    onChange={() => handleFreebieToggle(key)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="text-xl">{icon}</span>
                  <span
                    className={`text-sm font-medium flex-1 ${
                      localFilters.freebies.includes(key)
                        ? "text-blue-900"
                        : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Amenities Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("amenities")}
            className="flex items-center justify-between w-full text-left group"
          >
            <div className="flex items-center gap-2">
              <LuBuilding className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                {t("hotels.results.filters.amenities")}
              </span>
              {localFilters.amenities.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {localFilters.amenities.length}
                </span>
              )}
            </div>
            {expandedSections.amenities ? (
              <LuChevronUp className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            ) : (
              <LuChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </button>
          {expandedSections.amenities && (
            <div className="space-y-2 pt-2">
              {[
                {
                  key: "front_desk",
                  label: t("hotels.results.filters.front_desk"),
                  icon: "🔔",
                },
                {
                  key: "air_conditioned",
                  label: t("hotels.results.filters.air_conditioned"),
                  icon: "❄️",
                },
                {
                  key: "fitness",
                  label: t("hotels.results.filters.fitness"),
                  icon: "💪",
                },
                {
                  key: "pool",
                  label: t("hotels.results.filters.pool"),
                  icon: "🏊",
                },
              ].map(({ key, label, icon }) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all ${
                    localFilters.amenities.includes(key)
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(key)}
                    onChange={() => handleAmenityToggle(key)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="text-xl">{icon}</span>
                  <span
                    className={`text-sm font-medium flex-1 ${
                      localFilters.amenities.includes(key)
                        ? "text-blue-900"
                        : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
