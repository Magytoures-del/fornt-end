/**
 * Custom hook for fetching hotel booking data (price and content)
 * Encapsulates data fetching, transformation, and state management
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { HOTEL_BOOKING_API, DEFAULT_BOOKING_DATA } from "@/constants/hotelBooking";
import {
  extractHotelData,
  extractPriceData,
  calculateNights,
  parseStayDates,
  calculateRoomPricing,
  calculateMaxGuests,
  extractHotelLocation,
  extractHotelImage,
  extractHotelDescription,
  extractHotelRating,
} from "@/utils/hotelBookingUtils";

/**
 * Custom hook for hotel booking data
 * @param {Object} params - Booking parameters
 * @param {string} params.searchId - Search ID
 * @param {string} params.hotelId - Hotel ID
 * @param {string} params.providerName - Provider name
 * @param {string} params.recommendationId - Recommendation ID
 * @returns {Object} Booking data state and loading/error states
 */
export const useHotelBookingData = ({ searchId, hotelId, providerName, recommendationId }) => {
  const [bookingData, setBookingData] = useState(DEFAULT_BOOKING_DATA);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState(null);

  /**
   * Fetches hotel content information
   */
  const fetchHotelContent = useCallback(
    async (priceProvider) => {
      if (!searchId || !hotelId) {
        console.warn("Missing searchId or hotelId for content fetch");
        return;
      }

      try {
        setIsLoadingContent(true);
        setContentError(null);

        const response = await axios.get(HOTEL_BOOKING_API.CONTENT(searchId, hotelId, priceProvider));

        if (response.data.success) {
          const hotelData = extractHotelData(response.data.data);

          if (hotelData) {
            setBookingData((prev) => ({
              ...prev,
              hotel: {
                ...prev.hotel,
                name: hotelData.name || prev.hotel.name,
                location: extractHotelLocation(hotelData, prev.hotel.location),
                rating: extractHotelRating(hotelData, prev.hotel.rating),
                image: extractHotelImage(hotelData, prev.hotel.image),
                description: extractHotelDescription(hotelData, prev.hotel.description),
                amenities:
                  hotelData.facilities ||
                  hotelData.facilityGroups ||
                  hotelData.amenities ||
                  prev.hotel.amenities,
                address: hotelData.contact?.address || hotelData.address || prev.hotel.address,
                hotelId: hotelData.id || hotelData.hotelId || prev.hotel.hotelId,
                providerName: hotelData.providerName || prev.hotel.providerName,
                geoCode: hotelData.geoCode || prev.hotel.geoCode,
                contact: hotelData.contact || prev.hotel.contact,
                checkinInfo: hotelData.checkinInfo || prev.hotel.checkinInfo,
                checkoutInfo: hotelData.checkoutInfo || prev.hotel.checkoutInfo,
                reviews: hotelData.reviews || prev.hotel.reviews,
                policies: hotelData.policies || prev.hotel.policies,
                fees: hotelData.fees || prev.hotel.fees,
                images: hotelData.images || prev.hotel.images,
              },
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching hotel content:", error);
        setContentError(
          error?.response?.data?.error ||
            error?.message ||
            "Failed to fetch hotel content"
        );
      } finally {
        setIsLoadingContent(false);
      }
    },
    [searchId, hotelId]
  );

  /**
   * Fetches price data and updates booking data
   */
  const fetchPriceData = useCallback(async () => {
    if (!searchId || !hotelId || !providerName || !recommendationId) {
      console.warn("Missing booking parameters, using default data");
      return;
    }

    try {
      setIsLoadingPrice(true);
      setPriceError(null);

      const response = await axios.get(
        HOTEL_BOOKING_API.PRICE(searchId, hotelId, providerName, recommendationId)
      );

      if (response.data.success) {
        const { actualData, stayPeriod, roomGroups } = extractPriceData(response.data.data);

        if (roomGroups && Array.isArray(roomGroups) && roomGroups.length > 0) {
          const roomGroup = roomGroups[0];

          // Calculate number of nights
          const numberOfNights = calculateNights(stayPeriod);

          // Calculate pricing
          const { totalPrice, pricePerNight, originalPrice } = calculateRoomPricing(
            roomGroup,
            numberOfNights
          );

          // Parse dates
          const { checkIn, checkOut } = parseStayDates(stayPeriod);

          // Calculate max guests
          const maxGuests = calculateMaxGuests(roomGroup.occupancies);

          // Build room info
          const roomInfo = {
            roomGroupId: roomGroup.id,
            roomId: roomGroup.room?.id || roomGroup.room?.standardRoomId || "",
            providerName: roomGroup.providerName,
            providerId: roomGroup.providerId,
            refundable: roomGroup.refundable,
            refundability: roomGroup.refundability,
            boardBasis: roomGroup.boardBasis,
            policies: roomGroup.policies,
            priceId: actualData?.priceId,
            hotelId: actualData?.hotelId,
            conversionRate: roomGroup.conversionRate,
            currency: roomGroup.conversionRate?.toCurrency || "SAR",
            occupancies: roomGroup.occupancies || [],
          };

          // Update booking data
          setBookingData((prev) => ({
            ...prev,
            room: {
              ...prev.room,
              price: pricePerNight || prev.room.price,
              totalPrice: totalPrice || prev.room.price * numberOfNights,
              originalPrice: originalPrice || prev.room.originalPrice,
              nights: numberOfNights || prev.room.nights,
              guests: maxGuests || prev.room.guests,
              name:
                roomGroup.room?.name ||
                roomGroup.room?.standardRoomName ||
                prev.room.name,
              ...roomInfo,
            },
            dates: {
              checkIn: checkIn?.iso || prev.dates.checkIn,
              checkOut: checkOut?.iso || prev.dates.checkOut,
              checkInFormatted: checkIn?.formatted || prev.dates.checkInFormatted,
              checkOutFormatted: checkOut?.formatted || prev.dates.checkOutFormatted,
            },
          }));

          // Fetch hotel content with priceProvider parameter
          if (roomGroup.providerName) {
            fetchHotelContent(roomGroup.providerName);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
      setPriceError(
        error?.response?.data?.error || error?.message || "Failed to fetch price data"
      );
    } finally {
      setIsLoadingPrice(false);
    }
  }, [searchId, hotelId, providerName, recommendationId, fetchHotelContent]);

  // Fetch price data on mount
  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  return {
    bookingData,
    setBookingData,
    isLoadingPrice,
    priceError,
    isLoadingContent,
    contentError,
    refetchPriceData: fetchPriceData,
  };
};

