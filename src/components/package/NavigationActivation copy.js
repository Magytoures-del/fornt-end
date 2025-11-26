"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  RiEyeLine,
  RiMapPin2Fill,
  RiCalendarLine,
  RiPriceTagLine,
  RiImageLine,
  RiInformationLine,
  RiPhoneLine,
  RiCheckLine,
} from "react-icons/ri";

export default function NavigationActivation({ result }) {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState("overview");
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setActiveSection(sectionId);
    }
  };

  // Navigation items configuration
  const navigationItems = [
    {
      id: "overview",
      label: t("package.nav.overview", "نظرة عامة"),
      icon: RiEyeLine,
      description: t("package.nav.overview_desc", "تفاصيل الرحلة"),
    },
    {
      id: "gallery",
      label: t("package.nav.gallery", "معرض الصور"),
      icon: RiImageLine,
      description: t("package.nav.gallery_desc", "صور الوجهة"),
    },
    {
      id: "itinerary",
      label: t("package.nav.itinerary", "برنامج الرحلة"),
      icon: RiCalendarLine,
      description: t("package.nav.itinerary_desc", "الأنشطة والمواعيد"),
    },
    {
      id: "location",
      label: t("package.nav.location", "الموقع"),
      icon: RiMapPin2Fill,
      description: t("package.nav.location_desc", "الخريطة والعنوان"),
    },
    {
      id: "pricing",
      label: t("package.nav.pricing", "الأسعار"),
      icon: RiPriceTagLine,
      description: t("package.nav.pricing_desc", "تفاصيل التكلفة"),
    },
    {
      id: "contact",
      label: t("package.nav.contact", "التواصل"),
      icon: RiPhoneLine,
      description: t("package.nav.contact_desc", "احجز الآن"),
    },
  ];

  // Return null if no offer data
  if (!result) {
    return null;
  }

  return (
    <section
      className={`relative bg-gradient-to-br from-slate-50 to-blue-50 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <RiInformationLine className="w-4 h-4" />
            {t("package.nav.explore", "استكشف التفاصيل")}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("package.nav.title", "دليل الرحلة")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t(
              "package.nav.subtitle",
              "اكتشف كل ما تحتاج معرفته عن رحلتك المثالية"
            )}
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`
                  group relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-300
                  transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20
                  ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  }
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <RiCheckLine className="w-3 h-3" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all duration-300
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                  }
                `}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3
                    className={`
                    font-semibold text-sm md:text-base mb-1 transition-colors duration-300
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-900 group-hover:text-blue-700"
                    }
                  `}
                  >
                    {item.label}
                  </h3>
                  <p
                    className={`
                    text-xs md:text-sm transition-colors duration-300
                    ${
                      isActive
                        ? "text-blue-100"
                        : "text-gray-500 group-hover:text-blue-600"
                    }
                  `}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div
                  className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isActive ? "opacity-0" : ""}
                `}
                />
              </button>
            );
          })}
        </div>

        {/* Package Quick Info */}
        {result && (
          <div className="mt-8 md:mt-12 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
              {/* Duration */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <RiCalendarLine className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t("package.nav.duration", "مدة الرحلة")}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {result.duration} {t("common.nights", "ليالٍ")}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <RiMapPin2Fill className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t("package.nav.destination", "الوجهة")}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {result.map?.[i18n.language] ||
                      result.map?.ar ||
                      t("package.nav.destination_placeholder", "وجهة رائعة")}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <RiCheckLine className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t("package.nav.status", "حالة العرض")}
                  </p>
                  <p className="font-semibold text-green-600">
                    {t("package.nav.available", "متاح للحجز")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-8 md:mt-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <RiPhoneLine className="w-4 h-4" />
            {t("package.nav.cta", "تواصل معنا للحجز")}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse" />
    </section>
  );
}
