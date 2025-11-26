"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useSearchForm } from "../../context/SearchFormContext";
import { LuUsers, LuPlus, LuMinus, LuX } from "react-icons/lu";

const PassengerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PassengerInput = styled.div`
  height: 56px;
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  ${(props) =>
    props.$isOpen &&
    `
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  `}

  @media (min-width: 768px) {
    height: 58px; /* Reduced from 60px */
    padding: 0 22px; /* Reduced from 24px */
  }

  @media (min-width: 1024px) {
    height: 60px; /* Reduced from 64px */
  }
`;

const PassengerText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  transition: color 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    font-size: 14px; /* Keep same size instead of 15px */

    svg {
      width: 20px; /* Reduced from 22px */
      height: 20px;
    }
  }
`;

// Mobile Bottom Sheet Overlay
const BottomSheetOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
  display: ${(props) => (props.$show ? "block" : "none")};
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease;

  @media (min-width: 768px) {
    display: none;
  }
`;

// Mobile Bottom Sheet
const BottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.3);
  z-index: 10002;
  transform: ${(props) => (props.$show ? "translateY(0)" : "translateY(100%)")};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    display: none;
  }
`;

const BottomSheetHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const BottomSheetTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
`;

const BottomSheetContent = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
`;

// Desktop Dropdown (unchanged for desktop)
const PassengerDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 24px;
  transform: translateY(-10px);
  opacity: 0;
  animation: dropdownFadeIn 0.3s ease-out forwards;
  display: ${(props) => (props.$showOnDesktop ? "block" : "none")};

  @keyframes dropdownFadeIn {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const PassengerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  @media (max-width: 767px) {
    padding: 24px 0;
  }
`;

const PassengerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const PassengerLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;

  @media (max-width: 767px) {
    font-size: 17px;
  }
`;

const PassengerAge = styled.span`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.3;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const PassengerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 767px) {
    gap: 20px;
  }
`;

const CounterButton = styled.button`
  width: 44px;
  height: 44px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #6b7280;
    transition: color 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    color: #3b82f6;
  }

  @media (max-width: 767px) {
    width: 48px;
    height: 48px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CounterValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  min-width: 32px;
  text-align: center;

  @media (max-width: 767px) {
    font-size: 20px;
    min-width: 36px;
  }
`;

const DoneButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 767px) {
    padding: 18px;
    font-size: 17px;
    border-radius: 20px;
    margin-top: 24px;
  }
`;

export default function PassengerSelector() {
  const { t } = useTranslation();
  const { state, actions } = useSearchForm();
  const { passengers } = state;
  const { setPassengers, getPassengerText } = actions;

  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);
  const portalWrapperRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Detect mobile screen size
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !(
          portalWrapperRef.current &&
          portalWrapperRef.current.contains(event.target)
        ) &&
        !isMobile
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showDropdown]);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (showDropdown && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDropdown, isMobile]);

  // Update desktop dropdown position relative to the input container
  const updateDropdownPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (showDropdown && !isMobile) {
      updateDropdownPosition();
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
      return () => {
        window.removeEventListener("resize", updateDropdownPosition);
        window.removeEventListener("scroll", updateDropdownPosition, true);
      };
    }
  }, [showDropdown, isMobile]);

  const updatePassengerCount = (type, increment) => {
    const newPassengers = { ...passengers };
    const newCount = newPassengers[type] + increment;

    // Validation rules
    if (newCount < 0) return;
    if (type === "adults" && newCount < 1) return; // At least 1 adult
    if (type === "children" && newCount > 8) return; // Max 8 children
    if (type === "infants" && newCount > newPassengers.adults) return; // Max 1 infant per adult

    const totalPassengers = Object.values({
      ...newPassengers,
      [type]: newCount,
    }).reduce((sum, count) => sum + count, 0);

    if (totalPassengers > 9) return; // Max 9 passengers total

    newPassengers[type] = newCount;
    setPassengers(newPassengers);
  };

  const handleDone = () => {
    setShowDropdown(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowDropdown(false);
    }
  };

  const PassengerContent = () => (
    <>
      {/* Adults */}
      <PassengerRow>
        <PassengerInfo>
          <PassengerLabel>{t("flights.passengers.adults")}</PassengerLabel>
          <PassengerAge>{t("flights.passengers.adults_age")}</PassengerAge>
        </PassengerInfo>
        <PassengerControls>
          <CounterButton
            onClick={() => updatePassengerCount("adults", -1)}
            disabled={passengers.adults <= 1}
          >
            <LuMinus />
          </CounterButton>
          <CounterValue>{passengers.adults}</CounterValue>
          <CounterButton
            onClick={() => updatePassengerCount("adults", 1)}
            disabled={passengers.adults >= 9}
          >
            <LuPlus />
          </CounterButton>
        </PassengerControls>
      </PassengerRow>

      {/* Children */}
      <PassengerRow>
        <PassengerInfo>
          <PassengerLabel>{t("flights.passengers.children")}</PassengerLabel>
          <PassengerAge>{t("flights.passengers.children_age")}</PassengerAge>
        </PassengerInfo>
        <PassengerControls>
          <CounterButton
            onClick={() => updatePassengerCount("children", -1)}
            disabled={passengers.children <= 0}
          >
            <LuMinus />
          </CounterButton>
          <CounterValue>{passengers.children}</CounterValue>
          <CounterButton
            onClick={() => updatePassengerCount("children", 1)}
            disabled={passengers.children >= 8}
          >
            <LuPlus />
          </CounterButton>
        </PassengerControls>
      </PassengerRow>

      {/* Infants */}
      <PassengerRow>
        <PassengerInfo>
          <PassengerLabel>{t("flights.passengers.infants")}</PassengerLabel>
          <PassengerAge>{t("flights.passengers.infants_age")}</PassengerAge>
        </PassengerInfo>
        <PassengerControls>
          <CounterButton
            onClick={() => updatePassengerCount("infants", -1)}
            disabled={passengers.infants <= 0}
          >
            <LuMinus />
          </CounterButton>
          <CounterValue>{passengers.infants}</CounterValue>
          <CounterButton
            onClick={() => updatePassengerCount("infants", 1)}
            disabled={passengers.infants >= passengers.adults}
          >
            <LuPlus />
          </CounterButton>
        </PassengerControls>
      </PassengerRow>

      <DoneButton onClick={handleDone}>
        {t("flights.passengers.done")}
      </DoneButton>
    </>
  );

  return (
    <>
      <PassengerContainer ref={containerRef}>
        <PassengerInput
          onClick={() => setShowDropdown(!showDropdown)}
          $isOpen={showDropdown}
        >
          <PassengerText>
            <LuUsers />
            {getPassengerText()}
          </PassengerText>
        </PassengerInput>
      </PassengerContainer>

      {/* Desktop Dropdown via Portal */}
      {isMounted &&
        showDropdown &&
        !isMobile &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 10010,
            }}
            ref={portalWrapperRef}
          >
            <PassengerDropdown $showOnDesktop={!isMobile}>
              <PassengerContent />
            </PassengerDropdown>
          </div>,
          document.body
        )}

      {/* Mobile Bottom Sheet via Portal */}
      {isMounted &&
        isMobile &&
        showDropdown &&
        createPortal(
          <>
            <BottomSheetOverlay
              $show={showDropdown}
              onClick={handleOverlayClick}
            />
            <BottomSheet $show={showDropdown}>
              <BottomSheetHeader>
                <BottomSheetTitle>
                  {t("flights.passengers.label")}
                </BottomSheetTitle>
                <CloseButton onClick={() => setShowDropdown(false)}>
                  <LuX />
                </CloseButton>
              </BottomSheetHeader>
              <BottomSheetContent>
                <PassengerContent />
              </BottomSheetContent>
            </BottomSheet>
          </>,
          document.body
        )}
    </>
  );
}
