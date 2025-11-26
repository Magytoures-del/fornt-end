"use client";
import { useTranslation } from "react-i18next";
import { FaUsers, FaMapMarkedAlt, FaHeadset, FaStar } from "react-icons/fa";

const stats = [
  {
    id: 1,
    icon: FaUsers,
    numberKey: "aboutPage.stats.customers.number",
    labelKey: "aboutPage.stats.customers.label",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    id: 2,
    icon: FaMapMarkedAlt,
    numberKey: "aboutPage.stats.destinations.number",
    labelKey: "aboutPage.stats.destinations.label",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    id: 3,
    icon: FaHeadset,
    numberKey: "aboutPage.stats.support.number",
    labelKey: "aboutPage.stats.support.label",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
  },
  {
    id: 4,
    icon: FaStar,
    numberKey: "aboutPage.stats.rating.number",
    labelKey: "aboutPage.stats.rating.label",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
];

export default function Statistics() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`group relative bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="text-2xl md:text-3xl text-white" />
                  </div>

                  {/* Number */}
                  <div className="mb-2">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {t(stat.numberKey)}
                    </h3>
                  </div>

                  {/* Label */}
                  <p className="text-sm md:text-base text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-300">
                    {t(stat.labelKey)}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

