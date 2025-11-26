import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Section, SectionTitle } from "../styles/PassengerForm.styles";
import SSRModalSelector from "../SSRModalSelector";

export default function SpecialServicesSection({
  control,
  errors,
  specialServiceRequirements,
}) {
  const { t } = useTranslation();

  // Only render if at least one special service is required
  if (
    !specialServiceRequirements.mealPreference?.required &&
    !specialServiceRequirements.seatSelection?.required &&
    !specialServiceRequirements.baggageAllowance?.required
  ) {
    return null;
  }

  return (
    <Section>
      <SectionTitle>
        <span>{t("passenger_form.special_service_requests")}</span>
      </SectionTitle>

      <Controller
        name="extraBaggage"
        control={control}
        render={({ field: baggageField }) => (
          <Controller
            name="specialMeal"
            control={control}
            render={({ field: mealField }) => (
              <Controller
                name="seatPreference"
                control={control}
                render={({ field: seatField }) => (
                  <SSRModalSelector
                    baggageValue={baggageField.value}
                    onBaggageChange={baggageField.onChange}
                    mealValue={mealField.value}
                    onMealChange={mealField.onChange}
                    seatValue={seatField.value}
                    onSeatChange={seatField.onChange}
                    errors={{
                      baggage: errors.extraBaggage?.message,
                      meal: errors.specialMeal?.message,
                      seat: errors.seatPreference?.message,
                    }}
                    showTitle={false}
                    requirements={specialServiceRequirements}
                  />
                )}
              />
            )}
          />
        )}
      />
    </Section>
  );
}
