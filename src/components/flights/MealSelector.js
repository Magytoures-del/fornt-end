import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

const Container = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
  font-size: 0.875rem;
`;

const MealGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const MealOption = styled.div`
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

const MealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MealName = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const MealPrice = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
`;

const MealDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`;

const MealIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const RadioInput = styled.input`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
`;

const MealSelector = ({
  value,
  onChange,
  mealOptions = [],
  error,
  disabled = false,
}) => {
  const { t } = useTranslation();

  // Default meal options if none provided
  const defaultOptions = [
    {
      id: "none",
      code: "",
      name: "no_special_meal",
      price: 0,
      description: "passenger_form.meals.no_special_description",
      icon: "🍽️",
    },
    {
      id: "vegetarian",
      code: "VGML",
      name: "vegetarian_meal",
      price: 15,
      description: "passenger_form.meals.vegetarian_description",
      icon: "🥗",
    },
    {
      id: "hindu",
      code: "HNML",
      name: "hindu_meal",
      price: 15,
      description: "passenger_form.meals.hindu_description",
      icon: "🕉️",
    },
    {
      id: "halal",
      code: "MOML",
      name: "halal_meal",
      price: 15,
      description: "passenger_form.meals.halal_description",
      icon: "☪️",
    },
    {
      id: "kosher",
      code: "KSML",
      name: "kosher_meal",
      price: 20,
      description: "passenger_form.meals.kosher_description",
      icon: "✡️",
    },
    {
      id: "diabetic",
      code: "DBML",
      name: "diabetic_meal",
      price: 15,
      description: "passenger_form.meals.diabetic_description",
      icon: "🍎",
    },
    {
      id: "gluten_free",
      code: "GFML",
      name: "gluten_free_meal",
      price: 15,
      description: "passenger_form.meals.gluten_free_description",
      icon: "🌾",
    },
    {
      id: "seafood",
      code: "SFML",
      name: "seafood_meal",
      price: 20,
      description: "passenger_form.meals.seafood_description",
      icon: "🐟",
    },
    {
      id: "child",
      code: "CHML",
      name: "child_meal",
      price: 10,
      description: "passenger_form.meals.child_description",
      icon: "👶",
    },
  ];

  const options = mealOptions.length > 0 ? mealOptions : defaultOptions;

  const handleOptionChange = (optionId) => {
    if (!disabled) {
      onChange(optionId);
    }
  };

  return (
    <Container>
      <Label>{t("passenger_form.fields.special_meal_selection")}</Label>

      <MealGrid>
        {options.map((option) => (
          <MealOption
            key={option.id}
            selected={value === option.id}
            onClick={() => handleOptionChange(option.id)}
          >
            <RadioInput
              type="radio"
              name="meal"
              value={option.id}
              checked={value === option.id}
              onChange={() => handleOptionChange(option.id)}
              disabled={disabled}
            />

            <MealIcon>{option.icon}</MealIcon>

            <MealHeader>
              <MealName>{t(`passenger_form.meals.${option.name}`)}</MealName>
              <MealPrice style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {option.price > 0 ? (
                  <>
                    +{option.price} <SARCurrencyIcon className="w-3 h-3" />
                  </>
                ) : (
                  t("passenger_form.meals.included")
                )}
              </MealPrice>
            </MealHeader>

            <MealDescription>{t(option.description)}</MealDescription>
          </MealOption>
        ))}
      </MealGrid>

      {error && (
        <div
          style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}
        >
          {error}
        </div>
      )}
    </Container>
  );
};

export default MealSelector;
