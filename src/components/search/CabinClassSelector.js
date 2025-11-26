"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useSearchForm } from "../../context/SearchFormContext";
import { LuChevronDown, LuPlane, LuX, LuCheck } from "react-icons/lu";

const CabinClassContainer = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  width: 100%;
`;

const CabinClassInput = styled.div`
  height: 56px;
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const CabinClassText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 12px;
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
  z-index: 10003;
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
  z-index: 10004;
  transform: ${(props) => (props.$show ? "translateY(0)" : "translateY(100%)")};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 70vh;
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
  padding: 8px 0 24px;
  flex: 1;
  overflow-y: auto;
`;

// Desktop Dropdown
const CabinClassDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
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

const CabinClassOption = styled.div`
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
    transform: translateX(8px);
  }

  &.selected {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: #3b82f6;
    border-left: 4px solid #3b82f6;
    transform: translateX(4px);
  }

  @media (max-width: 767px) {
    padding: 24px 24px;
    gap: 20px;

    &:hover {
      transform: none;
      background: #f8fafc;
    }

    &.selected {
      border-left: none;
      transform: none;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: #3b82f6;
      }
    }
  }
`;

const CabinClassInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
`;

const CabinClassName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  transition: color 0.2s ease;

  .selected & {
    color: #3b82f6;
  }

  @media (max-width: 767px) {
    font-size: 17px;
  }
`;

const CabinClassDescription = styled.span`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const SelectedIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  display: ${(props) => (props.$show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
    color: white;
  }

  @media (max-width: 767px) {
    width: 28px;
    height: 28px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ChevronIcon = styled(LuChevronDown)`
  width: 20px;
  height: 20px;
  color: #6b7280;
  transition: all 0.3s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 20px; /* Keep same size instead of 22px */
    height: 20px;
  }
`;

export default function CabinClassSelector() {
  const { t } = useTranslation();
  const { state, actions } = useSearchForm();
  const { cabinClass } = state;
  const { setCabinClass } = actions;

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

  const cabinClassOptions = [
    {
      value: "economy",
      name: t("flights.cabin_class.economy"),
      description: t("flights.cabin_class.economy_desc"),
    },
    {
      value: "premium_economy",
      name: t("flights.cabin_class.premium_economy"),
      description: t("flights.cabin_class.premium_economy_desc"),
    },
    {
      value: "business",
      name: t("flights.cabin_class.business"),
      description: t("flights.cabin_class.business_desc"),
    },
    {
      value: "first",
      name: t("flights.cabin_class.first"),
      description: t("flights.cabin_class.first_desc"),
    },
  ];

  const selectedCabinClass = cabinClassOptions.find(
    (option) => option.value === cabinClass
  );

  const handleCabinClassChange = (value) => {
    setCabinClass(value);
    setShowDropdown(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowDropdown(false);
    }
  };

  const CabinClassContent = () => (
    <>
      {cabinClassOptions.map((option) => (
        <CabinClassOption
          key={option.value}
          className={cabinClass === option.value ? "selected" : ""}
          onClick={() => handleCabinClassChange(option.value)}
        >
          <CabinClassInfo>
            <CabinClassName>{option.name}</CabinClassName>
            <CabinClassDescription>{option.description}</CabinClassDescription>
          </CabinClassInfo>
          <SelectedIndicator $show={cabinClass === option.value}>
            <LuCheck />
          </SelectedIndicator>
        </CabinClassOption>
      ))}
    </>
  );

  return (
    <>
      <CabinClassContainer ref={containerRef}>
        <CabinClassInput
          onClick={() => setShowDropdown(!showDropdown)}
          $isOpen={showDropdown}
        >
          <CabinClassText>
            <LuPlane />
            {selectedCabinClass?.name}
          </CabinClassText>
          <ChevronIcon $isOpen={showDropdown} />
        </CabinClassInput>
      </CabinClassContainer>

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
            <CabinClassDropdown $showOnDesktop={!isMobile}>
              <CabinClassContent />
            </CabinClassDropdown>
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
                  {t("flights.cabin_class.label")}
                </BottomSheetTitle>
                <CloseButton onClick={() => setShowDropdown(false)}>
                  <LuX />
                </CloseButton>
              </BottomSheetHeader>
              <BottomSheetContent>
                <CabinClassContent />
              </BottomSheetContent>
            </BottomSheet>
          </>,
          document.body
        )}
    </>
  );
}
