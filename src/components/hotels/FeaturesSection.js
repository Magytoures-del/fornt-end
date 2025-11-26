"use client";

import { useTranslation } from "react-i18next";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: "🏨",
      title: t("hotels.why_flymoon.features.diverse_hotels.title"),
      description: t("hotels.why_flymoon.features.diverse_hotels.description"),
      bgGradient: "from-blue-500 to-cyan-500",
      bgLight: "from-blue-50 to-cyan-50",
      shadowColor: "shadow-blue-500/20",
      hoverShadow: "group-hover:shadow-blue-500/40",
    },
    {
      icon: "🔍",
      title: t("hotels.why_flymoon.features.easy_booking.title"),
      description: t("hotels.why_flymoon.features.easy_booking.description"),
      bgGradient: "from-purple-500 to-pink-500",
      bgLight: "from-purple-50 to-pink-50",
      shadowColor: "shadow-purple-500/20",
      hoverShadow: "group-hover:shadow-purple-500/40",
    },
    {
      icon: "💰",
      title: t("hotels.why_flymoon.features.best_prices.title"),
      description: t("hotels.why_flymoon.features.best_prices.description"),
      bgGradient: "from-emerald-500 to-teal-500",
      bgLight: "from-emerald-50 to-teal-50",
      shadowColor: "shadow-emerald-500/20",
      hoverShadow: "group-hover:shadow-emerald-500/40",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
            <span className="text-white text-2xl">✨</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight">
            {t("hotels.why_flymoon.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("hotels.why_flymoon.subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg ${feature.shadowColor} hover:shadow-xl ${feature.hoverShadow} transition-all duration-500 hover:transform hover:-translate-y-2 border border-gray-100`}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgLight} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>

              {/* Icon */}
              <div className="relative flex justify-center mb-8">
                <div className="relative">
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${feature.bgGradient} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <span className="text-4xl filter drop-shadow-sm">
                      {feature.icon}
                    </span>
                  </div>
                  {/* Animated ring */}
                  <div
                    className={`absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br ${feature.bgGradient} opacity-20 scale-110 group-hover:scale-125 group-hover:opacity-30 transition-all duration-300`}
                  ></div>
                </div>
              </div>

              {/* Content */}
              <div className="relative text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight group-hover:text-gray-900 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Hover indicator */}
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.bgGradient} rounded-t-full group-hover:w-12 transition-all duration-300`}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-40"
                style={{
                  animationDelay: `${i * 200}ms`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


