"use client";
import { useTranslation } from "react-i18next";
import {
  FaPlane,
  FaHotel,
  FaPassport,
  FaHeadset,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaAward,
  FaCrown,
  FaStar,
  FaRocket,
  FaHeart,
  FaHandshake,
  FaEye,
  FaBullseye,
  FaCheckCircle,
  FaUserTie,
  FaGem,
} from "react-icons/fa";

const premiumServices = [
  {
    id: 1,
    icon: <FaPlane />,
    titleKey: "aboutPage.services.flight.title",
    descriptionKey: "aboutPage.services.flight.description",
    featureKey: "aboutPage.services.flight.feature",
    bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-50",
    iconBg: "bg-gradient-to-r from-blue-500 to-indigo-600",
    accentColor: "text-blue-500",
  },
  {
    id: 2,
    icon: <FaHotel />,
    titleKey: "aboutPage.services.hotels.title",
    descriptionKey: "aboutPage.services.hotels.description",
    featureKey: "aboutPage.services.hotels.feature",
    bgGradient: "bg-gradient-to-br from-emerald-50 to-teal-50",
    iconBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
    accentColor: "text-emerald-500",
  },
  {
    id: 3,
    icon: <FaPassport />,
    titleKey: "aboutPage.services.visa.title",
    descriptionKey: "aboutPage.services.visa.description",
    featureKey: "aboutPage.services.visa.feature",
    bgGradient: "bg-gradient-to-br from-purple-50 to-pink-50",
    iconBg: "bg-gradient-to-r from-purple-500 to-pink-600",
    accentColor: "text-purple-500",
  },
  {
    id: 4,
    icon: <FaMapMarkedAlt />,
    titleKey: "aboutPage.services.tours.title",
    descriptionKey: "aboutPage.services.tours.description",
    featureKey: "aboutPage.services.tours.feature",
    bgGradient: "bg-gradient-to-br from-orange-50 to-red-50",
    iconBg: "bg-gradient-to-r from-orange-500 to-red-600",
    accentColor: "text-orange-500",
  },
  {
    id: 5,
    icon: <FaShieldAlt />,
    titleKey: "aboutPage.services.insurance.title",
    descriptionKey: "aboutPage.services.insurance.description",
    featureKey: "aboutPage.services.insurance.feature",
    bgGradient: "bg-gradient-to-br from-green-50 to-emerald-50",
    iconBg: "bg-gradient-to-r from-green-500 to-emerald-600",
    accentColor: "text-green-500",
  },
  {
    id: 6,
    icon: <FaHeadset />,
    titleKey: "aboutPage.services.support.title",
    descriptionKey: "aboutPage.services.support.description",
    featureKey: "aboutPage.services.support.feature",
    bgGradient: "bg-gradient-to-br from-cyan-50 to-blue-50",
    iconBg: "bg-gradient-to-r from-cyan-500 to-blue-600",
    accentColor: "text-cyan-500",
  },
];
export default function Services() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  pt-10">
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16">
        {/* Decorative line */}
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("aboutPage.services.title")}
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t("aboutPage.services.subtitle")}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center items-center mt-5 space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8 mb-12 sm:mb-16 lg:px-0 px-5">
        {premiumServices.map((service, index) => (
          <PremiumServiceCard
            key={service.id}
            service={service}
            index={index}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
const PremiumServiceCard = ({ service, index, t }) => (
  <div
    className={`group relative ${service.bgGradient} rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:rotate-1 border border-white/30 backdrop-blur-sm animate-fade-in-up`}
    style={{ animationDelay: `${index * 150}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10 flex flex-col items-center text-center gap-2 py-2">
      <div
        className={`${service.iconBg} w-9 sm:w-10 md:w-12 h-9 sm:h-10 md:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
      >
        <div className="text-lg sm:text-lg md:text-xl text-white">
          {service.icon}
        </div>
      </div>

      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
        {t(service.titleKey)}
      </h3>

      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4 group-hover:text-gray-700 transition-colors duration-300">
        {t(service.descriptionKey)}
      </p>

      <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
        <FaCheckCircle className="mr-2 text-green-500 flex-shrink-0 text-xs sm:text-sm" />
        <span className="leading-tight">{t(service.featureKey)}</span>
      </div>
    </div>

    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
      <div
        className={`w-3 sm:w-4 h-3 sm:h-4 ${service.accentColor} rounded-full border-2 border-current animate-pulse`}
      ></div>
    </div>
  </div>
);
