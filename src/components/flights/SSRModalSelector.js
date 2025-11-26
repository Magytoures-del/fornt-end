"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import BaggageModal from "./BaggageModal";
import MealModal from "./MealModal";
import SeatModal from "./SeatModal";

const Container = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
`;

const SSRGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const SSROption = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  text-align: center;
  position: relative;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const SSRIcon = styled.div`
  width: 32px;
  height: 32px;
  margin: 0 auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 50%;
  font-size: 1.125rem;
  color: #6b7280;
  transition: all 0.2s ease;

  ${SSROption}:hover & {
    background: #eff6ff;
    color: #3b82f6;
  }
`;

const SSROptionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
`;

const SSROptionDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SelectedValue = styled.div`
  font-size: 0.6875rem;
  color: #059669;
  font-weight: 500;
  background: #f0fdf4;
  padding: 0.1875rem 0.375rem;
  border-radius: 0.1875rem;
  display: inline-block;
  border: 1px solid #bbf7d0;
`;

const NoSelection = styled.div`
  font-size: 0.6875rem;
  color: #9ca3af;
  font-style: italic;
`;

const SSRModalSelector = ({
  baggageValue,
  onBaggageChange,
  mealValue,
  onMealChange,
  seatValue,
  onSeatChange,
  baggageOptions = [],
  mealOptions = [],
  seatOptions = [],
  seatMap = null,
  errors = {},
  disabled = false,
  showTitle = true,
}) => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    if (!disabled) {
      setActiveModal(modalType);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getSelectedValue = (type, value) => {
    if (!value || value === "none" || value === "no_preference") {
      return null;
    }

    const translations = {
      baggage: {
        small: t("passenger_form.baggage.small_baggage"),
        medium: t("passenger_form.baggage.medium_baggage"),
        large: t("passenger_form.baggage.large_baggage"),
        extra_large: t("passenger_form.baggage.extra_large_baggage"),
      },
      meal: {
        vegetarian: t("passenger_form.meals.vegetarian_meal"),
        hindu: t("passenger_form.meals.hindu_meal"),
        halal: t("passenger_form.meals.halal_meal"),
        kosher: t("passenger_form.meals.kosher_meal"),
        diabetic: t("passenger_form.meals.diabetic_meal"),
        gluten_free: t("passenger_form.meals.gluten_free_meal"),
        seafood: t("passenger_form.meals.seafood_meal"),
        child: t("passenger_form.meals.child_meal"),
      },
      seat: {
        window: t("passenger_form.seats.window_seat"),
        aisle: t("passenger_form.seats.aisle_seat"),
        middle: t("passenger_form.seats.middle_seat"),
        front: t("passenger_form.seats.front_seat"),
        exit_row: t("passenger_form.seats.exit_row_seat"),
      },
    };

    return translations[type]?.[value] || value;
  };

  return (
    <Container>
      {showTitle && (
        <SectionTitle>
          {t("passenger_form.special_service_requests")}
        </SectionTitle>
      )}

      <SSRGrid>
        <SSROption onClick={() => openModal("baggage")}>
          <SSRIcon>🧳</SSRIcon>
          <SSROptionTitle>
            {t("passenger_form.fields.extra_baggage_selection")}
          </SSROptionTitle>
          <SSROptionDescription>
            {t("passenger_form.baggage.select_extra_baggage")}
          </SSROptionDescription>
          {getSelectedValue("baggage", baggageValue) ? (
            <SelectedValue>
              {getSelectedValue("baggage", baggageValue)}
            </SelectedValue>
          ) : (
            <NoSelection>
              {t("passenger_form.baggage.no_selection")}
            </NoSelection>
          )}
        </SSROption>

        <SSROption onClick={() => openModal("meal")}>
          <SSRIcon>🍽️</SSRIcon>
          <SSROptionTitle>
            {t("passenger_form.fields.special_meal_selection")}
          </SSROptionTitle>
          <SSROptionDescription>
            {t("passenger_form.meals.select_special_meal")}
          </SSROptionDescription>
          {getSelectedValue("meal", mealValue) ? (
            <SelectedValue>{getSelectedValue("meal", mealValue)}</SelectedValue>
          ) : (
            <NoSelection>{t("passenger_form.meals.no_selection")}</NoSelection>
          )}
        </SSROption>

        <SSROption onClick={() => openModal("seat")}>
          <SSRIcon>🪑</SSRIcon>
          <SSROptionTitle>
            {t("passenger_form.fields.seat_selection")}
          </SSROptionTitle>
          <SSROptionDescription>
            {t("passenger_form.seats.select_seat_preference")}
          </SSROptionDescription>
          {getSelectedValue("seat", seatValue) ? (
            <SelectedValue>{getSelectedValue("seat", seatValue)}</SelectedValue>
          ) : (
            <NoSelection>{t("passenger_form.seats.no_selection")}</NoSelection>
          )}
        </SSROption>
      </SSRGrid>

      <BaggageModal
        isOpen={activeModal === "baggage"}
        onClose={closeModal}
        value={baggageValue}
        onChange={onBaggageChange}
        baggageOptions={baggageOptions}
        error={errors.baggage}
        disabled={disabled}
      />

      <MealModal
        isOpen={activeModal === "meal"}
        onClose={closeModal}
        value={mealValue}
        onChange={onMealChange}
        mealOptions={mealOptions}
        error={errors.meal}
        disabled={disabled}
      />

      <SeatModal
        isOpen={activeModal === "seat"}
        onClose={closeModal}
        value={seatValue}
        onChange={onSeatChange}
        seatOptions={seatOptions}
        seatMap={seatMap}
        error={errors.seat}
        disabled={disabled}
      />
    </Container>
  );
};

export default SSRModalSelector;
