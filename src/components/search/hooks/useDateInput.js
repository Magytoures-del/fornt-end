import { useState, useEffect, useCallback, useMemo } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { lockBodyScroll } from "../utils/dateUtils";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook for DateInput component logic
 * @param {Object} params
 * @param {boolean} params.showCalendar - Whether calendar is visible
 * @param {Function} params.setShowCalendar - Function to toggle calendar
 * @returns {Object} DateInput hook state and handlers
 */
export const useDateInput = ({ showCalendar, setShowCalendar }) => {
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const [isMounted, setIsMounted] = useState(false);

  // Mount check for portal rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Escape key to close calendar
  useEffect(() => {
    if (!showCalendar) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowCalendar(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCalendar, setShowCalendar]);

  // Handle clicks outside calendar
  useEffect(() => {
    if (!showCalendar) return;

    const handleClickOutside = (event) => {
      const calendarElement = document.querySelector('[data-calendar="true"]');
      const dateInputElement = event.target.closest('[data-date-input="true"]');

      if (
        calendarElement &&
        !calendarElement.contains(event.target) &&
        !dateInputElement
      ) {
        setShowCalendar(false);
      }
    };

    // Use capture phase for better detection
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [showCalendar, setShowCalendar]);

  // Prevent body scroll when mobile calendar is open
  useEffect(() => {
    if (!isMobile || !showCalendar) return;
    return lockBodyScroll(true);
  }, [isMobile, showCalendar]);

  // Memoized handlers
  const toggleCalendar = useCallback(() => {
    setShowCalendar((prev) => !prev);
  }, [setShowCalendar]);

  return {
    isMobile,
    isMounted,
    toggleCalendar,
  };
};


