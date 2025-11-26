"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { buildBookingPayload } from "@/domain/flights/payload";
import { transformToTraveller } from "@/domain/flights/transform";
import { API_ENDPOINTS, BOOKING_STATUS } from "@/constants/booking";

/**
 * Custom hook for creating flight bookings
 * Encapsulates booking creation logic, loading states, and error handling
 */
export const useCreateBooking = ({
  pricingId,
  netAmount,
  onSuccess,
  onError,
  onSaveToSession,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingResponse, setBookingResponse] = useState(null);

  const createBooking = useCallback(
    async (formData, travellerRequirements, onwardDate) => {
      setIsLoading(true);
      setError(null);

      try {
        // Transform form data to travellers
        const travellers = transformToTraveller(
          formData,
          travellerRequirements,
          onwardDate
        );

        // Build booking payload
        const bookingPayload = buildBookingPayload({
          pricingId,
          formData,
          travellers,
          netAmount,
        });

        // Log for development
        if (process.env.NODE_ENV === "development") {
          console.log("Creating booking with payload:", bookingPayload);
        }

        // Make API call
        const response = await axios.post(
          API_ENDPOINTS.CREATE_BOOKING,
          bookingPayload
        );

        if (process.env.NODE_ENV === "development") {
          console.log("Booking response:", response.data);
        }

        // Save to session storage if callback provided
        if (onSaveToSession) {
          const bookingDataToSave = {
            bookingResponse: response.data,
            bookingPayload,
            travellers,
            timestamp: Date.now(),
            status: BOOKING_STATUS.CREATED,
          };
          onSaveToSession(bookingDataToSave);
        }

        // Store response in state
        setBookingResponse(response.data);

        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create booking";

        setError(errorMessage);
        console.error("Booking creation failed:", err);

        // Save error to session if callback provided
        if (onSaveToSession) {
          const errorData = {
            error: errorMessage,
            timestamp: Date.now(),
            status: BOOKING_STATUS.FAILED,
          };
          onSaveToSession(errorData);
        }

        // Call error callback
        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pricingId, netAmount, onSuccess, onError, onSaveToSession]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setBookingResponse(null);
  }, []);

  return {
    createBooking,
    isLoading,
    error,
    bookingResponse,
    reset,
  };
};

export default useCreateBooking;

