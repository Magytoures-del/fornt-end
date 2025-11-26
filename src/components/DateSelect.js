import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

const DateSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: #ef4444;
  }
`;

const SelectsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ error }) => (error ? "#ef4444" : "#e2e8f0")};
  border-radius: 6px;
  font-size: 0.95rem;
  color: #334155;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: ${({ $isRTL }) =>
    $isRTL ? "left 0.5rem center" : "right 0.5rem center"};
  background-size: 1.25em;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  direction: ${({ $isRTL }) => ($isRTL ? "rtl" : "ltr")};

  &:focus {
    outline: none;
    border-color: #3d4fff;
    box-shadow: 0 0 0 2px rgba(61, 79, 255, 0.1);
  }

  &:hover {
    border-color: #94a3b8;
  }

  option {
    padding: 0.5rem;
    text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  &::before {
    content: "!";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;

const DateSelect = ({
  label,
  dayValue,
  monthValue,
  yearValue,
  onDayChange,
  onMonthChange,
  onYearChange,
  error,
  required,
  yearRange = "past", // "past" for birth dates, "future" for expiry dates
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Generate arrays for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    t("date_select.months.january"),
    t("date_select.months.february"),
    t("date_select.months.march"),
    t("date_select.months.april"),
    t("date_select.months.may"),
    t("date_select.months.june"),
    t("date_select.months.july"),
    t("date_select.months.august"),
    t("date_select.months.september"),
    t("date_select.months.october"),
    t("date_select.months.november"),
    t("date_select.months.december"),
  ];
  const currentYear = new Date().getFullYear();

  // Generate years based on the yearRange prop
  const years =
    yearRange === "future"
      ? Array.from({ length: 20 }, (_, i) => currentYear + i) // Next 20 years for passport expiry
      : Array.from({ length: 100 }, (_, i) => currentYear - i); // Past 100 years for birth dates

  // Validate day based on month and year
  const getValidDays = () => {
    if (!monthValue || !yearValue) return days;
    const daysInMonth = new Date(yearValue, monthValue, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const validDays = getValidDays();

  return (
    <DateSelectContainer>
      {label && (
        <Label>
          {label}
          {required && <span>*</span>}
        </Label>
      )}
      <SelectsContainer>
        <SelectWrapper>
          <StyledSelect
            value={dayValue}
            onChange={(e) => onDayChange(e.target.value)}
            error={error}
            $isRTL={isRTL}
          >
            <option value="">{t("date_select.day")}</option>
            {validDays.map((day) => (
              <option key={day} value={day}>
                {day.toString().padStart(2, "0")}
              </option>
            ))}
          </StyledSelect>
        </SelectWrapper>

        <SelectWrapper>
          <StyledSelect
            value={monthValue}
            onChange={(e) => {
              onMonthChange(e.target.value);
              // Reset day if it's invalid for the new month
              if (dayValue) {
                const daysInMonth = new Date(
                  yearValue || currentYear,
                  e.target.value,
                  0
                ).getDate();
                if (parseInt(dayValue) > daysInMonth) {
                  onDayChange("");
                }
              }
            }}
            error={error}
            $isRTL={isRTL}
          >
            <option value="">{t("date_select.month")}</option>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </StyledSelect>
        </SelectWrapper>

        <SelectWrapper>
          <StyledSelect
            value={yearValue}
            onChange={(e) => {
              onYearChange(e.target.value);
              // Reset day if it's invalid for the new year (leap year)
              if (dayValue && monthValue === 2) {
                const daysInMonth = new Date(
                  e.target.value,
                  monthValue,
                  0
                ).getDate();
                if (parseInt(dayValue) > daysInMonth) {
                  onDayChange("");
                }
              }
            }}
            error={error}
            $isRTL={isRTL}
          >
            <option value="">{t("date_select.year")}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </StyledSelect>
        </SelectWrapper>
      </SelectsContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </DateSelectContainer>
  );
};

export default DateSelect;
