import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Section,
  SectionTitle,
  InputGrid,
  InputGroup,
  ErrorMessage,
} from "../styles/PassengerForm.styles";
import FormInput from "../../FormInput";
import PhoneNumberInput from "../../PhoneNumberInput";

export default function ContactDetailsSection({
  control,
  errors,
  createValidationRules,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Section>
      <SectionTitle>
        <span>{t("passenger_form.contact_details")}</span>
      </SectionTitle>

      <InputGrid>
        <Controller
          name="email"
          control={control}
          rules={createValidationRules("email", true)}
          render={({ field }) => (
            <FormInput
              {...field}
              label={t("passenger_form.fields.email")}
              type="email"
              placeholder={t("passenger_form.fields.email_placeholder")}
              error={errors.email?.message}
              style={{ direction: "ltr" }}
              required
            />
          )}
        />
        <InputGroup>
          <label
            style={{
              direction: isRTL ? "rtl" : "ltr",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {isRTL && (
              <span style={{ color: "#3d4fff", marginRight: "4px" }}>*</span>
            )}
            {t("passenger_form.fields.phone_number")}
            {!isRTL && (
              <span style={{ color: "#3d4fff", marginLeft: "4px" }}>*</span>
            )}
          </label>
          <Controller
            name="phone"
            control={control}
            rules={createValidationRules("phone", true)}
            render={({ field }) => (
              <>
                <Controller
                  name="phoneCode"
                  control={control}
                  render={({ field: phoneCodeField }) => (
                    <PhoneNumberInput
                      value={field.value}
                      onChange={field.onChange}
                      phoneCode={phoneCodeField.value}
                      onPhoneCodeChange={phoneCodeField.onChange}
                      placeholder={t("passenger_form.fields.phone_placeholder")}
                      error={!!errors.phone}
                      t={t}
                      isRTL={isRTL}
                    />
                  )}
                />
                {errors.phone && (
                  <ErrorMessage>{errors.phone.message}</ErrorMessage>
                )}
              </>
            )}
          />
        </InputGroup>
      </InputGrid>
    </Section>
  );
}
