"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useSearchForm } from "../../context/SearchFormContext";
import LocationInput from "./LocationInput";
import PassengerSelector from "./PassengerSelector";
import {
  LuPlaneTakeoff,
  LuPlaneLanding,
  LuArrowLeftRight,
} from "react-icons/lu";
import { BiErrorCircle } from "react-icons/bi";
import DateInput from "./DateInput";
import CabinClassSelector from "./CabinClassSelector";
import DirectFlightSelector from "./DirectFlightSelector";
import FlightSearchOverlay from "../flights/components/FlightSearchOverlay";
import { useSearchOverlay } from "./hooks/useSearchOverlay";
import { useFlightSearch } from "./hooks/useFlightSearch";
import { useSearchFormValidation } from "./hooks/useSearchFormValidation";
import { extractAirportCode, getCabinClassCode } from "./utils/searchFormUtils";
import {
  SearchFormContainer,
  FormGrid,
  InputGroup,
  FormLabel,
  SwapButton,
  SearchButton,
} from "./styles/SearchForm.styles";
import {
  ErrorMessage,
  ErrorIcon,
  ErrorMessageWrapper,
} from "./styles/ValidationError.styles";
import { useToast, ToastContainer } from "../../components/common/Toast";

/**
 * SearchForm Component
 *
 * Main flight search form component with location selection, date picker,
 * and search functionality. Handles both one-way and round-trip searches.
 *
 * @returns {JSX.Element} SearchForm component
 */
export default function SearchFrom() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const { state, actions } = useSearchForm();
  const [isMounted, setIsMounted] = useState(false);

  const {
    departure,
    arrival,
    startDate,
    endDate,
    tripType,
    passengers,
    isLoading,
    cabinClass,
    directFlight,
  } = state;

  const { setDeparture, setArrival, setStartDate, setEndDate } = actions;

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  // Track if search was attempted to show errors
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Custom hooks
  const { showOverlay, searchProgress, showOverlayHandler } =
    useSearchOverlay();
  const {
    errors,
    touched,
    validateForm,
    validateField,
    setFieldTouched,
    setAllFieldsTouched,
    clearFieldError,
  } = useSearchFormValidation(state);
  const {
    handleSearch: originalHandleSearch,
    handleSearchNewTab: originalHandleSearchNewTab,
  } = useFlightSearch(
    state,
    actions,
    showOverlayHandler,
    validateForm,
    setAllFieldsTouched
  );
  const { toasts, showToast, removeToast } = useToast();

  // Wrapper for handleSearch to track search attempt
  const handleSearch = () => {
    setSearchAttempted(true);
    originalHandleSearch();
  };

  const handleSearchNewTab = (e) => {
    setSearchAttempted(true);
    originalHandleSearchNewTab(e);
  };

  // Mount check for portal and mobile detection
  useEffect(() => {
    setIsMounted(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Validate passengers when they change
  useEffect(() => {
    validateField("passengers", null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passengers?.adults, passengers?.children, passengers?.infants]);

  // Track previous errors to avoid showing duplicate toasts
  const prevErrorsRef = useRef({});

  // Show toast on mobile when new errors occur (only after search attempt)
  useEffect(() => {
    if (!isMobile || !searchAttempted) {
      prevErrorsRef.current = errors;
      return;
    }

    const currentErrorKeys = Object.keys(errors).filter((key) => errors[key]);
    const prevErrorKeys = Object.keys(prevErrorsRef.current).filter(
      (key) => prevErrorsRef.current[key]
    );

    // Only show toast if there are new errors or errors changed
    const hasNewErrors =
      currentErrorKeys.length > 0 &&
      (currentErrorKeys.length !== prevErrorKeys.length ||
        currentErrorKeys.some(
          (key) => errors[key] !== prevErrorsRef.current[key]
        ));

    if (hasNewErrors) {
      // Show the first error in toast
      const firstErrorKey = currentErrorKeys[0];
      const firstError = errors[firstErrorKey];
      if (firstError) {
        showToast(firstError, "error", 4000);
      }
    }

    prevErrorsRef.current = errors;
  }, [errors, isMobile, showToast, searchAttempted]);

  // Event handlers
  const handleDepartureChange = (location) => {
    setDeparture(location);
    if (location) {
      validateField("departure", location);
      clearFieldError("departure");
      // Re-validate arrival if it exists (to check for same locations)
      if (arrival) {
        validateField("arrival", arrival);
      }
    } else {
      setFieldTouched("departure");
      validateField("departure", "");
    }
  };

  const handleArrivalChange = (location) => {
    setArrival(location);
    if (location) {
      validateField("arrival", location);
      clearFieldError("arrival");
    } else {
      setFieldTouched("arrival");
      validateField("arrival", "");
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date) {
      validateField("startDate", date);
      clearFieldError("startDate");
      // Re-validate end date if it exists
      if (endDate) {
        validateField("endDate", endDate);
      }
    } else {
      setFieldTouched("startDate");
      validateField("startDate", "");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (date) {
      validateField("endDate", date);
      clearFieldError("endDate");
    } else {
      setFieldTouched("endDate");
      validateField("endDate", "");
    }
  };

  const handleSwapLocations = () => {
    actions.swapLocations();
    // Re-validate both locations after swap
    if (departure) validateField("departure", departure);
    if (arrival) validateField("arrival", arrival);
  };

  // Handle blur events to mark fields as touched
  const handleDepartureBlur = () => {
    setFieldTouched("departure");
    if (departure) {
      validateField("departure", departure);
    }
  };

  const handleArrivalBlur = () => {
    setFieldTouched("arrival");
    if (arrival) {
      validateField("arrival", arrival);
    }
  };

  // Computed values
  const isSearchDisabled =
    Object.keys(errors).length > 0 ||
    isLoading ||
    !state.departure ||
    !state.arrival ||
    !state.startDate;
  const cabinClassParam = getCabinClassCode(cabinClass);

  return (
    <>
      {/* Search Overlay via Portal */}
      {isMounted &&
        showOverlay &&
        createPortal(
          <FlightSearchOverlay
            isSearching={showOverlay}
            searchProgress={searchProgress}
            origin={extractAirportCode(departure)}
            destination={extractAirportCode(arrival)}
            originLabel={departure}
            destinationLabel={arrival}
            departureDate={startDate}
            returnDate={endDate}
            adults={passengers.adults}
            childrenCount={passengers.children}
            infants={passengers.infants}
            cabinClass={cabinClassParam}
            isRoundTrip={tripType === "roundtrip"}
            t={t}
            i18n={i18n}
          />,
          document.body
        )}

      <SearchFormContainer>
        <FormGrid>
          {/* Location Inputs */}
          <InputGroup className="flex lg:flex-row gap-4 px-5 lg:px-0">
            <ErrorMessageWrapper className="flex-1">
              <LocationInput
                title={t("flights.search_form.where_from")}
                icon={<LuPlaneTakeoff />}
                location={departure}
                onChange={handleDepartureChange}
                onRemove={() => {
                  setDeparture("");
                  clearFieldError("departure");
                }}
                onBlur={handleDepartureBlur}
                error={touched.departure ? errors.departure : null}
              />
              {touched.departure && errors.departure && !isMobile && (
                <ErrorMessage>
                  <ErrorIcon>
                    <BiErrorCircle size={14} />
                  </ErrorIcon>
                  {errors.departure}
                </ErrorMessage>
              )}
            </ErrorMessageWrapper>
            <div className="flex items-center">
              <SwapButton
                onClick={handleSwapLocations}
                type="button"
                aria-label={t(
                  "flights.search_form.swap_locations",
                  "Swap locations"
                )}
              >
                <LuArrowLeftRight />
              </SwapButton>
            </div>
            <ErrorMessageWrapper className="flex-1">
              <LocationInput
                title={t("flights.search_form.where_to")}
                icon={<LuPlaneLanding />}
                location={arrival}
                onChange={handleArrivalChange}
                onRemove={() => {
                  setArrival("");
                  clearFieldError("arrival");
                }}
                onBlur={handleArrivalBlur}
                error={touched.arrival ? errors.arrival : null}
              />
              {searchAttempted &&
                touched.arrival &&
                errors.arrival &&
                !isMobile && (
                  <ErrorMessage>
                    <ErrorIcon>
                      <BiErrorCircle size={14} />
                    </ErrorIcon>
                    {errors.arrival}
                  </ErrorMessage>
                )}
            </ErrorMessageWrapper>
          </InputGroup>

          {/* Date Input */}
          <InputGroup
            className={`${
              isRTL
                ? "border-r border-blue-500/20 pr-1"
                : "border-l border-blue-500/20 pl-1"
            } px-5 lg:px-0`}
          >
            <ErrorMessageWrapper className="w-full">
              <DateInput
                startDate={startDate}
                setStartDate={handleStartDateChange}
                endDate={endDate}
                setEndDate={handleEndDateChange}
              />
              {searchAttempted &&
                touched.startDate &&
                errors.startDate &&
                !isMobile && (
                  <ErrorMessage>
                    <ErrorIcon>
                      <BiErrorCircle size={14} />
                    </ErrorIcon>
                    {errors.startDate}
                  </ErrorMessage>
                )}
              {searchAttempted &&
                touched.endDate &&
                errors.endDate &&
                !isMobile && (
                  <ErrorMessage>
                    <ErrorIcon>
                      <BiErrorCircle size={14} />
                    </ErrorIcon>
                    {errors.endDate}
                  </ErrorMessage>
                )}
            </ErrorMessageWrapper>
          </InputGroup>

          {/* Mobile-only Options */}
          <div className="flex flex-col gap-4 px-4 lg:px-0 lg:hidden">
            <InputGroup className="flex lg:hidden">
              <ErrorMessageWrapper className="w-full">
                <FormLabel>{t("flights.passengers.label")}</FormLabel>
                <PassengerSelector />
                {searchAttempted && errors.passengers && !isMobile && (
                  <ErrorMessage>
                    <ErrorIcon>
                      <BiErrorCircle size={14} />
                    </ErrorIcon>
                    {errors.passengers}
                  </ErrorMessage>
                )}
              </ErrorMessageWrapper>
            </InputGroup>
            <InputGroup className="flex lg:hidden">
              <FormLabel>{t("flights.cabin_class.label")}</FormLabel>
              <CabinClassSelector />
            </InputGroup>
            <InputGroup className="flex lg:hidden">
              <FormLabel>{t("flights.direct_flight.label")}</FormLabel>
              <DirectFlightSelector />
            </InputGroup>
          </div>

          {/* Search Button */}
          <div className="flex h-full items-center">
            <SearchButton
              onClick={handleSearch}
              onContextMenu={handleSearchNewTab}
              disabled={isSearchDisabled}
              title={t(
                "flights.search_form.search_button_tooltip",
                "Left click to search, Right click to open in new tab"
              )}
              aria-label={t(
                "flights.search_form.search_button",
                "Search flights"
              )}
            >
              {isLoading
                ? t("flights.search_form.searching")
                : t("flights.search_form.search_button")}
            </SearchButton>
          </div>
        </FormGrid>
      </SearchFormContainer>

      {/* Toast Container for Mobile */}
      {isMobile && <ToastContainer toasts={toasts} removeToast={removeToast} />}
    </>
  );
}
