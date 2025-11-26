"use client";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { RiEyeLine } from "react-icons/ri";

export default function OverviewSection({ offer }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Return null if no overview content
  if (!offer?.overview?.[currentLanguage]) {
    return null;
  }

  const overviewText = offer.overview[currentLanguage];
  const isLongText = overviewText.length > 400;
  const displayText = isExpanded ? overviewText : overviewText.slice(0, 400);

  return (
    <section
      className={`relative  transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("package.overview_title", "نظرة عامة")}
          </h2>
          <div
            className={`w-16 h-1 
          bg-gradient-to-l from-blue-500 to-purple-500 mr-0
             
          rounded-full`}
          ></div>
          <p className="text-gray-600">
            {t("package.overview_subtitle", "تعرف على تفاصيل الرحلة")}
          </p>
        </div>

        {/* Overview Content */}
        <div className=" mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                {displayText}
                {isLongText && !isExpanded && "..."}
              </p>
            </div>

            {isLongText && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <RiEyeLine className="w-4 h-4" />
                {isExpanded
                  ? t("common.show_less", "عرض أقل")
                  : t("common.show_more", "عرض المزيد")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full filter blur-3xl opacity-10 -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200 rounded-full filter blur-3xl opacity-10 -z-10" />
    </section>
  );
}
