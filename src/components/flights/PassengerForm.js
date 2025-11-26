import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Container, SubmitButton } from "./styles/PassengerForm.styles";
import PassengerFormSkeleton from "./PassengerFormSkeleton";
import MainPassengerSection from "./sections/MainPassengerSection";
import ContactDetailsSection from "./sections/ContactDetailsSection";
import SpecialServicesSection from "./sections/SpecialServicesSection";
import ErrorRetrySection from "./sections/ErrorRetrySection";
import { getNationalityOptions, getCountryOptions } from "../../utils/helper";
import useTravelCheckList from "@/hooks/useTravelCheckList";

export default function PassengerForm({
  bookingID,
  flights,
  isLoading,
  onwardDate,
  amount,
  TUI,
  control,
  handleSubmit,
  onSubmit,
  errors,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { loading, error, results, refetch } = useTravelCheckList(bookingID);

  // Memoize static options to prevent unnecessary re-renders
  const nationalityOptions = useMemo(() => getNationalityOptions(t), [t]);
  const countryOptions = useMemo(() => getCountryOptions(t), [t]);

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("checkListData", results);
  }

  // Extract requirements directly from TravellerCheckList
  const travellerCheck = results?.data?.data?.TravellerCheckList?.[0];
  const ssrCheck = results?.data?.data?.SSRCheckList?.Trips?.[0];

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("travellerCheck", travellerCheck);
    console.log("ssrCheck", ssrCheck);
  }

  // Create checklist requirements object with proper structure
  const checkList = {
    travellerRequirements: {
      nationality: { required: travellerCheck?.Nationality === 1 },
      dateOfBirth: { required: travellerCheck?.DOB === 1 },
      passportNumber: { required: travellerCheck?.PassportNo === 1 },
      passportExpiry: { required: travellerCheck?.PDOE === 1 },
      passportIssue: { required: travellerCheck?.PLI === 1 },
      passportIssueDate: { required: travellerCheck?.PDOI === 1 },
      country: { required: travellerCheck?.Country === 1 },
      panNumber: { required: travellerCheck?.PANNo === 1 },
      emigrationCheck: { required: travellerCheck?.EmigCheck === 1 },
    },
    specialServiceRequirements: {
      mealPreference: { required: ssrCheck?.Meal === 1 },
      seatSelection: { required: ssrCheck?.Seat === 1 },
      baggageAllowance: { required: ssrCheck?.Bag === 1 },
    },
  };

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("passenger form", bookingID);
    console.log("checklist results", results);
    console.log("checklist", checkList);
  }

  // Handle loading states
  if (isLoading || loading) {
    return <PassengerFormSkeleton />;
  }

  // Handle error states
  if (error) {
    return <ErrorRetrySection error={error} onRetry={refetch} />;
  }

  // Extract requirements from the checklist structure
  const travellerRequirements = checkList?.travellerRequirements || {};
  const specialServiceRequirements =
    checkList?.specialServiceRequirements || {};

  // Helper function to calculate age from birth date to a specific date
  const calculateAge = (birthDate, targetDate) => {
    let age = targetDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = targetDate.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && targetDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Helper function to create validation rules based on checklist requirements
  const createValidationRules = (
    fieldName,
    isRequired,
    customMessage,
    additionalRules = {}
  ) => {
    const rules = {};
    if (isRequired) {
      rules.required =
        customMessage || t(`passenger_form.fields.${fieldName}_required`);
    }

    // Add specific validation rules for different field types
    switch (fieldName) {
      case "name":
        rules.minLength = {
          value: 2,
          message: t("passenger_form.fields.name_too_short"),
        };
        rules.maxLength = {
          value: 50,
          message: t("passenger_form.fields.name_too_long"),
        };
        rules.pattern = {
          value: /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
          message: t("passenger_form.fields.name_invalid"),
        };
        break;
      case "surname":
        rules.minLength = {
          value: 2,
          message: t("passenger_form.fields.surname_too_short"),
        };
        rules.maxLength = {
          value: 50,
          message: t("passenger_form.fields.surname_too_long"),
        };
        rules.pattern = {
          value: /^[a-zA-Z\u0600-\u06FF\s'-]+$/,
          message: t("passenger_form.fields.surname_invalid"),
        };
        break;
      case "date_of_birth":
        rules.validate = (value) => {
          if (!value?.day || !value?.month || !value?.year) {
            return true; // Let required rule handle empty values
          }

          const day = parseInt(value.day, 10);
          const month = parseInt(value.month, 10);
          const year = parseInt(value.year, 10);

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return t("passenger_form.fields.date_of_birth_invalid");
          }

          const birthDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Check if date is valid
          if (
            birthDate.getDate() !== day ||
            birthDate.getMonth() !== month - 1 ||
            birthDate.getFullYear() !== year
          ) {
            return t("passenger_form.fields.date_of_birth_invalid");
          }

          // Check if date is in the past
          if (birthDate >= today) {
            return t("passenger_form.fields.date_of_birth_must_be_past");
          }

          // Check if date is not too old (120 years)
          const maxAge = new Date();
          maxAge.setFullYear(maxAge.getFullYear() - 120);
          if (birthDate < maxAge) {
            return t("passenger_form.fields.date_of_birth_too_old");
          }

          // Check if passenger is at least 1 day old
          const minAge = new Date(today);
          minAge.setDate(minAge.getDate() - 1);
          if (birthDate > minAge) {
            return t("passenger_form.fields.date_of_birth_too_young");
          }

          // Validate age against travel date (onwardDate)
          // Adult passengers must be 18+ on travel date
          if (onwardDate) {
            const travelDate = new Date(onwardDate);
            travelDate.setHours(0, 0, 0, 0);

            if (!isNaN(travelDate.getTime())) {
              const ageOnTravelDate = calculateAge(birthDate, travelDate);

              // This form is for main passenger (adult), so must be 18+
              if (ageOnTravelDate < 18) {
                return t("passenger_form.fields.date_of_birth_adult_required");
              }
            }
          }

          return true;
        };
        break;
      case "email":
        rules.pattern = {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: t("passenger_form.fields.email_invalid"),
        };
        break;
      case "passport_number":
        rules.minLength = {
          value: 6,
          message: t("passenger_form.fields.passport_number_min_length"),
        };
        rules.maxLength = {
          value: 15,
          message: t("passenger_form.fields.passport_number_max_length"),
        };
        rules.pattern = {
          value: /^[A-Za-z0-9]+$/,
          message: t("passenger_form.fields.passport_number_invalid"),
        };
        break;
      case "passport_expiry":
        rules.validate = (value) => {
          if (!value?.day || !value?.month || !value?.year) {
            return true; // Let required rule handle empty values
          }

          const day = parseInt(value.day, 10);
          const month = parseInt(value.month, 10);
          const year = parseInt(value.year, 10);

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return t("passenger_form.fields.passport_expiry_invalid");
          }

          const expiryDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Check if date is valid
          if (
            expiryDate.getDate() !== day ||
            expiryDate.getMonth() !== month - 1 ||
            expiryDate.getFullYear() !== year
          ) {
            return t("passenger_form.fields.passport_expiry_invalid");
          }

          // Check if date is in the future
          if (expiryDate <= today) {
            return t("passenger_form.fields.passport_expiry_must_be_future");
          }

          // Check if passport is valid for at least 6 months from travel date
          if (onwardDate) {
            const travelDate = new Date(onwardDate);
            travelDate.setHours(0, 0, 0, 0);

            if (!isNaN(travelDate.getTime())) {
              // Calculate 6 months from travel date
              const sixMonthsFromTravel = new Date(travelDate);
              sixMonthsFromTravel.setMonth(sixMonthsFromTravel.getMonth() + 6);

              if (expiryDate < sixMonthsFromTravel) {
                return t(
                  "passenger_form.fields.passport_expiry_minimum_six_months"
                );
              }
            }
          }

          return true;
        };
        break;
      case "passport_issue_date":
        rules.validate = (value) => {
          if (!value?.day || !value?.month || !value?.year) {
            return true; // Let required rule handle empty values
          }

          const day = parseInt(value.day, 10);
          const month = parseInt(value.month, 10);
          const year = parseInt(value.year, 10);

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return t("passenger_form.fields.passport_issue_date_invalid");
          }

          const issueDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Check if date is valid
          if (
            issueDate.getDate() !== day ||
            issueDate.getMonth() !== month - 1 ||
            issueDate.getFullYear() !== year
          ) {
            return t("passenger_form.fields.passport_issue_date_invalid");
          }

          // Check if date is in the past
          if (issueDate >= today) {
            return t("passenger_form.fields.passport_issue_date_must_be_past");
          }

          // Note: Cross-field validation with passport expiry date
          // will be handled by re-validating when expiry date changes
          return true;
        };
        break;
      case "pan_number":
        rules.pattern = {
          value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          message: t("passenger_form.fields.pan_number_invalid"),
        };
        break;
      case "phone":
        rules.validate = (value) => {
          if (!value) return true; // Let required rule handle empty values

          // Remove non-numeric characters for validation
          const numericPhone = value.replace(/\D/g, "");
          if (numericPhone.length < 7) {
            return t("passenger_form.fields.phone_min_length");
          }
          if (numericPhone.length > 15) {
            return t("passenger_form.fields.phone_max_length");
          }
          // Check if phone contains only valid characters
          if (!/^[\d\s\-\(\)]+$/.test(value)) {
            return t("passenger_form.fields.phone_invalid");
          }
          return true;
        };
        break;
    }

    // Merge any additional custom rules
    return { ...rules, ...additionalRules };
  };

  // Create a wrapper function to pass travellerRequirements to onSubmit
  const handleFormSubmit = (data) => {
    onSubmit(data, travellerRequirements);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <MainPassengerSection
          control={control}
          errors={errors}
          travellerRequirements={travellerRequirements}
          nationalityOptions={nationalityOptions}
          countryOptions={countryOptions}
          createValidationRules={createValidationRules}
        />

        <SpecialServicesSection
          control={control}
          errors={errors}
          specialServiceRequirements={specialServiceRequirements}
        />

        <ContactDetailsSection
          control={control}
          errors={errors}
          createValidationRules={createValidationRules}
        />

        <SubmitButton
          type="submit"
          style={{ direction: "ltr", textAlign: "center" }}
        >
          {t("passenger_form.continue")}
        </SubmitButton>
      </form>
    </Container>
  );
}
