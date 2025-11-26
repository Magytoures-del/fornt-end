"use client";

import React, { useState } from "react";
import HotelCard from "./HotelCard";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useSearchData } from "../../hooks/useSearchData";
import { calculateNights } from "../../utils/dateUtils";

export default function HotelResultsList({
  searchResults,
  searchId,
  searchTracingKey,
  isLoading,
  isPriceLoading,
  limit = 20,
}) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { searchData } = useSearchData();
  const [activeTab, setActiveTab] = useState("hotels");
  
  // Calculate number of nights from search data
  const numberOfNights = searchData?.checkIn && searchData?.checkOut
    ? calculateNights(searchData.checkIn, searchData.checkOut)
    : 1;

  // Extract hotels from searchResults or use default data
  const extractHotelsFromResults = () => {
    if (!searchResults) {
      return { hotels: [], total: 0, locationName: null };
    }

    // Handle nested response structure: response.data.data.data
    // The hotels are at: searchResults.hotels
    // The total count is at: searchResults.total
    // Location name is at: searchResults.locationName
    const hotels = searchResults?.hotels || [];
    const total = searchResults?.total || 0;
    const locationName = searchResults?.locationName || null;

    return {
      hotels: Array.isArray(hotels) ? hotels : [],
      total: typeof total === "number" ? total : 0,
      locationName: locationName,
    };
  };

  const {
    hotels: apiHotels,
    total: totalHotels,
    locationName,
  } = extractHotelsFromResults();

  // Always use SAR currency
  const currency = "SAR";

  const tabs = [
    {
      id: "hotels",
      label: t("hotels.results.tabs.hotels"),
      count: totalHotels || apiHotels.length || 257,
    },
    { id: "motels", label: t("hotels.results.tabs.motels"), count: 51 },
    { id: "resorts", label: t("hotels.results.tabs.resorts"), count: 72 },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const indicatorTransform = isRTL
    ? `translateX(-${activeIndex * 100}%)`
    : `translateX(${activeIndex * 100}%)`;

  // Use API hotels if available, otherwise use default mock data
  const defaultHotels = [];

  // Transform API hotel data to match HotelCard expected structure
  const transformHotels = (hotelsArray) => {
    return hotelsArray.map((hotel) => ({
      id: hotel.id,
      name: hotel.name || "",
      location: hotel.address || hotel.locationName || "",
      rating: hotel.starRating || 0,
      amenities: hotel.facilities?.length || 0,
      reviewScore: hotel.userReview?.rating || null,
      reviewCount: hotel.userReview?.count || 0,
      // Use rate.ratePerNight for price display, fallback to rate.total if ratePerNight not available
      price:
        hotel.rate?.ratePerNight ||
        hotel.rate?.total ||
        hotel.rate?.amount ||
        null,
      images: hotel.images?.length || 0,
      imageUrl:
        hotel.heroImage ||
        (hotel.images && hotel.images.length > 0
          ? hotel.images[0].url || hotel.images[0]
          : null),
      distance: hotel.distance !== undefined ? hotel.distance : null,
      facilities: hotel.facilities || [],
      geoCode: hotel.geoCode || null,
      provider: hotel.provider || hotel.rate?.provider || null,
      chainName: hotel.chainName || null,
      propertyType: hotel.propertyType || null,
      searchId: searchId,
      searchTracingKey: searchTracingKey,
      // Rate-related fields
      isRecommended: hotel.isRecommended || false,
      isRefundable: hotel.isRefundable || false,
      freeBreakfast: hotel.freeBreakfast || false,
      freeCancellation: hotel.freeCancellation || false,
      payAtHotel: hotel.payAtHotel || false,
      akbarChoice: hotel.akbarChoice || false,
      // Currency for price display
      currency: currency,
      // Full rate object for additional details
      rateDetails: hotel.rate || null,
      // Keep original hotel data for reference
      original: hotel,
    }));
  };

  const hotels =
    apiHotels.length > 0 ? transformHotels(apiHotels) : defaultHotels;

  // Show message if no results
  if (searchResults && hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          {t("hotels.results.no_results") || "No hotels found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      {/* <div className="relative bg-white border border-gray-200 rounded-lg">
        <div className="flex divide-x divide-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                activeTab === tab.id ? "" : ""
              }`}
            >
              <div className="text-sm font-semibold text-gray-900">
                {tab.label}
              </div>
              <div className="text-xs text-gray-500">
                {tab.count} {t("hotels.results.tabs.places")}
              </div>
            </button>
          ))}
        </div>
        <span
          className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded transition-transform duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            transform: indicatorTransform,
          }}
        />
      </div> */}

      {/* Results Header */}
      {locationName && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("hotels.results.location_results")}: {locationName}
          </h2>
        </div>
      )}
    

      {/* Hotel Cards */}
      <div className="space-y-5">
        {hotels.map((hotel, index) => (
          <HotelCard
            key={`hotel-${hotel.id || hotel.hotelId}-${index}`}
            hotel={hotel}
            isPriceLoading={isPriceLoading && !hotel.price}
            numberOfNights={numberOfNights}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}
