"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { LuMapPin, LuCalendar, LuUsers, LuStar, LuShield } from "react-icons/lu";
import { BsCheckCircleFill, BsShieldCheck, BsClock } from "react-icons/bs";
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
  const formattedAmount = amount.toFixed(2);
  
  // If SAR, return JSX with icon
  if (currency === "SAR") {
    if (isRTL) {
      // RTL: number comes first, then icon
      return (
        <span className="inline-flex items-center gap-1" >
          {formattedAmount} <SARCurrencyIcon className="w-4 h-4 inline-flex" />
        </span>
      );
    } else {
      // LTR: icon comes first, then number
      return (
        <span className="inline-flex items-center gap-1" >
          <SARCurrencyIcon className="w-4 h-4 inline-flex" /> {formattedAmount}
        </span>
      );
    }
  }
  
  // For other currencies, return string
  if (isRTL) {
    // RTL: number comes first, then currency
    return `${currencySymbol} ${formattedAmount}`;
  } else {
    // LTR: currency comes first, then number
    return `${formattedAmount} ${currencySymbol}`;
  }
};

/**
 * Calculate totals with taxes
 */
const calculateTotal = (bookingData) => {
  const totalPrice = bookingData.room.totalPrice;
  const basePrice = bookingData.room.price * bookingData.room.nights;

  if (totalPrice && totalPrice > 0) {
    const estimatedTaxes = totalPrice - basePrice;
    return {
      basePrice: basePrice,
      taxes: estimatedTaxes > 0 ? estimatedTaxes : 0,
      serviceFee: 0,
      total: totalPrice,
    };
  } else {
    const taxes = basePrice * 0.15;
    const serviceFee = basePrice * 0.05;
    return {
      basePrice,
      taxes,
      serviceFee,
      total: basePrice + taxes + serviceFee,
    };
  }
};

/**
 * Star Rating Component
 */
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <LuStar
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Hotel Info Section
 */
const HotelInfo = ({ hotel }) => {
  return (
    <div className="p-5 border-b border-gray-100">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0 group">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-24 h-20 object-cover rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1.5">
            {hotel.name}
          </h3>
          <StarRating rating={hotel.rating} />
          <div className="flex items-center gap-1.5 text-gray-600 text-xs mt-2">
            <LuMapPin className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
            <span className="truncate">{hotel.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Room Details Section
 */
const RoomDetails = ({ room, t }) => {
  return (
    <div className="p-5 border-b border-gray-100">
      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
        <div className="w-1 h-5 bg-blue-500 rounded-full" />
        {t("hotels.details.booking_page.summary.room_details")}
      </h4>
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-gray-900 text-sm mb-2">
            {room.name}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg">
              <LuUsers className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium">
                {room.guests} {t("hotels.details.booking_page.summary.guests")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-lg">
              <LuCalendar className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-medium">
                {room.nights} {t("hotels.details.booking_page.summary.nights")}
              </span>
            </div>
          </div>

          {/* Board Basis */}
          {room.boardBasis && (
            <div className="mt-2 text-xs bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-semibold text-gray-700">{t("hotels.details.booking_page.summary.board_basis")}: </span>
              <span className="text-gray-600">
                {room.boardBasis.description || room.boardBasis.type || t("hotels.details.booking_page.summary.not_available")}
              </span>
            </div>
          )}

          {/* Refundability Badge */}
          {room.refundability !== undefined && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  room.refundable
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                    : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"
                }`}
              >
                <BsCheckCircleFill className="w-3.5 h-3.5" />
                {room.refundable ? t("hotels.details.booking_page.summary.refundable") : t("hotels.details.booking_page.summary.non_refundable")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Dates Section
 */
const DatesSection = ({ dates, t }) => {
  return (
    <div className="p-5 border-b border-gray-100">
      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
        <div className="w-1 h-5 bg-purple-500 rounded-full" />
        {t("hotels.details.booking_page.summary.dates")}
      </h4>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-600 font-medium">
            {t("hotels.details.booking_page.summary.check_in")}
          </span>
          <span className="text-sm font-bold text-gray-900">{dates.checkInFormatted}</span>
        </div>
        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-600 font-medium">
            {t("hotels.details.booking_page.summary.check_out")}
          </span>
          <span className="text-sm font-bold text-gray-900">{dates.checkOutFormatted}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Pricing Section
 */
const PricingSection = ({ totals, room, currency, currencySymbol, t, isRTL }) => {
  return (
    <div className="p-5">
      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
        <div className="w-1 h-5 bg-green-500 rounded-full" />
        {t("hotels.details.booking_page.summary.price_breakdown")}
      </h4>
      <div className="space-y-2.5">
        {/* Base Price */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {t("hotels.details.booking_page.summary.room_price")} ({room.nights}{" "}
            {t("hotels.details.booking_page.summary.nights")})
          </span>
          <span className="font-semibold text-gray-900" >
            {formatPrice(totals.basePrice, currency, currencySymbol, isRTL)}
          </span>
        </div>

        {/* Taxes */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {t("hotels.details.booking_page.summary.taxes")}
          </span>
          <span className="font-semibold text-gray-900" >
            {formatPrice(totals.taxes, currency, currencySymbol, isRTL)}
          </span>
        </div>

        {/* Service Fee */}
        {totals.serviceFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t("hotels.details.booking_page.summary.service_fee")}
            </span>
            <span className="font-semibold text-gray-900" >
              {formatPrice(totals.serviceFee, currency, currencySymbol, isRTL)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="border-t-2 border-gray-200 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 text-base">
              {t("hotels.details.booking_page.summary.total")}
            </span>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" >
              {formatPrice(totals.total, currency, currencySymbol, isRTL)}
            </span>
          </div>
        </div>
      </div>

      {/* Savings Notice */}
      {room.originalPrice && room.originalPrice > room.price && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <BsCheckCircleFill className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-green-800 font-semibold inline-flex items-center gap-1">
              {t("hotels.details.booking_page.summary.savings", {
                amount: ((room.originalPrice - room.price) * room.nights).toFixed(2),
                currency: currency === "SAR" ? "" : currencySymbol,
              })}
              {currency === "SAR" && <SARCurrencyIcon className="w-3 h-3 inline-flex" />}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Security Badge
 */
const SecurityBadge = ({ t }) => {
  return (
    <div className="px-5 pb-5">
      <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <BsShieldCheck className="w-5 h-5 text-blue-600" />
        <span className="text-xs font-semibold text-blue-800">
          {t("hotels.details.booking_page.summary.secure_booking")}
        </span>
      </div>
    </div>
  );
};

/**
 * Main Booking Summary Component
 */
export default function BookingSummary({ bookingData, timeRemaining, formattedTime, isExpired }) {
  const { t, i18n } = useTranslation();
  const currency = bookingData.room?.currency || "SAR";
  const currencySymbol = getCurrencySymbol(currency, t);
  const totals = calculateTotal(bookingData);
  const isRTL = i18n.language === "ar";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      {/* Session Timer Display */}
      {!isExpired && timeRemaining > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 border-b border-blue-500">
          <div className="flex items-center justify-center gap-2">
            <BsClock className="w-4 h-4 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium">
              {t("hotels.details.booking_page.session_time_remaining", "Time remaining")}:{" "}
              <span className="font-bold text-sm sm:text-base  bg-opacity-20 px-2 py-0.5 rounded">
                {formattedTime}
              </span>
            </span>
          </div>
        </div>
      )}
      <HotelInfo hotel={bookingData.hotel} />
      <RoomDetails room={bookingData.room} t={t} />
      <DatesSection dates={bookingData.dates} t={t} />
      <PricingSection
        totals={totals}
        room={bookingData.room}
        currency={currency}
        currencySymbol={currencySymbol}
        t={t}
        isRTL={isRTL}
      />
      <SecurityBadge t={t} />
    </div>
  );
}
