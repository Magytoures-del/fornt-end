import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import SSRSelector from "./SSRSelector";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 2rem 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const ResultsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResultsItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ResultsLabel = styled.span`
  font-weight: 600;
  color: #374151;
`;

const ResultsValue = styled.span`
  color: #6b7280;
  margin-left: 0.5rem;
`;

const SSRExample = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    baggage: "none",
    meal: "none",
    seat: "no_preference",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleBaggageChange = (value) => {
    setFormData((prev) => ({ ...prev, baggage: value }));
  };

  const handleMealChange = (value) => {
    setFormData((prev) => ({ ...prev, meal: value }));
  };

  const handleSeatChange = (value) => {
    setFormData((prev) => ({ ...prev, seat: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("SSR Form submitted:", formData);
  };

  const getDisplayValue = (type, value) => {
    const translations = {
      baggage: {
        none: t("passenger_form.baggage.no_extra_baggage"),
        small: t("passenger_form.baggage.small_baggage"),
        medium: t("passenger_form.baggage.medium_baggage"),
        large: t("passenger_form.baggage.large_baggage"),
        extra_large: t("passenger_form.baggage.extra_large_baggage"),
      },
      meal: {
        none: t("passenger_form.meals.no_special_meal"),
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
        no_preference: t("passenger_form.seats.no_preference"),
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
      <Title>{t("passenger_form.special_service_requests")}</Title>

      <Form onSubmit={handleSubmit}>
        <SSRSelector
          baggageValue={formData.baggage}
          onBaggageChange={handleBaggageChange}
          mealValue={formData.meal}
          onMealChange={handleMealChange}
          seatValue={formData.seat}
          onSeatChange={handleSeatChange}
          showTitle={false}
        />

        <SubmitButton type="submit">
          {t("passenger_form.continue")}
        </SubmitButton>
      </Form>

      {submitted && (
        <ResultsContainer>
          <ResultsTitle>Selected Options:</ResultsTitle>
          <ResultsList>
            <ResultsItem>
              <ResultsLabel>Baggage:</ResultsLabel>
              <ResultsValue>
                {getDisplayValue("baggage", formData.baggage)}
              </ResultsValue>
            </ResultsItem>
            <ResultsItem>
              <ResultsLabel>Meal:</ResultsLabel>
              <ResultsValue>
                {getDisplayValue("meal", formData.meal)}
              </ResultsValue>
            </ResultsItem>
            <ResultsItem>
              <ResultsLabel>Seat:</ResultsLabel>
              <ResultsValue>
                {getDisplayValue("seat", formData.seat)}
              </ResultsValue>
            </ResultsItem>
          </ResultsList>
        </ResultsContainer>
      )}
    </Container>
  );
};

export default SSRExample;
