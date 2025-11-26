"use client";

import React from "react";
import {
  LuMapPin,
  LuNavigation,
  LuClock,
  LuCar,
  LuBus,
  LuPlane,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

export default function LocationSection({ hotel }) {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();

  // Use API data if available, otherwise use default
  const nearbyAttractions =
    hotel?.nearByAttractions && hotel.nearByAttractions.length > 0
      ? hotel.nearByAttractions.map((attraction) => ({
          name: attraction.name,
          distance: `${attraction.distance} ${
            attraction.unit || t("hotels.details.location.km")
          }`,
          walkTime:
            attraction.distance <= 2
              ? `${Math.round(attraction.distance * 12)} ${t(
                  "hotels.details.location.min_walk"
                )}`
              : `${Math.round(attraction.distance * 5)} ${t(
                  "hotels.details.location.min_drive"
                )}`,
          type:
            attraction.type ||
            (attraction.name.toLowerCase().includes("airport")
              ? t("hotels.details.location.airport")
              : t("hotels.details.location.attraction")),
        }))
      : [
          {
            name: "Taksim Square",
            distance: `0.5 ${t("hotels.details.location.km")}`,
            walkTime: `6 ${t("hotels.details.location.min_walk")}`,
            type: t("hotels.details.location.landmark"),
          },
          {
            name: "Istiklal Street",
            distance: `0.3 ${t("hotels.details.location.km")}`,
            walkTime: `4 ${t("hotels.details.location.min_walk")}`,
            type: t("hotels.details.location.shopping"),
          },
          {
            name: "Galata Tower",
            distance: `1.2 ${t("hotels.details.location.km")}`,
            walkTime: `15 ${t("hotels.details.location.min_walk")}`,
            type: t("hotels.details.location.historic_site"),
          },
        ];

  // Get address from contact.address
  const address = hotel?.contact?.address
    ? `${hotel.contact.address.line1 || ""}${
        hotel.contact.address.line2 ? ", " + hotel.contact.address.line2 : ""
      }, ${hotel.contact.address.city || ""}, ${
        hotel.contact.address.state || ""
      }, ${hotel.contact.address.postalCode || ""}, ${
        hotel.contact.address.country || ""
      }`
        .trim()
        .replace(/^,\s*|,\s*$/g, "")
    : "Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437, Turkey";

  const transportation = [
    {
      icon: <LuCar className="w-5 h-5" />,
      name: t("hotels.details.location.car_rental"),
      description: t("hotels.details.location.car_rental_desc"),
      time: `5 ${t("hotels.details.location.min_walk")}`,
    },
    {
      icon: <LuBus className="w-5 h-5" />,
      name: t("hotels.details.location.metro_station"),
      description: t("hotels.details.location.metro_station_desc"),
      time: `6 ${t("hotels.details.location.min_walk")}`,
    },
    {
      icon: <LuPlane className="w-5 h-5" />,
      name: t("hotels.details.location.airport"),
      description: "Istanbul Airport (IST)",
      time: `45 ${t("hotels.details.location.min_drive")}`,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
          {t("hotels.details.location.title")}
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          {t("hotels.details.location.subtitle")}
        </p>
      </div>

      <div className="p-6 md:p-8">
        {/* Address */}
        <div className="mb-10">
          <div className="flex items-start gap-4 mb-6 p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
            <div className="bg-blue-600 p-3 rounded-xl flex-shrink-0">
              <LuMapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {t("hotels.details.location.address")}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {address}
              </p>
              {hotel?.contact?.phones && hotel.contact.phones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {t("hotels.details.location.phone")}
                    </span>{" "}
                    {hotel.contact.phones[0]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Map */}
          {hotel?.geoCode?.lat && hotel?.geoCode?.long ? (
            <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg relative">
              <iframe
                src={`https://www.google.com/maps?q=${hotel.geoCode.lat},${hotel.geoCode.long}&hl=${currentLanguage}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={hotel?.name || hotel?.hotelName || t("hotels.details.location.interactive_map")}
                className="w-full h-full"
              />
              {/* Map overlay with link to open in Google Maps */}
              <a
                href={`https://www.google.com/maps?q=${hotel.geoCode.lat},${hotel.geoCode.long}&hl=${currentLanguage}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`absolute bottom-4 ${isRTL ? 'left-4' : 'right-4'} bg-white hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-lg shadow-lg font-semibold text-sm transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2 z-10`}
                aria-label={t("hotels.details.location.open_in_google_maps")}
              >
                <LuNavigation className="w-4 h-4" />
                {t("hotels.details.location.view_larger_map")}
              </a>
            </div>
          ) : (
            <div className="w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="bg-white p-4 rounded-full mb-4 inline-block shadow-lg">
                  <LuNavigation className="w-12 h-12 text-blue-600 mx-auto" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  {t("hotels.details.location.interactive_map")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t("hotels.details.location.map_coming_soon")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Transportation */}
        {/* <div className="mb-10">
          <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
            {t("hotels.details.location.transportation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {transportation.map((transport, index) => (
              <div
                key={index}
                className="group p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2.5 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <div className="text-blue-600 group-hover:text-white transition-colors">
                      {transport.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900">{transport.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                  {transport.description}
                </p>
                <p className="text-sm text-blue-600 font-semibold">
                  {transport.time}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Nearby Attractions */}
        <div>
          <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
            {t("hotels.details.location.nearby_attractions")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyAttractions.slice(0, 8).map((attraction, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1.5">
                    {attraction.name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {attraction.distance}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span>{attraction.walkTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    {attraction.type}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 hover:scale-110 transition-transform p-2">
                    <LuNavigation className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
