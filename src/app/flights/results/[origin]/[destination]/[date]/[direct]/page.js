"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { use, useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

// Hooks
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { useFlightSearchOverlay } from "@/hooks/useFlightSearchOverlay";

// Components
import FlightResults from "@/components/flights/FlightResults";
import FlightResultsSkeleton from "@/components/flights/FlightResultsSkeleton";
import SearchFilters from "@/components/search/SearchFilters";
import SearchFiltersSkeleton from "@/components/search/SearchFiltersSkeleton";
import FlightSearchOverlay from "@/components/flights/components/FlightSearchOverlay";
import BreadcrumbNav from "@/components/flights/results/BreadcrumbNav";
import ErrorState from "@/components/flights/results/ErrorState";
import SearchSummaryCard from "@/components/flights/results/SearchSummaryCard";
import ModifySearchCard from "@/components/flights/results/ModifySearchCard";
import MobileFiltersSheet from "@/components/flights/results/MobileFiltersSheet";

// Utils
import {
  parseDateParam,
  parseOverlayDates,
  getSearchParams,
  getTripType,
  loadSearchFormData,
} from "@/utils/flightResultsUtils";

/**
 * Flight Results Page Component
 * Displays flight search results with filters and search modification options
 */
export default function FlightResultsPage({ params }) {
  // Hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();

  // State
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [originLabel, setOriginLabel] = useState("");
  const [destinationLabel, setDestinationLabel] = useState("");
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Extract route parameters
  const { origin, destination, date, direct } = use(params);

  // Parse search parameters with defaults
  const { adults, children, infants, cabinClass } =
    getSearchParams(searchParams);

  // Parse date information
  const { startDate, endDate, isRoundTrip } = parseDateParam(date);
  const dateLocale = i18n.language === "ar" ? "ar-SA" : "en-US";

  // Flight search hook
  const {
    results,
    isLoading,
    error,
    airlineOptions,
    currency,
    sortBy,
    onFilterChange,
    onSortChange,
    onLoadMore,
    canLoadMore,
    isInitialLoad,
    isSearching,
    isFiltering,
    totalFlightsFound,
  } = useFlightSearch({
    origin,
    destination,
    date,
    direct,
    adults,
    children,
    infants,
    cabinClass,
  });

  // Overlay management hook
  const { searchProgress, shouldShowOverlay } = useFlightSearchOverlay(
    results,
    isSearching,
    isInitialLoad
  );

  // Derived values
  const tripType = getTripType(results);
  const overlayDates = useMemo(() => parseOverlayDates(date), [date]);

  // Mount check for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load search form data from localStorage
  useEffect(() => {
    const formData = loadSearchFormData();
    setOriginLabel(formData.originLabel);
    setDestinationLabel(formData.destinationLabel);
  }, [origin, destination]);

  // Memoized functions
  const getCabinClassLabel = useCallback(
    (cabinClass) => {
      const cabinMap = {
        E: t("flights.cabin_class.economy"),
        B: t("flights.cabin_class.business"),
        F: t("flights.cabin_class.first"),
      };
      return cabinMap[cabinClass] || t("flights.cabin_class.economy");
    },
    [t]
  );

  // Event handlers
  const handleSearchModeToggle = useCallback(() => {
    setIsSearchMode((prev) => !prev);
  }, []);

  const handleSearchSubmit = useCallback(
    (searchData) => {
      const params = new URLSearchParams({
        adults: searchData.adults || adults,
        children: searchData.children || children,
        infants: searchData.infants || infants,
        cabinClass: searchData.cabinClass || cabinClass,
      });

      router.push(
        `/flights/results/${searchData.origin}/${searchData.destination}/${
          searchData.date
        }/${searchData.direct}?${params.toString()}`
      );
      setIsSearchMode(false);
    },
    [adults, children, infants, cabinClass, router]
  );

  const handleBackToSearch = useCallback(() => {
    router.back();
  }, [router]);

  const handleCloseFiltersSheet = useCallback(() => {
    setShowFiltersSheet(false);
  }, []);

  // Early return for error state
  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-in fade-in duration-300">
      {/* Search Overlay via Portal - Show immediately when search starts, hide when results arrive */}
      {isMounted &&
        shouldShowOverlay &&
        createPortal(
          <FlightSearchOverlay
            isSearching={shouldShowOverlay}
            searchProgress={searchProgress}
            origin={origin}
            destination={destination}
            originLabel={originLabel}
            destinationLabel={destinationLabel}
            departureDate={overlayDates.departureDate}
            returnDate={overlayDates.returnDate}
            adults={adults}
            childrenCount={children}
            infants={infants}
            cabinClass={cabinClass}
            isRoundTrip={isRoundTrip}
            t={t}
            i18n={i18n}
          />,
          document.body
        )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <BreadcrumbNav />

        {/* Search Summary or Modify Search Card */}
        {isSearchMode ? (
          <ModifySearchCard
            onClose={handleSearchModeToggle}
            onBack={handleBackToSearch}
            onSubmit={handleSearchSubmit}
            isRTL={isRTL}
          />
        ) : (
          <SearchSummaryCard
            originLabel={originLabel}
            destinationLabel={destinationLabel}
            date={date}
            adults={adults}
            childrenCount={children}
            infants={infants}
            cabinClass={cabinClass}
            onEditClick={handleSearchModeToggle}
            getCabinClassLabel={getCabinClassLabel}
            dateLocale={dateLocale}
          />
        )}

        {/* Mobile Filters Trigger */}
        <div className="xl:hidden mb-4">
          <button
            type="button"
            onClick={() => setShowFiltersSheet(true)}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-6 py-3.5 text-base font-bold text-gray-700 shadow-md hover:bg-gray-50 hover:border-blue-300 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
            aria-label={t("filters.title")}
          >
            <svg
              className="w-5 h-5 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 4 21 4 14 12 14 20 10 18 10 12 3 4"></polygon>
            </svg>
            <span>{t("filters.title")}</span>
          </button>
        </div>

        {/* Main Content with Filters and Results Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="xl:col-span-1 order-2 xl:order-1 hidden xl:block">
            <div className="sticky top-4 sm:top-6 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] overflow-y-auto pb-4 sm:pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {isLoading ? (
                <SearchFiltersSkeleton />
              ) : (
                <SearchFilters
                  airlinesOptions={airlineOptions || []}
                  onFilterChange={onFilterChange}
                  onSortChange={onSortChange}
                  currentSortBy={sortBy}
                  currency={currency}
                />
              )}
            </div>
          </aside>

          <div className="xl:col-span-3 order-1 xl:order-2">
            {isLoading ? (
              <FlightResultsSkeleton />
            ) : (
              <FlightResults
                results={results}
                origin={origin}
                destination={destination}
                date={date}
                adults={adults}
                childrenCount={children}
                infants={infants}
                cabinClass={cabinClass}
                tripType={tripType}
                isLoading={isLoading}
                isInitialLoad={isInitialLoad}
                isSearching={isSearching}
                isFiltering={isFiltering}
                totalFlightsFound={totalFlightsFound}
                onLoadMore={onLoadMore}
                canLoadMore={canLoadMore}
                currency={currency}
              />
            )}
          </div>
        </div>

        {/* Mobile Filters Bottom Sheet */}
        <MobileFiltersSheet
          isOpen={showFiltersSheet}
          onClose={handleCloseFiltersSheet}
          isLoading={isLoading}
          airlineOptions={airlineOptions}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          currentSortBy={sortBy}
          currency={currency}
        />
      </div>
    </div>
  );
}
