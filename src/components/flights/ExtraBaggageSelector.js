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

const BaggageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const BaggageOption = styled.div`
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.selected ? "#eff6ff" : "#ffffff")};

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
`;

const BaggageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const BaggageType = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const BaggagePrice = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
`;

const BaggageDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`;

const BaggageWeight = styled.div`
  font-size: 0.75rem;
  color: #374151;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
`;

const ExtraBaggageSelector = ({
  value,
  onChange,
  baggageOptions = [],
  error,
  disabled = false,
}) => {
  const { t } = useTranslation();

  // Default baggage options if none provided
  const defaultOptions = [
    {
      id: "none",
      type: "no_extra_baggage",
      weight: "0 kg",
      price: 0,
      description: "passenger_form.baggage.no_extra_description",
    },
    {
      id: "small",
      type: "small_baggage",
      weight: "5 kg",
      price: 25,
      description: "passenger_form.baggage.small_description",
    },
    {
      id: "medium",
      type: "medium_baggage",
      weight: "10 kg",
      price: 45,
      description: "passenger_form.baggage.medium_description",
    },
    {
      id: "large",
      type: "large_baggage",
      weight: "20 kg",
      price: 75,
      description: "passenger_form.baggage.large_description",
    },
    {
      id: "extra_large",
      type: "extra_large_baggage",
      weight: "32 kg",
      price: 120,
      description: "passenger_form.baggage.extra_large_description",
    },
  ];

  const options = baggageOptions.length > 0 ? baggageOptions : defaultOptions;

  const handleOptionChange = (optionId) => {
    if (!disabled) {
      onChange(optionId);
    }
  };

  return (
    <Container>
      <Label>{t("passenger_form.fields.extra_baggage_selection")}</Label>

      <BaggageGrid>
        {options.map((option) => (
          <BaggageOption
            key={option.id}
            selected={value === option.id}
            onClick={() => handleOptionChange(option.id)}
          >
            <BaggageHeader>
              <BaggageType>
                {t(`passenger_form.baggage.${option.type}`)}
              </BaggageType>
              <BaggagePrice style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {option.price > 0 ? (
                  <>
                    +{option.price} <SARCurrencyIcon className="w-3 h-3" />
                  </>
                ) : (
                  t("passenger_form.baggage.included")
                )}
              </BaggagePrice>
            </BaggageHeader>

            <BaggageDescription>{t(option.description)}</BaggageDescription>

            <BaggageWeight>
              {t("passenger_form.baggage.weight")}: {option.weight}
            </BaggageWeight>

            <RadioInput
              type="radio"
              name="baggage"
              value={option.id}
              checked={value === option.id}
              onChange={() => handleOptionChange(option.id)}
              disabled={disabled}
            />
          </BaggageOption>
        ))}
      </BaggageGrid>

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

export default ExtraBaggageSelector;
