import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SEARCH_TYPES } from "../constants/dateInputConstants";

/**
 * Custom hook for DateInput translations
 * @param {Object} params
 * @param {string} params.searchType - Type of search (flight/hotel)
 * @param {string} params.tripType - Type of trip (oneway/roundtrip)
 * @param {string|null} params.endDate - End date value
 * @returns {Object} Translation strings
 */
export const useDateInputTranslations = ({
  searchType,
  tripType,
  endDate,
}) => {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      departureLabel:
        searchType === SEARCH_TYPES.HOTEL
          ? t("hotels.search_form.check_in", "تاريخ الوصول")
          : t("flights.search_form.departure_date", "تاريخ المغادرة"),
      returnLabel:
        searchType === SEARCH_TYPES.HOTEL
          ? t("hotels.search_form.check_out", "تاريخ المغادرة")
          : tripType === "roundtrip" || endDate
          ? t("flights.search_form.return_date", "تاريخ العودة")
          : "",
      chooseDate: t("flights.search_form.choose_date", "اختر التاريخ"),
      addReturn: t("flights.search_form.add_return", "إضافة العودة"),
      pickDatesAria: t(
        "flights.search_form.pick_dates_aria",
        "اختر تواريخ السفر"
      ),
      addReturnAria: t("flights.search_form.add_return", "إضافة تاريخ العودة"),
    }),
    [t, searchType, tripType, endDate]
  );
};


