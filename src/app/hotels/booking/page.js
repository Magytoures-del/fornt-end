"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import BookingProgressStepper from "@/components/hotels/booking/BookingProgressStepper";
import BookingForm from "@/components/hotels/booking/BookingForm";
import PaymentSection from "@/components/hotels/booking/PaymentSection";
import BookingConfirmation from "@/components/hotels/booking/BookingConfirmation";
import BookingSummary from "@/components/hotels/booking/BookingSummary";
import SearchOverlay from "@/components/hotels/components/SearchOverlay";
import { useHotelBookingData } from "@/hooks/useHotelBookingData";
import { useHotelBooking } from "@/hooks/useHotelBooking";
import { useHotelPayment } from "@/hooks/useHotelPayment";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useSearchData } from "@/hooks/useSearchData";
import { HOTEL_BOOKING_STEPS } from "@/constants/hotelBooking";
import { BsClock, BsExclamationTriangle } from "react-icons/bs";

/**
 * Main Hotel Booking Content Component
 * Manages booking flow with clean separation of concerns
 */
function HotelBookingContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(
    HOTEL_BOOKING_STEPS.GUEST_DETAILS
  );
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Get search data from localStorage
  const { searchData, getGuestsInfo } = useSearchData();

  // Get booking parameters from URL
  const searchId = searchParams.get("searchId");
  const hotelId = searchParams.get("hotelId");
  const providerName = searchParams.get("providerName");
  const recommendationId = searchParams.get("recommendationId");
  const searchTracingKey = searchParams.get("searchTracingKey");

  // Session timer (20 minutes)
  const handleTimeout = useCallback(() => {
    setShowTimeoutModal(true);
  }, []);

  const { timeRemaining, isExpired, formattedTime, clearTimer } =
    useSessionTimer(20, handleTimeout);

  // Fetch booking data (price and content)
  const {
    bookingData,
    setBookingData,
    isLoadingPrice,
    priceError,
    isLoadingContent,
    contentError,
  } = useHotelBookingData({
    searchId,
    hotelId,
    providerName,
    recommendationId,
  });

  // Mount check for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear timer when booking is confirmed
  useEffect(() => {
    if (currentStep === HOTEL_BOOKING_STEPS.CONFIRMATION) {
      clearTimer();
    }
  }, [currentStep, clearTimer]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  // Calculate search progress and determine if searching
  const isSearching = isLoadingPrice || isLoadingContent;
  const searchProgress = useMemo(() => {
    if (!isSearching) return 100;
    if (isLoadingPrice && isLoadingContent) return 50;
    if (isLoadingPrice) return 30;
    if (isLoadingContent) return 70;
    return 100;
  }, [isLoadingPrice, isLoadingContent, isSearching]);

  // Get search data for overlay
  const overlaySearchData = useMemo(() => {
    if (!searchData) return null;

    const guestsInfo = getGuestsInfo();
    // Ensure guests object has the correct structure
    const guests = guestsInfo
      ? {
          adults: guestsInfo.adults || 1,
          children: guestsInfo.children || 0,
          rooms: guestsInfo.rooms || 1,
        }
      : { adults: 1, children: 0, rooms: 1 };

    return {
      destination:
        searchData.destination ||
        searchData.selectedLocation?.fullName ||
        searchData.selectedLocation?.name ||
        "",
      selectedLocation: searchData.selectedLocation || null,
      checkIn: searchData.checkIn || null,
      checkOut: searchData.checkOut || null,
      guests: guests,
    };
  }, [searchData, getGuestsInfo]);

  // Booking creation hook
  const {
    createBooking,
    isCreatingBooking,
    bookingError,
    bookingResponse,
    setBookingError,
  } = useHotelBooking({
    searchId,
    hotelId,
    providerName,
    recommendationId,
    bookingData,
    searchTracingKey,
  });

  // Payment hook
  const {
    startPayment,
    isStartingPayment,
    paymentError,
    paymentResponse,
    isRetrievingBooking,
    retrieveError,
    retrieveResponse,
    setPaymentError,
  } = useHotelPayment({
    bookingResponse,
    bookingData,
    onPaymentSuccess: () => {
      setCurrentStep(HOTEL_BOOKING_STEPS.CONFIRMATION);
    },
  });

  // Computed booking data with translations
  const displayBookingData = useMemo(
    () => ({
      ...bookingData,
      hotel: {
        ...bookingData.hotel,
        name:
          bookingData.hotel.name || t("hotels.details.booking_page.hotel_name"),
        location:
          bookingData.hotel.location ||
          t("hotels.details.booking_page.hotel_location"),
      },
      room: {
        ...bookingData.room,
        name:
          bookingData.room.name || t("hotels.details.booking_page.room_name"),
      },
    }),
    [bookingData, t]
  );

  // Booking steps configuration
  const steps = useMemo(
    () => [
      {
        id: HOTEL_BOOKING_STEPS.GUEST_DETAILS,
        title: t("hotels.details.booking_page.steps.guest_details"),
        description: t("hotels.details.booking_page.steps.guest_details_desc"),
      },
      {
        id: HOTEL_BOOKING_STEPS.PAYMENT,
        title: t("hotels.details.booking_page.steps.payment"),
        description: t("hotels.details.booking_page.steps.payment_desc"),
      },
      {
        id: HOTEL_BOOKING_STEPS.CONFIRMATION,
        title: t("hotels.details.booking_page.steps.confirmation"),
        description: t("hotels.details.booking_page.steps.confirmation_desc"),
      },
    ],
    [t]
  );

  // Update booking data helper
  const updateBookingData = useCallback(
    (section, data) => {
      setBookingData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));
    },
    [setBookingData]
  );

  // Handle step navigation
  const nextStep = useCallback(async () => {
    // If moving from first step (guest details), create the booking
    if (currentStep === HOTEL_BOOKING_STEPS.GUEST_DETAILS) {
      const response = await createBooking();
      if (response) {
        setCurrentStep(HOTEL_BOOKING_STEPS.PAYMENT);
      }
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length, createBooking]);

  const prevStep = useCallback(() => {
    if (currentStep > HOTEL_BOOKING_STEPS.GUEST_DETAILS) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Handle redirect to search
  const handleRedirectToSearch = useCallback(() => {
    clearTimer();
    router.push("/hotels");
  }, [router, clearTimer]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case HOTEL_BOOKING_STEPS.GUEST_DETAILS:
        return (
          <BookingForm
            guestData={bookingData.guest}
            onUpdate={(data) => updateBookingData("guest", data)}
            onNext={nextStep}
            isCreatingBooking={isCreatingBooking}
            bookingError={bookingError}
            isDisabled={isLoadingPrice || isExpired}
            onClearBookingError={() => setBookingError(null)}
          />
        );

      case HOTEL_BOOKING_STEPS.PAYMENT:
        return (
          <PaymentSection
            paymentData={bookingData.payment}
            onUpdate={(data) => updateBookingData("payment", data)}
            onNext={nextStep}
            onPrev={prevStep}
            bookingData={bookingData}
            bookingResponse={bookingResponse}
            isCreatingBooking={isCreatingBooking}
            bookingError={bookingError}
            isStartingPayment={isStartingPayment}
            paymentError={paymentError}
            paymentResponse={paymentResponse}
            isRetrievingBooking={isRetrievingBooking}
            retrieveError={retrieveError}
            onStartPayment={startPayment}
          />
        );

      case HOTEL_BOOKING_STEPS.CONFIRMATION:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            bookingResponse={bookingResponse}
            paymentResponse={paymentResponse}
            retrieveResponse={retrieveResponse}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br lg:mt-10 from-gray-50 via-blue-50/30 to-gray-50">
      {/* Session Timer Banner - Fixed at top with improved design */}

      {/* Add padding top when timer is visible */}

      {/* Search Overlay via Portal */}
      {isMounted &&
        isSearching &&
        overlaySearchData &&
        createPortal(
          <SearchOverlay
            isSearching={isSearching}
            searchProgress={searchProgress}
            destination={overlaySearchData.destination}
            selectedLocation={overlaySearchData.selectedLocation}
            checkIn={overlaySearchData.checkIn}
            checkOut={overlaySearchData.checkOut}
            guests={overlaySearchData.guests}
            t={t}
          />,
          document.body
        )}

      {/* Timeout Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 lg:p-10 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-lg">
                <BsExclamationTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t(
                  "hotels.details.booking_page.session_expired_title",
                  "Session Expired"
                )}
              </h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t(
                  "hotels.details.booking_page.session_expired_message",
                  "Your booking session has expired. Please start a new search to continue."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleRedirectToSearch}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  {t(
                    "hotels.details.booking_page.start_new_search",
                    "Start New Search"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with error messages */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          {priceError && !isLoadingPrice && (
            <div className="p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg shadow-sm">
              <p className="text-sm sm:text-base text-amber-800 font-medium">
                {priceError}
              </p>
            </div>
          )}
          {contentError && !isLoadingContent && (
            <div className="p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg shadow-sm">
              <p className="text-sm sm:text-base text-amber-800 font-medium">
                {contentError}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <BookingProgressStepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
              {renderStepContent()}
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-6 lg:top-10">
              {isLoadingPrice || isLoadingContent ? (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-4 sm:p-6 animate-pulse">
                  <div className="h-32 sm:h-40 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-2/3 mb-2" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-1/3 mb-6" />
                  <div className="space-y-3">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-full" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-5/6" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-2/3" />
                  </div>
                  <div className="mt-6 h-9 sm:h-10 bg-gray-200 rounded-lg" />
                </div>
              ) : bookingData?.room?.price ? (
                <BookingSummary
                  bookingData={displayBookingData}
                  timeRemaining={timeRemaining}
                  formattedTime={formattedTime}
                  isExpired={isExpired}
                />
              ) : (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-4 sm:p-6">
                  <div className="text-xs sm:text-sm text-gray-500">
                    {t("hotels.details.booking_page.summary.pricing_notice")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Fallback Component
 */
function BookingPageLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">
            {t("common.loading", "Loading...")}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Page Component with Suspense
 */
export default function HotelBookingPage() {
  return (
    <Suspense fallback={<BookingPageLoadingFallback />}>
      <HotelBookingContent />
    </Suspense>
  );
}
