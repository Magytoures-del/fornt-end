"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { localizeNumber } from "@/utils/numberLocalization";
import {
  RiUserLine,
  RiCalendarLine,
  RiPriceTag3Line,
  RiStarFill,
  RiWhatsappFill,
  RiPhoneFill,
  RiCalendarEventFill,
  RiArrowRightLine,
} from "react-icons/ri";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

const PriceCard = ({ offer, className = "", onClick }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || "ar";
  const [selectedPassengerType, setSelectedPassengerType] = useState("double");

  // Calculate pricing based on passenger type
  const getPricing = () => {
    if (!offer) return { price: 0, originalPrice: 0, discount: 0 };

    // Use startPrice as the base price
    const basePrice = offer?.startPrice || 0;

    // Add logic for different passenger types if available
    const pricing = {
      single: basePrice * 2, // Single occupancy usually costs more
      double: basePrice,
    };

    const currentPrice = pricing[selectedPassengerType] || basePrice;

    return {
      price: currentPrice,
      originalPrice: currentPrice * 1.2, // Show original price with discount
      discount: 20,
    };
  };

  const { price, originalPrice, discount } = getPricing();

  // WhatsApp integration
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `${t(
        "package.whatsapp_inquiry",
        "مرحباً، أرغب في الاستفسار عن الباقة:"
      )} ${offer?.titleHeader?.[currentLanguage] || ""}`
    );
    const phoneNumber = "1234567890"; // Replace with actual WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // Phone call integration
  const handlePhoneCall = () => {
    const phoneNumber = "+1234567890"; // Replace with actual phone number
    window.location.href = `tel:${phoneNumber}`;
  };

  if (!offer) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8 ${className}`}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-center font-bold">
          <RiPriceTag3Line className="inline-block w-5 h-5 mr-2" />
          {t("common.off", "خصم")} {discount}%
        </div>
      )}

      <div className="p-6">
        {/* Duration and Guests Info */}
        <div className="flex items-center justify-between mb-6 text-gray-600">
          <div className="flex items-center gap-2">
            <RiCalendarLine className="w-5 h-5" />
            <span className="font-medium">
              {offer.duration} {t("common.days", "أيام")} / {offer.duration - 1}{" "}
              {t("common.nights", "ليالي")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RiUserLine className="w-5 h-5" />
            <span className="font-medium">
              {offer.passengerType === "double"
                ? t("package.occupancy.double", "مزدوج")
                : offer.passengerType === "single"
                ? t("package.occupancy.single", "فردي")
                : t("package.occupancy.triple", "ثلاثي")}
            </span>
          </div>
        </div>

        {/* Passenger Type Selector */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-3">
            {t("package.occupancy_type", "نوع الإقامة")}
          </h4>
          <div className="space-y-2">
            {["single", "double"].map((type) => (
              <label
                key={type}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedPassengerType === type
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="passengerType"
                  value={type}
                  checked={selectedPassengerType === type}
                  onChange={(e) => setSelectedPassengerType(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 font-medium">
                  {t(`package.occupancy.${type}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Pricing Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span className="line-through flex items-center gap-1">
                {localizeNumber(originalPrice, currentLanguage)} <SARCurrencyIcon className="w-3 h-3" />
              </span>
              <div className="flex items-center text-green-600 font-semibold">
                <RiPriceTag3Line className="w-4 h-4 mr-1" />
                {t("common.save", "توفير")}{" "}
                {localizeNumber(originalPrice - price, currentLanguage)}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-2xl font-bold text-blue-600">
              {localizeNumber(price, currentLanguage)} <SARCurrencyIcon className="w-7 h-7 ml-2" />
            </div>
            <span className="text-gray-600 text-sm">
              {t("common.perPerson", "للشخص")}
            </span>
          </div>
        </div>

        {/* Rating Display */}
        <div className="flex items-center mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <RiStarFill key={index} className="w-4 h-4 text-yellow-400" />
            ))}
          </div>
          <span className="ml-2 font-semibold text-gray-800">4.8</span>
          <span className="ml-1 text-gray-600 text-sm">
            ({t("package.reviews_count", "120+ تقييم")})
          </span>
        </div>

        {/* Contact Options */}
        <div className="space-y-3">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppContact}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <RiWhatsappFill className="w-6 h-6" />
            {t("package.contact_whatsapp", "تواصل عبر واتساب")}
          </button>

          {/* Phone Button */}
          <button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          >
            <RiCalendarEventFill className="w-6 h-6" />
            <span>{t("form.open_booking_form", "فتح نموذج الحجز")}</span>
            <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>✓ {t("package.free_cancellation", "إلغاء مجاني حتى 24 ساعة")}</p>
            <p>✓ {t("package.instant_confirmation", "تأكيد فوري للحجز")}</p>
            <p>✓ {t("package.customer_support", "دعم العملاء 24/7")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
