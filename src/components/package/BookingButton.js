"use client";

import { useTranslation } from "react-i18next";
import { localizeNumber } from "@/utils/numberLocalization";
import {
  RiCalendarEventFill,
  RiArrowRightLine,
  RiCheckLine,
  RiUserLine,
  RiTimeLine,
} from "react-icons/ri";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

const BookingButton = ({ offer, onClick, className = "" }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || "ar";

  if (!offer) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Quick Info Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {t("package.ready_to_book", "جاهز للحجز؟")}
          </h3>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <RiCalendarEventFill className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          {t(
            "package.booking_description",
            "احجز الآن واحصل على تأكيد فوري لرحلتك"
          )}
        </p>
      </div>

      {/* Package Summary */}
      <div className="p-6">
        <div className="space-y-4 mb-6">
          {/* Duration */}
          <div className="flex items-center gap-3 text-gray-700">
            <RiTimeLine className="w-5 h-5 text-blue-600" />
            <span className="font-medium">
              {offer.duration} {t("common.days", "أيام")}
            </span>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 text-gray-700">
            <RiUserLine className="w-5 h-5 text-blue-600" />
            <span className="font-medium">
              {offer.numberOfGuests || 2} {t("common.guests", "ضيوف")}
            </span>
          </div>

          {/* Price */}
          {offer.startPrice && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-gray-700 font-medium">
                {t("package.starting_price", "السعر يبدأ من")}:
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-end gap-1">
                  {localizeNumber(offer.startPrice, currentLanguage)} <SARCurrencyIcon className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-600">
                  {t("common.perPerson", "للشخص")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mb-6 space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">
            {t("package.booking_benefits", "مميزات الحجز")}:
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <RiCheckLine className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>
                {t("package.instant_confirmation", "تأكيد فوري للحجز")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RiCheckLine className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>
                {t("package.free_cancellation", "إلغاء مجاني حتى 24 ساعة")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RiCheckLine className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>{t("package.customer_support", "دعم العملاء 24/7")}</span>
            </div>
          </div>
        </div>

        {/* Main Booking Button */}

        {/* Secondary Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {t("package.secure_booking", "حجز آمن ومحمي بتشفير SSL")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingButton;
