"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { BiErrorCircle } from "react-icons/bi";

export default function ContactForm() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCode: "+966",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handlePhoneCodeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phoneCode: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t(
        "contact.form.validation.name_required",
        "Full name is required"
      );
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t(
        "contact.form.validation.name_too_short",
        "Name must be at least 2 characters"
      );
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t(
        "contact.form.validation.email_required",
        "Email address is required"
      );
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t(
        "contact.form.validation.email_invalid",
        "Please enter a valid email address"
      );
    }

    // Phone validation
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = t(
        "contact.form.validation.phone_required",
        "Phone number is required"
      );
    } else {
      // Remove non-numeric characters for validation
      const numericPhone = formData.phone.replace(/\D/g, "");
      if (numericPhone.length < 7) {
        newErrors.phone = t(
          "contact.form.validation.phone_too_short",
          "Phone number must be at least 7 digits"
        );
      } else if (numericPhone.length > 15) {
        newErrors.phone = t(
          "contact.form.validation.phone_too_long",
          "Phone number must not exceed 15 digits"
        );
      }
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = t(
        "contact.form.validation.subject_required",
        "Please select a subject"
      );
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t(
        "contact.form.validation.message_required",
        "Message is required"
      );
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t(
        "contact.form.validation.message_too_short",
        "Message must be at least 10 characters"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          language: currentLanguage,
        }),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          phoneCode: "+966",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-fit">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("contact.form.title")}
        </h2>
        <p className="text-gray-600 text-lg">{t("contact.form.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.form.full_name")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 h-[60px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("contact.form.placeholders.full_name")}
            />
            {errors.name && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
                <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errors.name}</p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.form.email")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 h-[60px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder={t("contact.form.placeholders.email")}
            />
            {errors.email && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
                <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errors.email}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 h-full">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.form.phone")} <span className="text-red-500">*</span>
            </label>
            <PhoneNumberInput
              value={formData.phone || ""}
              onChange={handlePhoneChange}
              phoneCode={formData.phoneCode || "+966"}
              onPhoneCodeChange={handlePhoneCodeChange}
              placeholder={t("contact.form.placeholders.phone")}
              error={!!errors.phone}
              t={t}
              isRTL={isRTL}
              required
            />
            {errors.phone && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
                <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errors.phone}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2 h-full">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("contact.form.subject")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 h-[60px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.subject
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">{t("contact.form.subjects.select")}</option>
              <option value="general">
                {t("contact.form.subjects.general")}
              </option>
              <option value="booking">
                {t("contact.form.subjects.booking")}
              </option>
              <option value="hotel">{t("contact.form.subjects.hotel")}</option>
              <option value="package">
                {t("contact.form.subjects.package")}
              </option>
              <option value="support">
                {t("contact.form.subjects.support")}
              </option>
              <option value="complaint">
                {t("contact.form.subjects.complaint")}
              </option>
            </select>
            {errors.subject && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
                <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errors.subject}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("contact.form.message")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.message
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            placeholder={t("contact.form.placeholders.message")}
          />
          {errors.message && (
            <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
              <BiErrorCircle className="w-4 h-4 flex-shrink-0" />
              <p>{errors.message}</p>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{t("contact.form.success")}</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{t("contact.form.error")}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("contact.form.sending")}
            </div>
          ) : (
            t("contact.form.send_message")
          )}
        </button>
      </form>
    </div>
  );
}
