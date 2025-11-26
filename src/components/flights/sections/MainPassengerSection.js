import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Section,
  SectionTitle,
  GenderToggle,
  GenderButton,
  InputGrid,
  InputGroup,
  ErrorMessage,
  CheckboxGroup,
  CheckboxLabel,
} from "../styles/PassengerForm.styles";
import FormInput from "../../FormInput";
import DateSelect from "../../DateSelect";
import SearchableSelect from "../../SearchableSelect";
import CountrySelectWithFlags from "../../CountrySelectWithFlags";

const GenderToggleComponent = ({ value, onChange, t }) => (
  <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
    <legend className="sr-only">{t("passenger_form.gender.title")}</legend>
    <GenderToggle>
      <GenderButton
        type="button"
        $active={value === "Mr"}
        onClick={() => onChange("Mr")}
        aria-pressed={value === "Mr"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
        {t("passenger_form.gender.mr")}
      </GenderButton>
      <GenderButton
        type="button"
        $active={value === "Mrs"}
        onClick={() => onChange("Mrs")}
        aria-pressed={value === "Mrs"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <path d="M12 13v8" />
          <path d="M8 17h8" />
        </svg>
        {t("passenger_form.gender.mrs")}
      </GenderButton>
    </GenderToggle>
  </fieldset>
);

const RequiredLabel = ({ labelKey, isRequired, isRTL, t }) => (
  <label
    style={{
      direction: isRTL ? "rtl" : "ltr",
      textAlign: isRTL ? "right" : "left",
    }}
  >
    {isRTL && isRequired && (
      <span style={{ color: "#3d4fff", marginRight: "4px" }}>*</span>
    )}
    {t(labelKey)}
    {!isRTL && isRequired && (
      <span style={{ color: "#3d4fff", marginLeft: "4px" }}>*</span>
    )}
  </label>
);

export default function MainPassengerSection({
  control,
  errors,
  travellerRequirements,
  nationalityOptions,
  countryOptions,
  createValidationRules,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Watch passport dates for cross-field validation
  const passportExpDate = useWatch({ control, name: "passportExpDate" });
  const passportIssueDate = useWatch({ control, name: "passportIssueDate" });

  return (
    <Section>
      <SectionTitle>
        <span>{t("passenger_form.main_passenger")}</span>
        <span>{t("passenger_form.adult", { count: 1 })}</span>
      </SectionTitle>

      <Controller
        name="gender"
        control={control}
        render={({ field: { value, onChange } }) => (
          <GenderToggleComponent value={value} onChange={onChange} t={t} />
        )}
      />

      <InputGrid>
        <Controller
          name="name"
          control={control}
          rules={createValidationRules("name", true)}
          render={({ field }) => (
            <FormInput
              {...field}
              label={t("passenger_form.fields.name")}
              placeholder={t("passenger_form.fields.name_placeholder")}
              error={errors.name?.message}
              required
            />
          )}
        />
        <Controller
          name="surname"
          control={control}
          rules={createValidationRules("surname", true)}
          render={({ field }) => (
            <FormInput
              {...field}
              label={t("passenger_form.fields.surname")}
              placeholder={t("passenger_form.fields.surname_placeholder")}
              error={errors.surname?.message}
              required
            />
          )}
        />
      </InputGrid>

      <InputGrid>
        {travellerRequirements.nationality?.required && (
          <InputGroup>
            <Controller
              name="nationality"
              control={control}
              rules={createValidationRules("nationality", true)}
              render={({ field }) => (
                <>
                  <RequiredLabel
                    labelKey="passenger_form.fields.nationality"
                    isRequired={true}
                    isRTL={isRTL}
                    t={t}
                  />
                  <CountrySelectWithFlags
                    options={nationalityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(
                      "passenger_form.fields.nationality_placeholder"
                    )}
                    error={errors.nationality?.message || false}
                    t={t}
                    isRTL={isRTL}
                    style={{ direction: !isRTL ? "rtl" : "ltr" }}
                  />
                </>
              )}
            />
          </InputGroup>
        )}
        {travellerRequirements.dateOfBirth?.required && (
          <InputGroup>
            <Controller
              name="birthDate"
              control={control}
              rules={createValidationRules("date_of_birth", true)}
              render={({ field: { value, onChange } }) => (
                <DateSelect
                  label={t("passenger_form.fields.date_of_birth")}
                  dayValue={value?.day || ""}
                  monthValue={value?.month || ""}
                  yearValue={value?.year || ""}
                  onDayChange={(day) => onChange({ ...value, day })}
                  onMonthChange={(month) => onChange({ ...value, month })}
                  onYearChange={(year) => onChange({ ...value, year })}
                  error={errors.birthDate?.message}
                  required
                  yearRange="past"
                />
              )}
            />
          </InputGroup>
        )}
      </InputGrid>

      <InputGrid>
        {travellerRequirements.passportNumber?.required && (
          <Controller
            name="passportNumber"
            control={control}
            rules={createValidationRules("passport_number", true)}
            render={({ field }) => (
              <FormInput
                {...field}
                label={t("passenger_form.fields.passport_number")}
                placeholder={t(
                  "passenger_form.fields.passport_number_placeholder"
                )}
                error={errors.passportNumber?.message}
                required
              />
            )}
          />
        )}
        {travellerRequirements.passportExpiry?.required && (
          <InputGroup>
            <Controller
              name="passportExpDate"
              control={control}
              rules={createValidationRules("passport_expiry", true)}
              render={({ field: { value, onChange } }) => (
                <DateSelect
                  label={t("passenger_form.fields.passport_expiry")}
                  dayValue={value?.day || ""}
                  monthValue={value?.month || ""}
                  yearValue={value?.year || ""}
                  onDayChange={(day) => onChange({ ...value, day })}
                  onMonthChange={(month) => onChange({ ...value, month })}
                  onYearChange={(year) => onChange({ ...value, year })}
                  error={errors.passportExpDate?.message}
                  required
                  yearRange="future"
                />
              )}
            />
          </InputGroup>
        )}
      </InputGrid>

      <InputGrid>
        {travellerRequirements.passportIssue?.required && (
          <InputGroup>
            <Controller
              name="passportIssueLocation"
              control={control}
              rules={{
                required: t(
                  "passenger_form.fields.passport_issue_location_required"
                ),
              }}
              render={({ field }) => (
                <>
                  <RequiredLabel
                    labelKey="passenger_form.fields.passport_issue_location"
                    isRequired={true}
                    isRTL={isRTL}
                    t={t}
                  />
                  <CountrySelectWithFlags
                    options={nationalityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(
                      "passenger_form.fields.passport_issue_location_placeholder"
                    )}
                    error={errors.passportIssueLocation?.message || false}
                    t={t}
                    isRTL={isRTL}
                    style={{ direction: !isRTL ? "rtl" : "ltr" }}
                  />
                </>
              )}
            />
          </InputGroup>
        )}
        {travellerRequirements.passportIssueDate?.required && (
          <InputGroup>
            <Controller
              name="passportIssueDate"
              control={control}
              rules={{
                ...createValidationRules("passport_issue_date", true),
                validate: (value) => {
                  // First run the standard validation
                  const standardValidation = createValidationRules(
                    "passport_issue_date",
                    true
                  );
                  if (standardValidation.validate) {
                    const standardResult = standardValidation.validate(value);
                    if (standardResult !== true) {
                      return standardResult;
                    }
                  }

                  // Then check cross-field validation with expiry date
                  if (
                    value?.day &&
                    value?.month &&
                    value?.year &&
                    passportExpDate?.day &&
                    passportExpDate?.month &&
                    passportExpDate?.year
                  ) {
                    const issueDay = parseInt(value.day, 10);
                    const issueMonth = parseInt(value.month, 10);
                    const issueYear = parseInt(value.year, 10);
                    const expDay = parseInt(passportExpDate.day, 10);
                    const expMonth = parseInt(passportExpDate.month, 10);
                    const expYear = parseInt(passportExpDate.year, 10);

                    if (
                      !isNaN(issueDay) &&
                      !isNaN(issueMonth) &&
                      !isNaN(issueYear) &&
                      !isNaN(expDay) &&
                      !isNaN(expMonth) &&
                      !isNaN(expYear)
                    ) {
                      const issueDateObj = new Date(
                        issueYear,
                        issueMonth - 1,
                        issueDay
                      );
                      const expiryDateObj = new Date(
                        expYear,
                        expMonth - 1,
                        expDay
                      );
                      if (issueDateObj >= expiryDateObj) {
                        return t(
                          "passenger_form.fields.passport_issue_date_must_be_before_expiry"
                        );
                      }
                    }
                  }
                  return true;
                },
              }}
              render={({ field: { value, onChange } }) => (
                <DateSelect
                  label={t("passenger_form.fields.passport_issue_date")}
                  dayValue={value?.day || ""}
                  monthValue={value?.month || ""}
                  yearValue={value?.year || ""}
                  onDayChange={(day) => onChange({ ...value, day })}
                  onMonthChange={(month) => onChange({ ...value, month })}
                  onYearChange={(year) => onChange({ ...value, year })}
                  error={errors.passportIssueDate?.message}
                  required
                  yearRange="past"
                />
              )}
            />
          </InputGroup>
        )}
      </InputGrid>

      <InputGrid>
        {travellerRequirements.country?.required && (
          <InputGroup>
            <Controller
              name="country"
              control={control}
              rules={createValidationRules("country", true)}
              render={({ field }) => (
                <>
                  <RequiredLabel
                    labelKey="passenger_form.fields.country"
                    isRequired={true}
                    isRTL={isRTL}
                    t={t}
                  />
                  <CountrySelectWithFlags
                    options={countryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("passenger_form.fields.country_placeholder")}
                    error={errors.country?.message || false}
                    t={t}
                    isRTL={isRTL}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  />
                </>
              )}
            />
          </InputGroup>
        )}
        {travellerRequirements.panNumber?.required && (
          <Controller
            name="panNumber"
            control={control}
            rules={createValidationRules("pan_number", true)}
            render={({ field }) => (
              <FormInput
                {...field}
                label={t("passenger_form.fields.pan_number")}
                placeholder={t("passenger_form.fields.pan_number_placeholder")}
                error={errors.panNumber?.message}
                required
              />
            )}
          />
        )}
      </InputGrid>

      {travellerRequirements.emigrationCheck?.required && (
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend className="sr-only">
            {t("passenger_form.fields.emigration_check")}
          </legend>
          <InputGrid>
            <Controller
              name="emigrationCheck"
              control={control}
              rules={{
                required: t("passenger_form.fields.emigration_check_required"),
              }}
              render={({ field }) => (
                <CheckboxGroup style={{ direction: isRTL ? "rtl" : "ltr" }}>
                  <CheckboxLabel
                    style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                  >
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      style={{
                        marginLeft: isRTL ? "8px" : "0",
                        marginRight: isRTL ? "0" : "8px",
                        width: "44px",
                        height: "44px",
                      }}
                      aria-describedby={
                        errors.emigrationCheck ? "emigration-error" : undefined
                      }
                    />
                    <span>{t("passenger_form.fields.emigration_check")}</span>
                  </CheckboxLabel>
                  {errors.emigrationCheck && (
                    <ErrorMessage id="emigration-error">
                      {errors.emigrationCheck.message}
                    </ErrorMessage>
                  )}
                </CheckboxGroup>
              )}
            />
          </InputGrid>
        </fieldset>
      )}
    </Section>
  );
}
