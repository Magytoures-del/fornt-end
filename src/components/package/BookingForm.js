"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiCalendarLine,
  RiMapPinLine,
  RiSendPlaneFill,
  RiWhatsappFill,
  RiCheckLine,
  RiErrorWarningLine,
} from "react-icons/ri";

const BookingForm = ({ offer, onSubmit, className = "" }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || "ar";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    travelDate: "",
    passengers: {
      adults: 2,
      children: 0,
      infants: 0,
    },
    specialRequests: "",
    agreesToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t(
        "form.errors.fullName_required",
        "الاسم الكامل مطلوب"
      );
    }

    if (!formData.email.trim()) {
      newErrors.email = t(
        "form.errors.email_required",
        "البريد الإلكتروني مطلوب"
      );
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t(
        "form.errors.email_invalid",
        "البريد الإلكتروني غير صحيح"
      );
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("form.errors.phone_required", "رقم الهاتف مطلوب");
    }

    if (!formData.travelDate) {
      newErrors.travelDate = t(
        "form.errors.travelDate_required",
        "تاريخ السفر مطلوب"
      );
    }

    if (!formData.agreesToTerms) {
      newErrors.agreesToTerms = t(
        "form.errors.terms_required",
        "يجب الموافقة على الشروط والأحكام"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("passengers.")) {
      const passengerType = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        passengers: {
          ...prev.passengers,
          [passengerType]: parseInt(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking details message
      const packageTitle =
        offer?.titleHeader?.[currentLanguage] ||
        offer?.titleHeader?.ar ||
        offer?.titleHeader?.en ||
        t("form.unknown_package", "باقة سفر");
      const packagePrice = offer?.startPrice
        ? `${offer.startPrice} ${t("common.currency", "ريال")}` // Note: In WhatsApp message, keep text format
        : t("form.price_on_request", "السعر عند الطلب");

      const bookingMessage = `
${t("form.booking_details", "تفاصيل الحجز")}:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 ${t("form.package_name", "اسم الباقة")}: ${packageTitle}
💰 ${t("form.package_price", "السعر")}: ${packagePrice}

👤 ${t("form.personal_info", "المعلومات الشخصية")}:
• ${t("form.full_name", "الاسم الكامل")}: ${formData.fullName}
• ${t("form.email", "البريد الإلكتروني")}: ${formData.email}
• ${t("form.phone", "رقم الهاتف")}: ${formData.phone}
${
  formData.nationality
    ? `• ${t("form.nationality", "الجنسية")}: ${formData.nationality}`
    : ""
}

🗓️ ${t("form.travel_date", "تاريخ السفر المفضل")}: ${formData.travelDate}

👥 ${t("form.passenger_info", "معلومات المسافرين")}:
• ${formData.passengers.adults} ${t("form.adults", "بالغين")}
${
  formData.passengers.children > 0
    ? `• ${formData.passengers.children} ${t("form.children", "أطفال")}`
    : ""
}
${
  formData.passengers.infants > 0
    ? `• ${formData.passengers.infants} ${t("form.infants", "رضع")}`
    : ""
}

${
  formData.specialRequests
    ? `📝 ${t("form.special_requests", "طلبات خاصة أو ملاحظات")}: ${
        formData.specialRequests
      }`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${t("form.submitted_at", "تم الإرسال في")}: ${new Date().toLocaleString(
        currentLanguage === "ar" ? "ar-SA" : "en-US"
      )}
      `.trim();

      // Prepare data for contact API
      const contactData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject:
          t("form.booking_subject", "طلب حجز باقة سفر") + ` - ${packageTitle}`,
        message: bookingMessage,
      };

      // Send to contact API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: contactData,
          language: currentLanguage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            t("form.errors.submission_failed", "حدث خطأ أثناء الإرسال")
        );
      }

      if (result.success) {
        setIsSuccess(true);

        // Call parent onSubmit function if provided (for additional handling)
        if (onSubmit) {
          await onSubmit({
            ...formData,
            package: {
              id: offer?._id,
              title: packageTitle,
              price: offer?.startPrice,
            },
          });
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            nationality: "",
            travelDate: "",
            passengers: { adults: 2, children: 0, infants: 0 },
            specialRequests: "",
            agreesToTerms: false,
          });
        }, 3000);
      } else {
        throw new Error(
          result.error ||
            t("form.errors.submission_failed", "حدث خطأ أثناء الإرسال")
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({
        submit:
          error.message ||
          t(
            "form.errors.submission_failed",
            "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
          ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp booking
  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent(
      `${t("package.whatsapp_booking", "أرغب في حجز الباقة التالية:")}

📦 ${offer?.titleHeader?.[currentLanguage] || ""}
👤 ${formData.fullName}
📧 ${formData.email}
📱 ${formData.phone}
🗓️ ${formData.travelDate}
👥 ${formData.passengers.adults} ${t("form.adults", "بالغين")} ${
        formData.passengers.children > 0
          ? `+ ${formData.passengers.children} ${t("form.children", "أطفال")}`
          : ""
      }

${
  formData.specialRequests
    ? `📝 ${t("form.special_requests", "طلبات خاصة")}: ${
        formData.specialRequests
      }`
    : ""
}
`
    );
    const phoneNumber = "1234567890"; // Replace with actual WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  if (isSuccess) {
    return (
      <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center ${className}`}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RiCheckLine className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t("form.success.title", "تم الإرسال بنجاح!")}
        </h3>
        <p className="text-gray-600">
          {t(
            "form.success.message",
            "شكراً لك! سنتواصل معك قريباً لتأكيد الحجز."
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <h3 className="text-2xl font-bold mb-2">
          {t("form.title", "احجز الآن")}
        </h3>
        <p className="text-blue-100">
          {t("form.subtitle", "املأ البيانات التالية لإتمام الحجز")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            <RiUserLine className="w-5 h-5" />
            {t("form.personal_info", "المعلومات الشخصية")}
          </h4>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("form.full_name", "الاسم الكامل")} *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.fullName
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              placeholder={t("form.placeholders.full_name", "أدخل اسمك الكامل")}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <RiErrorWarningLine className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("form.email", "البريد الإلكتروني")} *
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder={t(
                    "form.placeholders.email",
                    "example@email.com"
                  )}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <RiErrorWarningLine className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("form.phone", "رقم الهاتف")} *
              </label>
              <div className="relative">
                <RiPhoneLine className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                    errors.phone
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder={t("form.placeholders.phone", "05xxxxxxxx")}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <RiErrorWarningLine className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Nationality and Travel Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("form.nationality", "الجنسية")}
              </label>
              <div className="relative">
                <RiMapPinLine className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">
                    {t("form.placeholders.nationality", "اختر الجنسية")}
                  </option>
                  <option value="SA">
                    {t("countries.saudi_arabia", "السعودية")}
                  </option>
                  <option value="AE">{t("countries.uae", "الإمارات")}</option>
                  <option value="KW">{t("countries.kuwait", "الكويت")}</option>
                  <option value="QA">{t("countries.qatar", "قطر")}</option>
                  <option value="BH">
                    {t("countries.bahrain", "البحرين")}
                  </option>
                  <option value="OM">{t("countries.oman", "عُمان")}</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="travelDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("form.travel_date", "تاريخ السفر المفضل")} *
              </label>
              <div className="relative">
                <RiCalendarLine className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                    errors.travelDate
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.travelDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <RiErrorWarningLine className="w-4 h-4" />
                  {errors.travelDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            <RiUserLine className="w-5 h-5" />
            {t("form.passenger_info", "معلومات المسافرين")}
          </h4>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.adults", "البالغين")}
              </label>
              <input
                type="number"
                name="passengers.adults"
                value={formData.passengers.adults}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.children", "الأطفال")}
              </label>
              <input
                type="number"
                name="passengers.children"
                value={formData.passengers.children}
                onChange={handleInputChange}
                min="0"
                max="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("form.infants", "الرضع")}
              </label>
              <input
                type="number"
                name="passengers.infants"
                value={formData.passengers.infants}
                onChange={handleInputChange}
                min="0"
                max="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("form.special_requests", "طلبات خاصة أو ملاحظات")}
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            placeholder={t(
              "form.placeholders.special_requests",
              "أي طلبات خاصة أو ملاحظات إضافية..."
            )}
          />
        </div>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreesToTerms"
              checked={formData.agreesToTerms}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 mt-1"
            />
            <span className="text-sm text-gray-700">
              {t("form.terms_agreement", "أوافق على")}{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                {t("form.terms_link", "الشروط والأحكام")}
              </a>{" "}
              {t("form.and", "و")}{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                {t("form.privacy_link", "سياسة الخصوصية")}
              </a>
            </span>
          </label>
          {errors.agreesToTerms && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <RiErrorWarningLine className="w-4 h-4" />
              {errors.agreesToTerms}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-1">
              <RiErrorWarningLine className="w-4 h-4" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          {/* Regular Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
          >
            <RiSendPlaneFill className="w-6 h-6" />
            {isSubmitting
              ? t("form.submitting", "جاري الإرسال...")
              : t("form.submit", "إرسال طلب الحجز")}
          </button>

          {/* WhatsApp Submit Button */}
          <button
            type="button"
            onClick={handleWhatsAppBooking}
            disabled={!formData.fullName || !formData.phone}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
          >
            <RiWhatsappFill className="w-6 h-6" />
            {t("form.whatsapp_submit", "إرسال عبر واتساب")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
