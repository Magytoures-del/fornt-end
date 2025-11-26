"use client";

import React, { useState, useEffect } from "react";
import {
  LuUsers,
  LuBed,
  LuWifi,
  LuEye,
  LuWind,
  LuShirt,
  LuLaptop,
  LuDroplet,
  LuSparkles,
  LuBeer,
  LuBath,
  LuLock,
  LuFootprints,
  LuVolume2,
  LuCoffee,
  LuPhone,
  LuDroplets,
  LuTv,
  LuPackage,
  LuTag,
  LuPercent,
  LuShield,
  LuBadgePercent,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { localizeNumber } from "@/utils/numberLocalization";
import { useRouter } from "next/navigation";
import axios from "axios";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

export default function RoomSelection({ hotel, searchId, hotelId, searchTracingKey }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roomsToShow, setRoomsToShow] = useState(5); // Show 5 rooms initially
  const ROOMS_PER_PAGE = 5; // Number of rooms to load per click

  const defaultRooms = [];

  useEffect(() => {
    const fetchRooms = async () => {
      if (!searchId || !hotelId) {
        // Use default rooms if searchId or hotelId is not available
        setRooms(defaultRooms);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `/api/hotels/details/${searchId}/${hotelId}/rooms`
        );

        console.log("Hotel rooms response:", response.data);

        if (response.data.success) {
          const responseData = response.data.data;

          // Extract recommendations and stayPeriod from nested structure
          let recommendations = null;
          let stayPeriod = null;
          let numberOfNights = 1; // Default to 1 night if cannot be determined

          if (responseData?.success && responseData?.data) {
            recommendations = responseData.data.recommendations;
            stayPeriod = responseData.data.stayPeriod;
          } else if (responseData?.data?.recommendations) {
            recommendations = responseData.data.recommendations;
            stayPeriod = responseData.data.stayPeriod;
          } else if (responseData?.recommendations) {
            recommendations = responseData.recommendations;
            stayPeriod = responseData.stayPeriod;
          } else if (
            responseData?.success &&
            responseData?.data &&
            Array.isArray(responseData.data)
          ) {
            recommendations = responseData.data;
          }

          // Calculate number of nights from stayPeriod
          if (stayPeriod?.start && stayPeriod?.end) {
            try {
              const startDate = new Date(stayPeriod.start);
              const endDate = new Date(stayPeriod.end);
              const diffTime = Math.abs(endDate - startDate);
              numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (numberOfNights < 1) numberOfNights = 1;
            } catch (e) {
              console.warn("Could not parse stayPeriod dates", e);
            }
          }

          // Transform recommendations and roomGroups to flat room list
          if (Array.isArray(recommendations) && recommendations.length > 0) {
            const transformedRooms = [];
            let roomIndex = 0;

            recommendations.forEach((recommendation) => {
              if (
                recommendation.roomGroup &&
                Array.isArray(recommendation.roomGroup)
              ) {
                recommendation.roomGroup.forEach((roomGroupItem) => {
                  const roomData = roomGroupItem.room || {};

                  // Extract bed information
                  let bedType = t("hotels.details.rooms.not_available_short");
                  if (
                    roomData.beds &&
                    Array.isArray(roomData.beds) &&
                    roomData.beds.length > 0
                  ) {
                    const beds = roomData.beds
                      .map((bed) => bed.type || bed.description || "")
                      .filter(Boolean)
                      .join(", ");
                    bedType =
                      beds ||
                      `${roomData.beds.length} ${t(
                        "hotels.details.rooms.beds"
                      )}`;
                  }

                  // Extract facilities/amenities
                  const facilities = roomData.facilities || [];
                  const amenities = facilities.map((facility) => {
                    if (typeof facility === "string") return facility;
                    return (
                      facility.name ||
                      facility.title ||
                      t("hotels.details.rooms.facility")
                    );
                  });

                  // Extract images
                  const images = [];
                  if (roomData.images && Array.isArray(roomData.images)) {
                    roomData.images.forEach((img) => {
                      if (typeof img === "string") {
                        images.push(img);
                      } else if (img.url) {
                        images.push(img.url);
                      }
                    });
                  }

                  // Calculate total price - prioritize recommendation.total, then roomGroupItem.totalRate
                  let totalPrice = 0;
                  if (recommendation.total && recommendation.total > 0) {
                    totalPrice = Math.round(recommendation.total * 100) / 100;
                  } else if (roomGroupItem.totalRate && roomGroupItem.totalRate > 0) {
                    totalPrice = Math.round(roomGroupItem.totalRate * 100) / 100;
                  } else if (roomGroupItem.baseRate && roomGroupItem.baseRate > 0) {
                    totalPrice = Math.round(roomGroupItem.baseRate * 100) / 100;
                  }

                  // Calculate price per night - use ratePerNight if available, otherwise calculate from totalRate
                  let price = 0;
                  // Use dailyRates if available (average per night)
                  if (
                    roomGroupItem.dailyRates &&
                    Array.isArray(roomGroupItem.dailyRates) &&
                    roomGroupItem.dailyRates.length > 0
                  ) {
                    const dailyRatesSum = roomGroupItem.dailyRates.reduce(
                      (sum, rate) => sum + (rate.amount || 0),
                      0
                    );
                    price =
                      Math.round(
                        (dailyRatesSum / roomGroupItem.dailyRates.length) * 100
                      ) / 100;
                  } else if (roomGroupItem.ratePerNight) {
                    price = Math.round(roomGroupItem.ratePerNight * 100) / 100;
                  } else if (totalPrice > 0 && numberOfNights > 0) {
                    price =
                      Math.round(
                        (totalPrice / numberOfNights) * 100
                      ) / 100;
                  }

                  // If totalPrice wasn't set but we have price per night, calculate it
                  if (totalPrice === 0 && price > 0 && numberOfNights > 0) {
                    totalPrice = Math.round(price * numberOfNights * 100) / 100;
                  }

                  // Original price (published rate) - total
                  let originalTotalPrice = null;
                  if (
                    recommendation.publishedRate &&
                    recommendation.publishedRate > totalPrice
                  ) {
                    originalTotalPrice = Math.round(recommendation.publishedRate * 100) / 100;
                  } else if (
                    roomGroupItem.publishedRate &&
                    roomGroupItem.publishedRate > totalPrice
                  ) {
                    originalTotalPrice = Math.round(roomGroupItem.publishedRate * 100) / 100;
                  }

                  // Original price per night (for display)
                  let originalPrice = null;
                  if (originalTotalPrice && numberOfNights > 0) {
                    originalPrice =
                      Math.round(
                        (originalTotalPrice / numberOfNights) * 100
                      ) / 100;
                  }

                  // Determine availability
                  const available =
                    roomGroupItem.availability !== undefined
                      ? roomGroupItem.availability > 0
                      : true;

                  // Extract max guests from occupancies
                  let maxGuests = 2;
                  if (
                    roomGroupItem.occupancies &&
                    Array.isArray(roomGroupItem.occupancies) &&
                    roomGroupItem.occupancies.length > 0
                  ) {
                    const occupancy = roomGroupItem.occupancies[0];
                    maxGuests =
                      (occupancy.numOfAdults || 1) +
                      (occupancy.numOfChildren || 0);
                  } else if (roomData.maxGuestAllowed) {
                    maxGuests = roomData.maxGuestAllowed;
                  } else if (roomData.maxAdultAllowed) {
                    maxGuests = roomData.maxAdultAllowed;
                  }

                  // Calculate savings percentage
                  let savingsPercentage = 0;
                  if (originalTotalPrice && totalPrice && originalTotalPrice > totalPrice) {
                    savingsPercentage = Math.round(
                      ((originalTotalPrice - totalPrice) / originalTotalPrice) * 100
                    );
                  }

                  // Extract offers
                  const offers = roomGroupItem.offers || [];
                  const validOffers = offers.filter(
                    (offer) =>
                      offer &&
                      (offer.discountOffer !== 0 ||
                        offer.percentageDiscountOffer !== 0 ||
                        offer.stayOffer)
                  );

                  // Determine if it's a package rate
                  const isPackageRate = roomGroupItem.isPackageRate || false;

                  transformedRooms.push({
                    id:
                      roomGroupItem.id || roomData.id || `room-${++roomIndex}`,
                    name:
                      roomData.name ||
                      roomData.standardRoomName ||
                      `${t("hotels.details.rooms.room_prefix")} ${++roomIndex}`,
                    description: roomData.description || "",
                    maxGuests: maxGuests,
                    bedType: bedType,
                    size:
                      roomData.area ||
                      `${Math.floor(Math.random() * 30 + 25)} ${t(
                        "hotels.details.rooms.sq_m"
                      )}`,
                    amenities:
                      amenities.length > 0
                        ? amenities
                        : [t("hotels.details.rooms.standard_amenities")],
                    price: price || 0,
                    totalPrice: totalPrice || 0,
                    numberOfNights: numberOfNights,
                    originalPrice: originalPrice,
                    originalTotalPrice: originalTotalPrice,
                    savingsPercentage: savingsPercentage,
                    images: images,
                    available: available,
                    boardBasis:
                      roomGroupItem.boardBasis?.description ||
                      roomGroupItem.boardBasis?.type ||
                      null,
                    refundable: roomGroupItem.refundable || false,
                    refundability: roomGroupItem.refundability || null,
                    isPackageRate: isPackageRate,
                    offers: validOffers,
                    // Store additional info for future use
                    _raw: {
                      roomGroupItem: roomGroupItem,
                      recommendation: recommendation,
                    },
                  });
                });
              }
            });

            if (transformedRooms.length > 0) {
              setRooms(transformedRooms);
              setRoomsToShow(5); // Reset to initial display count
            } else {
              setRooms(defaultRooms);
              setRoomsToShow(5);
            }
          } else {
            // No recommendations found, use default
            setRooms(defaultRooms);
            setRoomsToShow(5);
          }
        } else {
          setError(
            response.data.error || t("hotels.details.rooms.failed_to_fetch")
          );
          setRooms(defaultRooms);
          setRoomsToShow(5);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError(
          err?.response?.data?.error ||
            err?.message ||
            t("hotels.details.rooms.failed_to_fetch")
        );
        // Use default rooms on error
        setRooms(defaultRooms);
        setRoomsToShow(5);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId, hotelId]);

  const getAmenityIcon = (amenity) => {
    // Normalize amenity name for matching
    const normalizedAmenity = (
      typeof amenity === "string"
        ? amenity
        : amenity.name || amenity.title || ""
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Map amenities to icons with responsive sizing
    const iconMap = {
      "air-conditioning": <LuWind className="w-4 h-4 sm:w-5 sm:h-5" />,
      airconditioning: <LuWind className="w-4 h-4 sm:w-5 sm:h-5" />,
      ac: <LuWind className="w-4 h-4 sm:w-5 sm:h-5" />,
      bathrobe: <LuShirt className="w-4 h-4 sm:w-5 sm:h-5" />,
      desk: <LuLaptop className="w-4 h-4 sm:w-5 sm:h-5" />,
      hairdryer: <LuDroplet className="w-4 h-4 sm:w-5 sm:h-5" />,
      "hair-dryer": <LuDroplet className="w-4 h-4 sm:w-5 sm:h-5" />,
      iron: <LuSparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
      ironing: <LuSparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
      "iron-board": <LuSparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
      "mini-bar": <LuBeer className="w-4 h-4 sm:w-5 sm:h-5" />,
      minibar: <LuBeer className="w-4 h-4 sm:w-5 sm:h-5" />,
      "private-bathroom": <LuBath className="w-4 h-4 sm:w-5 sm:h-5" />,
      bathroom: <LuBath className="w-4 h-4 sm:w-5 sm:h-5" />,
      safe: <LuLock className="w-4 h-4 sm:w-5 sm:h-5" />,
      slippers: <LuFootprints className="w-4 h-4 sm:w-5 sm:h-5" />,
      shoe: <LuFootprints className="w-4 h-4 sm:w-5 sm:h-5" />,
      soundproofing: <LuVolume2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      "sound-proof": <LuVolume2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      tea: <LuCoffee className="w-4 h-4 sm:w-5 sm:h-5" />,
      "tea-or-coffee": <LuCoffee className="w-4 h-4 sm:w-5 sm:h-5" />,
      "tea-coffee": <LuCoffee className="w-4 h-4 sm:w-5 sm:h-5" />,
      coffee: <LuCoffee className="w-4 h-4 sm:w-5 sm:h-5" />,
      telephone: <LuPhone className="w-4 h-4 sm:w-5 sm:h-5" />,
      phone: <LuPhone className="w-4 h-4 sm:w-5 sm:h-5" />,
      toiletries: <LuDroplets className="w-4 h-4 sm:w-5 sm:h-5" />,
      towels: <LuDroplets className="w-4 h-4 sm:w-5 sm:h-5" />,
      towel: <LuDroplets className="w-4 h-4 sm:w-5 sm:h-5" />,
      tv: <LuTv className="w-4 h-4 sm:w-5 sm:h-5" />,
      television: <LuTv className="w-4 h-4 sm:w-5 sm:h-5" />,
      wardrobe: <LuPackage className="w-4 h-4 sm:w-5 sm:h-5" />,
      closet: <LuPackage className="w-4 h-4 sm:w-5 sm:h-5" />,
      water: <LuDroplet className="w-4 h-4 sm:w-5 sm:h-5" />,
      "wi-fi": <LuWifi className="w-4 h-4 sm:w-5 sm:h-5" />,
      wifi: <LuWifi className="w-4 h-4 sm:w-5 sm:h-5" />,
      "wireless-internet": <LuWifi className="w-4 h-4 sm:w-5 sm:h-5" />,
      internet: <LuWifi className="w-4 h-4 sm:w-5 sm:h-5" />,
    };

    // Try exact match first
    if (iconMap[normalizedAmenity]) {
      return iconMap[normalizedAmenity];
    }

    // Try partial matching
    for (const key in iconMap) {
      if (normalizedAmenity.includes(key) || key.includes(normalizedAmenity)) {
        return iconMap[key];
      }
    }

    // Default icon
    return <LuBed className="w-4 h-4 sm:w-5 sm:h-5" />;
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50/30 to-white">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
          {t("hotels.details.rooms.title")}
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base md:text-lg">
          {t("hotels.details.rooms.subtitle")}
        </p>
      </div>

      {/* Loading State - Skeleton Cards */}
      {isLoading && (
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="p-4 sm:p-6 md:p-8">
                {/* Savings Badge Skeleton */}
                <div className="absolute top-4 ltr:right-4 rtl:left-4 h-10 w-24 bg-gray-200 rounded-lg"></div>

                {/* Header Section Skeleton */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                  <div className="flex-1 min-w-0 ltr:pr-16 rtl:pl-16">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="h-6 sm:h-7 bg-gray-200 rounded-lg w-1/2"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-24"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-28"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Offers Section Skeleton */}
                <div className="mb-4 sm:mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="h-4 bg-amber-200 rounded w-32 mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-white border border-amber-300 rounded-lg w-28"></div>
                    <div className="h-8 bg-white border border-amber-300 rounded-lg w-32"></div>
                  </div>
                </div>

                {/* Room Info Badges Skeleton */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 flex-wrap">
                  <div className="h-8 sm:h-9 bg-blue-100 rounded-lg sm:rounded-xl w-24"></div>
                  <div className="h-8 sm:h-9 bg-purple-100 rounded-lg sm:rounded-xl w-32"></div>
                  <div className="h-8 sm:h-9 bg-green-100 rounded-lg sm:rounded-xl w-20"></div>
                  <div className="h-8 sm:h-9 bg-amber-100 rounded-lg sm:rounded-xl w-28"></div>
                </div>

                {/* Amenities Grid Skeleton */}
                <div className="mb-4 sm:mb-6">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 mb-2 sm:mb-3"></div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1 sm:gap-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-3"
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Actions Skeleton */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 sm:pt-5 border-t-2 border-gray-200">
                  <div className="flex-1 min-w-0">
                    <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                    <div className="h-10 sm:h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-green-100 rounded w-36 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </div>
                  <div className="h-12 sm:h-14 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg sm:rounded-xl w-full sm:w-48"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-4 sm:p-6 mx-4 sm:mx-6 mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Rooms List */}
      {!isLoading && (
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {rooms.slice(0, roomsToShow).map((room) => (
            <div
              key={room.id}
              className={`relative bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${
                selectedRoom === room.id
                  ? "border-blue-600 ring-2 sm:ring-4 ring-blue-200 shadow-xl sm:scale-[1.01] md:scale-[1.02]"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-lg"
              } ${!room.available ? "opacity-60" : ""}`}
            >
              <div className="p-4 sm:p-6 md:p-8">
                {/* Savings Badge - Top Corner (RTL/LTR aware) */}
                {room.savingsPercentage > 0 && (
                  <div className="absolute top-4 ltr:right-4 rtl:left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg transform ltr:rotate-1 rtl:-rotate-1 hover:rotate-0 transition-transform z-10">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <LuBadgePercent className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-bold">
                        {room.savingsPercentage}% {t("hotels.details.rooms.off_badge")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                  <div className="flex-1 min-w-0 ltr:pr-16 rtl:pl-16">
                    <div className="flex flex-col gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                          {room.name}
                        </h3>
                        {!room.available && (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                            {t("hotels.details.rooms.not_available")}
                          </span>
                        )}
                        {room.isPackageRate && (
                          <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                            <LuTag className="w-3 h-3" />
                            {t("hotels.details.rooms.package_deal")}
                          </span>
                        )}
                      </div>
                    </div>
                    {room.description && (
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {room.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Offers Section */}
                {room.offers && room.offers.length > 0 && (
                  <div className="mb-4 sm:mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h4 className="text-xs sm:text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <LuTag className="w-4 h-4 text-amber-600" />
                      {t("hotels.details.rooms.special_offers_applied")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {room.offers.map((offer, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-amber-300 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2"
                        >
                          <div className="flex items-center gap-1.5">
                            {offer.discountOffer && offer.discountOffer !== 0 && (
                              <>
                                <LuPercent className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-semibold text-amber-900">
                                  {offer.description || offer.title}
                                </span>
                              </>
                            )}
                            {offer.percentageDiscountOffer && offer.percentageDiscountOffer !== 0 && (
                              <>
                                <LuPercent className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-semibold text-amber-900">
                                  {offer.percentageDiscountOffer}% {offer.description || offer.title}
                                </span>
                              </>
                            )}
                            {offer.stayOffer && (
                              <>
                                <LuShield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-semibold text-amber-900">
                                  {offer.description || offer.title}
                                </span>
                              </>
                            )}
                            {!offer.discountOffer &&
                              !offer.percentageDiscountOffer &&
                              !offer.stayOffer && (
                                <>
                                  <LuTag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm font-semibold text-amber-900">
                                    {offer.description || offer.title || t("hotels.details.rooms.special_offer")}
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Room Info Badges */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 text-blue-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                    <LuUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                      {room.maxGuests} {t("hotels.details.rooms.guests")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-purple-50 text-purple-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                    <LuBed className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold line-clamp-1">
                      {room.bedType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-green-50 text-green-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded flex-shrink-0"></span>
                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{room.size}</span>
                  </div>
                  {room.boardBasis && (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 text-amber-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                      <span className="text-xs sm:text-sm font-semibold line-clamp-1">
                        {room.boardBasis}
                      </span>
                    </div>
                  )}
                  {room.refundable && (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 text-emerald-700 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                      <span className="text-[10px] sm:text-xs font-semibold line-clamp-1">
                        {room.refundability ||
                          t("hotels.details.rooms.refundable")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Amenities Grid */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                      {t("hotels.details.rooms.amenities")}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                      {room.amenities.map((amenity, index) => {
                        const amenityName =
                          typeof amenity === "string"
                            ? amenity
                            : amenity.name || amenity.title || t("hotels.details.rooms.facility");
                        // Format amenity name for display
                        const displayName = amenityName
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());

                        return (
                          <div
                            key={index}
                            className="group flex flex-col items-center gap-1 sm:gap-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-3 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                            title={displayName}
                          >
                            <div className="text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-transform">
                              {getAmenityIcon(amenityName)}
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-gray-700 text-center font-medium leading-tight line-clamp-2">
                              {displayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price and Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 sm:pt-5 border-t-2 border-gray-200">
                  <div className="flex-1 min-w-0">
                    {/* Original Price with Strikethrough */}
                    {room.originalTotalPrice &&
                      room.originalTotalPrice > room.totalPrice && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm sm:text-base text-gray-400 line-through font-medium flex items-center gap-1">
                            <SARCurrencyIcon className="w-3 h-3" />
                            {localizeNumber(room.originalTotalPrice, i18n?.language || "en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          {room.savingsPercentage > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                              {t("hotels.details.rooms.save_percentage", { percentage: room.savingsPercentage })}
                            </span>
                          )}
                        </div>
                      )}
                    
                    {/* Total Price - Main Display */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-1 flex-wrap">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                          {room.totalPrice > 0
                            ? `${localizeNumber(room.totalPrice, i18n?.language || "en", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : room.price > 0
                            ? `${localizeNumber(room.price, i18n?.language || "en", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : t("hotels.details.rooms.price_on_request")}
                        </span>
                        {(room.totalPrice > 0 || room.price > 0) && (
                          <SARCurrencyIcon className="text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      {room.totalPrice > 0 && (
                        <span className="text-sm text-gray-500 font-medium">
                          {t("hotels.details.rooms.total")}
                        </span>
                      )}
                    </div>
                    
                    {/* Price Breakdown */}
                    {room.totalPrice > 0 && room.numberOfNights > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          {room.numberOfNights} {room.numberOfNights === 1 
                            ? t("hotels.details.rooms.night")
                            : t("hotels.details.rooms.nights")}
                          {room.price > 0 && (
                            <>
                              {" × "}
                              <span className="font-semibold text-gray-700 flex items-center gap-1">
                                <SARCurrencyIcon className="w-3 h-3" /> {localizeNumber(room.price, i18n?.language || "en", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              {" "}
                              {t("hotels.details.rooms.per_night_rate")}
                            </>
                          )}
                        </p>
                      </div>
                    )}
                    
                    {/* Savings Display */}
                    {room.originalTotalPrice &&
                      room.originalTotalPrice > room.totalPrice && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs sm:text-sm text-green-700 font-bold flex items-center gap-1">
                            {t("hotels.details.rooms.you_save")}: <SARCurrencyIcon className="w-3 h-3" />{" "}
                            {localizeNumber(room.originalTotalPrice - room.totalPrice, i18n?.language || "en", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}
                    
                    {room.totalPrice > 0 && (
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        {t("hotels.details.rooms.excl_tax")}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        if (!room.available) return;

                        setSelectedRoom(room.id);

                        // Extract booking parameters from room data
                        const roomGroupItem = room._raw?.roomGroupItem;
                        const recommendation = room._raw?.recommendation;

                        const providerName = roomGroupItem?.providerName;
                        const recommendationId = recommendation?.id;

                        if (
                          providerName &&
                          recommendationId &&
                          searchId &&
                          hotelId
                        ) {
                          // Redirect to booking page with query parameters
                          const params = new URLSearchParams({
                            searchId,
                            hotelId,
                            providerName,
                            recommendationId,
                          });
                          if (searchTracingKey) {
                            params.set("searchTracingKey", searchTracingKey);
                          }
                          router.push(`/hotels/booking?${params.toString()}`);
                        } else {
                          console.warn("Missing booking parameters:", {
                            providerName,
                            recommendationId,
                            searchId,
                            hotelId,
                          });
                        }
                      }}
                      disabled={!room.available}
                      className={`flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-md ${
                        selectedRoom === room.id
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl sm:scale-105 ring-2 ring-green-300"
                          : room.available
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl sm:hover:scale-105 hover:ring-2 hover:ring-blue-300"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {selectedRoom === room.id ? (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {t("hotels.details.rooms.selected")}
                        </>
                      ) : (
                        <>
                          {t("hotels.details.rooms.select_room")}
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!isLoading && rooms.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">
                {t("hotels.details.rooms.no_rooms")}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {!isLoading && rooms.length > roomsToShow && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                onClick={() => setRoomsToShow((prev) => prev + ROOMS_PER_PAGE)}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {t("hotels.details.rooms.load_more")} (
                {rooms.length - roomsToShow}{" "}
                {t("hotels.details.rooms.remaining")})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected Room Notification */}
      {selectedRoom && (
        <div className="p-4 sm:p-6 bg-blue-50 border-t border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-blue-900 text-sm sm:text-base mb-1">
                {t("hotels.details.rooms.room_selected")}:{" "}
                <span className="break-words">
                  {rooms.find((r) => r.id === selectedRoom)?.name}
                </span>
              </h3>
              <p className="text-blue-700 text-xs sm:text-sm">
                {t("hotels.details.rooms.ready_to_book")}
              </p>
            </div>
            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base">
              {t("hotels.details.rooms.continue_booking")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
