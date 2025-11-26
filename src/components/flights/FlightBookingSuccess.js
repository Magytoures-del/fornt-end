"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  BsCheckCircle,
  BsAirplane,
  BsPerson,
  BsCreditCard,
  BsDownload,
  BsPrinter,
  BsWhatsapp,
  BsChevronDown,
  BsChevronUp,
  BsTelephone,
  BsGeoAlt,
  BsClock,
  BsCalendarEvent,
} from "react-icons/bs";
import { TbPlaneInflight } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";

import Image from "next/image";
// Fallback-only client PDF export (server is primary)
import { exportElementToPdf } from "@/utils/exportPdf";
import FlightCard from "./details/FlightCard";
import { localizeCurrency } from "@/utils/numberLocalization";

const FlightBookingSuccess = memo(
  ({
    bookingData,
    onDownload,
    onPrint,
    onWhatsAppShare,
    showActions = true,
    className = "",
  }) => {
    const { t, i18n } = useTranslation();

    // State for collapsible sections
    const [isPassengerInfoExpanded, setIsPassengerInfoExpanded] =
      useState(true);
    const [isFlightDetailsExpanded, setIsFlightDetailsExpanded] =
      useState(true);
    const [isBookingSummaryExpanded, setIsBookingSummaryExpanded] =
      useState(true);

    // Memoize formatPrice function to prevent recreation on every render
    const formatPrice = useCallback(
      (price, currency = "SAR") => {
        return localizeCurrency(price, currency, i18n?.language || "en", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      },
      [i18n?.language]
    );

    // Memoize formatTimeWithMeridiem function
    const formatTimeWithMeridiem = useCallback(
      (timeStr) => {
        const raw = (timeStr || "").toString().trim();
        if (!raw) return "";

        const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/);
        if (isoMatch) {
          const dateObj = new Date(raw);
          if (!isNaN(dateObj.getTime())) {
            const locale = i18n?.language === "ar" ? "ar-SA" : "en-US";
            return new Intl.DateTimeFormat(locale, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              calendar: "gregory",
            }).format(dateObj);
          }
        }

        const ampmMatch = raw.match(/\b(AM|PM|am|pm|Am|Pm)\b/);
        if (ampmMatch) {
          const isPM = ampmMatch[0].toLowerCase() === "pm";
          const label = isPM ? t("flight_results.pm") : t("flight_results.am");
          return raw.replace(/\b(AM|PM|am|pm|Am|Pm)\b/, label);
        }

        const m = raw.match(/^(\d{1,2}):(\d{2})$/);
        if (!m) return raw;
        let hours = parseInt(m[1], 10);
        const minutes = m[2];
        const isPM = hours >= 12;
        const label = isPM ? t("flight_results.pm") : t("flight_results.am");
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${minutes} ${label}`;
      },
      [i18n?.language, t]
    );

    // Memoize getAirlineLogo function
    const getAirlineLogo = useCallback((airlineCode) => {
      const code = (airlineCode || "").toString().trim().toUpperCase();
      if (!code) return "/logo.png";
      return `https://sacontent.akbartravels.com/AirlineLogo/assets/images/v2/AirlineLogo/${code}.png`;
    }, []);

    // Memoize event handlers to prevent unnecessary re-renders
    const handleDownload = useCallback(async () => {
      if (onDownload) {
        // Delegate to parent (server-side generation)
        onDownload(bookingData);
        return;
      }
      // Fallback
      try {
        const container = document.getElementById("ticket-print-area");
        if (!container) {
          console.warn("Ticket container not found for PDF export.");
          alert("Unable to prepare the ticket for download. Please try again.");
          return;
        }
        await exportElementToPdf({
          element: container,
          fileName: `${bookingData?.bookingId || "ticket"}.pdf`,
          margin: 8,
          scale: 2,
        });
      } catch (err) {
        console.error("PDF export failed:", err);
        alert("Failed to download ticket. Please try again.");
      }
    }, [onDownload, bookingData]);

    const handlePrint = useCallback(() => {
      if (onPrint) {
        onPrint(bookingData);
      } else {
        window.print();
      }
    }, [onPrint, bookingData]);

    const handleWhatsApp = useCallback(() => {
      if (onWhatsAppShare) {
        onWhatsAppShare(bookingData);
      } else {
        const message = encodeURIComponent(
          `${t(
            "booking_success.whatsapp_message",
            "I've successfully booked my flight!"
          )}\n\n` +
            `${t("booking_success.flight_details", "Flight Details")}:\n` +
            `${bookingData?.flight?.airlineName || ""} - ${
              bookingData?.flight?.flightNo || ""
            }\n` +
            `${bookingData?.flight?.fromCity || ""} to ${
              bookingData?.flight?.toCity || ""
            }\n` +
            `${t(
              "booking_success.departure",
              "Departure"
            )}: ${formatTimeWithMeridiem(
              bookingData?.flight?.departureTime
            )}\n` +
            `${t("booking_success.booking_reference", "Booking Reference")}: ${
              bookingData?.bookingId || ""
            }`
        );
        const phoneNumber = "1234567890";
        window.open(
          `https://wa.me/${phoneNumber}?text=${message}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    }, [onWhatsAppShare, bookingData, t, formatTimeWithMeridiem]);

    // Memoize expensive computations
    const airlineLogo = useMemo(
      () => getAirlineLogo(bookingData?.flight?.airlineCode),
      [getAirlineLogo, bookingData?.flight?.airlineCode]
    );

    const formattedDepartureTime = useMemo(
      () => formatTimeWithMeridiem(bookingData?.flight?.departureTime),
      [formatTimeWithMeridiem, bookingData?.flight?.departureTime]
    );

    const formattedArrivalTime = useMemo(
      () => formatTimeWithMeridiem(bookingData?.flight?.arrivalTime),
      [formatTimeWithMeridiem, bookingData?.flight?.arrivalTime]
    );

    const formattedPrices = useMemo(
      () => ({
        baseFare: formatPrice(bookingData?.pricing?.baseFare),
        taxes: formatPrice(bookingData?.pricing?.taxes),
        serviceFee: formatPrice(bookingData?.pricing?.serviceFee),
        total: formatPrice(bookingData?.pricing?.total),
      }),
      [formatPrice, bookingData?.pricing]
    );

    if (!bookingData) {
      return (
        <div
          className={`text-center p-8 ${className}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsCheckCircle
              className="w-8 h-8 text-red-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("booking_success.not_found_title", "Booking Not Found")}
          </h3>
          <p className="text-gray-600">
            {t(
              "booking_success.not_found_message",
              "We couldn't find your booking details."
            )}
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        {" "}
        <div
          id="ticket-print-area"
          className={`bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm ${className}`}
          role="main"
          aria-label="Flight booking confirmation"
        >
          {/* Gradient Header */}
          {/* <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <BsCheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {t("booking_success.title", "Booking Confirmed!")}
          </h2>
          <p className="text-blue-100 mb-3">
            {t(
              "booking_success.subtitle",
              "Your flight has been successfully booked"
            )}
          </p>
      
        </div>
      </div> */}

          <div className="p-6">
            {/* Action Buttons */}
            {/* {showActions && (
            <div
              className="flex flex-wrap justify-center gap-4 mb-8 no-print"
              role="toolbar"
              aria-label="Ticket actions"
            >
              <button
                onClick={handleDownload}
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label={t(
                  "booking_success.download_ticket_aria",
                  "Download ticket as PDF"
                )}
              >
                <BsDownload
                  className="w-5 h-5 mr-2 group-hover:animate-bounce"
                  aria-hidden="true"
                />
                {t("booking_success.download_ticket", "Download")}
              </button>
              <button
                onClick={handlePrint}
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300"
                aria-label={t(
                  "booking_success.print_ticket_aria",
                  "Print ticket"
                )}
              >
                <BsPrinter
                  className="w-5 h-5 mr-2 group-hover:animate-bounce"
                  aria-hidden="true"
                />
                {t("booking_success.print_ticket", "Print")}
              </button>
              <button
                onClick={handleWhatsApp}
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300"
                aria-label={t(
                  "booking_success.share_whatsapp_aria",
                  "Share booking details via WhatsApp"
                )}
              >
                <BsWhatsapp
                  className="w-5 h-5 mr-2 group-hover:animate-bounce"
                  aria-hidden="true"
                />
                {t("booking_success.share_whatsapp", "Share")}
              </button>
            </div>
          )} */}

            {/* Flight Details */}
            <div className="mb-8">
              <div
                className="flex items-center mb-6 gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2 transition-colors duration-200"
                onClick={() =>
                  setIsFlightDetailsExpanded(!isFlightDetailsExpanded)
                }
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl shadow-sm">
                  <TbPlaneInflight className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 flex-1">
                  {t("booking_success.flight_details", "Flight Details")}
                </h3>
                {isFlightDetailsExpanded ? (
                  <BsChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <BsChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Collapsible Flight Details Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isFlightDetailsExpanded
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {/* Airline Info */}

                {/* Flight Route */}
                <FlightCard results={bookingData.card} loading={false} />
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div
                        className="text-2xl font-bold text-gray-900 mb-2"
                        aria-label={`Departure time: ${formattedDepartureTime}`}
                      >
                        {formattedDepartureTime}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {bookingData.flight?.fromCity || "Origin"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bookingData.flight?.fromAirport || "Airport"}
                      </div>
                    </div>

                    <div className="flex-1 mx-6">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div
                          className="flex-1 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 rounded-full"
                          aria-hidden="true"
                        ></div>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full shadow-lg">
                          <span className="text-sm font-bold text-white">
                            {bookingData.flight?.duration || "Duration"}
                          </span>
                        </div>
                        <div
                          className="flex-1 h-1 bg-gradient-to-l from-blue-300 via-purple-300 to-blue-300 rounded-full"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-medium text-sm">
                          {bookingData.flight?.stops === 0
                            ? t("flight_results.direct")
                            : t("flight_results.stops_count", {
                                count: bookingData.flight?.stops || 0,
                              })}
                        </span>
                      </div>
                    </div>

                    <div className="text-center flex-1">
                      <div
                        className="text-2xl font-bold text-gray-900 mb-2"
                        aria-label={`Arrival time: ${formattedArrivalTime}`}
                      >
                        {formattedArrivalTime}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {bookingData.flight?.toCity || "Destination"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bookingData.flight?.toAirport || "Airport"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flight Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      {t("booking_success.cabin_class", "Class")}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.flight?.cabinClass || "Economy"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      {t("booking_success.passengers", "Passengers")}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.passengers?.adults || 1}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      {t("booking_success.aircraft", "Aircraft")}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.flight?.aircraft || "N/A"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1 font-medium">
                      {t("booking_success.seats", "Seats")}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {bookingData.flight?.seats || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            {bookingData.passengerInfo && (
              <div className="mb-8 border-t border-gray-100 pt-6">
                <div
                  className="flex items-center gap-3 mb-6 cursor-pointer hover:bg-gray-50 rounded-xl p-2 transition-colors duration-200"
                  onClick={() =>
                    setIsPassengerInfoExpanded(!isPassengerInfoExpanded)
                  }
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center  shadow-sm  ">
                    <IoPerson className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {t(
                      "booking_success.passenger_info",
                      "Passenger Information"
                    )}
                  </h3>
                  {isPassengerInfoExpanded ? (
                    <BsChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <BsChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isPassengerInfoExpanded
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-medium">
                          {t("booking_success.full_name", "Full Name")}
                        </label>
                        <p className="font-semibold text-gray-900">
                          {bookingData.passengerInfo.fullName || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-medium">
                          {t("booking_success.email", "Email")}
                        </label>
                        <p className="font-semibold text-gray-900">
                          {bookingData.passengerInfo.email || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-medium">
                          {t("booking_success.phone", "Phone")}
                        </label>
                        <p className="font-semibold text-gray-900">
                          {bookingData.passengerInfo.phone || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600 font-medium">
                          {t("booking_success.passport", "Passport")}
                        </label>
                        <p className="font-semibold text-gray-900">
                          {bookingData.passengerInfo.passport || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Travel Tips Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm p-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <BsCalendarEvent className="w-6 h-6 text-gray-600" />
            {t("booking_success.travel_tips", "Travel Tips")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <BsClock className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  {t(
                    "booking_success.check_in_time",
                    "Check-in opens 24 hours before departure"
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {t(
                    "booking_success.check_in_desc",
                    "Use online check-in for faster boarding"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BsGeoAlt className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  {t(
                    "booking_success.arrival_time",
                    "Arrive 2-3 hours early for international flights"
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {t(
                    "booking_success.arrival_desc",
                    "Allow extra time for security and immigration"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BsTelephone className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  {t(
                    "booking_success.contact_support_tip",
                    "Need help? Contact our support team"
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {t(
                    "booking_success.contact_desc",
                    "Available 24/7 for your assistance"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FlightBookingSuccess.displayName = "FlightBookingSuccess";

export default FlightBookingSuccess;
