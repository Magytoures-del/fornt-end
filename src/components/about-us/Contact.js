"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/6 w-20 sm:w-28 md:w-40 h-20 sm:h-28 md:h-40 bg-white/5 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-white/8 rounded-full blur-lg animate-pulse"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="transform transition-all duration-700">
          {/* Decorative line */}
          <div className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            {t("aboutPage.cta.title")}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            {t("aboutPage.cta.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-base sm:text-lg"
            >
              <span>{t("aboutPage.cta.contact")}</span>
              <FaArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/packages"
              className="group inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
            >
              <span>{t("aboutPage.cta.viewOffers")}</span>
              <FaArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
