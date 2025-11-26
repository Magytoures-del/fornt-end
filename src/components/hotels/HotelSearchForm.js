"use client";

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useSearchForm } from "../../context/SearchFormContext";
import LocationInput from "../search/LocationInput";
import HotelGuestsSelector from "./HotelGuestsSelector";
import { LuMapPin, LuCalendar } from "react-icons/lu";
import DateInput from "../search/DateInput";

// Styled Components
const SearchFormContainer = styled.div`
  padding: 0px 0;
  padding-right: 0;
  @media (min-width: 789px) {
    padding: 0px 0;
    border: 1px solid #e5e7eb;
  }
  display: flex;
  flex-direction: column;
  gap: 20px;

  border-radius: 10px;
  background-color: white;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 2fr 1.5fr 150px;
  }
`;

const InputGroup = styled.div`
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: block;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 14px;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }

  /* RTL Support */
  [dir="rtl"] & {
    text-align: right;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;

  @media (min-width: 789px) {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    padding: 0px 32px;
  }
  padding: 10px 32px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  height: 100%;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default function HotelSearchForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const { state, actions } = useSearchForm();

  const { departure, startDate, endDate, isLoading } = state;

  const { setDeparture, setStartDate, setEndDate, setLoading, isFormValid } =
    actions;

  const handleDestinationChange = (location) => {
    setDeparture(location);
  };

  // Helper function to extract location code or name
  const extractLocationCode = (locationString) => {
    if (!locationString) return "";
    const match = locationString.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : locationString;
  };

  const handleSearch = () => {
    // Basic validation
    if (!departure || !startDate || !endDate) {
      alert(t("hotels.search_form.please_fill_required_fields"));
      return;
    }

    // Try context-provided submit handler; proceed only if not handled
    const handled = actions.handleSubmit && actions.handleSubmit();
    if (handled) return;

    // For now, just show an alert since endpoint is not ready
    alert(t("hotels.coming_soon"));

    // Future implementation:
    // const checkIn = new Date(startDate).toISOString().split("T")[0];
    // const checkOut = new Date(endDate).toISOString().split("T")[0];
    // const resultsUrl = `/hotels/results/${extractLocationCode(departure)}/${checkIn}/${checkOut}`;
    // router.push(resultsUrl);
  };

  const isSearchDisabled = !departure || !startDate || !endDate || isLoading;

  return (
    <SearchFormContainer>
      <FormGrid>
        <InputGroup className="flex lg:flex-row gap-4 px-5 lg:px-0 h-full">
          <LocationInput
            className="h-full"
            title={t("hotels.search_form.destination")}
            icon={<LuMapPin />}
            location={departure}
            onChange={handleDestinationChange}
            onRemove={() => setDeparture("")}
            placeholder={t("hotels.search_form.destination_placeholder")}
          />
        </InputGroup>

        <InputGroup className="px-5 lg:px-0">
          <DateInput
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            searchType="hotel"
          />
        </InputGroup>

        <InputGroup className="flex items-center h-full">
          <HotelGuestsSelector />
        </InputGroup>

        <div className="flex justify-end h-full items-center flex-1 w-full">
          <SearchButton
            onClick={handleSearch}
            disabled={isSearchDisabled}
            title={t("hotels.search_form.search_button")}
            className="h-full w-full" // Add this
          >
            {isLoading
              ? t("hotels.search_form.searching")
              : t("hotels.search_form.search_button")}
          </SearchButton>
        </div>
      </FormGrid>
    </SearchFormContainer>
  );
}
