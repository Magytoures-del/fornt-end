"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BsXCircle,
  BsArrowLeft,
  BsExclamationTriangle,
  BsWhatsapp,
  BsTelephone,
  BsEnvelope,
  BsCreditCard,
  BsInfoCircle,
  BsBuilding,
} from "react-icons/bs";
import { BiSupport } from "react-icons/bi";

/**
 * Hotel Booking Fail Content Component
 * Displays booking failure information and provides recovery options
 */
function HotelBookingFailContent() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get error data from URL parameters
  const [errorInfo, setErrorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoize error details from URL
  const errorReason = useMemo(
    () => searchParams.get("reason") || searchParams.get("error") || "unknown",
    [searchParams]
  );

  const transactionId = useMemo(
    () => searchParams.get("TransactionID") || searchParams.get("transactionId"),
    [searchParams]
  );

  const errorMessage = useMemo(
    () => searchParams.get("message") || searchParams.get("errorMessage"),
    [searchParams]
  );

  useEffect(() => {
    const loadErrorInfo = () => {
      try {
        // Set error information based on the error reason
        const errorMessages = {
          payment_failed: {
            title: t("booking_fail.payment_failed_title", "Payment Failed"),
            message:
              errorMessage ||
              t(
                "booking_fail.payment_failed_message",
                "Your payment could not be processed. Please check your payment details and try again."
              ),
            icon: BsCreditCard,
          },
          payment_declined: {
            title: t("booking_fail.payment_declined_title", "Payment Declined"),
            message:
              errorMessage ||
              t(
                "booking_fail.payment_declined_message",
                "Your payment was declined by your bank. Please contact your bank or try a different payment method."
              ),
            icon: BsCreditCard,
          },
          timeout: {
            title: t("booking_fail.timeout_title", "Booking Timeout"),
            message:
              errorMessage ||
              t(
                "booking_fail.timeout_message",
                "Your booking session has expired. Please search for hotels again and complete the booking process."
              ),
            icon: BsExclamationTriangle,
          },
          availability: {
            title: t(
              "booking_fail.availability_title",
              "Hotel No Longer Available"
            ),
            message:
              errorMessage ||
              t(
                "booking_fail.availability_message",
                "Unfortunately, the selected hotel or room is no longer available. Please search for alternative options."
              ),
            icon: BsBuilding,
          },
          validation: {
            title: t("booking_fail.validation_title", "Validation Error"),
            message:
              errorMessage ||
              t(
                "booking_fail.validation_message",
                "There was an error validating your booking information. Please check your details and try again."
              ),
            icon: BsExclamationTriangle,
          },
          network: {
            title: t("booking_fail.network_title", "Network Error"),
            message:
              errorMessage ||
              t(
                "booking_fail.network_message",
                "A network error occurred while processing your booking. Please check your internet connection and try again."
              ),
            icon: BsExclamationTriangle,
          },
          unknown: {
            title: t("booking_fail.unknown_title", "Booking Failed"),
            message:
              errorMessage ||
              t(
                "booking_fail.unknown_message",
                "An unexpected error occurred while processing your booking. Please try again or contact our support team."
              ),
            icon: BsXCircle,
          },
        };

        setErrorInfo(
          errorMessages[errorReason] || errorMessages.unknown
        );
      } catch (error) {
        console.error("Error loading error info:", error);
        setErrorInfo({
          title: t("booking_fail.error_title", "Error"),
          message:
            errorMessage ||
            t(
              "booking_fail.error_message",
              "An error occurred while processing your booking."
            ),
          icon: BsXCircle,
        });
      } finally {
        setLoading(false);
      }
    };

    loadErrorInfo();
  }, [errorReason, errorMessage, t]);

  // Contact details from translations
  const supportEmail = t("footer.email", "contact@flymoonsa.com");
  const supportPhoneRaw = t("footer.phone", "+1234567890");
  const supportPhoneDigits = String(supportPhoneRaw).replace(/\D/g, "");
  const supportPhoneIntl = supportPhoneDigits.startsWith("00")
    ? supportPhoneDigits.slice(2)
    : supportPhoneDigits;

  // Event handlers
  const handleBackToHotels = useCallback(() => {
    router.push("/hotels");
  }, [router]);

  const handleRetryBooking = useCallback(() => {
    // Go back to previous page or hotels search
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/hotels");
    }
  }, [router]);

  const handleContactSupport = useCallback(() => {
    router.push("/contact");
  }, [router]);

  const handleWhatsAppSupport = useCallback(() => {
    const message = encodeURIComponent(
      `${t(
        "booking_fail.whatsapp_message",
        "I need help with a failed hotel booking."
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div
            className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            aria-hidden="true"
          ></div>
          <p className="text-gray-600 text-lg">
            {t("booking_fail.loading", "Loading details...")}
          </p>
        </div>
      </div>
    );
  }

  const ErrorIcon = errorInfo?.icon || BsXCircle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ErrorIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {errorInfo?.title || t("booking_fail.title", "Booking Failed")}
            </h1>
            <p className="text-red-100 text-lg">
              {t(
                "booking_fail.subtitle",
                "We were unable to complete your booking. Please try again or contact our support team."
              )}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Error Message */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <BsInfoCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-red-800 text-sm sm:text-base">
                  {errorInfo?.message}
                </p>
              </div>
            </div>

            {/* Transaction ID if available */}
            {transactionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">
                  {t(
                    "booking_fail.transaction_id",
                    "Transaction ID"
                  )}
                </p>
                <p className="font-mono text-base font-semibold text-gray-900 break-all">
                  {transactionId}
                </p>
              </div>
            )}

            {/* Recommended Actions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t(
                  "booking_fail.what_next",
                  "What to Do Next"
                )}
              </h2>
              <div className="space-y-3">
                <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <BsInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">
                      {t(
                        "booking_fail.recommended_actions",
                        "Recommended Actions"
                      )}
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>
                        {t(
                          "booking_fail.check_payment_details",
                          "Check your payment method and try again"
                        )}
                      </li>
                      <li>
                        {t(
                          "booking_fail.contact_bank",
                          "Contact your bank if payment was declined"
                        )}
                      </li>
                      <li>
                        {t(
                          "booking_fail.try_different_method",
                          "Try a different payment method"
                        )}
                      </li>
                      <li>
                        {t(
                          "booking_fail.contact_support",
                          "Contact our support team for assistance"
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleRetryBooking}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 flex items-center justify-center"
              >
                <BsArrowLeft className="w-5 h-5 mr-2" />
                {t("booking_fail.retry_booking", "Retry Booking")}
              </button>
              <button
                onClick={handleBackToHotels}
                className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300"
              >
                {t("booking_fail.search_hotels", "Search Hotels")}
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <BiSupport className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t(
                  "booking_fail.need_help",
                  "Need Help?"
                )}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              {t(
                "booking_fail.contact_support_desc",
                "Our support team is available 24/7 to assist you with your booking."
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* WhatsApp Support */}
              <button
                onClick={handleWhatsAppSupport}
                className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors group"
              >
                <BsWhatsapp className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-green-900">
                  WhatsApp
                </span>
              </button>

              {/* Phone Support */}
              <a
                href={`tel:${supportPhoneRaw}`}
                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors group"
              >
                <BsTelephone className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-blue-900">
                  {supportPhoneRaw}
                </span>
              </a>

              {/* Email Support */}
              <a
                href={`mailto:${supportEmail}`}
                className="flex flex-col items-center p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors group"
              >
                <BsEnvelope className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-purple-900">
                  {supportEmail}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Page Component with Suspense
 */
export default function HotelBookingFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <HotelBookingFailContent />
    </Suspense>
  );
}

