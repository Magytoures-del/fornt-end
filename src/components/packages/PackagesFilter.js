"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function PackagesFilter({ onFilterChange }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    destination: "",
    priceRange: "",
    duration: "",
    packageType: "",
    sortBy: "popular",
  });

  const destinations = [
    { value: "dubai", label: "Dubai" },
    { value: "paris", label: "Paris" },
    { value: "london", label: "London" },
    { value: "cairo", label: "Cairo" },
    { value: "istanbul", label: "Istanbul" },
    { value: "rome", label: "Rome" },
    { value: "tokyo", label: "Tokyo" },
    { value: "new-york", label: "New York" },
  ];

  const priceRanges = [
    { value: "0-500", label: "$0 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000-2000", label: "$1,000 - $2,000" },
    { value: "2000+", label: "$2,000+" },
  ];

  const durations = [
    { value: "1-3", label: "1-3 Days" },
    { value: "4-7", label: "4-7 Days" },
    { value: "8-14", label: "8-14 Days" },
    { value: "15+", label: "15+ Days" },
  ];

  const packageTypes = [
    { value: "honeymoon", label: "Honeymoon" },
    { value: "family", label: "Family" },
    { value: "adventure", label: "Adventure" },
    { value: "business", label: "Business" },
    { value: "cultural", label: "Cultural" },
    { value: "beach", label: "Beach" },
    { value: "city", label: "City Break" },
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "duration", label: "Duration" },
    { value: "rating", label: "Rating" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      destination: "",
      priceRange: "",
      duration: "",
      packageType: "",
      sortBy: "popular",
    };
    setFilters(clearedFilters);
    onFilterChange && onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Destination Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("packages.filter.destination", "الوجهة")}
          </label>
          <select
            value={filters.destination}
            onChange={(e) => handleFilterChange("destination", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {t("packages.filter.all_destinations", "جميع الوجهات")}
            </option>
            {destinations.map((dest) => (
              <option key={dest.value} value={dest.value}>
                {dest.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("packages.filter.price_range", "السعر")}
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange("priceRange", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {t("packages.filter.all_prices", "جميع الأسعار")}
            </option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("packages.filter.duration", "المدة")}
          </label>
          <select
            value={filters.duration}
            onChange={(e) => handleFilterChange("duration", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {t("packages.filter.all_durations", "جميع المدد")}
            </option>
            {durations.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </div>

        {/* Package Type Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("packages.filter.package_type", "نوع الباقة")}
          </label>
          <select
            value={filters.packageType}
            onChange={(e) => handleFilterChange("packageType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {t("packages.filter.all_types", "جميع الأنواع")}
            </option>
            {packageTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("packages.filter.sort_by", "ترتيب حسب")}
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex-shrink-0">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t("packages.filter.clear", "مسح الفلاتر")}
          </button>
        </div>
      </div>
    </div>
  );
}
