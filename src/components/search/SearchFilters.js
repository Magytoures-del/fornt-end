"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SearchFilters({
  onFilterChange,
  onSortChange,
  airlinesOptions = [],
  priceBuckets = [],
  currency = "USD",
  currentSortBy = "price_asc",
}) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    priceRange: "all",
    stops: "all",
    airlines: [],
    departureTime: "all",
    cabinClass: "all",
  });
  const [airlineQuery, setAirlineQuery] = useState("");
  const [showAllAirlines, setShowAllAirlines] = useState(false);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSortChange = (sortBy) => {
    if (onSortChange) {
      onSortChange(sortBy);
    }
  };

  const handleAirlineToggle = (airline) => {
    const currentAirlines = filters.airlines;
    const newAirlines = currentAirlines.includes(airline)
      ? currentAirlines.filter((a) => a !== airline)
      : [...currentAirlines, airline];

    handleFilterChange("airlines", newAirlines);
  };

  const sortOptions = [
    { value: "price_asc", label: t("filters.sort.price_lowest") },
    { value: "price_desc", label: t("filters.sort.price_highest") },
    { value: "duration_asc", label: t("filters.sort.duration_shortest") },
    { value: "duration_desc", label: t("filters.sort.duration_longest") },
    { value: "departure_asc", label: t("filters.sort.departure_earliest") },
    { value: "departure_desc", label: t("filters.sort.departure_latest") },
    { value: "stops_asc", label: t("filters.sort.stops_fewest") },
    { value: "stops_desc", label: t("filters.sort.stops_most") },
  ];

  const priceRanges =
    priceBuckets && priceBuckets.length
      ? priceBuckets
      : [
          { value: "all", label: t("filters.all_prices", { currency }) },
          {
            value: "0-500",
            label: t("filters.under_amount", { amount: "500", currency }),
          },
          {
            value: "500-1000",
            label: t("filters.between_amount", {
              min: "500",
              max: "1,000",
              currency,
            }),
          },
          {
            value: "1000-1500",
            label: t("filters.between_amount", {
              min: "1,000",
              max: "1,500",
              currency,
            }),
          },
          {
            value: "1500+",
            label: t("filters.over_amount", { amount: "1,500", currency }),
          },
        ];

  const stopOptions = [
    { value: "all", label: t("filters.all_flights") },
    { value: "0", label: t("filters.direct_only") },
    { value: "1", label: t("filters.one_stop") },
    { value: "2+", label: t("filters.two_plus_stops") },
  ];

  const departureTimes = [
    { value: "all", label: t("filters.all_times") },
    { value: "morning", label: t("filters.morning") },
    { value: "afternoon", label: t("filters.afternoon") },
    { value: "evening", label: t("filters.evening") },
    { value: "night", label: t("filters.night") },
  ];

  const airlines = useMemo(
    () =>
      airlinesOptions && airlinesOptions.length
        ? airlinesOptions
        : [
            "EgyptAir",
            "Saudi Arabian Airlines",
            "Flynas",
            "Emirates",
            "Qatar Airways",
            "Turkish Airlines",
            "Kuwait Airways",
          ],
    [airlinesOptions]
  );

  const filteredAirlines = useMemo(() => {
    const query = airlineQuery.trim().toLowerCase();
    if (!query) return airlines;
    return airlines.filter((a) => a.toLowerCase().includes(query));
  }, [airlineQuery, airlines]);

  const AIRLINE_LIMIT = 8;
  const shouldLimitAirlines = useMemo(
    () => airlineQuery.trim() === "",
    [airlineQuery]
  );
  const visibleAirlines = useMemo(() => {
    if (!shouldLimitAirlines) return filteredAirlines;
    return showAllAirlines
      ? filteredAirlines
      : filteredAirlines.slice(0, AIRLINE_LIMIT);
  }, [filteredAirlines, shouldLimitAirlines, showAllAirlines]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 p-3 sm:p-4 lg:p-6">
      {/* Enhanced Header */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 lg:mb-8">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          {t("filters.title")}
        </h3>
      </div>

      {/* Enhanced Sort Options */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center space-x-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span>{t("filters.sort_by")}</span>
        </h4>
        <div className="space-y-2 sm:space-y-3">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center group cursor-pointer"
            >
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={currentSortBy === option.value}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors duration-200"
              />
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Enhanced Price Range */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center space-x-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <span>{t("filters.price_range")}</span>
        </h4>
        <div className="space-y-2 sm:space-y-3">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center group cursor-pointer"
            >
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors duration-200"
              />
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Enhanced Stops */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center space-x-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>{t("filters.stops")}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {stopOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center group cursor-pointer hover:bg-gray-50 rounded-lg p-1 sm:p-2 -ml-1 sm:-ml-2 transition-colors duration-200"
            >
              <input
                type="radio"
                name="stops"
                value={option.value}
                checked={filters.stops === option.value}
                onChange={(e) => handleFilterChange("stops", e.target.value)}
                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors duration-200 flex-shrink-0"
              />
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Enhanced Airlines */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center space-x-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span>{t("filters.airlines")}</span>
        </h4>
        <div className="mb-3 sm:mb-4">
          <div className="relative">
            <input
              type="text"
              value={airlineQuery}
              onChange={(e) => setAirlineQuery(e.target.value)}
              placeholder={t("filters.search_airlines")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none">
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3 overflow-y-auto pr-2">
          {visibleAirlines.map((airline) => (
            <label
              key={airline}
              className="flex items-center group cursor-pointer hover:bg-gray-50 rounded-lg p-1 sm:p-2 -ml-1 sm:-ml-2 transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleAirlineToggle(airline)}
                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
              />
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {airline}
              </span>
            </label>
          ))}
          {filteredAirlines.length === 0 && (
            <p className="text-xs text-gray-500 py-2 text-center">—</p>
          )}
        </div>
        {filteredAirlines.length > AIRLINE_LIMIT && shouldLimitAirlines && (
          <button
            type="button"
            onClick={() => setShowAllAirlines((v) => !v)}
            className="mt-3 sm:mt-4 w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-blue-700 border border-blue-200 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium"
          >
            {showAllAirlines ? t("common.show_less") : t("common.show_more")}
          </button>
        )}
      </div>

      {/* Enhanced Departure Time */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center space-x-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{t("filters.departure_time")}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {departureTimes.map((time) => (
            <label
              key={time.value}
              className="flex items-center group cursor-pointer hover:bg-gray-50 rounded-lg p-1 sm:p-2 -ml-1 sm:-ml-2 transition-colors duration-200"
            >
              <input
                type="radio"
                name="departureTime"
                value={time.value}
                checked={filters.departureTime === time.value}
                onChange={(e) =>
                  handleFilterChange("departureTime", e.target.value)
                }
                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors duration-200 flex-shrink-0"
              />
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {time.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Enhanced Clear Filters */}
      <button
        onClick={() => {
          const defaultFilters = {
            priceRange: "all",
            stops: "all",
            airlines: [],
            departureTime: "all",
            cabinClass: "all",
          };
          setFilters(defaultFilters);
          if (onFilterChange) {
            onFilterChange(defaultFilters);
          }
        }}
        className="w-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 font-medium hover:shadow-md transform hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{t("filters.clear_all")}</span>
        </div>
      </button>
    </div>
  );
}
