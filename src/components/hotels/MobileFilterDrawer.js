"use client";

import React, { useState, useEffect } from "react";
import { LuX, LuFilter } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import HotelFiltersSidebar from "./HotelFiltersSidebar";

export default function MobileFilterDrawer({
  filters,
  onFilterChange,
  isOpen,
  onClose,
  activeFilterCount = 0,
  searchQuery = "",
  onSearchChange,
}) {
  const { t } = useTranslation();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <LuFilter className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {t("hotels.results.filters.title")}
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <LuX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
          <HotelFiltersSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 px-4 py-4 flex gap-3 shadow-lg flex-shrink-0">
          <button
            onClick={() => {
              onFilterChange({
                priceRange: [50, 10000],
                rating: null,
                freebies: [],
                amenities: [],
              });
              if (onSearchChange) onSearchChange("");
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            <LuX className="w-4 h-4" />
            {t("common.clear_all")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md"
          >
            {t("common.apply")}
          </button>
        </div>
      </div>
    </>
  );
}

