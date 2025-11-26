"use client";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";

export default function Introduction() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100 mb-4">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("aboutPage.introduction.badge")}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t("aboutPage.introduction.title")}
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {t("aboutPage.introduction.description")}
            </p>

            {/* Key Points */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 mt-1">
                  <FaCheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-base md:text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {t("aboutPage.services.title")}
                </p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 mt-1">
                  <FaCheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-base md:text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {t("aboutPage.stats.support.label")}
                </p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 mt-1">
                  <FaCheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-base md:text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {t("aboutPage.advantages.team.title")}
                </p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 mt-1">
                  <FaCheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-base md:text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {t("aboutPage.advantages.quality.title")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-2xl transform hover:scale-105 transition-transform duration-500">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 border-4 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-white rounded-full"></div>
              </div>

              {/* Content overlay */}
              <div className="relative z-10 text-white">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-3xl font-bold">✈️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Travel Excellence</h3>
                      <p className="text-white/80">Since 2020</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold">+10K</div>
                      <div className="text-sm text-white/80">Happy Customers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="text-3xl font-bold">+50</div>
                      <div className="text-sm text-white/80">Destinations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

