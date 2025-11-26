import React from "react";
import { useTranslation } from "react-i18next";
import { SORT_OPTIONS } from "@/constants/hotelSearch";

/**
 * Sorting controls with hotel count display
 */
const SortingControls = ({
  displayedCount,
  totalCount,
  hasMore,
  sortBy,
  onSortChange,
  isPriceLoading,
}) => {
  const { t } = useTranslation();
  
  // Show skeleton while prices are loading
  if (isPriceLoading) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-pulse">
        {/* Hotel count skeleton */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 border border-blue-200">
          <div className="w-5 h-5 bg-blue-200 rounded"></div>
          <div className="h-4 bg-blue-200 rounded w-48"></div>
        </div>

        {/* Sort dropdown skeleton */}
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-300 shadow-sm">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Hotel count */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 border border-blue-200">
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="text-sm font-semibold text-gray-700">
          {t("hotels.results.showing_count", { displayed: displayedCount, total: totalCount })}
        </span>
        {hasMore && (
          <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full border border-gray-300 ml-2">
            {t("hotels.results.scroll_for_more")}
          </span>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-300 shadow-sm">
        <svg
          className="w-5 h-5 text-gray-600"
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
        <label
          htmlFor="sort-select"
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          {t("hotels.results.sort.sort_by_colon")}
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm font-medium text-gray-900 border-0 bg-transparent focus:ring-0 focus:outline-none cursor-pointer pr-8"
        >
          <option value={SORT_OPTIONS.RECOMMENDED}>{t("hotels.results.sort.recommended")}</option>
          <option value={SORT_OPTIONS.PRICE_LOW}>{t("hotels.results.sort.price_low_high")}</option>
          <option value={SORT_OPTIONS.PRICE_HIGH}>{t("hotels.results.sort.price_high_low")}</option>
          <option value={SORT_OPTIONS.RATING}>{t("hotels.results.sort.rating")}</option>
          <option value={SORT_OPTIONS.REVIEW}>{t("hotels.results.sort.review")}</option>
          <option value={SORT_OPTIONS.DISTANCE}>{t("hotels.results.sort.distance")}</option>
        </select>
      </div>
    </div>
  );
};

export default SortingControls;

