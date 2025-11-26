"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { BsAirplane } from "react-icons/bs";
import FlightCard from "./FlightCard";
import PassengerForm from "../PassengerForm";
import PriceCard from "./PriceCard";
import FlightCardSkeleton from "../FlightCardSkeleton";
import PassengerFormSkeleton from "../PassengerFormSkeleton";
import PricingCardSkeleton from "../PricingCardSkeleton";
import MobilePriceBar from "./MobilePriceBar";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import ErrorBoundary from "@/components/common/ErrorBoundary";

/**
 * Flight Details Step Component
 * Displays flight information and passenger form
 */
export default function DetailsStep({
  // Flight data
  results,
  cardResults,
  loading,
  error,
  onRetry,
  // Pricing data
  pricingData,
  priceLoading,
  priceError,
  onPriceRetry,
  // Form props
  control,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitting,
  // Additional data
  bookingID,
  onwardDate,
  amount,
}) {
  const { t } = useTranslation();

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <FlightCardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PassengerFormSkeleton />
          </div>
          <div className="lg:col-span-1">
            <PricingCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        context="loading flight details"
      />
    );
  }

  // No Results State
  if (!loading && !error && Array.isArray(results) && results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BsAirplane className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("flight_details.no_results_title", {
            defaultValue: "No Flight Details Found",
          })}
        </h3>
        <p className="text-gray-600 mb-4">{t("flight_details.no_results")}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          {t("flight_details.refresh")}
        </button>
      </div>
    );
  }

  // Main Content
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Flight Card and Form */}
        <div className="lg:col-span-2">
          <ErrorBoundary context="flight details">
            <FlightCard results={cardResults} loading={loading} />
          </ErrorBoundary>

          <ErrorBoundary context="passenger form" className="mt-6">
            {priceLoading ? (
              <PassengerFormSkeleton />
            ) : priceError ? (
              <ErrorDisplay
                error={priceError}
                onRetry={onPriceRetry}
                context="loading pricing information"
                className="mt-6"
              />
            ) : (
              <PassengerForm
                bookingID={bookingID}
                flights={results}
                isLoading={loading}
                onwardDate={onwardDate}
                amount={amount}
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
              />
            )}
          </ErrorBoundary>
        </div>

        {/* Right Column - Pricing */}
        <div className="space-y-6 lg:col-span-1 hidden lg:block">
          <ErrorBoundary context="pricing card">
            {priceLoading ? (
              <PricingCardSkeleton />
            ) : priceError ? (
              <ErrorDisplay
                error={priceError}
                onRetry={onPriceRetry}
                context="loading pricing details"
              />
            ) : (
              <PriceCard pricingData={pricingData} />
            )}
          </ErrorBoundary>
        </div>
      </div>

      {/* Mobile Floating Price Bar */}
      {!error && (
        <MobilePriceBar
          pricingData={pricingData}
          priceError={priceError}
          isLoading={priceLoading}
        />
      )}
    </>
  );
}
