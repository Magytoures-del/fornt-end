"use client";
import React, { useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useSearchForm } from "../../context/SearchFormContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import Calendar from "./Calendar";
import { DateInputContainer } from "./components/DateInputContainer";
import { DateField } from "./components/DateField";
import { useDateInput } from "./hooks/useDateInput";
import { useDateInputTranslations } from "./hooks/useDateInputTranslations";
import { formatDateLocalized } from "./utils/dateUtils";
import {
  BREAKPOINTS,
  SEARCH_TYPES,
  KEYBOARD_KEYS,
} from "./constants/dateInputConstants";

/**
 * DateInput Component
 *
 * A responsive date input component with calendar picker support for both
 * flight and hotel search types. Handles one-way and round-trip selections.
 *
 * Features:
 * - Responsive design (mobile/desktop)
 * - RTL/LTR support
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Portal rendering for mobile calendar
 * - Body scroll lock on mobile
 *
 * @param {Object} props
 * @param {string|null} props.startDate - Start date (departure/check-in)
 * @param {Function} props.setStartDate - Function to set start date
 * @param {string|null} props.endDate - End date (return/check-out)
 * @param {Function} props.setEndDate - Function to set end date
 * @param {string} props.searchType - Type of search: "flight" or "hotel"
 */
export default function DateInput({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchType = SEARCH_TYPES.FLIGHT,
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { state, actions } = useSearchForm();
  const { showCalendar, tripType } = state;
  const { setShowCalendar, setTripType } = actions;
  const containerRef = useRef(null);

  // Custom hooks
  const { isMobile, isMounted, toggleCalendar } = useDateInput({
    showCalendar,
    setShowCalendar,
  });

  const translations = useDateInputTranslations({
    searchType,
    tripType,
    endDate,
  });

  // Memoized formatted dates
  const formattedStartDate = useMemo(
    () => formatDateLocalized(startDate, i18n.language),
    [startDate, i18n.language]
  );

  const formattedEndDate = useMemo(
    () => formatDateLocalized(endDate, i18n.language),
    [endDate, i18n.language]
  );

  // Memoized handlers
  const handleAddReturnClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setTripType("roundtrip");
      setShowCalendar(true);
    },
    [setTripType, setShowCalendar]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
        e.preventDefault();
        toggleCalendar();
      }
    },
    [toggleCalendar]
  );

  const handleAddReturnKeyDown = useCallback(
    (e) => {
      if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
        e.preventDefault();
        handleAddReturnClick(e);
      }
    },
    [handleAddReturnClick]
  );

  // Computed values
  const isReturnClickable =
    tripType === "oneway" && !endDate && searchType === SEARCH_TYPES.FLIGHT;

  const startDateBorderClass = isRTL ? "border-l" : "border-r";

  // Calendar props (memoized to prevent unnecessary re-renders)
  const calendarProps = useMemo(
    () => ({
      setShowCalendar,
      tripType,
      setTripType,
      isMobile,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      searchType,
    }),
    [
      setShowCalendar,
      tripType,
      setTripType,
      isMobile,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      searchType,
    ]
  );

  return (
    <div
      className="relative lg:mb-0 mb-4 w-full"
      data-date-input="true"
      ref={containerRef}
    >
      <DateInputContainer
        isRTL={isRTL}
        isActive={showCalendar}
        onClick={toggleCalendar}
        onKeyDown={handleKeyDown}
        ariaLabel={translations.pickDatesAria}
        ariaExpanded={showCalendar}
      >
        {/* Start Date - Departure Date for flights, Check-in for hotels */}
        <DateField
          formattedDate={formattedStartDate}
          label={translations.departureLabel}
          placeholder={translations.chooseDate}
          isRTL={isRTL}
          className={`${startDateBorderClass} border-gray-200`}
        />

        {/* End Date - Return Date for flights, Check-out for hotels */}
        <DateField
          formattedDate={formattedEndDate}
          label={translations.returnLabel}
          placeholder={
            isReturnClickable ? translations.addReturn : translations.chooseDate
          }
          isRTL={isRTL}
          isClickable={isReturnClickable}
          className={`
            ${isReturnClickable ? "cursor-pointer" : ""}
            ${isReturnClickable && !endDate ? "hover:bg-gray-50" : ""}
          `}
          onClick={isReturnClickable ? handleAddReturnClick : undefined}
          onKeyDown={isReturnClickable ? handleAddReturnKeyDown : undefined}
          ariaLabel={isReturnClickable ? translations.addReturnAria : undefined}
        />
      </DateInputContainer>

      {/* Calendar Popup - portal on mobile for full-screen */}
      {showCalendar &&
        (isMobile ? (
          isMounted &&
          createPortal(<Calendar {...calendarProps} />, document.body)
        ) : (
          <Calendar {...calendarProps} />
        ))}
    </div>
  );
}
