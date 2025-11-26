"use client";

import React, { useState } from "react";
import {
  LuWifi,
  LuCar,
  LuCoffee,
  LuDumbbell,
  LuWaves,
  LuUtensils,
  LuShield,
  LuClock,
  LuBed,
  LuWind,
  LuTv,
  LuBath,
  LuLock,
  LuPhone,
  LuPlane,
  LuGamepad2,
  LuMusic,
  LuShoppingBag,
  LuBuilding,
  LuSparkles,
  LuDroplet,
  LuSun,
  LuStethoscope,
  LuBaby,
  LuDog,
  LuWine,
  LuCigarette,
  LuBan,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";

export default function HotelInfoSection({ hotel }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  // Function to get the appropriate icon for a facility
  const getFacilityIcon = (facilityName) => {
    if (!facilityName) return <LuBed className="w-6 h-6" />;

    // Normalize facility name for matching
    const normalized = facilityName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Comprehensive icon mapping for hotel facilities
    const iconMap = {
      // Internet & Connectivity
      wifi: <LuWifi className="w-6 h-6" />,
      "wi-fi": <LuWifi className="w-6 h-6" />,
      internet: <LuWifi className="w-6 h-6" />,
      "wireless-internet": <LuWifi className="w-6 h-6" />,
      "free-wifi": <LuWifi className="w-6 h-6" />,
      "free-internet": <LuWifi className="w-6 h-6" />,

      // Parking
      parking: <LuCar className="w-6 h-6" />,
      "free-parking": <LuCar className="w-6 h-6" />,
      "paid-parking": <LuCar className="w-6 h-6" />,
      "valet-parking": <LuCar className="w-6 h-6" />,
      "parking-facilities": <LuCar className="w-6 h-6" />,

      // Food & Dining
      restaurant: <LuUtensils className="w-6 h-6" />,
      "breakfast": <LuCoffee className="w-6 h-6" />,
      "free-breakfast": <LuCoffee className="w-6 h-6" />,
      "continental-breakfast": <LuCoffee className="w-6 h-6" />,
      "buffet-breakfast": <LuCoffee className="w-6 h-6" />,
      "room-service": <LuUtensils className="w-6 h-6" />,
      bar: <LuWine className="w-6 h-6" />,
      "lounge-bar": <LuWine className="w-6 h-6" />,
      "pool-bar": <LuWine className="w-6 h-6" />,
      cafe: <LuCoffee className="w-6 h-6" />,
      "coffee-shop": <LuCoffee className="w-6 h-6" />,

      // Fitness & Recreation
      "fitness-center": <LuDumbbell className="w-6 h-6" />,
      gym: <LuDumbbell className="w-6 h-6" />,
      "fitness-facilities": <LuDumbbell className="w-6 h-6" />,
      "swimming-pool": <LuWaves className="w-6 h-6" />,
      pool: <LuWaves className="w-6 h-6" />,
      "outdoor-pool": <LuWaves className="w-6 h-6" />,
      "indoor-pool": <LuWaves className="w-6 h-6" />,
      "infinity-pool": <LuWaves className="w-6 h-6" />,
      spa: <LuSparkles className="w-6 h-6" />,
      "spa-center": <LuSparkles className="w-6 h-6" />,
      "wellness-center": <LuSparkles className="w-6 h-6" />,
      sauna: <LuDroplet className="w-6 h-6" />,
      "steam-room": <LuDroplet className="w-6 h-6" />,
      "hot-tub": <LuDroplet className="w-6 h-6" />,
      jacuzzi: <LuDroplet className="w-6 h-6" />,
      "game-room": <LuGamepad2 className="w-6 h-6" />,
      "entertainment": <LuGamepad2 className="w-6 h-6" />,
      "kids-club": <LuBaby className="w-6 h-6" />,
      "children-playground": <LuBaby className="w-6 h-6" />,

      // Services
      "front-desk": <LuClock className="w-6 h-6" />,
      "24-hour-front-desk": <LuClock className="w-6 h-6" />,
      "24hr-front-desk": <LuClock className="w-6 h-6" />,
      "concierge": <LuClock className="w-6 h-6" />,
      "security": <LuShield className="w-6 h-6" />,
      "24-7-security": <LuShield className="w-6 h-6" />,
      "24-hour-security": <LuShield className="w-6 h-6" />,
      "laundry": <LuSparkles className="w-6 h-6" />,
      "dry-cleaning": <LuSparkles className="w-6 h-6" />,
      "luggage-storage": <LuLock className="w-6 h-6" />,
      "baggage-storage": <LuLock className="w-6 h-6" />,
      "airport-shuttle": <LuPlane className="w-6 h-6" />,
      "shuttle-service": <LuCar className="w-6 h-6" />,
      "transfer-service": <LuCar className="w-6 h-6" />,
      "business-center": <LuBuilding className="w-6 h-6" />,
      "meeting-rooms": <LuBuilding className="w-6 h-6" />,
      "conference-facilities": <LuBuilding className="w-6 h-6" />,

      // Room Amenities
      "air-conditioning": <LuWind className="w-6 h-6" />,
      "air-conditioner": <LuWind className="w-6 h-6" />,
      ac: <LuWind className="w-6 h-6" />,
      heating: <LuSun className="w-6 h-6" />,
      "room-heating": <LuSun className="w-6 h-6" />,
      "safe-deposit-box": <LuLock className="w-6 h-6" />,
      safe: <LuLock className="w-6 h-6" />,
      "tv": <LuTv className="w-6 h-6" />,
      television: <LuTv className="w-6 h-6" />,
      "flat-screen-tv": <LuTv className="w-6 h-6" />,
      "private-bathroom": <LuBath className="w-6 h-6" />,
      bathroom: <LuBath className="w-6 h-6" />,
      "room-service": <LuPhone className="w-6 h-6" />,

      // Additional Facilities
      "elevator": <LuBuilding className="w-6 h-6" />,
      lift: <LuBuilding className="w-6 h-6" />,
      "shopping": <LuShoppingBag className="w-6 h-6" />,
      "gift-shop": <LuShoppingBag className="w-6 h-6" />,
      "souvenir-shop": <LuShoppingBag className="w-6 h-6" />,
      "atm": <LuLock className="w-6 h-6" />,
      "currency-exchange": <LuLock className="w-6 h-6" />,
      "tour-desk": <LuClock className="w-6 h-6" />,
      "travel-desk": <LuClock className="w-6 h-6" />,
      "library": <LuBuilding className="w-6 h-6" />,
      "reading-room": <LuBuilding className="w-6 h-6" />,
      "music-room": <LuMusic className="w-6 h-6" />,
      "karaoke": <LuMusic className="w-6 h-6" />,
      "beach-access": <LuWaves className="w-6 h-6" />,
      "beachfront": <LuWaves className="w-6 h-6" />,
      "garden": <LuSun className="w-6 h-6" />,
      "terrace": <LuSun className="w-6 h-6" />,
      "balcony": <LuSun className="w-6 h-6" />,
      "smoking-area": <LuCigarette className="w-6 h-6" />,
      "non-smoking": <LuBan className="w-6 h-6" />,
      "non-smoking-rooms": <LuBan className="w-6 h-6" />,
      "pet-friendly": <LuDog className="w-6 h-6" />,
      "pets-allowed": <LuDog className="w-6 h-6" />,
      "wheelchair-accessible": <LuBuilding className="w-6 h-6" />,
      "accessible-facilities": <LuBuilding className="w-6 h-6" />,
      "medical-services": <LuStethoscope className="w-6 h-6" />,
      "first-aid": <LuStethoscope className="w-6 h-6" />,
      "babysitting": <LuBaby className="w-6 h-6" />,
      "childcare": <LuBaby className="w-6 h-6" />,
    };

    // Try exact match first
    if (iconMap[normalized]) {
      return iconMap[normalized];
    }

    // Try partial matching
    for (const key in iconMap) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return iconMap[key];
      }
    }

    // Default icon
    return <LuBed className="w-6 h-6" />;
  };

  const amenities = [
    {
      icon: <LuWifi className="w-5 h-5" />,
      name: "Free WiFi",
      description: "High-speed internet throughout the hotel",
    },
    {
      icon: <LuCar className="w-5 h-5" />,
      name: "Free Parking",
      description: "Complimentary parking for guests",
    },
    {
      icon: <LuCoffee className="w-5 h-5" />,
      name: "Free Breakfast",
      description: "Complimentary breakfast included",
    },
    {
      icon: <LuDumbbell className="w-5 h-5" />,
      name: "Fitness Center",
      description: "24/7 fitness center with modern equipment",
    },
    {
      icon: <LuWaves className="w-5 h-5" />,
      name: "Swimming Pool",
      description: "Outdoor pool with city views",
    },
    {
      icon: <LuUtensils className="w-5 h-5" />,
      name: "Restaurant",
      description: "Fine dining restaurant on-site",
    },
    {
      icon: <LuShield className="w-5 h-5" />,
      name: "24/7 Security",
      description: "Round-the-clock security service",
    },
    {
      icon: <LuClock className="w-5 h-5" />,
      name: "24hr Front Desk",
      description: "24-hour front desk service",
    },
  ];

  const tabs = [
    { id: "overview", label: t("hotels.details.info.tabs.overview") },
    { id: "amenities", label: t("hotels.details.info.tabs.amenities") },
    { id: "policies", label: t("hotels.details.info.tabs.policies") },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-8 py-5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 bg-white"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8 lg:p-10">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {hotel?.descriptions && hotel.descriptions.length > 0 && (
              <>
                {hotel.descriptions
                  .filter(
                    (desc) =>
                      desc.type === "headline" || desc.type === "location"
                  )
                  .map((desc, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                        {desc.type === "headline"
                          ? t("hotels.details.info.overview.about_hotel") ||
                            t("hotels.details.info.overview.about")
                          : t("hotels.details.info.overview.location")}
                      </h3>
                      <div
                        className="text-gray-600 leading-relaxed prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: desc.text }}
                      />
                    </div>
                  ))}

                {hotel.descriptions
                  .filter(
                    (desc) => desc.type === "dining" || desc.type === "rooms"
                  )
                  .map((desc, index) => (
                    <div
                      key={index}
                      className="space-y-3 bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-xl border border-blue-100"
                    >
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                        {desc.type === "dining"
                          ? t("hotels.details.info.overview.dining")
                          : t("hotels.details.info.overview.rooms")}
                      </h3>
                      <div
                        className="text-gray-600 leading-relaxed prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: desc.text }}
                      />
                    </div>
                  ))}
              </>
            )}

            {!hotel?.descriptions && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {t("hotels.details.info.overview.about_hotel")}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {hotel?.name ||
                    t("hotels.details.info.overview.hotel_info_not_available")}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "amenities" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
              {t("hotels.details.info.overview.hotel_amenities")}
            </h3>
            {hotel?.facilities && hotel.facilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotel.facilities.map((facility, index) => (
                  <div
                    key={facility.id || index}
                    className="group flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {getFacilityIcon(facility.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {facility.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-1">
                      {amenity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {amenity.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "policies" && (
          <div className="space-y-8">
            {(hotel?.checkinInfo || hotel?.checkoutInfo) && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                  {t("hotels.details.info.policies.checkin_checkout")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hotel.checkinInfo && (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {t("hotels.details.info.policies.checkin")}
                      </h4>
                      <p className="text-gray-700 text-lg font-medium">
                        {hotel.checkinInfo.beginTime ||
                          t("hotels.details.info.policies.not_available")}
                        {hotel.checkinInfo.endTime &&
                        hotel.checkinInfo.endTime !== "anytime"
                          ? ` - ${hotel.checkinInfo.endTime}`
                          : hotel.checkinInfo.endTime === "anytime"
                          ? ` - ${t("hotels.details.info.policies.anytime")}`
                          : ""}
                      </p>
                      {hotel.checkinInfo.minAge && (
                        <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                          <span className="font-semibold">
                            {t("hotels.details.info.policies.minimum_age")}
                          </span>{" "}
                          {hotel.checkinInfo.minAge}
                        </p>
                      )}
                    </div>
                  )}
                  {hotel.checkoutInfo && (
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">
                        {t("hotels.details.info.policies.checkout")}
                      </h4>
                      <p className="text-gray-700 text-lg font-medium">
                        {hotel.checkoutInfo.time ||
                          t("hotels.details.info.policies.not_available")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hotel?.policies && hotel.policies.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-full"></span>
                  {t("hotels.details.info.policies.important_information")}
                </h3>
                {hotel.policies.map((policy, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl mb-4 shadow-sm"
                  >
                    <div
                      className="text-yellow-900 prose prose-yellow max-w-none"
                      dangerouslySetInnerHTML={{ __html: policy.text }}
                    />
                  </div>
                ))}
              </div>
            )}

            {hotel?.fees && hotel.fees.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full"></span>
                  {t("hotels.details.info.policies.fees_charges")}
                </h3>
                {hotel.fees.map((fee, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl mb-4 shadow-sm"
                  >
                    <div
                      className="text-gray-700 prose prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ __html: fee.text }}
                    />
                  </div>
                ))}
              </div>
            )}

            {hotel?.descriptions?.find((d) => d.type === "onsite_payments") && (
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                  {t("hotels.details.info.policies.accepted_payment_methods")}
                </h3>
                <p className="text-gray-700 font-medium">
                  {hotel.descriptions.find((d) => d.type === "onsite_payments")
                    ?.text ||
                    t(
                      "hotels.details.info.policies.payment_methods_not_available"
                    )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
