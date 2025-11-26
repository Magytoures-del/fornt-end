import React from "react";
import { useTranslation } from "react-i18next";
import { SEARCH_STATUS } from "@/constants/hotelSearch";

/**
 * Banner component to show search status (in progress or complete)
 */
const SearchStatusBanner = ({ searchStatus, isPriceLoading, totalHotels }) => {
  const { t } = useTranslation();
  if (searchStatus === SEARCH_STATUS.IN_PROGRESS) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg px-4 py-3 border border-amber-200">
        <div className="flex-shrink-0">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {t("hotels.results.search_in_progress")}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {t("hotels.results.search_in_progress_note")}
          </p>
        </div>
      </div>
    );
  }

  if (searchStatus === SEARCH_STATUS.COMPLETE && !isPriceLoading) {
    return (
      <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-4 py-3 border border-green-200">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            {t("hotels.results.search_completed")}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {t("hotels.results.search_completed_note", { count: totalHotels })}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default SearchStatusBanner;

