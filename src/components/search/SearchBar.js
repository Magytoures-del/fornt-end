"use client";

import { SearchFormProvider } from "../../context/SearchFormContext";
import { useTranslation } from "react-i18next";
import PassengerSelector from "./PassengerSelector";
import TripTypeSelector from "./TripTypeSelector";
import DirectFlightSelector from "./DirectFlightSelector";
import CabinClassSelector from "./CabinClassSelector";
import SearchFrom from "./SearchFrom";
import {
  SearchContainer,
  FlightOptions,
  FormGroup,
  FormLabel,
  SearchFormContainer,
} from "./styles/SearchBar.styles";
import { FORM_FIELDS, TRANSLATION_KEYS } from "./constants/searchBarConfig";

/**
 * SearchBar Component
 *
 * Main search bar component for flight searches with responsive layout.
 * Handles trip type, passengers, cabin class, and direct flight options.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback function called when form is submitted
 * @returns {JSX.Element} SearchBar component
 */
export default function SearchBar({ onSubmit }) {
  const { t } = useTranslation();

  // Component mapping for dynamic rendering
  const componentMap = {
    TripTypeSelector,
    PassengerSelector,
    CabinClassSelector,
    DirectFlightSelector,
  };

  /**
   * Renders a form field group with label and selector component
   * @param {Object} field - Field configuration object
   * @returns {JSX.Element} Form group with label and component
   */
  const renderFormField = (field) => {
    const Component = componentMap[field.component];
    const labelClassName = field.showLabelOnMobile ? "" : "hidden lg:block";
    const groupClassName = field.showOnMobile ? "flex" : "hidden lg:flex";

    return (
      <FormGroup key={field.id} className={groupClassName}>
        <FormLabel className={labelClassName}>
          {t(field.translationKey)}
        </FormLabel>
        <Component />
      </FormGroup>
    );
  };

  return (
    <SearchFormProvider onSubmit={onSubmit}>
      <SearchContainer>
        {/* Flight Options Form - Responsive grid layout */}
        <FlightOptions>{FORM_FIELDS.map(renderFormField)}</FlightOptions>

        {/* Main Search Form Container */}
        <SearchFormContainer>
          <div className="px-5 lg:px-0 pb-5 lg:hidden">
            <TripTypeSelector />
          </div>

          <SearchFrom />
        </SearchFormContainer>
      </SearchContainer>
    </SearchFormProvider>
  );
}
