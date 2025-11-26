"use client";

import React, { useMemo, useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useSearchForm } from "../../context/SearchFormContext";
import { LuArrowRight, LuArrowLeftRight } from "react-icons/lu";

// Modern Design System
const colors = {
  primary: {
    default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    hover: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    light: "rgba(102, 126, 234, 0.1)",
    lighter: "rgba(102, 126, 234, 0.05)",
  },
  accent: {
    default: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    hover: "linear-gradient(135deg, #e879f9 0%, #ef4444 100%)",
  },
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
  },
  white: "#ffffff",
  black: "#0a0a0a",
};

const transitions = {
  fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  smooth: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  bounce: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  glow: "0 0 20px rgba(102, 126, 234, 0.3), 0 0 40px rgba(102, 126, 234, 0.1)",
  focus: "0 0 0 4px rgba(102, 126, 234, 0.2)",
};

const TripTypeContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const TripTypeOptions = styled.div`
  display: flex;
  position: relative;
  background: ${colors.gray[100]};
  border: 2px solid ${colors.gray[200]};
  border-radius: 12px;
  padding: 4px;
  width: 100%;
  height: 56px;
  box-shadow: ${shadows.md};
  transition: ${transitions.default};
  isolation: isolate;

  &:hover {
    border-color: ${colors.gray[300]};
    box-shadow: ${shadows.lg};
  }

  &:focus-within {
    border-color: #667eea;
    box-shadow: ${shadows.focus};
  }

  @media (min-width: 768px) {
    height: 58px;
    border-radius: 12px;
    padding: 4px;
  }

  @media (min-width: 1024px) {
    height: 60px;
    border-radius: 12px;
    padding: 4px;
  }
`;

const SlidingIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    prop !== "selectedIndex" && prop !== "totalItems",
})`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: ${(props) =>
    `calc(${props.selectedIndex * (100 / props.totalItems)}% + 4px)`};
  width: ${(props) => `calc(${100 / props.totalItems}% - 8px)`};
  background: ${colors.primary.default};
  border-radius: 8px;
  transition: ${transitions.smooth};
  box-shadow: ${shadows.lg}, ${shadows.glow};
  z-index: 0;
  transform-origin: center;

  @media (min-width: 768px) {
    top: 4px;
    bottom: 4px;
    left: ${(props) =>
      `calc(${props.selectedIndex * (100 / props.totalItems)}% + 4px)`};
    width: ${(props) => `calc(${100 / props.totalItems}% - 8px)`};
    border-radius: 8px;
  }

  @media (min-width: 1024px) {
    top: 4px;
    bottom: 4px;
    left: ${(props) =>
      `calc(${props.selectedIndex * (100 / props.totalItems)}% + 4px)`};
    width: ${(props) => `calc(${100 / props.totalItems}% - 8px)`};
    border-radius: 8px;
  }

  /* RTL Support */
  [dir="rtl"] & {
    left: auto;
    right: ${(props) =>
      `calc(${props.selectedIndex * (100 / props.totalItems)}% + 4px)`};

    @media (min-width: 768px) {
      right: ${(props) =>
        `calc(${props.selectedIndex * (100 / props.totalItems)}% + 4px)`};
    }

    @media (min-width: 1024px) {
      right: ${(props) =>
        `calc(${props.selectedIndex * (100 / props.totalItems)}% + 4px)`};
    }
  }
`;

const TripTypeOption = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isSelected",
})`
  flex: 1;
  padding: 0 16px;
  border: none;
  background: transparent;
  color: ${(props) => (props.isSelected ? colors.white : colors.gray[600])};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: ${transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  height: 100%;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  border-radius: 8px;

  /* Hover state */
  &:hover:not(:disabled) {
    color: ${(props) => (props.isSelected ? colors.white : colors.gray[800])};
  }

  /* Active state */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* Focus state */
  &:focus-visible {
    outline: 2px solid ${colors.primary.light};
    outline-offset: 2px;
    border-radius: 8px;
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Icon styling */
  svg {
    width: 20px;
    height: 20px;
    transition: ${transitions.default};
    flex-shrink: 0;
    stroke-width: 2.5;
    filter: ${(props) =>
      props.isSelected ? "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))" : "none"};
  }

  &:hover:not(:disabled) svg {
    transform: ${(props) => (props.isSelected ? "none" : "scale(1.1)")};
  }

  /* Text styling */
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    transition: ${transitions.default};
    position: relative;
    font-weight: ${(props) => (props.isSelected ? 700 : 600)};
    letter-spacing: ${(props) => (props.isSelected ? "0.01em" : "0")};
  }

  /* Responsive adjustments */
  @media (min-width: 640px) {
    padding: 0 18px;
    gap: 10px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (min-width: 768px) {
    padding: 0 20px;
    gap: 10px;
    font-size: 14px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (min-width: 1024px) {
    padding: 0 24px;
    gap: 12px;
    font-size: 14px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    padding: 0 12px;
    gap: 6px;
    font-size: 13px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const TripTypeOptionText = styled.span`
  transition: ${transitions.default};
  font-weight: inherit;

  @media (max-width: 380px) {
    display: none;
  }
`;

const TripTypeOptionTextMobile = styled.span`
  display: none;
  font-weight: inherit;
  transition: ${transitions.default};

  @media (max-width: 380px) {
    display: inline-block;
    font-size: 11px;
    line-height: 1.3;
  }
`;

const IconWrapper = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isSelected",
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: ${(props) => (props.isSelected ? "100%" : "0%")};
    height: 2px;
    bottom: -2px;
    background: ${colors.white};
    border-radius: 2px;
    transition: ${transitions.default};
    opacity: ${(props) => (props.isSelected ? 1 : 0)};
  }
`;

export default function TripTypeSelector() {
  const { t } = useTranslation();
  const { state, actions } = useSearchForm();
  const { tripType } = state;
  const { setTripType } = actions;

  // Memoize trip types configuration
  const tripTypes = useMemo(
    () => [
      {
        value: "oneway",
        label: t("flights.trip_type.one_way") || "One Way",
        shortLabel: t("flights.trip_type.one_way_short") || "One Way",
        icon: LuArrowRight,
      },
      {
        value: "roundtrip",
        label: t("flights.trip_type.round_trip") || "Round Trip",
        shortLabel: t("flights.trip_type.round_trip_short") || "Round Trip",
        icon: LuArrowLeftRight,
      },
    ],
    [t]
  );

  // Find selected index for sliding indicator
  const selectedIndex = useMemo(
    () => tripTypes.findIndex((type) => type.value === tripType),
    [tripTypes, tripType]
  );

  // Memoize change handler
  const handleTripTypeChange = useCallback(
    (type) => {
      if (type !== tripType) {
        setTripType(type);
      }
    },
    [tripType, setTripType]
  );

  // Handle keyboard navigation for radio group
  const handleKeyDown = useCallback(
    (e, currentValue) => {
      const currentIndex = tripTypes.findIndex((t) => t.value === currentValue);
      let nextIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tripTypes.length;
          handleTripTypeChange(tripTypes[nextIndex].value);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tripTypes.length) % tripTypes.length;
          handleTripTypeChange(tripTypes[nextIndex].value);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleTripTypeChange(currentValue);
          break;
        default:
          break;
      }
    },
    [tripTypes, handleTripTypeChange]
  );

  return (
    <TripTypeContainer>
      <TripTypeOptions
        role="radiogroup"
        aria-label={t("flights.trip_type.label") || "Trip Type"}
        id="trip-type-selector"
      >
        {/* Sliding Background Indicator */}
        <SlidingIndicator
          selectedIndex={selectedIndex >= 0 ? selectedIndex : 0}
          totalItems={tripTypes.length}
          aria-hidden="true"
        />

        {/* Trip Type Options */}
        {tripTypes.map((type) => {
          const isSelected = tripType === type.value;
          const IconComponent = type.icon;

          return (
            <TripTypeOption
              key={type.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={type.label}
              isSelected={isSelected}
              onClick={() => handleTripTypeChange(type.value)}
              onKeyDown={(e) => handleKeyDown(e, type.value)}
              tabIndex={isSelected ? 0 : -1}
            >
              <IconWrapper isSelected={isSelected}>
                <IconComponent />
              </IconWrapper>
              <TripTypeOptionText>{type.label}</TripTypeOptionText>
              <TripTypeOptionTextMobile>
                {type.shortLabel}
              </TripTypeOptionTextMobile>
            </TripTypeOption>
          );
        })}
      </TripTypeOptions>
    </TripTypeContainer>
  );
}
