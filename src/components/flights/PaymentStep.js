"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  BsAirplane,
  BsCreditCard,
  BsCheckCircle,
  BsClock,
  BsPerson,
  BsCalendar,
  BsGeoAlt,
  BsShield,
  BsInfoCircle,
  BsArrowLeft,
  BsCheck2Circle,
  BsLuggage,
} from "react-icons/bs";
import { usePaymentDataSession } from "@/hooks/useTravelDataSession";

const PaymentStep = ({ bookingResponse, onBackToDetails }) => {
  const { t } = useTranslation();
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState(null);

  // Access session storage data
  const {
    paymentData,
    bookingData: sessionBookingData,
    passengerData,
    pricingData,
    flightDetails,
    savePaymentResponse,
    completeBooking,
  } = usePaymentDataSession();

  // Initiate PayTabs payment
  const initiatePayTabsPayment = React.useCallback(
    async (bookingData, customerDetails) => {
      setIsProcessingPayment(true);
      setPaymentError(null);

      try {
        const paymentPayload = {
          amount: customerDetails.amount,
          bookingReference: customerDetails.bookingReference,
          customerDetails: {
            name: customerDetails.name || "",
            email: customerDetails.email || "",
            phone: customerDetails.phone || "",
            country: customerDetails.country || "",
          },
        };

        console.log("Initiating PayTabs payment with payload:", paymentPayload);

        const response = await fetch(
          "https://apib2c.flymoonsa.com/api/bookings/paytabs/initiate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentPayload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Payment initiation failed: ${response.status}`
          );
        }

        const paymentResponse = await response.json();
        console.log("PayTabs payment initiated successfully:", paymentResponse);

        // Save payment response to session storage
        await savePaymentResponse(paymentResponse);

        // Check if there's a redirect URL from PayTabs
        if (paymentResponse.redirect_url || paymentResponse.payment_url) {
          window.location.href =
            paymentResponse.redirect_url || paymentResponse.payment_url;
        }

        return paymentResponse;
      } catch (error) {
        console.error("PayTabs payment initiation error:", error);
        setPaymentError(
          error.message || "Payment initiation failed. Please try again."
        );
        throw error;
      } finally {
        setIsProcessingPayment(false);
      }
    },
    [savePaymentResponse]
  );

  // Handle payment completion
  const handlePaymentCompletion = React.useCallback(
    async (paymentResponse) => {
      try {
        // Save payment response to session storage
        await savePaymentResponse(paymentResponse);

        // Log payment completion with stored data
        console.log("Payment completed with stored data:", {
          booking: sessionBookingData,
          passengers: passengerData,
          pricing: pricingData,
          flight: flightDetails,
          payment: paymentResponse,
        });

        // You can add additional payment processing logic here
        // For example, sending confirmation emails, updating databases, etc.

        // After successful payment processing, clear session storage
        // completeBooking();

        return true;
      } catch (error) {
        console.error("Payment completion failed:", error);
        return false;
      }
    },
    [
      sessionBookingData,
      passengerData,
      pricingData,
      flightDetails,
      savePaymentResponse,
    ]
  );

  // Debug: Log session storage data
  React.useEffect(() => {
    if (paymentData) {
      console.log("Payment step loaded with session data:", paymentData);
    }
    if (passengerData) {
      console.log("Passenger data from session:", passengerData);
    }
    if (bookingResponse) {
      console.log("Booking response data:", bookingResponse);
    }
  }, [paymentData, passengerData, bookingResponse]);

  if (!bookingResponse?.data?.data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center ">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 md:p-12 text-center max-w-lg w-full transform hover:scale-[1.02] transition-transform duration-300">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <BsAirplane className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            {t("payment_step.no_booking_data_title")}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            {t("payment_step.no_booking_data_message")}
          </p>
          <button
            onClick={onBackToDetails}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            <BsArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {t("payment_step.back_to_details")}
          </button>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const bookingData = bookingResponse.data.data;
  const trip = bookingData.Trips?.[0]?.Journey?.[0];
  const segment = trip?.Segments?.[0];
  const flight = segment?.Flight;
  const fares = segment?.Fares;

  // Get passenger data from session storage
  const passengers = passengerData?.formData || null;
  const firstPassenger = passengers
    ? {
        name: passengers.name || passengers.first_name || "",
        surname: passengers.surname || passengers.last_name || "",
        dateOfBirth: passengers.dateOfBirth || passengers.date_of_birth || "",
        nationality: passengers.nationality || "",
        passportNumber:
          passengers.passportNumber || passengers.passport_number || "",
        nationalityCode: passengers.nationalityCode || "EG",
      }
    : null;

  // Helper to get nationality flag
  const getNationalityFlag = (code) => {
    const flags = {
      EG: "🇪🇬",
      SA: "🇸🇦",
      AE: "🇦🇪",
      US: "🇺🇸",
      GB: "🇬🇧",
    };
    return flags[code?.toUpperCase()] || "🌍";
  };

  // Helper to get cabin class name
  const getCabinClassName = (cabinCode) => {
    const cabinClasses = {
      E: t("payment_step.economy", "Economy"),
      B: t("payment_step.business", "Business"),
      F: t("payment_step.first", "First Class"),
      P: t("payment_step.premium_economy", "Premium Economy"),
    };
    return cabinClasses[cabinCode?.toUpperCase()] || cabinCode;
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("common.not_provided");
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${weekday}, ${day} ${month} ${year}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return t("common.not_provided");
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return t("common.not_provided");
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${weekday}, ${day} ${month}`;
  };

  const calculateDuration = () => {
    if (!flight?.DepartureTime || !flight?.ArrivalTime) return "";
    const dep = new Date(flight.DepartureTime);
    const arr = new Date(flight.ArrivalTime);
    const diff = Math.abs(arr - dep);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} Hours ${minutes} Minute`;
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-0">
      {/* Booking Details Card */}
      <div className="bg-gray-0 border border-gray-300 flex flex-col sm:flex-row rounded-t-lg overflow-hidden">
        {/* Icon Section */}
        <div className="w-full sm:w-16 md:w-20 bg-gray-200 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-300 py-4 sm:py-0">
          <BsCheckCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-600" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {t("payment_step.booking_number", "Booking Number")}
              </p>
              <p className="font-semibold text-sm sm:text-base text-gray-900">
                {bookingData.flightNo
                  ? String(bookingData.TransactionID)
                  : "123456"}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {t("payment_step.ticket_number", "Ticket Number")}
              </p>
              <p className="font-semibold text-sm sm:text-base text-gray-900 break-words">
                {bookingData.TransactionID
                  ? String(bookingData.TransactionID)
                  : "12345678923"}
              </p>
            </div>
            <div>
              {/* <p className="text-sm text-gray-600 mb-1">
                {t("payment_step.purchase_date", "Purchase Date")}
              </p>
              <p className="font-semibold text-gray-900">
                {formatDate(new Date())}
              </p> */}
            </div>
            {/* <div>
              <p className="text-sm text-gray-600 mb-1">
                {t("payment_step.order_time", "Order Time")}
              </p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </div> */}
            <div>
              {/* <p className="text-sm text-gray-600 mb-1">
                {t("payment_step.condition", "Condition")}
              </p>
              <div className="flex items-center gap-1">
                <BsCheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">
                  {t("payment_step.confirmed", "Confirmed")}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Traveler Information Card */}
      {firstPassenger && (
        <div className="border border-gray-300 border-t-0 flex flex-col sm:flex-row overflow-hidden">
          <div className="w-full sm:w-16 md:w-20 bg-gray-200 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-300 py-4 sm:py-0">
            <BsPerson className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-600" />
          </div>

          <div className="flex-1 p-4 sm:p-5 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.traveler_name", "Traveler's Name")}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  {firstPassenger.name} {firstPassenger.surname}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.date_of_birth", "Date Of Birth")}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  {firstPassenger.birthDate || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.nationality", "Nationality")}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <span>
                    {getNationalityFlag(firstPassenger.nationalityCode)}
                  </span>
                  {firstPassenger.nationality}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t(
                    "payment_step.passport_number",
                    "National Code/Passport Number"
                  )}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <span>
                    {getNationalityFlag(firstPassenger.nationalityCode)}
                  </span>
                  {firstPassenger.passportNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Details Card */}
      {flight && (
        <div className="bg-gray-0 border border-gray-300 border-t-0 flex flex-col sm:flex-row overflow-hidden">
          <div className="w-full sm:w-16 md:w-20 bg-gray-200 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-300 py-4 sm:py-0">
            <BsAirplane className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-600" />
          </div>

          <div className="flex-1 p-4 sm:p-5 md:p-6">
            {/* Flight Timeline */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
              {/* Departure */}
              <div className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {formatTime(flight.DepartureTime)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {formatShortDate(flight.DepartureTime)}
                </p>
              </div>

              {/* Duration & Line */}
              <div className="flex-1 mx-2 sm:mx-4 md:mx-8 relative">
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-900 rounded-full"></div>
                  <div className="flex-1 border-t-2 border-gray-900 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1 sm:px-2">
                      <BsAirplane className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-900 transform rotate-90" />
                    </div>
                  </div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-900 rounded-full"></div>
                </div>
                <p className="text-center text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                  {calculateDuration()}
                </p>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {formatTime(flight.ArrivalTime)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {formatShortDate(flight.ArrivalTime)}
                </p>
              </div>
            </div>

            {/* City Names */}
            <div className="flex justify-between mb-4 sm:mb-5 md:mb-6">
              <div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {flight.DepartureCode}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 max-w-[120px] sm:max-w-none truncate">
                  {flight.DepAirportName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {flight.ArrivalCode}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 max-w-[120px] sm:max-w-none truncate">
                  {flight.ArrAirportName}
                </p>
              </div>
            </div>

            {/* Flight Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.flight_number", "Flight Number")}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  {flight.FlightNo?.trim() || "165"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.aviation_category", "Aviation Category")}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  {getCabinClassName(flight.Cabin)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.seat_number", "Seat Number")}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  E-11
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.bagging", "Bagging")}
                </p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">
                  {bookingData.SSR?.find((ssr) => ssr.Code === "BAG")
                    ?.Description || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Card */}
      {fares && (
        <div className="bg-gray-0 border border-gray-300 border-t-0 flex flex-col sm:flex-row rounded-b-2xl overflow-hidden">
          <div className="w-full sm:w-16 md:w-20 bg-gray-200 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-300 py-4 sm:py-0 sm:rounded-bl-2xl">
            <BsCreditCard className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-600" />
          </div>

          <div className="flex-1 p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  {t("payment_step.price_per_adult", "Price Per Adult")}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {bookingData.CurrencyCode}{" "}
                  {bookingData.ADT > 0
                    ? (fares.GrossFare / bookingData.ADT).toFixed(0)
                    : fares.GrossFare.toFixed(0)}
                </p>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <p className="text-xs text-gray-500 mb-1">
                  {t("payment_step.base_fare", "Base Fare")}:{" "}
                  {bookingData.CurrencyCode} {fares.TotalBaseFare?.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  {t("payment_step.taxes", "Taxes")}: {bookingData.CurrencyCode}{" "}
                  {fares.TotalTax?.toFixed(2)}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {t("payment_step.total", "Total")}: {bookingData.CurrencyCode}{" "}
                  {fares.GrossFare?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Error Message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <BsInfoCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-1">
              {t("payment_step.payment_error", "Payment Error")}
            </p>
            <p className="text-sm text-red-700">{paymentError}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
        <button
          onClick={onBackToDetails}
          disabled={isProcessingPayment}
          className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("payment_step.back_to_details", "Back to Details")}
        </button>
        <button
          onClick={async () => {
            try {
              // Extract customer details from passenger data
              const customerDetails = {
                amount: fares?.GrossFare || bookingData?.GrossAmount || 0,
                bookingReference: String(bookingData?.TransactionID || ""),
                name: firstPassenger
                  ? `${firstPassenger.name} ${firstPassenger.surname}`.trim()
                  : "",
                email:
                  passengerData?.formData?.email ||
                  sessionBookingData?.email ||
                  "",
                phone:
                  passengerData?.formData?.phone ||
                  sessionBookingData?.phone ||
                  "",
                country:
                  firstPassenger?.nationalityCode ||
                  passengerData?.formData?.country ||
                  "",
              };

              await initiatePayTabsPayment(bookingData, customerDetails);
            } catch (error) {
              // Error is already handled in initiatePayTabsPayment
              console.error("Payment initiation failed:", error);
            }
          }}
          disabled={isProcessingPayment}
          className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessingPayment ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {t("payment_step.processing", "Processing...")}
            </>
          ) : (
            t("payment_step.proceed_to_payment", "Proceed to Payment")
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
