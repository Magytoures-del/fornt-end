"use client";

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useSearchForm } from "../../context/SearchFormContext";
import { LuPlane, LuCheck } from "react-icons/lu";

const DirectFlightContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
  width: fit-content;
`;

const CheckboxContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isChecked",
})`
  display: flex;
  align-items: start;
  gap: 12px;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 56px;
  width: 100%;

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
    props.isChecked &&
    `
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  `}

  @media (min-width: 640px) {
    padding: 16px 20px; /* Reduced padding */
    gap: 12px; /* Reduced gap */
  }

  @media (min-width: 768px) {
    min-height: 56px; /* Further reduced */
    padding: 16px 20px; /* Further reduced */
    border-radius: 14px; /* Reduced */
  }

  @media (min-width: 1024px) {
    min-height: 56px; /* Keep same as 768px instead of growing */
    padding: 16px 20px; /* Keep same as 768px */
    border-radius: 14px; /* Reduced */
    gap: 12px; /* Further reduced */
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    gap: 10px;
  }
`;

const CustomCheckbox = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isChecked",
})`
  width: 24px;
  height: 24px;
  border: 2px solid ${(props) => (props.isChecked ? "#3b82f6" : "#d1d5db")};
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${(props) => (props.isChecked ? "#3b82f6" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.1);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  svg {
    width: 14px;
    height: 14px;
    color: white;
    opacity: ${(props) => (props.isChecked ? 1 : 0)};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${(props) => (props.isChecked ? "scale(1)" : "scale(0.5)")};
  }

  @media (min-width: 768px) {
    width: 24px; /* Keep same size instead of growing to 28px */
    height: 24px;
    border-radius: 8px; /* Keep same as base */

    svg {
      width: 14px; /* Keep same size */
      height: 14px;
    }
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    border-radius: 6px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
`;

const CheckboxLabel = styled.label.withConfig({
  shouldForwardProp: (prop) => prop !== "isChecked",
})`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: start;
  gap: 12px;
  flex: 1;
  transition: all 0.3s ease;
  line-height: 1.3;

  svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  &:hover svg {
    color: #3b82f6;
    transform: scale(1.1) rotate(5deg);
  }

  ${(props) =>
    props.isChecked &&
    `
    color: #1f2937;
    
    svg {
      color: #3b82f6;
    }
  `}

  @media (min-width: 640px) {
    font-size: 14px; /* Reduced from 15px */
    gap: 14px;

    svg {
      width: 20px; /* Reduced from 22px */
      height: 20px;
    }
  }

  @media (min-width: 1024px) {
    font-size: 14px; /* Keep same size instead of 16px */
  }

  @media (max-width: 480px) {
    font-size: 13px;
    gap: 10px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  /* RTL Support */
  [dir="rtl"] & {
    flex-direction: row-reverse;
  }
`;

export default function DirectFlightSelector() {
  const { t } = useTranslation();
  const { state, actions } = useSearchForm();
  const { directFlight } = state;
  const { setDirectFlight } = actions;

  const handleDirectFlightChange = (e) => {
    setDirectFlight(e.target.checked);
  };

  const handleContainerClick = () => {
    setDirectFlight(!directFlight);
  };

  const labelText =
    t("flights.direct_flight.direct_only") || "Direct flights only";

  return (
    <DirectFlightContainer>
      <CheckboxContainer
        isChecked={directFlight}
        onClick={handleContainerClick}
      >
        <CustomCheckbox isChecked={directFlight}>
          <LuCheck />
        </CustomCheckbox>
        <HiddenCheckbox
          type="checkbox"
          checked={directFlight}
          onChange={handleDirectFlightChange}
          id="direct-flight-checkbox"
          aria-labelledby="direct-flight-label"
        />
        <CheckboxLabel
          htmlFor="direct-flight-checkbox"
          id="direct-flight-label"
          isChecked={directFlight}
          onClick={(e) => e.preventDefault()} // Prevent double firing
        >
          <LuPlane />
          {labelText}
        </CheckboxLabel>
      </CheckboxContainer>
    </DirectFlightContainer>
  );
}
