/**
 * Custom hook for hotel booking creation
 * Encapsulates booking creation logic, loading states, and error handling
 */

import { useState, useCallback } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { HOTEL_BOOKING_API } from "@/constants/hotelBooking";
import { buildHotelBookingPayload } from "@/domain/hotels/bookingPayload";

/**
 * Custom hook for creating hotel bookings
 * @param {Object} params - Booking parameters
 * @param {string} params.searchId - Search ID
 * @param {string} params.hotelId - Hotel ID
 * @param {string} params.providerName - Provider name
 * @param {string} params.recommendationId - Recommendation ID
 * @param {Object} params.bookingData - Current booking data
 * @param {string} params.searchTracingKey - Search tracing key
 * @returns {Object} Booking state and create function
 */
export const useHotelBooking = ({
  searchId,
  hotelId,
  providerName,
  recommendationId,
  bookingData,
  searchTracingKey,
}) => {
  const { t } = useTranslation();
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingResponse, setBookingResponse] = useState(null);

  const createBooking = useCallback(async () => {
    // Validate required parameters
    if (!searchId || !hotelId || !providerName || !recommendationId) {
      const missingParams = [];
      if (!searchId) missingParams.push("searchId");
      if (!hotelId) missingParams.push("hotelId");
      if (!providerName) missingParams.push("providerName");
      if (!recommendationId) missingParams.push("recommendationId");
      
      setBookingError(
        t(
          "hotels.booking_errors.missing_parameters",
          `Missing required booking parameters: ${missingParams.join(", ")}`
        )
      );
      return null;
    }

    // Validate booking data
    if (!bookingData?.guest) {
      setBookingError(
        t(
          "hotels.booking_errors.missing_guest_data",
          "Guest information is required"
        )
      );
      return null;
    }

    if (!bookingData?.room?.priceId) {
      setBookingError(
        t(
          "hotels.booking_errors.missing_price_id",
          "Price information is missing. Please refresh and try again."
        )
      );
      return null;
    }

    try {
      setIsCreatingBooking(true);
      setBookingError(null);

      // Build booking payload
      const requestBody = buildHotelBookingPayload({
        searchId,
        hotelId,
        recommendationId,
        bookingData,
        priceId: bookingData.room.priceId,
        searchTracingKey,
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Creating booking with body:", requestBody);
      }

      const response = await axios.post(HOTEL_BOOKING_API.CREATE_ITINERARY, requestBody);

      if (process.env.NODE_ENV === "development") {
        console.log("Booking response:", response.data);
      }

      if (response.data.success) {
        setBookingResponse(response.data.data);
        return response.data.data;
      } else {
        // Extract detailed error message
        const errorMessage =
          response.data.error ||
          response.data.message ||
          response.data.data?.error ||
          response.data.data?.message ||
          t("hotels.booking_errors.failed_to_create");
        setBookingError(errorMessage);
        return null;
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      
      // Extract detailed error message from various possible locations
      let errorMessage = t("hotels.booking_errors.failed_to_create");
      
      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data?.data?.error ||
          error.response.data?.data?.message ||
          error.response.statusText ||
          errorMessage;
        
        // Handle specific HTTP status codes
        if (error.response.status === 400) {
          errorMessage =
            errorMessage ||
            t("hotels.booking_errors.invalid_request", "Invalid booking request. Please check your information.");
        } else if (error.response.status === 404) {
          errorMessage =
            errorMessage ||
            t("hotels.booking_errors.not_found", "Booking service not found. Please try again.");
        } else if (error.response.status === 500) {
          errorMessage =
            errorMessage ||
            t("hotels.booking_errors.server_error", "Server error. Please try again later.");
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = t(
          "hotels.booking_errors.network_error",
          "Network error. Please check your connection and try again."
        );
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      setBookingError(errorMessage);
      return null;
    } finally {
      setIsCreatingBooking(false);
    }
  }, [searchId, hotelId, providerName, recommendationId, bookingData, searchTracingKey, t]);

  return {
    createBooking,
    isCreatingBooking,
    bookingError,
    bookingResponse,
    setBookingError,
  };
};

