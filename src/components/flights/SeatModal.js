"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const SeatTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SeatOption = styled.div`
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.selected ? "#eff6ff" : "#ffffff")};
  position: relative;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
`;

const SeatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SeatName = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const SeatPrice = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
`;

const SeatDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`;

const SeatIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1.5rem;
`;

const SeatMapContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  margin-top: 1rem;
`;

const SeatMapTitle = styled.h5`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const SeatMap = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
`;

const Seat = styled.div`
  width: 35px;
  height: 35px;
  border: 1px solid
    ${(props) => {
      if (props.selected) return "#3b82f6";
      if (props.occupied) return "#ef4444";
      if (props.available) return "#10b981";
      return "#d1d5db";
    }};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: ${(props) => (props.available ? "pointer" : "not-allowed")};
  background: ${(props) => {
    if (props.selected) return "#3b82f6";
    if (props.occupied) return "#fef2f2";
    if (props.available) return "#f0fdf4";
    return "#f9fafb";
  }};
  color: ${(props) => {
    if (props.selected) return "#ffffff";
    if (props.occupied) return "#ef4444";
    if (props.available) return "#059669";
    return "#9ca3af";
  }};

  &:hover {
    ${(props) =>
      props.available &&
      `
      border-color: #3b82f6;
      background: #eff6ff;
      color: #3b82f6;
    `}
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.75rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${(props) => props.color};
  border: 1px solid ${(props) => props.borderColor || props.color};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.primary
      ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const SeatModal = ({
  isOpen,
  onClose,
  value,
  onChange,
  seatOptions = [],
  seatMap = null,
  error,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Default seat options if none provided
  const defaultOptions = [
    {
      id: "no_preference",
      type: "no_preference",
      price: 0,
      description: "passenger_form.seats.no_preference_description",
      icon: "🎯",
    },
    {
      id: "window",
      type: "window_seat",
      price: 25,
      description: "passenger_form.seats.window_description",
      icon: "🪟",
    },
    {
      id: "aisle",
      type: "aisle_seat",
      price: 25,
      description: "passenger_form.seats.aisle_description",
      icon: "🚶",
    },
    {
      id: "middle",
      type: "middle_seat",
      price: 15,
      description: "passenger_form.seats.middle_description",
      icon: "👥",
    },
    {
      id: "front",
      type: "front_seat",
      price: 35,
      description: "passenger_form.seats.front_description",
      icon: "✈️",
    },
    {
      id: "exit_row",
      type: "exit_row_seat",
      price: 50,
      description: "passenger_form.seats.exit_row_description",
      icon: "🚪",
    },
  ];

  const options = seatOptions.length > 0 ? seatOptions : defaultOptions;

  const handleSeatTypeChange = (optionId) => {
    if (!disabled) {
      onChange(optionId);
      setSelectedSeat(null);
    }
  };

  const handleSeatSelect = (seatNumber) => {
    if (!disabled && value !== "no_preference") {
      setSelectedSeat(seatNumber);
    }
  };

  // Generate sample seat map if none provided
  const generateSeatMap = () => {
    const seats = [];
    for (let row = 1; row <= 12; row++) {
      for (let col = 1; col <= 6; col++) {
        const seatNumber = `${row}${String.fromCharCode(64 + col)}`;
        const isOccupied = Math.random() < 0.3; // 30% chance of being occupied
        seats.push({
          number: seatNumber,
          occupied: isOccupied,
          available: !isOccupied,
        });
      }
    }
    return seats;
  };

  const seatMapData = seatMap || generateSeatMap();

  const handleSave = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{t("passenger_form.fields.seat_selection")}</ModalTitle>
          <CloseButton onClick={handleCancel}>×</CloseButton>
        </ModalHeader>

        <SeatTypeGrid>
          {options.map((option) => (
            <SeatOption
              key={option.id}
              selected={value === option.id}
              onClick={() => handleSeatTypeChange(option.id)}
            >
              <SeatIcon>{option.icon}</SeatIcon>

              <SeatHeader>
                <SeatName>{t(`passenger_form.seats.${option.type}`)}</SeatName>
                <SeatPrice style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {option.price > 0 ? (
                    <>
                      +{option.price} <SARCurrencyIcon className="w-3 h-3" />
                    </>
                  ) : (
                    t("passenger_form.seats.included")
                  )}
                </SeatPrice>
              </SeatHeader>

              <SeatDescription>{t(option.description)}</SeatDescription>
            </SeatOption>
          ))}
        </SeatTypeGrid>

        {value && value !== "no_preference" && (
          <SeatMapContainer>
            <SeatMapTitle>
              {t("passenger_form.seats.select_specific_seat")}
            </SeatMapTitle>

            <SeatMap>
              {seatMapData.map((seat) => (
                <Seat
                  key={seat.number}
                  selected={selectedSeat === seat.number}
                  occupied={seat.occupied}
                  available={seat.available}
                  onClick={() => handleSeatSelect(seat.number)}
                >
                  {seat.number}
                </Seat>
              ))}
            </SeatMap>

            <Legend>
              <LegendItem>
                <LegendColor color="#f0fdf4" borderColor="#10b981" />
                <span>{t("passenger_form.seats.available")}</span>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#fef2f2" borderColor="#ef4444" />
                <span>{t("passenger_form.seats.occupied")}</span>
              </LegendItem>
              <LegendItem>
                <LegendColor color="#3b82f6" />
                <span>{t("passenger_form.seats.selected")}</span>
              </LegendItem>
            </Legend>
          </SeatMapContainer>
        )}

        {error && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <ModalFooter>
          <Button onClick={handleCancel}>{t("common.cancel", "Cancel")}</Button>
          <Button primary onClick={handleSave}>
            {t("common.save", "Save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SeatModal;
