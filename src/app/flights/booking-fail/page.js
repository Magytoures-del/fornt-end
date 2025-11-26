"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BsXCircle,
  BsAirplane,
  BsArrowLeft,
  BsExclamationTriangle,
  BsWhatsapp,
  BsTelephone,
  BsEnvelope,
  BsCreditCard,
  BsInfoCircle,
} from "react-icons/bs";
import { BiSupport } from "react-icons/bi";

export default function FlightBookingFailPage() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get error data from URL parameters or sessionStorage
  const [bookingData, setBookingData] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize error details
  const errorReason = useMemo(
    () => searchParams.get("reason") || "unknown",
    [searchParams]
  );

  const transactionId = useMemo(
    () => searchParams.get("transactionId"),
    [searchParams]
  );

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        // Try to get booking data from sessionStorage
        const storedData = sessionStorage.getItem("pendingBooking");
        if (storedData) {
          setBookingData(JSON.parse(storedData));
        }

        // Set error information based on the error reason
        const errorMessages = {
          payment_failed: {
            title: t("booking_fail.payment_failed_title", "Payment Failed"),
            message: t(
              "booking_fail.payment_failed_message",
              "Your payment could not be processed. Please check your payment details and try again."
            ),
            icon: BsCreditCard,
          },
          payment_declined: {
            title: t("booking_fail.payment_declined_title", "Payment Declined"),
            message: t(
              "booking_fail.payment_declined_message",
              "Your payment was declined by your bank. Please contact your bank or try a different payment method."
            ),
            icon: BsCreditCard,
          },
          timeout: {
            title: t("booking_fail.timeout_title", "Booking Timeout"),
            message: t(
              "booking_fail.timeout_message",
              "Your booking session has expired. Please search for flights again and complete the booking process."
            ),
            icon: BsExclamationTriangle,
          },
          availability: {
            title: t(
              "booking_fail.availability_title",
              "Flight No Longer Available"
            ),
            message: t(
              "booking_fail.availability_message",
              "Unfortunately, the selected flight is no longer available. Please search for alternative flights."
            ),
            icon: BsAirplane,
          },
          validation: {
            title: t("booking_fail.validation_title", "Validation Error"),
            message: t(
              "booking_fail.validation_message",
              "There was an error validating your booking information. Please check your details and try again."
            ),
            icon: BsExclamationTriangle,
          },
          network: {
            title: t("booking_fail.network_title", "Network Error"),
            message: t(
              "booking_fail.network_message",
              "A network error occurred while processing your booking. Please check your internet connection and try again."
            ),
            icon: BsExclamationTriangle,
          },
          unknown: {
            title: t("booking_fail.unknown_title", "Booking Failed"),
            message: t(
              "booking_fail.unknown_message",
              "An unexpected error occurred while processing your booking. Please try again or contact our support team."
            ),
            icon: BsXCircle,
          },
        };

        setErrorInfo(errorMessages[errorReason] || errorMessages.unknown);
      } catch (error) {
        console.error("Error loading booking data:", error);
        setErrorInfo({
          title: t("booking_fail.error_title", "Error"),
          message: t(
            "booking_fail.error_message",
            "An error occurred while loading booking details."
          ),
          icon: BsXCircle,
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [errorReason, t]);

  // Contact details from translations (fallbacks provided)
  const supportEmail = t("footer.email", "contact@flymoonsa.com");
  const supportPhoneRaw = t("footer.phone", "+1234567890");
  const supportPhoneDigits = String(supportPhoneRaw).replace(/\D/g, "");
  const supportPhoneIntl = supportPhoneDigits.startsWith("00")
    ? supportPhoneDigits.slice(2)
    : supportPhoneDigits;

  // Memoize event handlers
  const handleRetryBooking = useCallback(() => {
    // Go back to flight details page with stored booking data
    if (bookingData?.bookId && bookingData?.tripType) {
      router.push(
        `/flights/details/${bookingData.tripType}/${bookingData.bookId}`
      );
    } else {
      router.push("/flights");
    }
  }, [bookingData, router]);

  const handleSearchNewFlights = useCallback(() => {
    // Clear pending booking from sessionStorage
    sessionStorage.removeItem("pendingBooking");
    router.push("/flights");
  }, [router]);

  const handleContactSupport = useCallback(() => {
    router.push("/contact");
  }, [router]);

  const handleWhatsAppSupport = useCallback(() => {
    const message = encodeURIComponent(
      `${t(
        "booking_fail.whatsapp_message",
        "I need help with a failed booking."
      )}\n\n` +
        `${t("booking_fail.error_reason", "Error Reason")}: ${
          errorInfo?.title || errorReason
        }\n` +
        (transactionId
          ? `${t(
              "booking_fail.transaction_id",
              "Transaction ID"
            )}: ${transactionId}\n`
          : "")
    );
    const phoneNumber = supportPhoneIntl;
    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [errorInfo, errorReason, transactionId, t, supportPhoneIntl]);

  // Keyboard navigation support
  const handleKeyDown = useCallback((event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div
            className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            aria-hidden="true"
          ></div>
          <p className="text-lg text-gray-600 font-medium">
            {t("booking_fail.loading", "Loading details...")}
          </p>
        </div>
      </div>
    );
  }

  const ErrorIcon = errorInfo?.icon || BsXCircle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(239,68,68,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-100 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Header */}
          <header className="text-center mb-8" role="banner">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-red-100 mx-4 sm:mx-0">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <ErrorIcon className="w-8 h-8 text-white" />
                </div>

                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {errorInfo?.title ||
                      t("booking_fail.title", "Booking Failed")}
                  </h1>
                  <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                    {errorInfo?.message ||
                      t(
                        "booking_fail.subtitle",
                        "We were unable to complete your booking. Please try again or contact our support team."
                      )}
                  </p>

                  {/* Transaction Reference (if available) */}
                  {transactionId && (
                    <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg border mb-4">
                      <span className="text-sm font-medium text-gray-600 mr-2">
                        {t("booking_fail.transaction_id", "Transaction ID")}:
                      </span>
                      <span
                        className="font-bold text-red-600 font-mono"
                        aria-label={`Transaction ID: ${transactionId}`}
                      >
                        {transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* What to Do Next Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recommended Actions */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BsInfoCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  {t("booking_fail.what_next", "What to Do Next")}
                </h2>

                <div className="space-y-6">
                  {/* Primary Actions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {t(
                        "booking_fail.recommended_actions",
                        "Recommended Actions"
                      )}
                    </h3>

                    {/* Retry Booking Button */}
                    {bookingData && (
                      <button
                        onClick={handleRetryBooking}
                        onKeyDown={(e) => handleKeyDown(e, handleRetryBooking)}
                        className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        aria-label={t(
                          "booking_fail.retry_booking_aria",
                          "Retry booking with same flight"
                        )}
                        role="button"
                        tabIndex={0}
                      >
                        <BsArrowLeft
                          className="w-5 h-5 mr-3"
                          aria-hidden="true"
                        />
                        {t("booking_fail.retry_booking", "Retry This Booking")}
                      </button>
                    )}

                    {/* Search New Flights Button */}
                    <button
                      onClick={handleSearchNewFlights}
                      onKeyDown={(e) =>
                        handleKeyDown(e, handleSearchNewFlights)
                      }
                      className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                      aria-label={t(
                        "booking_fail.search_flights_aria",
                        "Search for new flights"
                      )}
                      role="button"
                      tabIndex={0}
                    >
                      <BsAirplane className="w-5 h-5 mr-3" aria-hidden="true" />
                      {t("booking_fail.search_flights", "Search New Flights")}
                    </button>
                  </div>

                  {/* Common Issues and Solutions */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {t(
                        "booking_fail.common_issues",
                        "Common Issues & Solutions"
                      )}
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <BsExclamationTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>
                            {t("booking_fail.payment_issue", "Payment Issue")}:
                          </strong>{" "}
                          {t(
                            "booking_fail.payment_issue_solution",
                            "Check your card details, ensure sufficient funds, or try a different payment method."
                          )}
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <BsExclamationTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>
                            {t(
                              "booking_fail.availability_issue",
                              "Availability"
                            )}
                            :
                          </strong>{" "}
                          {t(
                            "booking_fail.availability_issue_solution",
                            "The flight may have sold out. Search again for alternative flights or dates."
                          )}
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <BsExclamationTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>
                            {t("booking_fail.session_issue", "Session Timeout")}
                            :
                          </strong>{" "}
                          {t(
                            "booking_fail.session_issue_solution",
                            "Your session may have expired. Start a new search and complete the booking faster."
                          )}
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <BsExclamationTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>
                            {t(
                              "booking_fail.technical_issue",
                              "Technical Issue"
                            )}
                            :
                          </strong>{" "}
                          {t(
                            "booking_fail.technical_issue_solution",
                            "Check your internet connection and try again. If the problem persists, contact our support team."
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Booking Summary (if available) */}
              {bookingData && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <BsAirplane className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                    {t(
                      "booking_fail.attempted_booking",
                      "Attempted Booking Details"
                    )}
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">
                        {t("booking_fail.trip_type", "Trip Type")}
                      </span>
                      <span className="font-semibold">
                        {bookingData.tripType === "roundtrip"
                          ? t("booking_fail.roundtrip", "Round Trip")
                          : t("booking_fail.oneway", "One Way")}
                      </span>
                    </div>
                    {bookingData.bookId && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600">
                          {t("booking_fail.book_id", "Booking Reference")}
                        </span>
                        <span className="font-semibold font-mono">
                          {bookingData.bookId}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 italic">
                      {t(
                        "booking_fail.booking_summary_note",
                        "This booking was not completed. No charges were made to your account."
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Support Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Need Help Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 h-fit">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <BiSupport className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-600" />
                  {t("booking_fail.need_help", "Need Help?")}
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  {t(
                    "booking_fail.support_message",
                    "Our support team is here to assist you with any booking issues. Contact us through any of these channels:"
                  )}
                </p>

                {/* Contact Options */}
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <BsEnvelope className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {t("booking_fail.email", "Email")}
                      </p>
                      <a
                        href={`mailto:${supportEmail}`}
                        className="text-sm text-blue-700 underline underline-offset-2 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded break-all"
                        aria-label={
                          t("booking_fail.email", "Email") + ": " + supportEmail
                        }
                      >
                        {supportEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <BsTelephone className="w-6 h-6 text-[#F43F5E] flex-shrink-0" />
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {t("booking_fail.phone", "Phone")}
                      </p>
                      <a
                        href={`tel:+${supportPhoneIntl}`}
                        className="text-sm text-blue-700 underline underline-offset-2 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                        aria-label={
                          t("booking_fail.phone", "Phone") +
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
                    <BsWhatsapp className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        {t("booking_fail.whatsapp", "WhatsApp")}
                      </p>
                      <a
                        href={`https://wa.me/${supportPhoneIntl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-700 underline underline-offset-2 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
                        aria-label={
                          t("booking_fail.whatsapp", "WhatsApp") +
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

                {/* Quick Contact Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleWhatsAppSupport}
                    onKeyDown={(e) => handleKeyDown(e, handleWhatsAppSupport)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                    aria-label={t(
                      "booking_fail.chat_whatsapp_aria",
                      "Chat with us on WhatsApp"
                    )}
                    role="button"
                    tabIndex={0}
                  >
                    <BsWhatsapp className="w-5 h-5 mr-2" aria-hidden="true" />
                    {t("booking_fail.chat_whatsapp", "Chat on WhatsApp")}
                  </button>

                  <button
                    onClick={handleContactSupport}
                    onKeyDown={(e) => handleKeyDown(e, handleContactSupport)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label={t(
                      "booking_fail.contact_form_aria",
                      "Go to contact form"
                    )}
                    role="button"
                    tabIndex={0}
                  >
                    <BsEnvelope className="w-5 h-5 mr-2" aria-hidden="true" />
                    {t("booking_fail.contact_form", "Contact Form")}
                  </button>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 rounded-3xl shadow-lg border border-amber-200 p-6">
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">
                      {t("booking_fail.important_notice", "Important Notice")}
                    </h4>
                    <p className="text-sm text-amber-800">
                      {t(
                        "booking_fail.no_charge_message",
                        "Your payment card has NOT been charged. If you see a pending transaction, it will be automatically released by your bank within 3-5 business days."
                      )}
                    </p>
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
