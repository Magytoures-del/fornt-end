"use client";
import { useTranslation } from "react-i18next";
import {
  FaGem,
  FaUserTie,
  FaHeart,
  FaHandshake,
  FaAward,
  FaGlobe,
} from "react-icons/fa";

const advantages = [
  {
    id: 1,
    icon: FaGem,
    titleKey: "aboutPage.advantages.quality.title",
    descriptionKey: "aboutPage.advantages.quality.description",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    id: 2,
    icon: FaUserTie,
    titleKey: "aboutPage.advantages.team.title",
    descriptionKey: "aboutPage.advantages.team.description",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    id: 3,
    icon: FaHeart,
    titleKey: "aboutPage.advantages.personal.title",
    descriptionKey: "aboutPage.advantages.personal.description",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
  },
  {
    id: 4,
    icon: FaHandshake,
    titleKey: "aboutPage.advantages.partnerships.title",
    descriptionKey: "aboutPage.advantages.partnerships.description",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    id: 5,
    icon: FaAward,
    titleKey: "aboutPage.advantages.awards.title",
    descriptionKey: "aboutPage.advantages.awards.description",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
  },
  {
    id: 6,
    icon: FaGlobe,
    titleKey: "aboutPage.advantages.global.title",
    descriptionKey: "aboutPage.advantages.global.description",
    gradient: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-50 to-cyan-50",
  },
];

export default function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("aboutPage.advantages.title")}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("aboutPage.advantages.subtitle")}
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div
                key={advantage.id}
                className={`group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${advantage.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${advantage.gradient} mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <Icon className="text-xl md:text-2xl text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {t(advantage.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {t(advantage.descriptionKey)}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

