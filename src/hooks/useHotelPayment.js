/**
 * Custom hook for hotel payment processing
 * Handles payment initiation and booking retrieval
 */

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { HOTEL_BOOKING_API } from "@/constants/hotelBooking";

/**
 * Maps nationality ID to country code
 * @param {string} nationalityId - Nationality ID (e.g., "saudi_arabia")
 * @returns {string} Country code (e.g., "SA")
 */
const mapNationalityToCountryCode = (nationalityId) => {
  if (!nationalityId) return "SA";
  
  // If already a 2-letter country code, return as is
  if (/^[A-Z]{2}$/i.test(nationalityId)) {
    return nationalityId.toUpperCase();
  }

  // Map nationality IDs to country codes
  const nationalityMap = {
    saudi_arabia: "SA",
    united_arab_emirates: "AE",
    kuwait: "KW",
    qatar: "QA",
    bahrain: "BH",
    oman: "OM",
    egypt: "EG",
    jordan: "JO",
    lebanon: "LB",
    turkey: "TR",
    united_states: "US",
    united_kingdom: "GB",
    canada: "CA",
    australia: "AU",
    germany: "DE",
    france: "FR",
    italy: "IT",
    spain: "ES",
  };

  return nationalityMap[nationalityId.toLowerCase()] || "SA";
};

/**
 * Custom hook for hotel payment
 * @param {Object} params - Payment parameters
 * @param {Object} params.bookingResponse - Booking response from creation
 * @param {Object} params.bookingData - Booking data with guest information
 * @param {Function} params.onPaymentSuccess - Callback when payment succeeds
 * @returns {Object} Payment state and functions
 */
export const useHotelPayment = ({ bookingResponse, bookingData, onPaymentSuccess }) => {
  const { t } = useTranslation();
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [isRetrievingBooking, setIsRetrievingBooking] = useState(false);
  const [retrieveError, setRetrieveError] = useState(null);
  const [retrieveResponse, setRetrieveResponse] = useState(null);

  /**
   * Starts payment process using PayTabs
   */
  const startPayment = useCallback(async () => {
    if (!bookingResponse) {
      const message = t("hotels.booking_errors.booking_info_not_available");
      setPaymentError(message);
      return null;
    }

    const itineraryData = bookingResponse?.data ?? bookingResponse;

    if (!itineraryData || !itineraryData.TUI || !itineraryData.TransactionID) {
      const message = t("hotels.booking_errors.itinerary_details_missing");
      setPaymentError(message);
      return null;
    }

    // Validate required booking data
    if (!bookingData?.guest) {
      const message = t("hotels.booking_errors.guest_details_missing");
      setPaymentError(message);
      return null;
    }

    try {
      setIsStartingPayment(true);
      setPaymentError(null);

      // Extract data from booking response
      const tui = itineraryData.TUI;
      const transactionID = itineraryData.TransactionID;
      const netAmount = itineraryData.NetAmount || bookingData?.room?.totalPrice || 0;
      const currency = itineraryData.CurrencyCode || bookingData?.room?.currency || "SAR";

      // Build customer details from booking data
      const countryCode = mapNationalityToCountryCode(bookingData.guest.nationality);
      const customerDetails = {
        name: `${bookingData.guest.firstName || ""} ${bookingData.guest.lastName || ""}`.trim() || "Guest",
        email: bookingData.guest.email || "",
        phone: bookingData.guest.phone || "",
        country: countryCode,
      };

      // Build redirect URLs
      // PayTabs will redirect to these URLs after payment completion/failure
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const successRedirectUrl = `${baseUrl}/hotels/booking/success?TransactionID=${transactionID}`;
      const failureRedirectUrl = `${baseUrl}/hotels/booking-fail?TransactionID=${transactionID}&reason=payment_failed`;

      // Build PayTabs payment payload
      const paymentPayload = {
        TUI: tui,
        TransactionID: transactionID,
        NetAmount: netAmount,
        currency: currency,
        customerDetails: customerDetails,
        cartDescription: "Hotel Booking",
        // Include redirect URLs for payment success and failure
        // Backend should use these to configure PayTabs redirect URLs
        redirectUrl: successRedirectUrl,
        returnUrl: successRedirectUrl,
        cancelUrl: failureRedirectUrl,
        failureUrl: failureRedirectUrl,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("Initiating PayTabs payment with payload:", paymentPayload);
      }

      // Call PayTabs initiate endpoint
      const response = await axios.post(
        `${"https://apib2c.flymoonsa.com"}${HOTEL_BOOKING_API.PAYTABS_INITIATE}`,
        paymentPayload
      );

      if (process.env.NODE_ENV === "development") {
        console.log("PayTabs payment response:", response.data);
      }

      if (response?.data?.success) {
        const paymentData = response.data;
        setPaymentResponse(paymentData);

        // Return the payment response with redirect_url
        return paymentData;
      } else {
        const message =
          response?.data?.error ||
          response?.data?.message ||
          "Failed to initiate payment.";
        setPaymentError(message);
        return null;
      }
    } catch (error) {
      console.error("Error initiating PayTabs payment:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to initiate payment.";
      setPaymentError(message);
      return null;
    } finally {
      setIsStartingPayment(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingResponse, bookingData, t]); // onPaymentSuccess is stable and doesn't need to be in deps

  return {
    startPayment,
    isStartingPayment,
    paymentError,
    paymentResponse,
    isRetrievingBooking,
    retrieveError,
    retrieveResponse,
    setPaymentError,
  };
};

