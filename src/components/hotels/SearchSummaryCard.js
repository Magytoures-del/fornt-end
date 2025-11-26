import React from "react";
import { useTranslation } from "react-i18next";
import { formatDateDisplay, calculateNights } from "@/utils/dateUtils";

/**
 * Compact search summary card component
 */
const SearchSummaryCard = ({ searchData, onEditClick, getGuestsInfo }) => {
  const { t } = useTranslation();

  if (!searchData) return null;

  return (
    <div
      onClick={onEditClick}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 md:p-6 cursor-pointer hover:shadow-2xl hover:border-blue-400 transition-all duration-300 group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-5">
        {/* Destination */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full lg:w-auto lg:flex-1">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
              {t("hotels.results.search_bar.destination")}
            </div>
            <div className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {searchData.destination || t("hotels.search_card.not_specified")}
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
          {/* Check-in Date */}
          {searchData.checkIn && (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1 sm:flex-initial">
                <div className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
                  {t("hotels.results.search_bar.check_in")}
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap truncate">
                  {formatDateDisplay(searchData.checkIn)}
                </div>
              </div>
            </div>
          )}

          {/* Arrow */}
          {searchData.checkIn && searchData.checkOut && (
            <div className="hidden sm:flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          )}

          {/* Check-out Date */}
          {searchData.checkOut && (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1 sm:flex-initial">
                <div className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
                  {t("hotels.results.search_bar.check_out")}
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap truncate">
                  {formatDateDisplay(searchData.checkOut)}
                </div>
              </div>
            </div>
          )}

          {/* Nights Badge */}
          {searchData.checkIn && searchData.checkOut && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white bg-opacity-60 backdrop-blur rounded-xl border-2 border-blue-200">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <div>
                <div className="text-xs text-gray-600 font-medium">
                  {calculateNights(searchData.checkIn, searchData.checkOut)}{" "}
                  {t("hotels.search_card.nights")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Guests Information */}
        {getGuestsInfo() && (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 w-full lg:w-auto">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-600 to-rose-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs text-gray-600 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
                {t("hotels.search_card.guests")}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                {(() => {
                  const guests = getGuestsInfo();
                  const parts = [];
                  if (guests.adults > 0) {
                    parts.push(
                      `${guests.adults} ${
                        guests.adults === 1
                          ? t("hotels.guests.adult")
                          : t("hotels.guests.adults")
                      }`
                    );
                  }
                  if (guests.children > 0) {
                    parts.push(
                      `${guests.children} ${
                        guests.children === 1
                          ? t("hotels.guests.child")
                          : t("hotels.guests.children")
                      }`
                    );
                  }
                  if (guests.rooms > 0) {
                    parts.push(
                      `${guests.rooms} ${
                        guests.rooms === 1
                          ? t("hotels.guests.room")
                          : t("hotels.guests.rooms")
                      }`
                    );
                  }
                  return parts.join(", ");
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Edit Button */}
        <button className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0 group-hover:scale-105 w-full lg:w-auto mt-3 lg:mt-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="hidden sm:inline">
            {t("hotels.search_card.edit_search")}
          </span>
          <span className="sm:hidden">{t("hotels.search_card.edit")}</span>
        </button>
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  );
};

export default SearchSummaryCard;

