import styled, { keyframes, css } from "styled-components";
import { CALENDAR_BREAKPOINTS } from "../constants/calendarConstants";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const dropdownIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUpMobile = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Backdrop
export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 999;
  touch-action: none;
  animation: ${fadeIn} 0.3s ease-out;
`;

// Main Container
export const CalendarContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  font-family: "Inter", "Arial", sans-serif;
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};
  display: flex;
  flex-direction: column;
  z-index: 1000;

  ${({ $isMobile, $isRTL }) =>
    $isMobile
      ? css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          border-radius: 0;
          box-shadow: none;
          animation: ${slideUpMobile} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `
      : css`
          position: absolute;
          top: calc(100% + 8px);
          ${$isRTL ? "right: 0;" : "left: 0;"}
          width: min(720px, 85vw);
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15),
            0 10px 25px rgba(0, 0, 0, 0.1);
          animation: ${dropdownIn} 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 24px;

          @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
            width: min(780px, 80vw);
            padding: 28px;
          }

          @media (max-width: ${CALENDAR_BREAKPOINTS.desktop}) {
            width: min(660px, 90vw);
            padding: 20px;
          }

          @media (max-width: ${CALENDAR_BREAKPOINTS.tablet}) {
            width: min(500px, 92vw);
            padding: 16px;
          }

          @media (max-width: ${CALENDAR_BREAKPOINTS.mobile}) {
            width: 95vw;
            padding: 14px;
          }
        `}
`;

// Mobile Header
export const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 16px;
  position: relative;
  border-radius: 0;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const MobileTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  letter-spacing: -0.02em;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  font-size: 20px;
  color: #6b7280;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  ${({ $isRTL }) => ($isRTL ? "right: 20px;" : "left: 20px;")}
  touch-action: manipulation;

  &:hover {
    background-color: #e5e7eb;
    color: #374151;
  }

  &:active {
    transform: scale(0.92);
    background-color: #d1d5db;
  }
`;

// Content Wrapper
export const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "0")};
  -webkit-overflow-scrolling: touch;

  ${({ $isMobile }) =>
    $isMobile &&
    `
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `}
`;

// Header
export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "16px")};
  padding: ${({ $isMobile }) => ($isMobile ? "0" : "0")};

  @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
    margin-bottom: 20px;
  }
`;

// Navigation Arrow
export const Arrow = styled.button`
  font-size: ${({ $isMobile }) => ($isMobile ? "24px" : "22px")};
  background: ${({ $isMobile }) =>
    $isMobile
      ? "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"};
  border: ${({ $isMobile }) =>
    $isMobile ? "2px solid #e5e7eb" : "1px solid #e2e8f0"};
  cursor: pointer;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "10px")};
  border-radius: 50%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #3b82f6;
  min-width: ${({ $isMobile }) => ($isMobile ? "48px" : "40px")};
  min-height: ${({ $isMobile }) => ($isMobile ? "48px" : "40px")};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ $isMobile }) =>
    $isMobile
      ? "0 2px 8px rgba(0, 0, 0, 0.08)"
      : "0 1px 3px rgba(0, 0, 0, 0.05)"};
  touch-action: manipulation;

  @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
    font-size: 24px;
    min-width: 44px;
    min-height: 44px;
    padding: 12px;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #3b82f6;
    transform: ${({ $isMobile }) =>
      $isMobile ? "scale(1.05)" : "scale(1.08)"};
    box-shadow: ${({ $isMobile }) =>
      $isMobile
        ? "0 4px 16px rgba(59, 130, 246, 0.3)"
        : "0 4px 12px rgba(59, 130, 246, 0.25)"};
  }

  &:active:not(:disabled) {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: #f9fafb;
    border-color: #e5e7eb;
  }
`;

// Months Wrapper
export const MonthsWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "1fr" : "repeat(2, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "0" : "20px")};
  padding: ${({ $isMobile }) => ($isMobile ? "0" : "0")};

  @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
    gap: 28px;
  }

  @media (max-width: ${CALENDAR_BREAKPOINTS.desktop}) {
    gap: 18px;
  }

  @media (max-width: ${CALENDAR_BREAKPOINTS.tablet}) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

export const MonthSection = styled.div`
  background: ${({ $isMobile }) => ($isMobile ? "transparent" : "white")};
  padding: ${({ $isMobile }) => ($isMobile ? "0" : "0")};
`;

export const MonthTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "20px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "18px")};
  font-weight: 700;
  color: #111827;
  gap: 16px;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 0" : "8px 0")};

  @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
    font-size: 19px;
    margin-bottom: 24px;
  }

  @media (max-width: ${CALENDAR_BREAKPOINTS.mobile}) {
    font-size: 18px;
    margin-bottom: 20px;
    padding: 12px 0;
  }
`;

export const MonthName = styled.span`
  font-family: "Inter", "Arial", sans-serif;
  flex: 1;
  text-align: center;
  letter-spacing: -0.01em;
  font-weight: 700;
`;

// Calendar Grid
export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "3px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "12px" : "0")};

  @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
    gap: 4px;
  }
`;

export const DayHeader = styled.div`
  padding: ${({ $isMobile }) => ($isMobile ? "14px 4px" : "10px 4px")};
  text-align: center;
  font-weight: 700;
  color: #6b7280;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "13px")};
  letter-spacing: 0.03em;
  text-transform: uppercase;

  @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
    font-size: 14px;
    padding: 12px 4px;
  }

  @media (max-width: ${CALENDAR_BREAKPOINTS.mobile}) {
    font-size: 12px;
    padding: 12px 2px;
  }
`;

// Day Cell
export const DayCell = styled.div`
  padding: ${({ $isMobile }) => ($isMobile ? "12px 4px" : "10px")};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ $isSelected, $isInRange, disabled, $isToday }) => {
    if (disabled) return "#d1d5db";
    if ($isSelected || $isInRange) return "#fff";
    if ($isToday) return "#3b82f6";
    return "#111827";
  }};
  background: ${({
    $isSelected,
    $isInRange,
    $isStartDate,
    $isEndDate,
    disabled,
  }) => {
    if ($isSelected && !disabled) {
      return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
    }
    if ($isInRange && !disabled) return "rgba(59, 130, 246, 0.12)";
    return "transparent";
  }};
  border-radius: ${({ $isStartDate, $isEndDate, $isMobile, $isRTL }) => {
    // In RTL: start date is on right (rounded left), end date is on left (rounded right)
    // In LTR: start date is on left (rounded right), end date is on right (rounded left)
    if ($isStartDate) {
      if ($isMobile) {
        return $isRTL ? "0 12px 12px 0" : "12px 0 0 12px";
      }
      return $isRTL ? "0 12px 12px 0" : "12px 0 0 12px";
    }
    if ($isEndDate) {
      if ($isMobile) {
        return $isRTL ? "12px 0 0 12px" : "0 12px 12px 0";
      }
      return $isRTL ? "12px 0 0 12px" : "0 12px 12px 0";
    }
    return $isMobile ? "12px" : "10px";
  }};
  font-weight: ${({ $isSelected, $isToday }) =>
    $isSelected || $isToday ? "700" : "600"};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "14px")};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${({ $isToday, $isSelected, $isMobile }) =>
    $isToday && !$isSelected
      ? $isMobile
        ? "2.5px solid #3b82f6"
        : "2px solid #3b82f6"
      : "2px solid transparent"};
  min-height: ${({ $isMobile }) => ($isMobile ? "64px" : "44px")};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  position: relative;
  box-shadow: ${({ $isSelected, $isMobile }) =>
    $isSelected
      ? $isMobile
        ? "0 6px 20px rgba(59, 130, 246, 0.35)"
        : "0 4px 12px rgba(59, 130, 246, 0.3)"
      : "none"};
  touch-action: manipulation;

  @media (min-width: ${CALENDAR_BREAKPOINTS.large}) {
    font-size: 15px;
    min-height: 48px;
    padding: 12px;
  }

  @media (max-width: ${CALENDAR_BREAKPOINTS.mobile}) {
    font-size: 15px;
    min-height: 60px;
    padding: 10px 4px;
  }

  &:hover:not([disabled]) {
    background: ${({ $isSelected, $isInRange }) =>
      $isSelected || $isInRange
        ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
        : "rgba(59, 130, 246, 0.1)"};
    transform: ${({ $isMobile }) =>
      $isMobile ? "scale(1.05)" : "scale(1.05)"};
    box-shadow: ${({ $isSelected, $isMobile }) =>
      $isSelected
        ? $isMobile
          ? "0 8px 24px rgba(59, 130, 246, 0.45)"
          : "0 6px 16px rgba(59, 130, 246, 0.4)"
        : "0 2px 8px rgba(0, 0, 0, 0.08)"};
  }

  &:active:not([disabled]) {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Friday highlighting */
  &:nth-child(7n-1) {
    color: ${({ disabled, $isSelected, $isInRange, $isToday }) =>
      disabled
        ? "#d1d5db"
        : $isSelected || $isInRange
        ? "#fff"
        : $isToday
        ? "#3b82f6"
        : "#ef4444"};
  }
`;

// Trip Type Selector
export const TripTypeSelector = styled.div`
  display: flex;
  background: #f3f4f6;
  padding: ${({ $isMobile }) => ($isMobile ? "6px" : "4px")};
  border-radius: ${({ $isMobile }) => ($isMobile ? "12px" : "10px")};
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "4px")};
  box-shadow: ${({ $isMobile }) =>
    $isMobile
      ? "0 2px 8px rgba(0, 0, 0, 0.06)"
      : "0 1px 4px rgba(0, 0, 0, 0.04)"};
  width: ${({ $isMobile }) => ($isMobile ? "100%" : "auto")};
`;

export const TripOption = styled.button`
  padding: ${({ $isMobile }) => ($isMobile ? "12px 20px" : "6px 14px")};
  border: none;
  border-radius: ${({ $isMobile }) => ($isMobile ? "10px" : "6px")};
  font-weight: 700;
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "13px")};
  background-color: ${({ $isActive }) =>
    $isActive ? "#3b82f6" : "transparent"};
  color: ${({ $isActive }) => ($isActive ? "#fff" : "#6b7280")};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  user-select: none;
  white-space: nowrap;
  flex: 1;
  touch-action: manipulation;
  box-shadow: ${({ $isActive, $isMobile }) =>
    $isActive && $isMobile ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none"};

  @media (max-width: ${CALENDAR_BREAKPOINTS.mobile}) {
    font-size: 14px;
    padding: 10px 16px;
  }

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? "#2563eb" : "rgba(59, 130, 246, 0.1)"};
    color: ${({ $isActive }) => ($isActive ? "#fff" : "#3b82f6")};
    transform: ${({ $isMobile }) => ($isMobile ? "scale(1.02)" : "none")};
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Help Text
export const HelpText = styled.div`
  text-align: center;
  color: #dc2626;
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "13px")};
  font-weight: 600;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: ${({ $isMobile }) => ($isMobile ? "12px" : "6px")};
  padding: ${({ $isMobile }) => ($isMobile ? "14px 20px" : "8px 16px")};
  margin: ${({ $isMobile }) => ($isMobile ? "20px 0 0" : "12px 16px 0")};
  border: 2px solid #fecaca;
  box-shadow: ${({ $isMobile }) =>
    $isMobile ? "0 2px 8px rgba(220, 38, 38, 0.1)" : "none"};

  @media (max-width: ${CALENDAR_BREAKPOINTS.mobile}) {
    font-size: 14px;
    padding: 12px 16px;
    margin: 16px 0 0;
  }
`;

// Mobile Done Button
export const MobileDoneButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
  position: relative;
  overflow: hidden;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(59, 130, 246, 0.25);
  letter-spacing: 0.01em;
  touch-action: manipulation;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 -6px 24px rgba(59, 130, 246, 0.35);
  }

  &:active {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: scale(0.98);
    box-shadow: 0 -2px 12px rgba(59, 130, 246, 0.3);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover:before {
    left: 100%;
  }
`;
