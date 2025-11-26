import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ExtraBaggageSelector from "./ExtraBaggageSelector";
import MealSelector from "./MealSelector";
import SeatSelector from "./SeatSelector";

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

const SSRSelector = ({
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

  return (
    <Container>
      {showTitle && (
        <SectionTitle>
          {t("passenger_form.special_service_requests")}
        </SectionTitle>
      )}

      <ExtraBaggageSelector
        value={baggageValue}
        onChange={onBaggageChange}
        baggageOptions={baggageOptions}
        error={errors.baggage}
        disabled={disabled}
      />

      <MealSelector
        value={mealValue}
        onChange={onMealChange}
        mealOptions={mealOptions}
        error={errors.meal}
        disabled={disabled}
      />

      <SeatSelector
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

export default SSRSelector;
