"use client";

import { useTranslation } from "react-i18next";
import SearchFilters from "@/components/search/SearchFilters";
import SearchFiltersSkeleton from "@/components/search/SearchFiltersSkeleton";

/**
 * Mobile bottom sheet component for filters
 */
export default function MobileFiltersSheet({
  isOpen,
  onClose,
  isLoading,
  airlineOptions,
  onFilterChange,
  onSortChange,
  currentSortBy,
  currency,
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="xl:hidden">
      <div
        className="fixed inset-0 z-[10001] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-x-0 bottom-0 z-[10002] max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto w-full bg-white rounded-t-3xl shadow-2xl">
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-gray-100 flex items-center justify-between px-6 py-4 rounded-t-3xl z-10">
            <h3 className="text-xl font-bold text-gray-900">
              {t("filters.title")}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 active:scale-95"
              aria-label={t("common.close")}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {isLoading ? (
              <SearchFiltersSkeleton />
            ) : (
              <SearchFilters
                airlinesOptions={airlineOptions || []}
                onFilterChange={onFilterChange}
                onSortChange={onSortChange}
                currentSortBy={currentSortBy}
                currency={currency}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



