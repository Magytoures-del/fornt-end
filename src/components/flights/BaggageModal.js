import React from "react";
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
  max-width: 600px;
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

const BaggageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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

const BaggageModal = ({
  isOpen,
  onClose,
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
          <ModalTitle>
            {t("passenger_form.fields.extra_baggage_selection")}
          </ModalTitle>
          <CloseButton onClick={handleCancel}>×</CloseButton>
        </ModalHeader>

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
            </BaggageOption>
          ))}
        </BaggageGrid>

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

export default BaggageModal;
