"use client";

import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LuUsers, LuMinus, LuPlus } from "react-icons/lu";
import { useOutsideClick } from "../../hooks/useOutsideClick";

export default function HotelGuestsSelector() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const updateGuests = (type, operation) => {
    setGuests((prev) => {
      const newValue =
        operation === "increment" ? prev[type] + 1 : prev[type] - 1;
      return { ...prev, [type]: Math.max(type === "adults" ? 1 : 0, newValue) };
    });
  };

  const totalGuests = guests.adults + guests.children;

  return (
    <SelectorContainer ref={dropdownRef}>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        <IconWrapper>
          <LuUsers />
        </IconWrapper>
        <SelectorText>
          {totalGuests} {t("hotels.guests.guests")}, {guests.rooms}{" "}
          {guests.rooms === 1
            ? t("hotels.guests.room")
            : t("hotels.guests.rooms")}
        </SelectorText>
      </SelectorButton>

      {isOpen && (
        <DropdownMenu>
          <DropdownItem>
            <ItemInfo>
              <ItemLabel>{t("hotels.guests.adults")}</ItemLabel>
              <ItemDesc>{t("hotels.guests.adults_desc")}</ItemDesc>
            </ItemInfo>
            <CounterGroup>
              <CounterButton
                onClick={() => updateGuests("adults", "decrement")}
                disabled={guests.adults <= 1}
              >
                <LuMinus />
              </CounterButton>
              <CounterValue>{guests.adults}</CounterValue>
              <CounterButton
                onClick={() => updateGuests("adults", "increment")}
              >
                <LuPlus />
              </CounterButton>
            </CounterGroup>
          </DropdownItem>

          <DropdownItem>
            <ItemInfo>
              <ItemLabel>{t("hotels.guests.children")}</ItemLabel>
              <ItemDesc>{t("hotels.guests.children_desc")}</ItemDesc>
            </ItemInfo>
            <CounterGroup>
              <CounterButton
                onClick={() => updateGuests("children", "decrement")}
                disabled={guests.children <= 0}
              >
                <LuMinus />
              </CounterButton>
              <CounterValue>{guests.children}</CounterValue>
              <CounterButton
                onClick={() => updateGuests("children", "increment")}
              >
                <LuPlus />
              </CounterButton>
            </CounterGroup>
          </DropdownItem>

          <DropdownItem>
            <ItemInfo>
              <ItemLabel>{t("hotels.guests.rooms")}</ItemLabel>
              <ItemDesc>{t("hotels.guests.rooms_desc")}</ItemDesc>
            </ItemInfo>
            <CounterGroup>
              <CounterButton
                onClick={() => updateGuests("rooms", "decrement")}
                disabled={guests.rooms <= 1}
              >
                <LuMinus />
              </CounterButton>
              <CounterValue>{guests.rooms}</CounterValue>
              <CounterButton onClick={() => updateGuests("rooms", "increment")}>
                <LuPlus />
              </CounterButton>
            </CounterGroup>
          </DropdownItem>

          <DoneButton onClick={() => setIsOpen(false)}>
            {t("hotels.guests.done")}
          </DoneButton>
        </DropdownMenu>
      )}
    </SelectorContainer>
  );
}

const SelectorContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SelectorButton = styled.button`
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #1f2937;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (min-width: 640px) {
    padding: 14px 18px;
    font-size: 15px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SelectorText = styled.span`
  font-weight: 500;
  flex: 1;
  text-align: left;

  [dir="rtl"] & {
    text-align: right;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 50;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 640px) {
    padding: 20px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-of-type {
    border-bottom: none;
  }

  @media (min-width: 640px) {
    padding: 18px 0;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;

  @media (min-width: 640px) {
    font-size: 15px;
  }
`;

const ItemDesc = styled.span`
  font-size: 12px;
  color: #6b7280;

  @media (min-width: 640px) {
    font-size: 13px;
  }
`;

const CounterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CounterButton = styled.button`
  width: 32px;
  height: 32px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #3b82f6;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CounterValue = styled.span`
  min-width: 32px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const DoneButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 640px) {
    padding: 14px;
    font-size: 15px;
  }
`;


