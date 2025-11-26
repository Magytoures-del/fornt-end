"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import {
  BsCheckCircle,
  BsAirplane,
  BsPerson,
  BsCreditCard,
  BsDownload,
  BsPrinter,
  BsWhatsapp,
  BsCalendarEvent,
  BsClock,
  BsGeoAlt,
  BsTelephone,
  BsEnvelope,
} from "react-icons/bs";
import FlightBookingSuccess from "@/components/flights/FlightBookingSuccess";
import { BiSupport } from "react-icons/bi";

// export async function generateMetadata() {
//   return {
//     title: "Flight Booking Confirmed | Flymoon Travel",
//     description:
//       "Your flight booking has been successfully confirmed. View your booking details, download tickets, and get important travel information.",
//     keywords:
//       "flight booking confirmed, flight ticket, booking confirmation, travel confirmation, flight details",
//     openGraph: {
//       title: "Flight Booking Confirmed | Flymoon Travel",
//       description:
//         "Your flight booking has been successfully confirmed. View your booking details and get ready for your journey.",
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: "Flight Booking Confirmed | Flymoon Travel",
//       description:
//         "Your flight booking has been successfully confirmed. View your booking details and get ready for your journey.",
//     },
//   };
// }

export default function FlightBookingSuccessPage() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();

  // Get booking data from URL parameters or localStorage
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Memoize booking ID to prevent unnecessary re-renders
  const bookingId = useMemo(
    () => searchParams.get("bookingId"),
    [searchParams]
  );

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setError(null);

        // Use mock data for demonstration
        const mockData = {
          bookingId: "FM123456789",
          status: "confirmed",
          bookingDate: new Date().toISOString(),
          flight: {
            airlineName: "Saudi Arabian Airlines",
            airlineCode: "SV",
            flightNo: "SV123",
            fromCity: "Riyadh",
            fromAirport: "King Khalid International Airport",
            fromCode: "RUH",
            toCity: "Dubai",
            toAirport: "Dubai International Airport",
            toCode: "DXB",
            departureDate: "2025-10-15",
            departureTime: "14:30",
            arrivalDate: "2025-10-15",
            arrivalTime: "17:45",
            duration: "1h 15m",
            cabinClass: "Economy",
            stops: 0,
          },
          passengers: [
            {
              type: "Adult",
              title: "Mr",
              firstName: "Ahmed",
              lastName: "Al-Rashid",
              dateOfBirth: "1990-05-15",
              gender: "Male",
              nationality: "Saudi Arabia",
              passportNumber: "K12345678",
              passportExpiry: "2028-12-31",
              email: "ahmed.rashid@example.com",
              phone: "+966501234567",
            },
            {
              type: "Adult",
              title: "Mrs",
              firstName: "Fatima",
              lastName: "Al-Rashid",
              dateOfBirth: "1992-08-20",
              gender: "Female",
              nationality: "Saudi Arabia",
              passportNumber: "K87654321",
              passportExpiry: "2029-06-15",
              email: "fatima.rashid@example.com",
              phone: "+966509876543",
            },
          ],
          pricing: {
            currency: "SAR",
            baseFare: "1,200.00",
            taxes: "180.00",
            fees: "50.00",
            total: "1,430.00",
            baggage: "Included (23kg)",
            seatSelection: "Standard",
            meal: "Not Selected",
          },
          paymentDetails: {
            method: "Credit Card",
            last4Digits: "4242",
            cardType: "Visa",
            transactionId: "TXN987654321",
          },
        };

        setBookingData(mockData);
      } catch (error) {
        console.error("Error loading booking data:", error);
        setError(error.message || "Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [bookingId]);

  // Contact details from translations (fallbacks provided)
  const supportEmail = t("footer.email", "contact@flymoonsa.com");
  const supportPhoneRaw = t("footer.phone", "+1234567890");
  const supportPhoneDigits = String(supportPhoneRaw).replace(/\D/g, "");
  const supportPhoneIntl = supportPhoneDigits.startsWith("00")
    ? supportPhoneDigits.slice(2)
    : supportPhoneDigits;

  // Memoize event handlers to prevent unnecessary re-renders
  const handleDownloadTicket = useCallback(async () => {
    if (!bookingData || downloading) return;
    try {
      setDownloading(true);
      const res = await fetch("/api/tickets/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingData }),
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${bookingData?.bookingId || "ticket"}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert(
        t(
          "booking_success.download_failed",
          "Failed to download ticket. Please try again."
        )
      );
    } finally {
      setDownloading(false);
    }
  }, [bookingData, downloading, t]);

  const handlePrintTicket = useCallback(() => {
    window.print();
  }, []);

  const handleWhatsAppShare = useCallback(() => {
    if (!bookingData) return;

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
        `${t("booking_success.booking_reference", "Booking Reference")}: ${
          bookingData?.bookingId || ""
        }`
    );
    const phoneNumber = supportPhoneIntl;
    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [bookingData, t, supportPhoneIntl]);

  // Keyboard navigation support
  const handleKeyDown = useCallback((event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div
            className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            aria-hidden="true"
          ></div>
          <p className="text-lg text-gray-600 font-medium">
            {t("booking_success.loading", "Loading booking details...")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t(
              "booking_success.loading_subtitle",
              "Please wait while we fetch your booking information"
            )}
          </p>
        </div>
      </div>
    );
  }

  if (!bookingData || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div
          className="text-center max-w-md mx-auto p-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <BsCheckCircle
              className="w-12 h-12 text-white"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error
              ? t("booking_success.error_title", "Error Loading Booking")
              : t("booking_success.not_found_title", "Booking Not Found")}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {error
              ? t(
                  "booking_success.error_message",
                  "There was an error loading your booking details. Please try again or contact support."
                )
              : t(
                  "booking_success.not_found_message",
                  "We couldn't find your booking details. Please check your booking reference or contact our support team."
                )}
          </p>
          {error && (
            <p className="text-sm text-red-600 mb-6 font-mono bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/flights"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label={t(
                "booking_success.search_flights_aria",
                "Search for new flights"
              )}
            >
              <BsAirplane className="w-5 h-5 mr-3" aria-hidden="true" />
              {t("booking_success.search_flights", "Search Flights")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300"
              aria-label={t(
                "booking_success.contact_support_aria",
                "Contact customer support"
              )}
            >
              <BsPerson className="w-5 h-5 mr-3" aria-hidden="true" />
              {t("booking_success.contact_support", "Contact Support")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Simple Success Header */}
          <header className="text-center mb-8" role="banner">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mx-4 sm:mx-0">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <BsCheckCircle className="w-8 h-8 text-white" />
                </div>

                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {t("booking_success.title", "Booking Confirmed!")}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {t(
                      "booking_success.subtitle",
                      "Your flight has been successfully booked and confirmed."
                    )}
                  </p>

                  {/* Booking Reference */}
                  <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg border mb-4">
                    <span className="text-sm font-medium text-gray-600 mr-2">
                      {t(
                        "booking_success.booking_reference",
                        "Booking Reference"
                      )}
                      :
                    </span>
                    <span
                      className="font-bold text-blue-600 font-mono"
                      aria-label={`Booking reference: ${
                        bookingData.bookingId || "N/A"
                      }`}
                    >
                      {bookingData.bookingId || "N/A"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <button
                      onClick={handleDownloadTicket}
                      onKeyDown={(e) => handleKeyDown(e, handleDownloadTicket)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
                      disabled={downloading}
                      aria-busy={downloading}
                      aria-label={t(
                        "booking_success.download_ticket_aria",
                        "Download ticket as PDF"
                      )}
                      role="button"
                      tabIndex={0}
                    >
                      {downloading ? (
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
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
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <BsDownload
                          className="w-4 h-4 mr-2"
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-sm">
                        {downloading
                          ? t("booking_success.downloading", "Downloading...")
                          : t("booking_success.download_ticket", "Download")}
                      </span>
                    </button>
                    <button
                      onClick={handlePrintTicket}
                      onKeyDown={(e) => handleKeyDown(e, handlePrintTicket)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-auto"
                      aria-label={t(
                        "booking_success.print_ticket_aria",
                        "Print ticket"
                      )}
                      role="button"
                      tabIndex={0}
                    >
                      <BsPrinter className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span className="text-sm">
                        {t("booking_success.print_ticket", "Print")}
                      </span>
                    </button>
                    <button
                      onClick={handleWhatsAppShare}
                      onKeyDown={(e) => handleKeyDown(e, handleWhatsAppShare)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 w-full sm:w-auto"
                      aria-label={t(
                        "booking_success.share_whatsapp_aria",
                        "Share booking details via WhatsApp"
                      )}
                      role="button"
                      tabIndex={0}
                    >
                      <BsWhatsapp className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span className="text-sm">
                        {t("booking_success.share_whatsapp", "Share")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Flight Details - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <FlightBookingSuccess
                bookingData={bookingData}
                onDownload={handleDownloadTicket}
                onPrint={handlePrintTicket}
                onWhatsAppShare={handleWhatsAppShare}
                showActions={false}
                className="mb-8"
              />
            </div>

            {/* Enhanced Pricing Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pricing Details */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 h-fit">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BsCreditCard className="w-6 h-6 sm:w-7 sm:h-7  text-green-600" />
                  {t("flight_details.pricing_details", "Pricing Details")}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">
                      {t("flight_details.base_fare", "Base Fare")}
                    </span>
                    <span className="font-bold text-lg">
                      {bookingData.pricing.currency}{" "}
                      {bookingData.pricing.baseFare}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">
                      {t("flight_details.taxes", "Taxes & Fees")}
                    </span>
                    <span className="font-bold text-lg">
                      {bookingData.pricing.currency} {bookingData.pricing.taxes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">
                      {t("flight_details.fees", "Service Fees")}
                    </span>
                    <span className="font-bold text-lg">
                      {bookingData.pricing.currency} {bookingData.pricing.fees}
                    </span>
                  </div>

                  {/* Additional Services */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {t(
                        "flight_details.additional_services",
                        "Additional Services"
                      )}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex items-center">
                          <BsAirplane className="w-4 h-4 mr-2" />
                          {t("flight_details.baggage", "Baggage")}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {bookingData.pricing.baggage ||
                            t("flight_details.included", "Included")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex items-center">
                          <BsPerson className="w-4 h-4 mr-2" />
                          {t("flight_details.seat_selection", "Seat Selection")}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {bookingData.pricing.seatSelection ||
                            t("flight_details.standard", "Standard")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex items-center">
                          <BsCheckCircle className="w-4 h-4 mr-2" />
                          {t("flight_details.meal", "Meal")}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {bookingData.pricing.meal ||
                            t("flight_details.not_selected", "Not Selected")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        {t("flight_details.total", "Total Amount")}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {bookingData.pricing.currency}{" "}
                        {bookingData.pricing.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 h-fit">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BiSupport className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
                  {t("booking_success.contact_info", "Contact Information")}
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <BsEnvelope className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {t("booking_success.email", "Email")}
                      </p>
                      <a
                        href={`mailto:${supportEmail}`}
                        className="text-sm text-blue-700 underline underline-offset-2 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                        aria-label={
                          t("booking_success.email", "Email") +
                          ": " +
                          supportEmail
                        }
                      >
                        {supportEmail}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <BsTelephone className="w-6 h-6 text-[#F43F5E]" />
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {t("booking_success.phone", "Phone")}
                      </p>
                      <a
                        href={`tel:+${supportPhoneIntl}`}
                        className="text-sm text-blue-700 underline underline-offset-2 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                        aria-label={
                          t("booking_success.phone", "Phone") +
                          ": +" +
                          supportPhoneIntl
                        }
                        dir="ltr"
                      >
                        {supportPhoneRaw}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <BsWhatsapp className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {t("booking_success.whatsapp", "WhatsApp")}
                      </p>
                      <a
                        href={`https://wa.me/${supportPhoneIntl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 underline underline-offset-2 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
                        aria-label={
                          t("booking_success.whatsapp", "WhatsApp") +
                          ": +" +
                          supportPhoneIntl
                        }
                        dir="ltr"
                      >
                        +{supportPhoneIntl}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
