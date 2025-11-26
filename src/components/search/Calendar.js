"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "../../utils/numberLocalization";
import {
  CALENDAR_CONFIG,
  SEARCH_TYPES,
  TRIP_TYPES,
} from "./constants/calendarConstants";
import {
  safeDate,
  getToday,
  isSameDate,
  isDateInPast,
  isInRange,
  generateCalendar,
  formatMonthYear,
  getLocalizedDayNames,
  formatDateString,
  getEffectiveTripType,
} from "./utils/calendarUtils";
import {
  Backdrop,
  CalendarContainer,
  MobileHeader,
  MobileTitle,
  CloseButton,
  ContentWrapper,
  Header,
  Arrow,
  MonthsWrapper,
  MonthSection,
  MonthTitle,
  MonthName,
  CalendarGrid,
  DayHeader,
  DayCell,
  TripTypeSelector,
  TripOption,
  HelpText,
  MobileDoneButton,
} from "./styles/Calendar.styles";

/**
 * Calendar Component
 *
 * A responsive calendar component for selecting dates in flight and hotel searches.
 * Supports one-way and round-trip selections with RTL/LTR support.
 *
 * @param {Object} props
 * @param {Function} props.setShowCalendar - Function to close calendar
 * @param {boolean} props.isMobile - Whether calendar is displayed on mobile
 * @param {string} props.tripType - Trip type: "oneway" or "roundtrip"
 * @param {Function} props.setTripType - Function to set trip type
 * @param {string|null} props.startDate - Selected start date (YYYY-MM-DD)
 * @param {Function} props.setStartDate - Function to set start date
 * @param {string|null} props.endDate - Selected end date (YYYY-MM-DD)
 * @param {Function} props.setEndDate - Function to set end date
 * @param {string} props.searchType - Search type: "flight" or "hotel"
 */
const Calendar = ({
  setShowCalendar,
  isMobile = false,
  tripType,
  setTripType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchType = SEARCH_TYPES.FLIGHT,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const calendarRef = useRef(null);
  const hasFocusedRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const focusTimeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Initialize viewDate based on selected date or today
  const [viewDate, setViewDate] = useState(() => {
    if (startDate) {
      const date = safeDate(startDate);
      if (date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
      }
    }
    const today = getToday();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Get today's date - recalculate on mount to ensure accuracy
  const today = useMemo(() => getToday(), []);

  // Localized day names
  const daysNarrow = useMemo(
    () => getLocalizedDayNames(i18n.language),
    [i18n.language]
  );

  // Close calendar when clicking outside (only for desktop)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        !event.target.closest('[data-calendar="true"]')
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [setShowCalendar, isMobile]);

  // Prevent body scroll when mobile calendar is open
  useEffect(() => {
    if (isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobile]);

  // Initialize viewDate based on selected date only on first mount
  useEffect(() => {
    if (isInitialMountRef.current && startDate) {
      const date = safeDate(startDate);
      if (date) {
        const newViewDate = new Date(date.getFullYear(), date.getMonth(), 1);
        setViewDate(newViewDate);
      }
      isInitialMountRef.current = false;
    }
  }, [startDate]);

  // Focus on selected date when calendar first opens (only once)
  useEffect(() => {
    // Only focus once when calendar first mounts
    if (hasFocusedRef.current) return;

    // Small delay to ensure calendar is rendered
    const timer = setTimeout(() => {
      const dateToFocus = startDate || (endDate ? endDate : null);

      if (dateToFocus) {
        const focusDate = safeDate(dateToFocus);
        if (focusDate) {
          const dateString = formatDateString(
            focusDate.getFullYear(),
            focusDate.getMonth(),
            focusDate.getDate()
          );
          const dateCell = document.querySelector(
            `[data-date-cell="${dateString}"]`
          );

          if (dateCell) {
            // Scroll to the date cell smoothly
            dateCell.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });

            // Focus on the date cell for accessibility (only if not disabled)
            if (!dateCell.disabled) {
              // Small delay to ensure scroll completes
              scrollTimeoutRef.current = setTimeout(() => {
                dateCell.focus();
                hasFocusedRef.current = true;
              }, CALENDAR_CONFIG.SCROLL_DELAY);
            } else {
              hasFocusedRef.current = true;
            }
          } else {
            hasFocusedRef.current = true;
          }
        }
      } else {
        // If no date selected, focus on today
        const todayDate = getToday();
        const todayString = formatDateString(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          todayDate.getDate()
        );
        const todayCell = document.querySelector(
          `[data-date-cell="${todayString}"]`
        );

        if (todayCell && !todayCell.disabled) {
          todayCell.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          scrollTimeoutRef.current = setTimeout(() => {
            todayCell.focus();
            hasFocusedRef.current = true;
          }, CALENDAR_CONFIG.SCROLL_DELAY);
        } else {
          hasFocusedRef.current = true;
        }
      }
    }, CALENDAR_CONFIG.FOCUS_DELAY);

    focusTimeoutRef.current = timer;

    // Cleanup function to clear timeouts
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [startDate, endDate]);

  // Date comparison functions
  const isSameDateMemo = useCallback(
    (d1, d2) => isSameDate(d1, d2, safeDate),
    []
  );

  const isDateInPastMemo = useCallback(
    (date) => isDateInPast(date, today, safeDate),
    [today]
  );

  const isInRangeMemo = useCallback(
    (date) => isInRange(date, startDate, endDate, safeDate),
    [startDate, endDate]
  );

  // Date selection handler
  const handleDateSelect = useCallback(
    (year, month, day) => {
      // Create a clean date from the individual components to avoid timezone issues
      const selectedDate = new Date(year, month, day);
      selectedDate.setHours(0, 0, 0, 0);

      // Check if date is in the past
      if (selectedDate < today) {
        return;
      }

      // Format as YYYY-MM-DD string to avoid timezone issues
      const dateString = formatDateString(year, month, day);

      // For hotels, always treat as roundtrip (check-in and check-out)
      const effectiveTripType = getEffectiveTripType(searchType, tripType);

      if (effectiveTripType === TRIP_TYPES.ROUNDTRIP) {
        if (!startDate || (startDate && endDate)) {
          // First selection or reselecting both dates
          setStartDate(dateString);
          setEndDate(null);
        } else if (startDate && !endDate) {
          // Second selection for end date
          const startDateTime = new Date(startDate).getTime();
          const selectedDateTime = selectedDate.getTime();

          if (selectedDateTime >= startDateTime) {
            setEndDate(dateString);
            setShowCalendar(false);
          } else {
            // If selected date is before start date, swap them
            setEndDate(startDate);
            setStartDate(dateString);
            setShowCalendar(false);
          }
        }
      } else if (effectiveTripType === TRIP_TYPES.ONEWAY) {
        setStartDate(dateString);
        setEndDate(null);
        setShowCalendar(false);
      }
    },
    [
      today,
      tripType,
      searchType,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      setShowCalendar,
    ]
  );

  // Navigation handlers with boundary checks
  const handlePrev = useCallback(() => {
    const prevDate = new Date(viewDate);
    prevDate.setMonth(prevDate.getMonth() - 1);

    // Don't allow going before current month
    const minViewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prevDate >= minViewDate) {
      setViewDate(prevDate);
    }
  }, [viewDate, today]);

  const handleNext = useCallback(() => {
    const nextDate = new Date(viewDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    // Optional: Add max date limit (e.g., 2 years from now)
    const maxViewDate = new Date(
      today.getFullYear() + CALENDAR_CONFIG.MAX_YEARS_AHEAD,
      today.getMonth(),
      1
    );
    if (nextDate <= maxViewDate) {
      setViewDate(nextDate);
    }
  }, [viewDate, today]);

  // Memoized calendar grids for better performance
  const currentGrid = useMemo(
    () => generateCalendar(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  const nextGrid = useMemo(
    () =>
      !isMobile
        ? generateCalendar(viewDate.getFullYear(), viewDate.getMonth() + 1)
        : null,
    [viewDate, isMobile]
  );

  // Localized month and year formatter
  const formatMonthYearMemo = useCallback(
    (date) => formatMonthYear(date, i18n.language),
    [i18n.language]
  );

  // Number localization
  const localizeNumber = useCallback(
    (num) => {
      if (i18n.language === "ar" || i18n.language?.startsWith("ar-")) {
        return toArabicNumerals(num);
      }
      return num.toString();
    },
    [i18n.language]
  );

  // Determine which grids to show
  const gridsToShow = useMemo(
    () => (isMobile ? [currentGrid] : [currentGrid, nextGrid]),
    [isMobile, currentGrid, nextGrid]
  );

  // Check if previous month navigation is disabled
  const isPrevDisabled = useMemo(() => {
    return (
      viewDate.getFullYear() === today.getFullYear() &&
      viewDate.getMonth() === today.getMonth()
    );
  }, [viewDate, today]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && <Backdrop onClick={() => setShowCalendar(false)} />}

      <CalendarContainer
        ref={calendarRef}
        $isMobile={isMobile}
        $isRTL={isRTL}
        data-calendar="true"
      >
        {/* Header with close button for mobile */}
        {isMobile && (
          <MobileHeader $isRTL={isRTL}>
            <CloseButton
              $isRTL={isRTL}
              onClick={() => setShowCalendar(false)}
              aria-label={t("calendar.close", "إغلاق التقويم")}
            >
              <IoClose />
            </CloseButton>
            <MobileTitle>{t("calendar.title", "اختيار التاريخ")}</MobileTitle>
          </MobileHeader>
        )}

        <ContentWrapper $isMobile={isMobile}>
          {searchType === SEARCH_TYPES.FLIGHT && (
            <Header $isMobile={isMobile}>
              <TripTypeSelector>
                <TripOption
                  $isMobile={isMobile}
                  $isActive={tripType === TRIP_TYPES.ONEWAY}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTripType(TRIP_TYPES.ONEWAY);
                    setEndDate(null);
                  }}
                >
                  {t("flights.trip_type.one_way", "ذهاب فقط")}
                </TripOption>
                <TripOption
                  $isMobile={isMobile}
                  $isActive={tripType === TRIP_TYPES.ROUNDTRIP}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTripType(TRIP_TYPES.ROUNDTRIP);
                  }}
                >
                  {t("flights.trip_type.round_trip", "ذهاب وعودة")}
                </TripOption>
              </TripTypeSelector>
            </Header>
          )}

          <MonthsWrapper $isMobile={isMobile}>
            {gridsToShow.map((grid, idx) => {
              if (!grid) return null;

              const displayedDate = new Date(viewDate);
              displayedDate.setMonth(viewDate.getMonth() + idx);

              return (
                <MonthSection
                  key={`${displayedDate.getFullYear()}-${displayedDate.getMonth()}`}
                  $isMobile={isMobile}
                >
                  <MonthTitle $isMobile={isMobile}>
                    {(idx === 0 || isMobile) && (
                      <Arrow
                        $isMobile={isMobile}
                        onClick={handlePrev}
                        disabled={isPrevDisabled}
                        aria-label={t(
                          "calendar.prev_month_aria",
                          "الشهر السابق"
                        )}
                      >
                        {isMobile ? (
                          isRTL ? (
                            <IoIosArrowBack />
                          ) : (
                            <IoIosArrowForward />
                          )
                        ) : isRTL ? (
                          <IoIosArrowForward />
                        ) : (
                          <IoIosArrowBack />
                        )}
                      </Arrow>
                    )}
                    <MonthName>{formatMonthYearMemo(displayedDate)}</MonthName>
                    {((!isMobile && idx === 1) || isMobile) && (
                      <Arrow
                        $isMobile={isMobile}
                        onClick={handleNext}
                        aria-label={t(
                          "calendar.next_month_aria",
                          "الشهر التالي"
                        )}
                      >
                        {isMobile ? (
                          isRTL ? (
                            <IoIosArrowForward />
                          ) : (
                            <IoIosArrowBack />
                          )
                        ) : isRTL ? (
                          <IoIosArrowBack />
                        ) : (
                          <IoIosArrowForward />
                        )}
                      </Arrow>
                    )}
                  </MonthTitle>

                  <CalendarGrid $isMobile={isMobile}>
                    {daysNarrow.map((day, index) => (
                      <DayHeader key={index} $isMobile={isMobile}>
                        {day}
                      </DayHeader>
                    ))}

                    {grid.flat().map((date, index) => {
                      const isDisplayMonth =
                        date.getMonth() === displayedDate.getMonth() &&
                        date.getFullYear() === displayedDate.getFullYear();

                      let disabled = !isDisplayMonth || isDateInPastMemo(date);

                      // When selecting return date, disable dates before startDate
                      // For hotels, always require check-out after check-in
                      const effectiveTripType = getEffectiveTripType(
                        searchType,
                        tripType
                      );
                      if (
                        effectiveTripType === TRIP_TYPES.ROUNDTRIP &&
                        startDate &&
                        !endDate
                      ) {
                        const safeStartDate = safeDate(startDate);
                        if (safeStartDate && date < safeStartDate) {
                          disabled = true;
                        }
                      }

                      const isSelected =
                        isSameDateMemo(date, startDate) ||
                        isSameDateMemo(date, endDate);
                      const inRange = isInRangeMemo(date);
                      const isToday = isSameDateMemo(date, today);
                      const isStartDate = isSameDateMemo(date, startDate);
                      const isEndDate = isSameDateMemo(date, endDate);

                      // Extract date components to avoid timezone issues
                      const cellYear = date.getFullYear();
                      const cellMonth = date.getMonth();
                      const cellDay = date.getDate();

                      // Create date string for data attribute
                      const dateString = formatDateString(
                        cellYear,
                        cellMonth,
                        cellDay
                      );

                      return (
                        <DayCell
                          key={`${cellYear}-${cellMonth}-${cellDay}-${index}`}
                          data-date-cell={dateString}
                          disabled={disabled}
                          $isSelected={isSelected}
                          $isInRange={inRange}
                          $isStartDate={isStartDate}
                          $isEndDate={isEndDate}
                          $isToday={isToday}
                          $isMobile={isMobile}
                          $isRTL={isRTL}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!disabled) {
                              handleDateSelect(cellYear, cellMonth, cellDay);
                            }
                          }}
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-label={
                            disabled
                              ? t("calendar.date_disabled", "تاريخ غير متاح")
                              : t(
                                  "calendar.date_select_aria",
                                  "اختر التاريخ {{date}}",
                                  {
                                    date: `${localizeNumber(
                                      cellDay
                                    )} ${formatMonthYearMemo(date)}`,
                                  }
                                )
                          }
                          onKeyDown={(e) => {
                            if (
                              (e.key === "Enter" || e.key === " ") &&
                              !disabled
                            ) {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDateSelect(cellYear, cellMonth, cellDay);
                            }
                          }}
                        >
                          {localizeNumber(cellDay)}
                        </DayCell>
                      );
                    })}
                  </CalendarGrid>
                </MonthSection>
              );
            })}
          </MonthsWrapper>

          {(searchType === SEARCH_TYPES.HOTEL ||
            tripType === TRIP_TYPES.ROUNDTRIP) &&
            startDate &&
            !endDate && (
              <HelpText $isMobile={isMobile}>
                {searchType === SEARCH_TYPES.HOTEL
                  ? t(
                      "calendar.select_checkout_help",
                      "الرجاء اختيار تاريخ المغادرة"
                    )
                  : t(
                      "calendar.select_return_help",
                      "الرجاء اختيار تاريخ العودة"
                    )}
              </HelpText>
            )}
        </ContentWrapper>

        {/* Done button for mobile */}
        {isMobile && (
          <MobileDoneButton onClick={() => setShowCalendar(false)}>
            {t("calendar.done", "تم")}
          </MobileDoneButton>
        )}
      </CalendarContainer>
    </>
  );
};

export default Calendar;
