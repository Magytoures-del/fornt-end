"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { LuPlaneTakeoff, LuPlaneLanding } from "react-icons/lu";
import Link from "next/link";
import FlightCard from "./results/FlightCard";
import { localizeNumber, localizeCurrency } from "../../utils/numberLocalization";

// Connection Tooltip Component

export default function FlightResults({
  results,
  origin,
  destination,
  date,
  adults,
  childrenCount,
  infants,
  cabinClass,
  tripType = "oneway", // Default to oneway if not provided
  isLoading = false,
  isInitialLoad = false,
  isSearching = false,
  isFiltering = false,
  totalFlightsFound = 0,
  onLoadMore,
  canLoadMore = false,
}) {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [progress, setProgress] = useState(0);
  const [tooltipStates, setTooltipStates] = useState({});
  const sentinelRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { t, i18n } = useTranslation();

  // Progress bar animation effect
  useEffect(() => {
    let interval;
    if (isInitialLoad || isSearching) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInitialLoad, isSearching]);

  // Infinite scroll: trigger onLoadMore when sentinel comes into view
  useEffect(() => {
    if (!canLoadMore || !onLoadMore) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          !isLoadingMore &&
          !isFiltering &&
          !isInitialLoad &&
          !isSearching
        ) {
          setIsLoadingMore(true);
          // Defer slightly to batch state updates
          setTimeout(() => {
            onLoadMore && onLoadMore();
          }, 0);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [
    canLoadMore,
    onLoadMore,
    isLoadingMore,
    isFiltering,
    isInitialLoad,
    isSearching,
  ]);

  // When results update (after pagination), allow next load
  useEffect(() => {
    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [results]);

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
  };

  const handleBooking = (flight) => {
    // TODO: Implement booking logic
    console.log("Booking flight:", flight);
    // Redirect to booking page or open booking modal
  };

  const getAirlineLogo = (airlineCode) => {
    const code = (airlineCode || "").toString().trim().toUpperCase();
    if (!code) return "/logo.png";
    return `https://sacontent.akbartravels.com/AirlineLogo/assets/images/v2/AirlineLogo/${code}.png`;
  };

  const formatPrice = (price) => {
    return localizeNumber(price, i18n?.language || "en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  const formatCurrency = (currency = "USD") => {
    return localizeCurrency(0, currency, i18n?.language || "en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace(/[\d٠-٩.,\s]/g, "").trim() || currency;
  };

  const getCabinClassLabel = (cabinClass) => {
    const cabinMap = {
      E: t("flights.cabin_class.economy"),
      B: t("flights.cabin_class.business"),
      F: t("flights.cabin_class.first"),
    };
    return cabinMap[cabinClass] || t("flights.cabin_class.economy");
  };

  const formatAirportWithTerminal = (code, terminal) => {
    const c = (code || "").toString().trim();
    const t = (terminal || "").toString().trim();
    if (!c && !t) return "";
    if (!t) return c;
    return `${c} • T${t}`;
  };

  const formatBooleanBadge = (value, trueText, falseText) => {
    const isTrue =
      value === true ||
      value === 1 ||
      value === "1" ||
      value === "True" ||
      value === "true";
    return {
      text: isTrue ? trueText : falseText,
      cls: isTrue
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-amber-50 text-amber-700 border-emerald-200",
    };
  };

  const formatTimeWithMeridiem = (timeStr) => {
    const raw = (timeStr || "").toString().trim();
    if (!raw) return "";

    // Handle ISO datetime like 2025-09-19T10:25:00
    const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/);
    if (isoMatch) {
      const dateObj = new Date(raw);
      if (!isNaN(dateObj.getTime())) {
        const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
        return new Intl.DateTimeFormat(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          calendar: "gregory",
        }).format(dateObj);
      }
    }

    // If already contains AM/PM, normalize label localization
    const ampmMatch = raw.match(/\b(AM|PM|am|pm|Am|Pm)\b/);
    if (ampmMatch) {
      const isPM = ampmMatch[0].toLowerCase() === "pm";
      const label = isPM ? t("flight_results.pm") : t("flight_results.am");
      return raw.replace(/\b(AM|PM|am|pm|Am|Pm)\b/, label);
    }

    // Expect HH:mm → convert to 12-hour format with localized AM/PM
    const m = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return raw;
    let hours = parseInt(m[1], 10);
    const minutes = m[2];
    const isPM = hours >= 12;
    const label = isPM ? t("flight_results.pm") : t("flight_results.am");
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${label}`;
  };

  const isISODateTime = (value) =>
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value.trim());

  const formatDateFromISOString = (isoString) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
      return new Intl.DateTimeFormat(locale, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        calendar: "gregory",
      }).format(d);
    } catch (e) {
      return "";
    }
  };

  // Show loading state only during initial load
  if (isInitialLoad) {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
            />
          </svg>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-sm sm:max-w-md mx-auto mb-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {Math.round(progress)}% {t("flight_results.complete")}
          </p>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
          {t("flight_results.searching_flights")}
        </h3>
        <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm lg:text-base">
          {t("flight_results.searching_flights_subtitle")}
        </p>
      </div>
    );
  }

  if (!isInitialLoad && (!results || results.length === 0)) {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
          {t("flight_results.no_results_title")}
        </h3>
        <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm lg:text-base">
          {t("flight_results.no_results_subtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Bar */}
      {(isInitialLoad || isSearching) && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Enhanced Results Summary with Progressive Loading Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-3 sm:mb-4 lg:mb-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3 mb-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                    />
                  </svg>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {t("flight_results.all_flights")}
                </p>
              </div>
              {/* Progressive Loading Indicator */}
              {(isSearching || isInitialLoad) && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-blue-600 font-medium">
                    {isInitialLoad
                      ? t("flight_results.searching_flights")
                      : t("flight_results.searching_more")}
                  </span>
                  {/* Inline Progress Bar */}
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {/* Filtering Loading Indicator */}
              {isFiltering && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-orange-600 font-medium">
                    {t("flight_results.filtering_results")}
                  </span>
                  <div className="w-16 h-1 bg-orange-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 lg:gap-4">
              <p className="text-xs sm:text-sm text-gray-600">
                {t("flight_results.best_options_for_class", {
                  class: getCabinClassLabel(cabinClass),
                })}
              </p>
              {/* Total Flights Found */}
              {totalFlightsFound > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    {t("flight_results.total_found", {
                      count: totalFlightsFound,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Flight Results */}
      <FlightCard
        results={results}
        origin={origin}
        destination={destination}
        selectedFlight={selectedFlight}
        onFlightSelect={handleFlightSelect}
      />

      {/* Infinite scroll sentinel */}
      {canLoadMore && (
        <div className="pt-4 sm:pt-6 lg:pt-8 flex items-center justify-center">
          <div ref={sentinelRef} className="h-6 w-full max-w-xs">
            {(isLoadingMore || isSearching) && (
              <div className="flex items-center justify-center space-x-2 text-blue-600 text-xs sm:text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span>{t("flight_results.searching_more_flights")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ongoing Search Indicator */}
      {isSearching && results.length > 0 && (
        <div className="text-center py-4 sm:py-6 px-4 sm:px-6">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 max-w-sm sm:max-w-none">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-xs sm:text-sm text-blue-700 font-medium">
              {t("flight_results.searching_more_flights")}
            </span>
            {/* Progress Bar */}
            <div className="w-16 sm:w-20 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced No Results Message */}
      {results.length === 0 && !isInitialLoad && (
        <div className="text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
            {t("flight_results.no_results_title")}
          </h3>
          <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm lg:text-base">
            {t("flight_results.no_results_subtitle")}
          </p>
        </div>
      )}
    </div>
  );
}
