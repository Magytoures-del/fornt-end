"use client";

import React, { use } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useFlightDetails from "@/hooks/useFlightDetails";
import useFlightPricing from "@/hooks/useFlightPricing";
import useCreateBooking from "@/hooks/useCreateBooking";
import { useTravelDataSession } from "@/hooks/useTravelDataSession";
import { processFlightData } from "@/domain/flights/transform";
import { decodeBookId, handleApiError } from "@/utils/helper";
import { BOOKING_STEPS, DEFAULT_FORM_VALUES } from "@/constants/booking";
import PageLayout from "@/components/flights/details/PageLayout";
import Breadcrumb from "@/components/flights/details/Breadcrumb";
import DetailsStep from "@/components/flights/details/DetailsStep";
import PaymentStep from "@/components/flights/PaymentStep";
import BookingProgressStepper from "@/components/common/BookingProgressStepper";
import BookingLoadingOverlay from "@/components/flights/BookingLoadingOverlay";
import SessionStorageDebugger from "@/components/common/SessionStorageDebugger";
import ErrorBoundary from "@/components/common/ErrorBoundary";

/**
 * Flight Details Page - Refactored
 * Clean architecture with separated concerns:
 * - Data fetching via custom hooks
 * - Business logic in domain modules
 * - UI split into focused components
 */
export default function FlightDetailsPage({ params }) {
  const { t } = useTranslation();
  const { bookId, tripType } = use(params);
  const decodedBookId = decodeBookId(bookId);

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [currentStep, setCurrentStep] = React.useState(BOOKING_STEPS.DETAILS);
  const [showDebugger, setShowDebugger] = React.useState(false);

  // ========================================
  // DATA FETCHING HOOKS
  // ========================================

  // Fetch flight details
  const {
    results: apiResults,
    loading: flightLoading,
    error: flightError,
    refetch: refetchFlight,
  } = useFlightDetails(decodedBookId, tripType);

  // Extract pricing ID
  const pricingId = apiResults?.data?.data?.PricingId;

  // Fetch pricing data
  const {
    priceResults,
    pricingData,
    baggageData,
    isLoading: priceLoading,
    error: priceError,
    refetch: refetchPrice,
  } = useFlightPricing(pricingId);

  // ========================================
  // DATA TRANSFORMATION
  // ========================================

  // Process flight data
  const processedFlights = React.useMemo(() => {
    try {
      return apiResults ? processFlightData(apiResults) : [];
    } catch (err) {
      handleApiError(err, "processing flight data");
      return [];
    }
  }, [apiResults]);

  // Build card results for FlightCard component
  const cardResults = React.useMemo(
    () =>
      processedFlights.length > 0
        ? {
            tripDetails: processedFlights.map((r) => ({
              ...r.card,
              ssrBaggage: baggageData,
            })),
          }
        : { tripDetails: [] },
    [processedFlights, baggageData]
  );

  // Extract flight information for loading overlay
  const flightInfo = React.useMemo(() => {
    if (processedFlights.length === 0) return null;

    const firstFlight = processedFlights[0];
    const rawData = apiResults?.data?.data?.RawData;

    return {
      from:
        rawData?.OriginDestinations?.[0]?.Origin ||
        firstFlight?.card?.departureAirport ||
        "",
      to:
        rawData?.OriginDestinations?.[0]?.Destination ||
        firstFlight?.card?.arrivalAirport ||
        "",
      departureTime:
        rawData?.OnwardDate || firstFlight?.card?.departureDate || "",
      arrivalTime: rawData?.ReturnDate || firstFlight?.card?.arrivalDate || "",
    };
  }, [processedFlights, apiResults]);

  // ========================================
  // SESSION STORAGE
  // ========================================

  const { updateBookingData, updatePassengerData, saveCompleteBookingFlow } =
    useTravelDataSession();

  // Save data to session storage when available
  React.useEffect(() => {
    if (processedFlights.length > 0 && pricingData) {
      const travelDataToSave = {
        bookId: decodedBookId,
        results: processedFlights,
        cardResults,
        ssrBaggageData: baggageData,
        timestamp: Date.now(),
      };

      const flightDetailsToSave = {
        apiResults,
        processedResults: processedFlights,
        cardResults,
        bookId: decodedBookId,
      };

      const pricingDataToSave = {
        ...pricingData,
        priceResults,
        rawPricingData: priceResults?.data?.data,
      };

      saveCompleteBookingFlow({
        travelData: travelDataToSave,
        flightDetails: flightDetailsToSave,
        pricingData: pricingDataToSave,
        searchParams: {
          bookId: decodedBookId,
          timestamp: Date.now(),
        },
      });
    }
  }, [
    processedFlights,
    pricingData,
    apiResults,
    priceResults,
    cardResults,
    baggageData,
    decodedBookId,
    saveCompleteBookingFlow,
  ]);

  // ========================================
  // BOOKING CREATION
  // ========================================

  const {
    createBooking,
    isLoading: isBookingLoading,
    bookingResponse,
    error: bookingError,
  } = useCreateBooking({
    pricingId: priceResults?.data?.data?.PricingId,
    netAmount: priceResults?.data?.data?.RawData?.NetAmount,
    onSuccess: () => {
      setCurrentStep(BOOKING_STEPS.PAYMENT);
    },
    onError: (error) => {
      console.error("Booking creation failed:", error);
    },
    onSaveToSession: updateBookingData,
  });

  // ========================================
  // FORM MANAGEMENT
  // ========================================

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = React.useCallback(
    (data, travellerRequirements) => {
      // Save passenger data immediately
      const passengerDataToSave = {
        formData: data,
        travellerRequirements,
        timestamp: Date.now(),
      };
      updatePassengerData(passengerDataToSave);

      // Create booking
      const onwardDate = apiResults?.data?.data?.RawData?.OnwardDate;
      createBooking(data, travellerRequirements, onwardDate);
    },
    [apiResults, createBooking, updatePassengerData]
  );

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleBackToDetails = React.useCallback(() => {
    setCurrentStep(BOOKING_STEPS.DETAILS);
  }, []);

  // ========================================
  // RENDER
  // ========================================

  return (
    <PageLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        currentStep={currentStep}
        stepName={
          currentStep === BOOKING_STEPS.PAYMENT
            ? t("payment.title", { defaultValue: "Payment" })
            : t("flight_details.title", { defaultValue: "Flight Details" })
        }
      />

      {/* Progress Stepper */}
      <BookingProgressStepper currentStep={currentStep} />

      {/* Details Step */}
      {currentStep === BOOKING_STEPS.DETAILS && (
        <DetailsStep
          // Flight data
          results={processedFlights}
          cardResults={cardResults}
          loading={flightLoading}
          error={flightError}
          onRetry={refetchFlight}
          // Pricing data
          pricingData={pricingData}
          priceLoading={priceLoading}
          priceError={priceError}
          onPriceRetry={refetchPrice}
          // Form props
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isSubmitting={isBookingLoading}
          // Additional data
          bookingID={priceResults?.data?.data?.PricingId}
          onwardDate={apiResults?.data?.data?.RawData?.OnwardDate}
          amount={priceResults?.data?.data?.RawData?.NetAmount}
        />
      )}

      {/* Payment Step */}
      {currentStep === BOOKING_STEPS.PAYMENT && bookingResponse && (
        <ErrorBoundary context="payment step">
          <PaymentStep
            bookingResponse={bookingResponse}
            onBackToDetails={handleBackToDetails}
          />
        </ErrorBoundary>
      )}

      {/* Booking Error State */}
      {currentStep === BOOKING_STEPS.PAYMENT &&
        !bookingResponse &&
        !isBookingLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {t("booking.error_title", { defaultValue: "Booking Error" })}
            </h3>
            <p className="text-red-700 mb-4">
              {bookingError ||
                t("booking.error_message", {
                  defaultValue: "Failed to create booking. Please try again.",
                })}
            </p>
            <button
              onClick={handleBackToDetails}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t("booking.back_to_details", {
                defaultValue: "Back to Details",
              })}
            </button>
          </div>
        )}

      {/* Booking Creation Loading Overlay */}
      {isBookingLoading && <BookingLoadingOverlay flightData={flightInfo} />}

      {/* Debug Tools (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <SessionStorageDebugger
          isVisible={showDebugger}
          onToggle={setShowDebugger}
        />
      )}
    </PageLayout>
  );
}
