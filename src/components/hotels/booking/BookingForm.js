"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuMessageSquare,
  LuArrowRight,
} from "react-icons/lu";
import { BiErrorCircle, BiLoaderAlt } from "react-icons/bi";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import CountrySelectWithFlags from "@/components/CountrySelectWithFlags";
import { getNationalityOptions } from "@/utils/helper";

/**
 * Input Field Component
 */
const InputField = ({
  label,
  icon: Icon,
  error,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <Icon
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 transition-colors ${
            disabled
              ? "text-gray-300"
              : "text-gray-400 group-focus-within:text-blue-500"
          }`}
        />
        <input
          disabled={disabled}
          className={`
            w-full pl-12 pr-4 py-3.5 border rounded-xl 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all shadow-sm
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed opacity-60 border-gray-200"
                : "bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500"
            }
            ${
              error && !disabled
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
          <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Select Field Component
 */
const SelectField = ({
  label,
  icon: Icon,
  error,
  required = false,
  children,
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 transition-colors group-focus-within:text-blue-500" />
        <select
          className={`
            w-full pl-12 pr-10 py-3.5 border rounded-xl 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all bg-white appearance-none shadow-sm cursor-pointer
            ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
            }
          `}
          {...props}
        >
          {children}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
          <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Section Header Component
 */
const SectionHeader = ({ title, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
  };

  return (
    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-3">
      <div className={`w-1.5 h-6 ${colorClasses[color]} rounded-full`} />
      {Icon && <Icon className="w-5 h-5" />}
      {title}
    </h3>
  );
};

/**
 * Main Booking Form Component
 */
export default function BookingForm({
  guestData,
  onUpdate,
  onNext,
  isCreatingBooking = false,
  bookingError = null,
  isDisabled = false,
  onClearBookingError = null,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [formData, setFormData] = useState({
    ...guestData,
    phoneCode: guestData.phoneCode || "+966",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    onUpdate({ [field]: value });

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear booking error when user starts editing any field
    if (bookingError && onClearBookingError) {
      onClearBookingError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = t(
        "hotels.details.booking_page.validation.first_name_required"
      );
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t(
        "hotels.details.booking_page.validation.first_name_too_short",
        "First name must be at least 2 characters"
      );
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = t(
        "hotels.details.booking_page.validation.first_name_too_long",
        "First name must not exceed 50 characters"
      );
    } else if (
      !/^[a-zA-Z\u0600-\u06FF\s'-]+$/.test(formData.firstName.trim())
    ) {
      newErrors.firstName = t(
        "hotels.details.booking_page.validation.first_name_invalid",
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      );
    }

    // Last name validation
    if (!formData.lastName || !formData.lastName.trim()) {
      newErrors.lastName = t(
        "hotels.details.booking_page.validation.last_name_required"
      );
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t(
        "hotels.details.booking_page.validation.last_name_too_short",
        "Last name must be at least 2 characters"
      );
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = t(
        "hotels.details.booking_page.validation.last_name_too_long",
        "Last name must not exceed 50 characters"
      );
    } else if (!/^[a-zA-Z\u0600-\u06FF\s'-]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = t(
        "hotels.details.booking_page.validation.last_name_invalid",
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      );
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = t(
        "hotels.details.booking_page.validation.email_required"
      );
    } else {
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = t(
          "hotels.details.booking_page.validation.email_invalid"
        );
      } else if (formData.email.trim().length > 100) {
        newErrors.email = t(
          "hotels.details.booking_page.validation.email_too_long",
          "Email address must not exceed 100 characters"
        );
      }
    }

    // Phone validation
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = t(
        "hotels.details.booking_page.validation.phone_required"
      );
    } else {
      // Remove non-numeric characters for validation
      const numericPhone = formData.phone.replace(/\D/g, "");
      if (numericPhone.length < 7) {
        newErrors.phone = t(
          "hotels.details.booking_page.validation.phone_too_short",
          "Phone number must be at least 7 digits"
        );
      } else if (numericPhone.length > 15) {
        newErrors.phone = t(
          "hotels.details.booking_page.validation.phone_too_long",
          "Phone number must not exceed 15 digits"
        );
      }
    }

    // Nationality validation
    if (!formData.nationality || !formData.nationality.trim()) {
      newErrors.nationality = t(
        "hotels.details.booking_page.validation.nationality_required"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // Get nationality options using the same helper as flight booking
  const nationalityOptions = useMemo(() => getNationalityOptions(t), [t]);

  return (
    <div className="p-5 sm:p-6 md:p-8 lg:p-10 relative">
      {/* Disabled Overlay - Blur and Transparent */}
      {(isDisabled || isCreatingBooking) && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
          <div className="text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
            <BiLoaderAlt className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-800 font-semibold text-base">
              {isCreatingBooking
                ? t(
                    "hotels.details.booking_page.creating_booking",
                    "Creating booking... Please wait."
                  )
                : t(
                    "hotels.details.booking_page.loading_price",
                    "Loading price information... Please wait."
                  )}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {t("hotels.details.booking_page.guest_details.title")}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {t("hotels.details.booking_page.guest_details.subtitle")}
        </p>
      </div>

      <div
        className={`space-y-6 sm:space-y-7 ${
          isDisabled || isCreatingBooking
            ? "opacity-50 pointer-events-none"
            : ""
        }`}
      >
        {/* Personal Information */}
        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 p-5 sm:p-6 rounded-2xl border border-blue-100/50 shadow-sm">
          <SectionHeader
            title={t("hotels.details.booking_page.guest_details.personal_info")}
            icon={LuUser}
            color="blue"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <InputField
              label={t("hotels.details.booking_page.guest_details.first_name")}
              icon={LuUser}
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={errors.firstName}
              placeholder={t(
                "hotels.details.booking_page.guest_details.first_name_placeholder"
              )}
              required
              disabled={isCreatingBooking || isDisabled}
            />
            <InputField
              label={t("hotels.details.booking_page.guest_details.last_name")}
              icon={LuUser}
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={errors.lastName}
              placeholder={t(
                "hotels.details.booking_page.guest_details.last_name_placeholder"
              )}
              required
              disabled={isCreatingBooking || isDisabled}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-purple-50/70 to-pink-50/50 p-5 sm:p-6 rounded-2xl border border-purple-100/50 shadow-sm">
          <SectionHeader
            title={t("hotels.details.booking_page.guest_details.contact_info")}
            icon={LuMail}
            color="purple"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <InputField
              label={t("hotels.details.booking_page.guest_details.email")}
              icon={LuMail}
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder={t(
                "hotels.details.booking_page.guest_details.email_placeholder"
              )}
              required
              disabled={isCreatingBooking || isDisabled}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("hotels.details.booking_page.guest_details.phone")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <PhoneNumberInput
                value={formData.phone || ""}
                onChange={(value) => handleInputChange("phone", value)}
                phoneCode={formData.phoneCode || "+966"}
                onPhoneCodeChange={(value) =>
                  handleInputChange("phoneCode", value)
                }
                placeholder={t("passenger_form.fields.phone_placeholder")}
                error={!!errors.phone}
                t={t}
                isRTL={isRTL}
                disabled={isCreatingBooking || isDisabled}
              />
              {errors.phone && (
                <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
                  <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{errors.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Travel Information */}
        <div className="bg-gradient-to-br from-green-50/70 to-emerald-50/50 p-5 sm:p-6 rounded-2xl border border-green-100/50 shadow-sm">
          <SectionHeader
            title={t("hotels.details.booking_page.guest_details.travel_info")}
            icon={LuMapPin}
            color="green"
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("hotels.details.booking_page.guest_details.nationality")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <CountrySelectWithFlags
              options={nationalityOptions}
              value={formData.nationality}
              onChange={(value) => handleInputChange("nationality", value)}
              placeholder={t(
                "hotels.details.booking_page.guest_details.select_nationality"
              )}
              error={errors.nationality || false}
              t={t}
              isRTL={isRTL}
              disabled={isCreatingBooking || isDisabled}
              style={{ direction: !isRTL ? "rtl" : "ltr" }}
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 p-5 sm:p-6 rounded-2xl border border-amber-100/50 shadow-sm">
          <SectionHeader
            title={t(
              "hotels.details.booking_page.guest_details.special_requests"
            )}
            icon={LuMessageSquare}
            color="amber"
          />
          <div className="relative group">
            <textarea
              value={formData.specialRequests}
              onChange={(e) =>
                handleInputChange("specialRequests", e.target.value)
              }
              rows={4}
              disabled={isCreatingBooking || isDisabled}
              className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none shadow-sm ${
                isCreatingBooking || isDisabled
                  ? "bg-gray-100 cursor-not-allowed opacity-60 border-gray-200"
                  : "bg-white border-gray-300 hover:border-gray-400"
              }`}
              placeholder={t(
                "hotels.details.booking_page.guest_details.special_requests_placeholder"
              )}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {t(
              "hotels.details.booking_page.guest_details.special_requests_note"
            )}
          </p>
        </div>

        {/* Booking Error - Prominent Display */}
        {bookingError && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-500 rounded-xl p-5 shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <BiErrorCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-base font-bold text-red-900 mb-1">
                  {t(
                    "hotels.details.booking_page.validation.booking_error_title",
                    "Booking Error"
                  )}
                </h4>
                <p className="text-sm text-red-800 font-medium leading-relaxed">
                  {bookingError}
                </p>
              </div>
              <button
                onClick={() => {
                  if (onClearBookingError) {
                    onClearBookingError();
                  }
                }}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label={t("common.close", "Close")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-end pt-6 sm:pt-8 border-t border-gray-200">
          <button
            onClick={handleNext}
            disabled={isCreatingBooking || isDisabled}
            className="
              group relative w-full sm:w-auto 
              bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white px-8 sm:px-12 py-4 rounded-xl 
              font-bold text-base
              hover:from-blue-700 hover:to-indigo-700 
              transition-all shadow-lg hover:shadow-xl 
              transform hover:-translate-y-0.5 
              duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:transform-none disabled:shadow-lg
              flex items-center justify-center gap-2
            "
          >
            {isCreatingBooking ? (
              <>
                <BiLoaderAlt className="w-5 h-5 animate-spin" />
                {t("hotels.details.booking_page.creating_booking")}
              </>
            ) : (
              <>
                {t("hotels.details.booking_page.continue_to_payment")}
                <LuArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
