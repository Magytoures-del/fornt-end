"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { HiCheckBadge, HiStar } from "react-icons/hi2";

// Hotel brands data
const hotels = [
  {
    name: "Hilton Hotels",
    icon: "🏨",
    verified: true,
    rating: 4.7,
  },
  {
    name: "Marriott International",
    icon: "🏩",
    verified: true,
    rating: 4.6,
  },
  {
    name: "Hyatt Hotels",
    icon: "🏨",
    verified: true,
    rating: 4.5,
  },
  {
    name: "InterContinental",
    icon: "🏩",
    verified: true,
    rating: 4.8,
  },
  {
    name: "Radisson Hotels",
    icon: "🏨",
    verified: true,
    rating: 4.4,
  },
  {
    name: "Accor Hotels",
    icon: "🏩",
    verified: true,
    rating: 4.3,
  },
  {
    name: "Four Seasons",
    icon: "🏨",
    verified: true,
    rating: 4.9,
  },
];

export default function PartnersSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-700 text-sm font-semibold border border-green-200/50 mb-6">
            <HiCheckBadge className="w-4 h-4 text-green-500" />
            {t("hotels.partners.title")}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("hotels.partners.subtitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("hotels.partners.description")}
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 lg:gap-6">
          {hotels.map((hotel, index) => (
            <div
              key={hotel.name}
              className="group relative bg-white rounded-2xl p-4 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Verified badge */}
              {hotel.verified && (
                <div className="absolute -top-2 -right-2 z-0">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <HiCheckBadge className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Icon container */}
              <div className="flex flex-col items-center justify-between h-full space-y-3">
                <div className="flex items-center justify-center w-full h-16 mb-2">
                  <div className="text-5xl group-hover:scale-105 transition-transform duration-300">
                    {hotel.icon}
                  </div>
                </div>

                {/* Hotel name */}
                <h3 className="text-sm font-medium text-gray-800 text-center line-clamp-2 mb-1">
                  {hotel.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-600">
                    {hotel.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-600">
            {t("hotels.partners.footer_text")}
          </p>
        </div>
      </div>
    </section>
  );
}


