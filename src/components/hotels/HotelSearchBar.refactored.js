"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LuSearch } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { SearchFormProvider, useSearchForm } from "../../context/SearchFormContext";
import DateInput from "../search/DateInput";

// Hooks
import { useToast } from "./hooks/useToast";
import { useDestinationSuggestions } from "./hooks/useDestinationSuggestions";
import { useGuestManagement } from "./hooks/useGuestManagement";
import { useHotelSearch } from "./hooks/useHotelSearch";
import { useLocalStoragePersistence } from "./hooks/useLocalStoragePersistence";

// Components
import DestinationInput from "./components/DestinationInput";
import GuestsSelector from "./components/GuestsSelector";
import MobileDestinationBottomSheet from "./components/MobileDestinationBottomSheet";
import SearchOverlay from "./components/SearchOverlay";

// Styles
import {
  SearchFormContainer,
  FormGrid,
  InputGroup,
  SearchButton,
} from "./styles/SearchBar.styles";
import { SelectorLabel } from "./styles/GuestsSelector.styles";
import { ToastContainer, ToastItem } from "./styles/SearchOverlay.styles";

// Utils
import { convertToYYYYMMDD, getSuggestionDisplayText } from "./utils/hotelSearchUtils";

/**
 * Wrapper component to handle hotel-specific date input setup
 */
function HotelDateInputWrapper({ checkIn, setCheckIn, checkOut, setCheckOut }) {
  const { actions } = useSearchForm();

  // Set tripType to roundtrip for hotels (always need check-in and check-out)
  useEffect(() => {
    actions.setTripType("roundtrip");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartDateChange = (date) => {
    setCheckIn(convertToYYYYMMDD(date));
  };

  const handleEndDateChange = (date) => {
    setCheckOut(convertToYYYYMMDD(date));
  };

  return (
    <DateInput
      startDate={checkIn}
      setStartDate={handleStartDateChange}
      endDate={checkOut}
      setEndDate={handleEndDateChange}
      searchType="hotel"
    />
  );
}

/**
 * Main Hotel Search Bar Component
 * Refactored to follow best practices and clean code principles
 */
export default function HotelSearchBar() {
  const { t } = useTranslation();

  // Toast notifications
  const { toasts, addToast } = useToast();

  // Destination state
  const [destination, setDestination] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Date state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Guest state
  const {
    guests,
    childrenAges,
    totalGuests,
    updateGuests,
    updateChildAge,
    setGuestsData,
    setChildrenAgesData,
  } = useGuestManagement();

  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [nationality, setNationality] = useState("");

  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");

  // Refs
  const destinationRef = useRef(null);
  const suggestionsRef = useRef(null);
  const guestsRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileDebounceTimerRef = useRef(null);
  const guestsDropdownJustOpenedRef = useRef(false);

  // Custom hooks
  const {
    suggestions,
    isSuggestLoading,
    suggestError,
    setSuggestError,
    fetchSuggestions,
    clearSuggestions,
  } = useDestinationSuggestions(t, addToast);

  const {
    handleSearch,
    isSearching,
    searchError,
    searchProgress,
    setSearchError,
  } = useHotelSearch(
    selectedLocation,
    checkIn,
    checkOut,
    guests,
    childrenAges,
    nationality,
    t,
    addToast
  );

  // LocalStorage persistence
  useLocalStoragePersistence({
    setDestination,
    setSearchTerm,
    setSelectedLocation,
    setCheckIn,
    setCheckOut,
    setGuestsData,
    setChildrenAgesData,
    destination,
    selectedLocation,
    checkIn,
    checkOut,
    guests,
    childrenAges,
  });

  // Detect mount and mobile screen size
  useEffect(() => {
    setIsMounted(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close dropdowns when clicking outside (Desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobile) {
        if (
          destinationRef.current &&
          !destinationRef.current.contains(event.target) &&
          suggestionsRef.current &&
          !suggestionsRef.current.contains(event.target)
        ) {
          setShowSuggestions(false);
        }
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (mobileDebounceTimerRef.current) {
        clearTimeout(mobileDebounceTimerRef.current);
      }
    };
  }, [isMobile]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isMobile && showMobilePopup) {
          closeMobileSuggestions();
        } else if (!isMobile && showSuggestions) {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, showMobilePopup, showSuggestions]);

  // Prevent body scroll when bottom sheet is open (mobile)
  useEffect(() => {
    if (showMobilePopup && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobilePopup, isMobile]);

  // Handle destination input change (Desktop)
  const handleDestinationChange = (e) => {
    if (isMobile) return;

    const value = e.target.value;
    setSearchTerm(value);
    setSearchError(null);
    
    if (selectedLocation) {
      setSelectedLocation(null);
    }

    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle mobile input click
  const handleMobileInputClick = () => {
    if (isMobile) {
      setShowMobilePopup(true);
      setMobileSearchValue("");
      clearSuggestions();
      setTimeout(() => {
        if (mobileSearchRef.current) {
          mobileSearchRef.current.focus();
        }
      }, 300);
    }
  };

  // Handle mobile search input change
  const handleMobileSearch = (e) => {
    const value = e.target.value;
    setMobileSearchValue(value);
    setSearchError(null);
    
    if (selectedLocation) {
      setSelectedLocation(null);
    }

    fetchSuggestions(value);
  };

  // Handle overlay click (mobile)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMobileSuggestions();
    }
  };

  // Close mobile suggestions
  const closeMobileSuggestions = () => {
    clearSuggestions();
    setShowMobilePopup(false);
    setMobileSearchValue("");
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const displayText = getSuggestionDisplayText(suggestion);
    setDestination(displayText);
    setSearchTerm(displayText);
    setSelectedLocation(suggestion);
    clearSuggestions();
    setShowSuggestions(false);
    setSuggestError(null);
    setSearchError(null);

    // Close mobile popup if open
    if (isMobile) {
      setShowMobilePopup(false);
      setMobileSearchValue("");
    }
  };

  return (
    <SearchFormContainer>
      <FormGrid>
        {/* Destination */}
        <InputGroup className="border-l border-l-gray-200 pr-4 justify-center relative">
          <SelectorLabel>
            {t("hotels.results.search_bar.destination")}
          </SelectorLabel>
          <DestinationInput
            destinationRef={destinationRef}
            suggestionsRef={suggestionsRef}
            searchTerm={searchTerm}
            isMobile={isMobile}
            handleDestinationChange={handleDestinationChange}
            handleMobileInputClick={handleMobileInputClick}
            placeholder={t("hotels.results.search_bar.destination")}
            showSuggestions={showSuggestions}
            isSuggestLoading={isSuggestLoading}
            suggestions={suggestions}
            handleSuggestionSelect={handleSuggestionSelect}
            noResultsText={t("common.no_results")}
          />
        </InputGroup>

        {/* Check In & Check Out - DateInput */}
        <InputGroup>
          <SearchFormProvider onSubmit={() => {}}>
            <HotelDateInputWrapper
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
            />
          </SearchFormProvider>
        </InputGroup>

        {/* Guests - Mobile Layout */}
        <div className="flex flex-col gap-0 px-0 lg:hidden">
          <InputGroup className="lg:hidden" data-no-border="true">
            <GuestsSelector
              guestsRef={guestsRef}
              guests={guests}
              totalGuests={totalGuests}
              childrenAges={childrenAges}
              showGuestsDropdown={showGuestsDropdown}
              setShowGuestsDropdown={setShowGuestsDropdown}
              updateGuests={updateGuests}
              updateChildAge={updateChildAge}
              guestsDropdownJustOpenedRef={guestsDropdownJustOpenedRef}
              isMobile={isMobile}
              isMounted={isMounted}
              t={t}
            />
          </InputGroup>
        </div>

        {/* Guests - Desktop Layout */}
        <div className="hidden lg:flex lg:flex-col gap-0 border-r border-r-gray-200 pr-4 justify-center">
          <InputGroup className="relative">
            <GuestsSelector
              guestsRef={guestsRef}
              guests={guests}
              totalGuests={totalGuests}
              childrenAges={childrenAges}
              showGuestsDropdown={showGuestsDropdown}
              setShowGuestsDropdown={setShowGuestsDropdown}
              updateGuests={updateGuests}
              updateChildAge={updateChildAge}
              guestsDropdownJustOpenedRef={guestsDropdownJustOpenedRef}
              isMobile={false}
              isMounted={isMounted}
              t={t}
            />
          </InputGroup>
        </div>

        {/* Search Button */}
        <div className="flex justify-end h-full items-center">
          <SearchButton onClick={handleSearch} disabled={isSearching}>
            <LuSearch />
            {t("hotels.results.search_bar.search")}
          </SearchButton>
        </div>
      </FormGrid>

      {/* Mobile Bottom Sheet via Portal */}
      {isMounted &&
        isMobile &&
        showMobilePopup &&
        createPortal(
          <MobileDestinationBottomSheet
            showMobilePopup={showMobilePopup}
            handleOverlayClick={handleOverlayClick}
            closeMobileSuggestions={closeMobileSuggestions}
            mobileSearchRef={mobileSearchRef}
            mobileSearchValue={mobileSearchValue}
            handleMobileSearch={handleMobileSearch}
            isSuggestLoading={isSuggestLoading}
            suggestions={suggestions}
            handleSuggestionSelect={handleSuggestionSelect}
            title={t("hotels.results.search_bar.destination")}
            placeholder={t("hotels.results.search_bar.destination")}
            noResultsText={t("common.no_results_for", {
              query: mobileSearchValue,
              defaultValue: 'No results found for "{{query}}"',
            })}
            startTypingText={
              t("flights.search_form.start_typing") || "Start typing to search..."
            }
          />,
          document.body
        )}

      {/* Search Overlay */}
      <SearchOverlay
        isSearching={isSearching}
        searchProgress={searchProgress}
        destination={destination}
        selectedLocation={selectedLocation}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        t={t}
      />

      {/* Toast Notifications */}
      {!!toasts.length && (
        <ToastContainer>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} $type={toast.type}>
              {toast.message}
            </ToastItem>
          ))}
        </ToastContainer>
      )}
    </SearchFormContainer>
  );
}

