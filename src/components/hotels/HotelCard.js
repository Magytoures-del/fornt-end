"use client";

import React from "react";
import {
  LuMapPin,
  LuStar,
  LuLuggage,
  LuEye,
  LuNavigation,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { localizeNumber } from "@/utils/numberLocalization";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

export default function HotelCard({
  hotel,
  currency = "SAR",
  isPriceLoading = false,
  numberOfNights = 1,
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <LuStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleViewPlace = () => {
    if (hotel.id) {
      const params = new URLSearchParams({
        id: hotel.id,
        searchId: hotel.searchId || "",
      });
      if (hotel.searchTracingKey) {
        params.set("searchTracingKey", hotel.searchTracingKey);
      }
      router.push(`/hotels/details?${params.toString()}`);
    }
  };

  const formatDistance = (distance) => {
    if (!distance && distance !== 0) return null;
    return distance.toFixed(2);
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return null;
    return localizeNumber(price, i18n?.language || "en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getCurrencyIcon = (currencyCode) => {
    if (currencyCode === "SAR") {
      return <SARCurrencyIcon className="inline-flex w-4 h-4" />;
    }
    // For other currencies, return text symbol
    const currencyMap = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      AED: "د.إ",
    };
    return <span>{currencyMap[currencyCode] || currencyCode}</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row">
        {/* Hotel Image */}
        <div className="relative w-full sm:w-72 p-3 flex-shrink-0">
          {hotel.imageUrl && hotel.imageUrl !== "/api/placeholder/300/200" ? (
            <img
              src={hotel.imageUrl}
              alt={hotel.name || t("hotels.results.hotel_card.hotel")}
              className="w-full h-44 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/api/placeholder/300/200";
              }}
            />
          ) : (
            <div className="w-full h-44 flex items-center justify-center bg-gray-200 rounded-lg">
              <span className="text-gray-400 text-sm">
                {t("hotels.results.hotel_card.no_image")}
              </span>
            </div>
          )}
          {hotel.images > 0 && (
            <div className="absolute top-5 right-5">
              <button className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                {hotel.images} {t("hotels.results.hotel_card.images")}
              </button>
            </div>
          )}
        </div>

        {/* Hotel Details */}
        <div className="flex-1 p-4 sm:p-6 sm:pr-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {hotel.name || t("hotels.results.hotel_card.untitled_hotel")}
              </h3>
              {hotel.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <LuMapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm line-clamp-1">{hotel.location}</span>
                </div>
              )}
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                {hotel.rating && hotel.rating > 0 && (
                  <div className="flex items-center gap-1 text-rose-500">
                    {renderStars(hotel.rating)}
                    <span className="text-sm ml-1 text-gray-700">
                      {hotel.rating} {t("hotels.results.hotel_card.star_hotel")}
                    </span>
                  </div>
                )}
                {hotel.amenities > 0 && (
                  <span className="text-xs text-gray-600">
                    <span className="font-semibold">20+</span>{" "}
                    {t("hotels.results.hotel_card.amenities")}
                  </span>
                )}
              </div>
              {(hotel.reviewScore || hotel.reviewCount) && (
                <div className="flex items-center gap-3">
                  {hotel.reviewScore && (
                    <span className="inline-flex items-center justify-center h-6 px-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-800">
                      {hotel.reviewScore.toFixed(1)}
                    </span>
                  )}
                  <span className="text-sm text-gray-700">
                    {t("hotels.results.hotel_card.very_good")}
                    {hotel.reviewCount
                      ? ` ${hotel.reviewCount} ${t(
                          "hotels.results.hotel_card.reviews"
                        )}`
                      : ""}
                  </span>
                </div>
              )}
              
              {/* Rate Badges: Refundable, Free Cancellation, Free Breakfast */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {hotel.isRefundable && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("hotels.results.hotel_card.refundable") || "Refundable"}
                  </span>
                )}
                {hotel.freeCancellation && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t("hotels.results.hotel_card.free_cancellation") || "Free Cancellation"}
                  </span>
                )}
                {hotel.freeBreakfast && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("hotels.results.hotel_card.free_breakfast") || "Free Breakfast"}
                  </span>
                )}
              </div>
            </div>

            {/* Right column: Price and CTA */}
            <div className="w-full sm:w-60 flex-shrink-0 flex flex-col sm:flex-col justify-between sm:items-end items-start sm:min-h-[176px] gap-4 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-xl sm:rounded-none">
              <div className="text-left sm:text-right mb-2 sm:mb-0 w-full">
                <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                  {t("hotels.results.hotel_card.starting_from")}
                </div>
                {isPriceLoading ? (
                  <>
                    <div className="h-7 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-2 animate-pulse" />
                    <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
                  </>
                ) : (() => {
                  // Get rate details from hotel
                  const rateDetails = hotel.rateDetails || hotel.rate || {};
                  const totalPrice = rateDetails.total || hotel.price || 0;
                  const ratePerNight = rateDetails.ratePerNight || hotel.price || 0;
                  // Always use SAR currency, don't use currency from response
                  const currencyCode = "SAR";
                  
                  if (totalPrice > 0 || ratePerNight > 0) {
                    return (
                      <>
                        {/* Total Price */}
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 flex items-center gap-1">
                          {formatPrice(totalPrice)}
                          <span className="text-base">
                            {getCurrencyIcon(currencyCode)}
                          </span>
                        </div>
                        
                        {/* Price Calculation */}
                        {numberOfNights > 1 && ratePerNight > 0 && (
                          <div className="text-xs text-gray-600 font-medium mt-1 flex items-center gap-1">
                            {numberOfNights} {t("hotels.results.hotel_card.nights") || "nights"} × {formatPrice(ratePerNight)} {getCurrencyIcon(currencyCode)} = {formatPrice(totalPrice)} {getCurrencyIcon(currencyCode)}
                          </div>
                        )}
                        
                        {/* Per Night (if only 1 night or no calculation) */}
                        {numberOfNights === 1 && (
                          <div className="text-xs text-gray-600 font-medium mt-1">
                            {t("hotels.results.hotel_card.per_night")}
                          </div>
                        )}
                        
                        <div className="text-[10px] text-gray-500 mt-1">
                          {t("hotels.results.hotel_card.excl_tax") || "excl. tax"}
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <div className="text-sm font-semibold text-gray-600">
                        {t("hotels.results.hotel_card.price_not_available")}
                      </div>
                    );
                  }
                })()}
              </div>
              <div className="w-full mt-auto">
                <button
                  onClick={handleViewPlace}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-11 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {t("hotels.results.hotel_card.view_place")}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
