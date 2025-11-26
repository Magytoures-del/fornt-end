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

const companyDirections = [
  {
    id: 1,
    icon: <FaEye />,
    titleKey: "aboutPage.direction.vision.title",
    descriptionKey: "aboutPage.direction.vision.description",
    iconBg: "bg-gradient-to-r from-blue-500 to-purple-600",
  },
  {
    id: 2,
    icon: <FaBullseye />,
    titleKey: "aboutPage.direction.mission.title",
    descriptionKey: "aboutPage.direction.mission.description",
    iconBg: "bg-gradient-to-r from-purple-500 to-pink-600",
  },
  {
    id: 3,
    icon: <FaRocket />,
    titleKey: "aboutPage.direction.future.title",
    descriptionKey: "aboutPage.direction.future.description",
    iconBg: "bg-gradient-to-r from-orange-500 to-red-600",
  },
];

export default function Vision() {
  const { t } = useTranslation();
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-5 lg:px-0 relative z-10">
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>

        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("aboutPage.direction.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            {t("aboutPage.direction.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-5 md:px-0">
          {companyDirections.map((direction, index) => (
            <DirectionCard
              key={direction.id}
              direction={direction}
              index={index}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
const DirectionCard = ({ direction, index, t }) => (
  <div
    className={`px-2 md:px-0 group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-105 border border-gray-200 animate-fade-in-up`}
    style={{ animationDelay: `${index * 200}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10 text-center">
      <div
        className={`${direction.iconBg} w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}
      >
        <div className="text-xl sm:text-2xl md:text-3xl text-white">
          {direction.icon}
        </div>
      </div>

      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
        {t(direction.titleKey)}
      </h3>

      <p className="text-sm sm:text-base text-gray-600 leading-7 group-hover:text-gray-800 transition-colors duration-300">
        {t(direction.descriptionKey)}
      </p>
    </div>
  </div>
);
