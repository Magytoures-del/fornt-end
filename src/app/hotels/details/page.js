"use client";

import React, { Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

// Components
import HotelDetailsHero from "@/components/hotels/details/HotelDetailsHero";
import HotelInfoSection from "@/components/hotels/details/HotelInfoSection";
import RoomSelection from "@/components/hotels/details/RoomSelection";
import LocationSection from "@/components/hotels/details/LocationSection";
import LoadingSkeleton from "@/components/hotels/details/LoadingSkeleton";
import Breadcrumb from "@/components/hotels/details/Breadcrumb";
import ErrorState from "@/components/hotels/details/ErrorState";
import EmptyState from "@/components/hotels/details/EmptyState";
import FloatingActions from "@/components/hotels/details/FloatingActions";
import { ToastContainer, useToast } from "@/components/common/Toast";

// Hooks
import { useHotelDetails } from "@/hooks/useHotelDetails";
import { useFavorites } from "@/hooks/useFavorites";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Constants
import { ANIMATION_DELAYS } from "@/constants/hotelDetails";

/**
 * Main hotel details content component
 */
function HotelDetailsContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("id");
  const searchId = searchParams.get("searchId");
  const searchTracingKey = searchParams.get("searchTracingKey");

  // Custom hooks
  const { hotelData, isLoading, error, retry } = useHotelDetails(
    hotelId,
    searchId
  );
  const { isFavorite, toggleFavorite } = useFavorites(hotelId);
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const { toasts, showToast, removeToast } = useToast();

  /**
   * Navigate back to previous page
   */
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * Share hotel details
   */
  const handleShare = useCallback(async () => {
    const hotelName = hotelData?.name || hotelData?.hotelName || t("hotels.details.page.hotel_details");
    const shareData = {
      title: hotelName,
      text: t("hotels.details.page.check_out_hotel", { name: hotelName }),
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        showToast(t("hotels.details.messages.link_copied"), "success");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
        showToast(t("hotels.details.messages.share_failed"), "error");
      }
    }
  }, [hotelData, showToast, t]);

  /**
   * Toggle favorite status with toast notification
   */
  const handleFavorite = useCallback(() => {
    toggleFavorite();
    const message = isFavorite
      ? t("hotels.details.messages.favorite_removed")
      : t("hotels.details.messages.favorite_added");
    showToast(message, "success", 2000);
  }, [toggleFavorite, isFavorite, showToast, t]);

  // Loading State
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error State
  if (error) {
    return <ErrorState error={error} onRetry={retry} onBack={handleBack} />;
  }

  // No Data State
  if (!hotelData) {
    return <EmptyState onBack={handleBack} />;
  }

  // Extract hotel information
  const hotelName = hotelData?.name || hotelData?.hotelName || t("hotels.details.page.hotel");
  const city =
    hotelData?.address?.city ||
    hotelData?.city ||
    hotelData?.location?.city ||
    "";

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30" translate="yes">
        {/* Hero Section with Image Gallery */}
        <HotelDetailsHero hotel={hotelData} />

        {/* Floating Action Buttons */}
        <FloatingActions
          onShare={handleShare}
          onFavorite={handleFavorite}
          isFavorite={isFavorite}
          onScrollTop={scrollToTop}
          showScrollTop={showScrollTop}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-100/40 to-pink-100/40 rounded-full blur-3xl -z-10" />
          
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl px-4 py-2.5 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-md border border-gray-200/50 hover:border-blue-300"
            aria-label={t("hotels.details.page.back_to_results_aria")}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">{t("hotels.details.page.back_to_results")}</span>
          </button>

          {/* Breadcrumb Navigation */}
          <Breadcrumb hotelName={hotelName} city={city} />

          {/* Content Sections */}
          <div className="space-y-8 lg:space-y-10">
            {/* Hotel Info Section */}
            <section
              className="animate-fade-in"
              aria-labelledby="hotel-info-heading"
            >
              <HotelInfoSection hotel={hotelData} />
            </section>

            {/* Room Selection Section */}
            <section
              className="animate-fade-in"
              style={{ animationDelay: ANIMATION_DELAYS.SECTION_1 }}
              aria-labelledby="room-selection-heading"
            >
              <RoomSelection
                hotel={hotelData}
                searchId={searchId}
                hotelId={hotelId}
                searchTracingKey={searchTracingKey}
              />
            </section>

            {/* Location Section */}
            <section
              className="animate-fade-in"
              style={{ animationDelay: ANIMATION_DELAYS.SECTION_2 }}
              aria-labelledby="location-heading"
            >
              <LocationSection hotel={hotelData} />
            </section>
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

/**
 * Hotel details page with Suspense boundary
 */
export default function HotelDetailsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HotelDetailsContent />
    </Suspense>
  );
}
