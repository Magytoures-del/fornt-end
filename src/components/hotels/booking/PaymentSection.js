"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuCreditCard, LuShield, LuArrowLeft, LuExternalLink, LuUser, LuCalendar, LuMail, LuPhone } from "react-icons/lu";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

/**
 * Get currency symbol (localized) - returns JSX for SAR, string for others
 */
const getCurrencySymbol = (currency, t) => {
  const symbols = {
    USD: "$",
    SAR: null, // Will use SARCurrencyIcon component
    AED: t("common.currency_aed"),
    EUR: "€",
    GBP: "£",
    INR: "₹",
  };
  return symbols[currency] !== undefined ? symbols[currency] : currency || null;
};

/**
 * Format price with proper RTL/LTR direction
 * Returns JSX if currency is SAR (to use icon), otherwise returns string
 */
const formatPrice = (amount, currency, currencySymbol, isRTL = false) => {
  const formattedAmount = typeof amount === 'number' ? amount.toFixed(2) : (parseFloat(amount) || 0).toFixed(2);
  
  // If SAR, return JSX with icon
  if (currency === "SAR") {
    if (isRTL) {
      // RTL: number comes first, then icon
      return (
        <span className="inline-flex items-center gap-1" dir="ltr">
          {formattedAmount} <SARCurrencyIcon className="w-4 h-4 inline-flex" />
        </span>
      );
    } else {
      // LTR: icon comes first, then number
      return (
        <span className="inline-flex items-center gap-1" dir="ltr">
          <SARCurrencyIcon className="w-4 h-4 inline-flex" /> {formattedAmount}
        </span>
      );
    }
  }
  
  // For other currencies, return string
  if (isRTL) {
    // RTL: number comes first, then currency
    return `${formattedAmount} ${currencySymbol}`;
  } else {
    // LTR: currency comes first, then number
    return `${currencySymbol} ${formattedAmount}`;
  }
};

export default function PaymentSection({
  paymentData,
  onUpdate,
  onNext,
  onPrev,
  isCreatingBooking = false,
  bookingError = null,
  bookingResponse = null,
  bookingData = {},
  onStartPayment,
  isStartingPayment = false,
  paymentError = null,
  paymentResponse = null,
  isRetrievingBooking = false,
  retrieveError = null,
}) {
  const { t, i18n } = useTranslation();
  const currency = bookingData?.room?.currency || "SAR";
  const currencySymbol = getCurrencySymbol(currency, t);
  const isRTL = i18n.language === "ar";
  const [formData, setFormData] = useState(paymentData);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    onUpdate({ [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // We're not validating card details anymore as we're redirecting to a hosted payment page
  const validateForm = () => {
    // No validation needed for redirect
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };
  
  const extractPaymentUrl = (data) => {
    if (!data) return null;
    if (typeof data === "string") return data;

    const candidates = [
      "redirect_url",
      "redirectUrl",
      "RedirectUrl",
      "redirectURL",
      "RedirectURL",
      "paymentUrl",
      "PaymentUrl",
      "paymentURL",
      "PaymentURL",
      "url",
      "Url",
      "URL",
      "HostedPaymentPage",
      "HostedPaymentUrl",
      "HostedPaymentURL",
    ];

    for (const key of candidates) {
      if (data?.[key]) {
        return data[key];
      }
    }

    if (Array.isArray(data)) {
      for (const item of data) {
        const nestedUrl = extractPaymentUrl(item);
        if (nestedUrl) return nestedUrl;
      }
    }

    if (data?.data) {
      return extractPaymentUrl(data.data);
    }

    return null;
  };

  const handleProceedToPayment = async () => {
    try {
      let result = null;

      if (onStartPayment) {
        result = await onStartPayment();
      }

      const urlFromResult = extractPaymentUrl(result);
      const urlFromState = extractPaymentUrl(paymentResponse);
      const urlFromBooking = extractPaymentUrl(bookingResponse);

      const finalUrl =
        urlFromResult || urlFromState || urlFromBooking ||
        (bookingResponse?.booking?.id
          ? `/api/hotels/payment/redirect?bookingId=${bookingResponse.booking.id}`
          : null);

      if (finalUrl) {
        // Redirect to PayTabs payment page
        window.location.href = finalUrl;
      } else {
        console.error("No payment URL available after payment initiation.");
      }
    } catch (error) {
      console.error("Failed to initiate payment:", error);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          {t("hotels.details.booking_page.payment.title")}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {t("hotels.details.booking_page.payment.subtitle")}
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Booking Summary */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            {t("hotels.details.booking_page.payment.booking_summary")}
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200">
            {/* Hotel Information */}
            <div className="mb-3 sm:mb-4">
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">{t("hotels.details.booking_page.payment.hotel_details")}</h4>
              <div className="mt-2 space-y-1.5 sm:space-y-2">
                <p className="text-gray-700 text-xs sm:text-sm"><span className="font-medium">{t("hotels.details.booking_page.payment.hotel")}:</span> {bookingData?.hotel?.name || t("hotels.details.booking_page.payment.not_specified")}</p>
                <p className="text-gray-700 text-xs sm:text-sm"><span className="font-medium">{t("hotels.details.booking_page.payment.location")}:</span> {bookingData?.hotel?.location || t("hotels.details.booking_page.payment.not_specified")}</p>
                <p className="text-gray-700 text-xs sm:text-sm"><span className="font-medium">{t("hotels.details.booking_page.payment.room_type")}:</span> {bookingData?.room?.name || t("hotels.details.booking_page.payment.not_specified")}</p>
              </div>
            </div>
            
            {/* Date Information */}
            <div className="mb-3 sm:mb-4">
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">{t("hotels.details.booking_page.payment.stay_details")}</h4>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <LuCalendar className="text-gray-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">{t("hotels.details.booking_page.payment.check_in")}</p>
                    <p className="font-medium text-xs sm:text-sm">{bookingData?.dates?.checkInFormatted || bookingData?.dates?.checkIn || t("hotels.details.booking_page.payment.not_specified")}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <LuCalendar className="text-gray-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">{t("hotels.details.booking_page.payment.check_out")}</p>
                    <p className="font-medium text-xs sm:text-sm">{bookingData?.dates?.checkOutFormatted || bookingData?.dates?.checkOut || t("hotels.details.booking_page.payment.not_specified")}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">{t("hotels.details.booking_page.payment.duration")}</p>
                    <p className="font-medium text-xs sm:text-sm">{bookingData?.room?.nights || '1'} {t("hotels.details.booking_page.payment.nights")}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">{t("hotels.details.booking_page.payment.guests_label")}</p>
                    <p className="font-medium text-xs sm:text-sm">{bookingData?.room?.guests || '2'} {t("hotels.details.booking_page.payment.guests")}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Information */}
            <div className="mb-3 sm:mb-4">
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">{t("hotels.details.booking_page.payment.price_details")}</h4>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <p className="text-gray-600 text-xs sm:text-sm">{t("hotels.details.booking_page.payment.price_per_night")}</p>
                  <p className="font-medium text-xs sm:text-sm whitespace-nowrap" dir="ltr">{formatPrice(bookingData?.room?.price || 0, currency, currencySymbol, isRTL)}</p>
                </div>
                {bookingData?.room?.originalPrice && bookingData.room.originalPrice > bookingData.room.price && (
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-xs sm:text-sm">{t("hotels.details.booking_page.payment.original_price_per_night")}</p>
                    <p className="line-through text-gray-500 text-xs sm:text-sm whitespace-nowrap" dir="ltr">{formatPrice(bookingData.room.originalPrice, currency, currencySymbol, isRTL)}</p>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <p className="font-medium text-xs sm:text-sm">{t("hotels.details.booking_page.payment.total_price")}</p>
                  <p className="font-bold text-blue-600 text-sm sm:text-base whitespace-nowrap" dir="ltr">{formatPrice(bookingData?.room?.totalPrice || 0, currency, currencySymbol, isRTL)}</p>
                </div>
              </div>
            </div>
            
            {/* Guest Information */}
            <div>
              <h4 className="font-medium text-gray-800 text-sm sm:text-base">{t("hotels.details.booking_page.payment.guest_details")}</h4>
              <div className="mt-2 space-y-1.5 sm:space-y-2">
                <div className="flex items-center">
                  <LuUser className="text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 text-xs sm:text-sm truncate">{bookingData?.guest?.firstName} {bookingData?.guest?.lastName}</p>
                </div>
                <div className="flex items-center">
                  <LuMail className="text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 text-xs sm:text-sm truncate">{bookingData?.guest?.email || t("hotels.details.booking_page.payment.not_provided")}</p>
                </div>
                <div className="flex items-center">
                  <LuPhone className="text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 text-xs sm:text-sm">{bookingData?.guest?.phone || t("hotels.details.booking_page.payment.not_provided")}</p>
                </div>
                {bookingData?.guest?.specialRequests && (
                  <div className="mt-3">
                    <p className="text-xs sm:text-sm font-medium">{t("hotels.details.booking_page.payment.special_requests")}:</p>
                    <p className="text-gray-700 mt-1 text-xs sm:text-sm">{bookingData.guest.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start">
            <LuShield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-green-800">
                {t("hotels.details.booking_page.payment.secure_payment")}
              </h4>
              <p className="text-xs sm:text-sm text-green-700 mt-1">
                {t("hotels.details.booking_page.payment.secure_payment_description")}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Error */}
        {bookingError && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">{bookingError}</p>
          </div>
        )}
        {paymentError && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">{paymentError}</p>
          </div>
        )}
        {retrieveError && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">{retrieveError}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            onClick={onPrev}
            disabled={
              isCreatingBooking || isStartingPayment || isRetrievingBooking
            }
            className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <LuArrowLeft className="w-4 h-4 mr-2" />
            {t("hotels.details.booking_page.back")}
          </button>
          <button
            onClick={handleProceedToPayment}
            disabled={
              isCreatingBooking ||
              isStartingPayment ||
              isRetrievingBooking ||
              !bookingResponse
            }
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isStartingPayment || isRetrievingBooking ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isRetrievingBooking
                  ? t("hotels.details.booking_page.payment.retrieving_booking")
                  : t("hotels.details.booking_page.payment.processing_payment")}
              </>
            ) : (
              <>
                {t("hotels.details.booking_page.payment.proceed_to_payment")} <LuExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
