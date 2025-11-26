"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function HotelSearchInput({ onSearchChange, value = "" }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
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
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder={t("hotels.results.filters.search_placeholder")}
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

