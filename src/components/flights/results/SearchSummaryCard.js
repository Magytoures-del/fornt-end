"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import {
  parseDateParam,
  calculateTotalPassengers,
} from "@/utils/flightResultsUtils";

/**
 * Search summary card component
 * Displays search criteria and allows modification
 */
export default function SearchSummaryCard({
  originLabel,
  destinationLabel,
  date,
  adults,
  childrenCount,
  infants,
  cabinClass,
  onEditClick,
  getCabinClassLabel,
  dateLocale,
}) {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const language = i18n.language;

  const { startDate, endDate, isRoundTrip } = parseDateParam(date);
  const totalPassengers = calculateTotalPassengers(
    adults,
    childrenCount,
    infants
  );

  const formatDate = (dateString, options) => {
    return new Date(dateString).toLocaleDateString(dateLocale, {
      ...options,
      calendar: "gregory",
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEditClick();
    }
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-5 cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-0.5"
      onClick={onEditClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={t("flights.search.click_to_modify")}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-3">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2 sm:mb-0 group-hover:text-blue-600 transition-colors duration-200">
              <span className="truncate">{originLabel}</span>
              <span className="flex-shrink-0 text-blue-500 group-hover:text-blue-600 transition-colors">
                {language === "en" ? (
                  <FaLongArrowAltRight className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <FaLongArrowAltLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </span>
              <span className="truncate">{destinationLabel}</span>
            </h1>
            <div className="flex items-center gap-1.5 text-blue-600 group-hover:text-blue-700 transition-colors">
              <div className="p-1 rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold hidden sm:inline">
                {t("flights.search.click_to_modify")}
              </span>
              <span className="text-xs font-semibold sm:hidden">
                {t("common.edit")}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
            {/* Date */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
              <div className="p-1 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                {isRoundTrip ? (
                  <>
                    {formatDate(startDate, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                    {endDate && (
                      <>
                        {" • "}
                        {formatDate(endDate, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </>
                    )}
                  </>
                ) : (
                  formatDate(startDate, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                )}
              </span>
            </div>

            {/* Passengers */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 group-hover:bg-green-50 transition-colors">
              <div className="p-1 rounded-md bg-green-100 group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {adults}{" "}
                {parseInt(adults) === 1
                  ? t("flights.passengers.adult")
                  : t("flights.passengers.adults")}
                {parseInt(childrenCount) > 0 &&
                  `, ${childrenCount} ${
                    parseInt(childrenCount) === 1
                      ? t("flights.passengers.child")
                      : t("flights.passengers.children")
                  }`}
                {parseInt(infants) > 0 &&
                  `, ${infants} ${
                    parseInt(infants) === 1
                      ? t("flights.passengers.infant")
                      : t("flights.passengers.infants")
                  }`}
              </span>
            </div>

            {/* Cabin Class */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 group-hover:bg-purple-50 transition-colors">
              <div className="p-1 rounded-md bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {getCabinClassLabel(cabinClass)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
