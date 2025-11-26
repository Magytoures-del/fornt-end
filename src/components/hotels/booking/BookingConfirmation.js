"use client";

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { localizeCurrency, localizeNumber } from "@/utils/numberLocalization";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

/**
 * Format date like "Tue, Mar 3, 2026"
 */
const formatDateWithDay = (value, locale = "en") => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      calendar: "gregory",
    });
  } catch (error) {
    return value;
  }
};

/**
 * Format currency amount
 */
const formatCurrency = (amount, currency = "SAR", locale = "en") => {
  if (currency === "SAR") {
    const formattedAmount = localizeNumber(amount, locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <span className="inline-flex items-center gap-1" dir="ltr">
        <SARCurrencyIcon className="w-4 h-4 inline-flex" /> {formattedAmount}
      </span>
    );
  }
  return localizeCurrency(amount, currency, locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Booking Confirmation Step Component
 * Displays booking confirmation matching email template design
 */
export default function BookingConfirmation({
  bookingData,
  bookingResponse,
  paymentResponse,
  retrieveResponse,
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const locale = i18n.language || "en";
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

  // Extract data
  const transactionID =
    retrieveResponse?.TransactionId ||
    retrieveResponse?.TransactionID ||
    bookingData?.booking?.transactionId ||
    bookingData?.booking?.transactionID ||
    "-";

  const hotelName =
    bookingData?.hotel?.name || retrieveResponse?.HotelInfo?.Name || "-";
  const hotelAddress = retrieveResponse?.HotelInfo?.HotelAddress || {};
  const fullAddress =
    [
      hotelAddress.AddressLine1,
      hotelAddress.AddressLine2,
      hotelAddress.City,
      hotelAddress.State,
      hotelAddress.Country,
      hotelAddress.ZIP,
    ]
      .filter(Boolean)
      .join(", ") ||
    bookingData?.hotel?.location ||
    "-";

  const guestInfo =
    retrieveResponse?.Rooms?.[0]?.Guests?.[0] || bookingData?.guest || {};
  const guestName =
    [
      guestInfo.Title,
      guestInfo.FirstName || guestInfo.firstName,
      guestInfo.LastName || guestInfo.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .toUpperCase() || "-";

  const checkInDate =
    retrieveResponse?.CheckInDate || bookingData?.dates?.checkIn;
  const checkOutDate =
    retrieveResponse?.CheckOutDate || bookingData?.dates?.checkOut;

  const room = retrieveResponse?.Rooms?.[0] || bookingData?.room || {};
  const roomName = room.Name || room.name || "-";
  const numberOfAdults = room.NumberOfAdults || room.guests || 1;

  const netAmount =
    retrieveResponse?.NetFare ||
    retrieveResponse?.NetAmount ||
    bookingData?.room?.totalPrice ||
    0;
  const currency = "SAR";

  const handleDownload = useCallback(async () => {
    if (isDownloadingReceipt) return;

    try {
      setIsDownloadingReceipt(true);

      if (!transactionID || transactionID === "-") {
        const errorMsg = t("hotels.booking_errors.transaction_id_not_found");
        throw new Error(errorMsg);
      }

      const response = await fetch(
        `/api/hotels/booking/${transactionID}/voucher`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorMsg = t(
          "hotels.details.booking.confirmation.download_failed"
        );
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `hotel-booking-voucher-${transactionID}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download voucher:", error);
      const errorMessage =
        error.message ||
        t("hotels.details.booking.confirmation.download_error");
      alert(errorMessage);
    } finally {
      setIsDownloadingReceipt(false);
    }
  }, [isDownloadingReceipt, transactionID, t]);

  return (
    <div
      className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-medium text-[#2d3137] mb-8">
        {t("hotels.details.booking.confirmation.confirmation_for_booking")}{" "}
        {t("hotels.details.booking.confirmation.ref")} {transactionID}
      </h1>

      {/* Hotel Card with Blue Background */}
      <div className="bg-[#0f85d3] rounded-t-lg overflow-hidden mb-0">
        <div className="p-6 sm:p-8">
          <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">
            {hotelName}
          </h2>
          <p className="text-[#b4b6b5] text-sm sm:text-base mb-6">
            {fullAddress}
          </p>

          {/* Guest Name */}
          <p className="text-[#b4b6b5] text-sm mb-1">
            {t("hotels.details.booking.confirmation.guest_name")}
          </p>
          <p className="text-white text-lg sm:text-xl font-semibold mb-6">
            {guestName}
          </p>

          {/* Check-in / Check-out */}
          <div className="grid grid-cols-2 gap-4 border-t border-[#b4b6b5] pt-6">
            <div>
              <p className="text-[#b4b6b5] text-sm mb-2">
                {t("hotels.details.booking.confirmation.check_in")}
              </p>
              <p className="text-white text-lg sm:text-xl font-semibold">
                {formatDateWithDay(checkInDate, locale)}
              </p>
            </div>
            <div
              className={`border-l border-[#b4b6b5] pl-4 sm:pl-6 ${
                locale === "ar" ? "border-l-0 border-r pr-4 sm:pr-6" : ""
              }`}
            >
              <p className="text-[#b4b6b5] text-sm mb-2">
                {t("hotels.details.booking.confirmation.check_out")}
              </p>
              <p className="text-white text-lg sm:text-xl font-semibold">
                {formatDateWithDay(checkOutDate, locale)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
        <div className="flex gap-4 pb-6 border-b border-dashed border-gray-300">
          {(() => {
            const roomImage =
              retrieveResponse?.Rooms?.[0]?.Image ||
              retrieveResponse?.HotelInfo?.heroimage ||
              bookingData?.hotel?.heroImage ||
              null;

            return roomImage ? (
              <img
                src={roomImage}
                alt={roomName}
                className="w-16 h-16 rounded object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = "none";
                  const placeholder = e.target.nextElementSibling;
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
            ) : null;
          })()}
          <div
            className={`w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center ${
              retrieveResponse?.Rooms?.[0]?.Image ||
              retrieveResponse?.HotelInfo?.heroimage ||
              bookingData?.hotel?.heroImage
                ? "hidden"
                : ""
            }`}
          >
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-gray-900 text-lg font-semibold mb-1">
              {roomName}
            </p>
            <p className="text-gray-600 text-sm">
              {t("hotels.details.booking.confirmation.for")} {numberOfAdults}{" "}
              {t("hotels.details.booking.confirmation.adults")}
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg border border-gray-200 mt-6 p-6 sm:p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-dashed border-gray-200">
            <span className="text-gray-600 text-base">
              {t("hotels.details.booking.confirmation.order_number")}
            </span>
            <span className="text-gray-900 text-base font-medium">
              {transactionID}
            </span>
          </div>

          <div className="flex justify-between items-center pb-6 border-b border-dashed border-gray-200">
            <span className="text-gray-600 text-base">
              {t("hotels.details.booking.confirmation.voucher")}
            </span>
            <span className="text-gray-900 text-base font-medium">
              {transactionID}
            </span>
          </div>

          <div className="flex justify-between items-center pb-6 border-b border-dashed border-gray-200">
            <span className="text-gray-600 text-base">
              {t("hotels.details.booking.confirmation.payment_status")}
            </span>
            <span className="text-gray-900 text-base font-medium">
              {t("hotels.details.booking.confirmation.paid_by_card")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-base">
              {t("hotels.details.booking.confirmation.amount")}
            </span>
            <span className="text-gray-900 text-2xl font-medium">
              {formatCurrency(netAmount, currency, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* Voucher Attached Section */}
      <div className="bg-white rounded-lg border border-gray-200 mt-6 p-6 sm:p-8">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base">
            {t("hotels.details.booking.confirmation.voucher_attached")}
          </span>
          <span className="text-gray-900 text-base"></span>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          disabled={isDownloadingReceipt || transactionID === "-"}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isDownloadingReceipt ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("hotels.details.booking.confirmation.preparing_receipt")}
            </>
          ) : (
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {t("hotels.details.booking.confirmation.download_receipt")}
            </>
          )}
        </button>
        <button
          onClick={() => router.push("/hotels")}
          className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300 transform hover:-translate-y-0.5 duration-200"
        >
          {t("hotels.details.booking.confirmation.back_to_hotels")}
        </button>
      </div>
    </div>
  );
}
