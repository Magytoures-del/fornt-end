"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactMap() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("contact.map.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("contact.map.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative h-96 md:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.4681700829283!2d39.8671046!3d21.4108356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c2054acdbc3153%3A0x673fc8c41bf227e1!2z2YjZg9in2YTZhyDYs9mF2KfYoSDYrNiv2YrYr9mHINmE2YTYs9mB2LEg2YjYp9mE2LPZitin2K3Zhw!5e0!3m2!1sar!2seg!4v1752783157449!5m2!1sar!2seg"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={
                    isRTL
                      ? "موقع فلاي مون في مكة المكرمة"
                      : "Flymoon Location in Makkah"
                  }
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? "تفاصيل الموقع" : "Location Details"}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {isRTL ? "العنوان" : "Address"}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {isRTL
                        ? "شارع الملك عبدالله، حي العزيزية، مكة المكرمة، المملكة العربية السعودية"
                        : "King Abdullah Street, Al-Aziziyah District, Makkah, Saudi Arabia"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {isRTL ? "ساعات العمل" : "Working Hours"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {isRTL
                        ? "الأحد - الخميس: 9:00 ص - 6:00 م"
                        : "Sunday - Thursday: 9:00 AM - 6:00 PM"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {isRTL
                        ? "السبت: 10:00 ص - 4:00 م"
                        : "Saturday: 10:00 AM - 4:00 PM"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {isRTL ? "المواصلات" : "Transportation"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {isRTL
                        ? "سهولة الوصول عبر وسائل النقل العام والمواصلات الخاصة"
                        : "Easy access via public transportation and private vehicles"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {isRTL ? "كيفية الوصول" : "How to Get Here"}
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {isRTL
                      ? "من مطار الملك عبدالعزيز الدولي"
                      : "From King Abdulaziz International Airport"}
                  </h4>
                  <p className="text-blue-800 text-sm">
                    {isRTL
                      ? "استقل سيارة أجرة أو استخدم خدمة النقل المباشر إلى مكة المكرمة"
                      : "Take a taxi or use the direct shuttle service to Makkah"}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    {isRTL ? "من محطة القطار" : "From Train Station"}
                  </h4>
                  <p className="text-green-800 text-sm">
                    {isRTL
                      ? "استقل قطار الحرمين السريع من جدة أو الرياض"
                      : "Take the Haramain High-Speed Railway from Jeddah or Riyadh"}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    {isRTL ? "بالسيارة" : "By Car"}
                  </h4>
                  <p className="text-purple-800 text-sm">
                    {isRTL
                      ? "اتبع إشارات الطريق إلى حي العزيزية في مكة المكرمة"
                      : "Follow road signs to Al-Aziziyah District in Makkah"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
