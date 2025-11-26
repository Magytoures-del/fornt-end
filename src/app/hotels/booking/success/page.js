"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import BookingConfirmation from "@/components/hotels/booking/BookingConfirmation";
import {
  HOTEL_BOOKING_API,
  buildRetrieveBookingPayload,
} from "@/constants/hotelBooking";

/**
 * Hotel Booking Success Content Component
 * Retrieves and displays booking confirmation using TransactionID
 */
function HotelBookingSuccessContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookingData, setBookingData] = useState(null);
  const [retrieveResponse, setRetrieveResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Get TransactionID from URL
  const transactionID = useMemo(
    () => searchParams.get("TransactionID"),
    [searchParams]
  );

  // Retrieve booking by TransactionID
  useEffect(() => {
    const retrieveBooking = async () => {
      if (!transactionID) {
        setError(t("hotels.booking_errors.transaction_id_missing"));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Build retrieve booking request payload
        const retrievePayload = buildRetrieveBookingPayload({
          referenceNumber: transactionID,
          referenceType: "T",
          requestMode: "RB",
        });

        // Call retrieve booking API
        const response = await axios.post(
          HOTEL_BOOKING_API.RETRIEVE_BOOKING,
          retrievePayload
        );

        // Handle nested response structure: response.data.data.data contains actual booking
        const bookingDetails =
          response?.data?.data?.data || response?.data?.data || response?.data;

        if (response?.data?.success && bookingDetails) {
          setRetrieveResponse(bookingDetails);

          // Extract booking data from response
          if (bookingDetails) {
            // Extract hotel info
            const hotelInfo = bookingDetails.HotelInfo || {};
            const firstRoom = bookingDetails.Rooms?.[0] || {};
            const firstGuest = firstRoom.Guests?.[0] || {};
            const contactInfo = bookingDetails.ContactInfo || {};

            setBookingData({
              hotel: {
                name: hotelInfo.Name || bookingDetails.HotelName || "-",
                location:
                  hotelInfo.LocationName || hotelInfo.HotelAddress?.City || "-",
                address: hotelInfo.HotelAddress,
                code: hotelInfo.Code,
                starRating: hotelInfo.StarRating,
                phone: hotelInfo.Phone,
                heroImage: hotelInfo.heroimage,
              },
              guest: {
                firstName: firstGuest.FirstName || contactInfo.FName || "-",
                lastName: firstGuest.LastName || contactInfo.LName || "-",
                email: firstGuest.Email || contactInfo.Email || "-",
                phone: firstGuest.MobileNumber || contactInfo.Mobile || "-",
                title: firstGuest.Title || contactInfo.Title || "",
              },
              room: {
                name: firstRoom.Name || "-",
                totalPrice:
                  bookingDetails.NetFare || bookingDetails.NetAmount || 0,
                grossPrice:
                  bookingDetails.GrossFare || bookingDetails.GrossAmount || 0,
                currency: "SAR", // Default currency
                nights: bookingDetails.Rooms?.[0]?.RoomRates?.length || 0,
                guests: bookingDetails.PaxCount || 1,
                roomId: firstRoom.RoomId,
                roomGroupId: firstRoom.RoomGroupId,
                refundable: firstRoom.Refundable === "True",
                boardBasis: firstRoom.RoomBoardBasis?.[0]?.name || "-",
              },
              dates: {
                checkIn: bookingDetails.CheckInDate || "-",
                checkOut: bookingDetails.CheckOutDate || "-",
                checkInTime: bookingDetails.CheckInTime || "-",
                checkOutTime: bookingDetails.CheckOutTime || "-",
              },
              booking: {
                transactionId:
                  bookingDetails.TransactionId || bookingDetails.TransactionID,
                bookingConfirmationId:
                  bookingDetails.BookingConfirmationId || "-",
                tui: bookingDetails.TUI,
                status:
                  bookingDetails.BookingStatus ||
                  bookingDetails.CurrentStatus ||
                  "-",
                paymentStatus: bookingDetails.PaymentStatus || "-",
                issuedDate: bookingDetails.IssuedDate || "-",
              },
            });
          }
        } else {
          const errorMessage =
            response?.data?.error ||
            response?.data?.message ||
            t("hotels.booking_errors.retrieve_failed");
          setError(errorMessage);
        }
      } catch (err) {
        console.error("Error retrieving booking:", err);
        const errorMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t("hotels.booking_errors.retrieve_failed");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    retrieveBooking();
  }, [transactionID, t]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">
            {t("hotels.details.booking_page.loading")}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("hotels.details.booking_page.error_title")}
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push("/hotels")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t("hotels.details.booking_page.back_to_hotels")}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200"
                >
                  {t("common.retry")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show booking confirmation
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <BookingConfirmation
            bookingData={bookingData}
            bookingResponse={null}
            paymentResponse={null}
            retrieveResponse={retrieveResponse}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Fallback Component
 */
function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Page Component with Suspense
 */
export default function HotelBookingSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HotelBookingSuccessContent />
    </Suspense>
  );
}
