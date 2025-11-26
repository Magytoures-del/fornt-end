"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import heroImage from "@/assets/contact-us.jpg";

export default function ContactHero() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <section className="relative min-h-[100vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center py-8 sm:py-12 md:py-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={t("contact.hero.title")}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
            {t("contact.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-gray-200 max-w-4xl mx-auto leading-relaxed px-2">
            {t("contact.hero.subtitle")}
          </p>

          {/* Contact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* 24/7 Support */}
            <div className="text-center p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-white/15 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-3 sm:mb-4 md:mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
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
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
                24/7
              </div>
              <div className="text-gray-200 text-sm sm:text-base md:text-lg font-medium">
                {t("contact.hero.stats.support_available")}
              </div>
            </div>

            {/* Response Time */}
            <div className="text-center p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-white/15 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-3 sm:mb-4 md:mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
                {t("contact.hero.stats.response_time_value")}
              </div>
              <div className="text-gray-200 text-sm sm:text-base md:text-lg font-medium">
                {t("contact.hero.stats.response_time")}
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="text-center p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-white/15 transition-all duration-300 sm:col-start-1 sm:col-end-3 lg:col-start-auto lg:col-end-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-3 sm:mb-4 md:mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
                100%
              </div>
              <div className="text-gray-200 text-sm sm:text-base md:text-lg font-medium">
                {t("contact.hero.stats.customer_satisfaction")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
