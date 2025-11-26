import React from "react";
import styled from "styled-components";
import { MdLuggage } from "react-icons/md";
import { TbShoppingBag } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useTranslation } from "react-i18next";

const IconListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 12px;
  min-width: 80px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
  }

  svg {
    font-size: 24px;
    color: #4f46e5;
  }
`;

const IconLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-align: center;
`;

const BaggageInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f6eded;
  border-radius: 20px;
  gap: 15px;
  margin-bottom: 15px;
  width: 100%;
  justify-content: space-between;
`;

const BaggageText = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

const BaggageItem = styled.div`
  display: flex;
  align-items: center;
  color: #112211;
  background-color: #e6e6e6;
  padding: 6px 12px;
  border-radius: 10px;
  gap: 4px;

  svg {
    font-size: 18px;
    color: #112211b3;
  }
`;

const BaggageValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #666;
`;

const SkeletonValue = styled.div`
  width: 40px;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function IconList({
  baggageWeight = "23kg",
  cabinBag = "7kg",
  isLoading = false,
}) {
  const { t } = useTranslation();

  // Format baggage weight to ensure proper display
  const formatBaggageWeight = (weight) => {
    if (!weight) return "";
    // If it already has 'kg', return as is, otherwise add 'kg'
    return weight.includes("kg") ? weight : `${weight}`;
  };

  // Format cabin bag to ensure proper display
  const formatCabinBag = (bag) => {
    if (!bag) return "";
    // If it already has 'kg', return as is, otherwise add 'kg'
    return bag.includes("kg") ? bag : `${bag}`;
  };

  return (
    <IconListContainer>
      <BaggageInfo>
        <BaggageText>{t("flight_results.included_baggage_note")}</BaggageText>
        <div className="flex flex-col gap-2 items-center">
          <BaggageItem>
            <MdLuggage />
            {isLoading ? (
              <SkeletonValue />
            ) : (
              <BaggageValue>{formatBaggageWeight(baggageWeight)}</BaggageValue>
            )}
          </BaggageItem>
          <BaggageItem>
            <TbShoppingBag />
            {isLoading ? (
              <SkeletonValue />
            ) : (
              <BaggageValue>{formatCabinBag(cabinBag)}</BaggageValue>
            )}
          </BaggageItem>
        </div>
      </BaggageInfo>
    </IconListContainer>
  );
}
