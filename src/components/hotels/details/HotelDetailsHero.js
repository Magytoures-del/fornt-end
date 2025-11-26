"use client";

import React, { useState } from "react";
import {
  LuMapPin,
  LuStar,
  LuHeart,
  LuShare2,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";

// Placeholder image as SVG data URI
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23f3f4f6' width='300' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function HotelDetailsHero({ hotel: hotelProp }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const defaultHotel = {
    name: "CVK Park Bosphorus Hotel Istanbul",
    location: "Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437",
    rating: 5,
    reviewScore: 4.2,
    reviewCount: 371,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop",
    ],
  };

  // Use prop data if available, otherwise use default
  const hotel = hotelProp || defaultHotel;

  // Handle images: use images array from API (prefer primary/room images), fallback to heroImage, then default
  const hotelImages =
    hotelProp?.images &&
    Array.isArray(hotelProp.images) &&
    hotelProp.images.length > 0
      ? hotelProp.images
          .filter((img) => img && img.url) // Filter out invalid images
          .map((img) => img.url) // Extract URL
      : hotelProp?.heroImage
      ? [hotelProp.heroImage]
      : hotel.images;

  // Get hotel name
  const hotelName = hotelProp?.name || hotel.name;

  // Get location from contact.address
  const hotelLocation = hotelProp?.contact?.address
    ? `${hotelProp.contact.address.line1 || ""}${
        hotelProp.contact.address.line2
          ? ", " + hotelProp.contact.address.line2
          : ""
      }, ${hotelProp.contact.address.city || ""}, ${
        hotelProp.contact.address.country || ""
      }`.trim()
    : hotelProp?.location || hotel.location;

  // Get rating (starRating in API)
  const hotelRating =
    hotelProp?.starRating || hotelProp?.rating || hotel.rating;

  // Get review score and count from reviews array
  const reviewData =
    hotelProp?.reviews && hotelProp.reviews.length > 0
      ? hotelProp.reviews[0]
      : null;
  const reviewScore =
    reviewData?.rating || hotelProp?.reviewScore || hotel.reviewScore;
  const reviewCount =
    reviewData?.count || hotelProp?.reviewCount || hotel.reviewCount;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + hotelImages.length) % hotelImages.length
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <LuStar
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="relative bg-white">
      {/* Main Image */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group">
        <img
          src={hotelImages[currentImageIndex] || PLACEHOLDER_IMAGE}
          alt={hotelName || t("hotels.details.hero.hotel")}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100 z-10"
          aria-label="Previous image"
        >
          <LuChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100 z-10"
          aria-label="Next image"
        >
          <LuChevronRight className="w-6 h-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-20 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          {currentImageIndex + 1} / {hotelImages.length}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-full transition-all shadow-lg backdrop-blur-sm ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600 scale-110"
                : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
            }`}
            aria-label="Add to favorites"
          >
            <LuHeart
              className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>
          <button
            className="bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg backdrop-blur-sm"
            aria-label="Share"
          >
            <LuShare2 className="w-5 h-5" />
          </button>
        </div>

        {/* Hotel Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {hotelName}
            </h1>

            {hotelLocation && (
              <div className="flex items-center gap-2 text-white/95 mb-4 text-lg">
                <LuMapPin className="w-5 h-5 flex-shrink-0" />
                <span className="drop-shadow">{hotelLocation}</span>
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {hotelRating !== undefined &&
                hotelRating !== null &&
                hotelRating > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="flex items-center gap-1">
                      {renderStars(hotelRating)}
                    </div>
                    <span className="text-white font-semibold text-lg">
                      {hotelRating} {t("hotels.details.hero.star_hotel")}
                    </span>
                  </div>
                )}

              {(reviewScore || reviewCount) && (
                <div className="bg-blue-600/90 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {reviewScore?.toFixed(1) || 0}
                  </span>
                  <span className="text-white/90 ml-2 text-sm">
                    {t("hotels.details.hero.very_good")}
                  </span>
                  <span className="text-white/80 ml-3 text-sm">
                    ({reviewCount || 0} {t("hotels.details.hero.reviews")})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {hotelImages.length > 1 && (
        <div className="bg-gradient-to-b from-white to-gray-50 py-6 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {hotelImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 relative w-24 h-20 md:w-28 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 transform ${
                    currentImageIndex === index
                      ? "border-blue-600 ring-4 ring-blue-200 scale-105 shadow-lg"
                      : "border-gray-300 hover:border-blue-400 hover:scale-105 shadow-md"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image || PLACEHOLDER_IMAGE}
                    alt={`Hotel view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-blue-600/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
