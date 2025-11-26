"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FEATURES, FEATURES_ANIMATION } from "@/constants/flights";

/**
 * Feature Card Component
 * Individual feature card with icon, title, and description
 *
 * @param {Object} props - Component props
 * @param {Object} props.feature - Feature data object
 * @param {number} props.index - Index for animation delay
 * @returns {JSX.Element} Feature card component
 */
function FeatureCard({ feature, index }) {
  const animationDelay = index * FEATURES_ANIMATION.delayMultiplier;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-8 shadow-lg ${feature.shadowColor} hover:shadow-xl ${feature.hoverShadow} transition-all duration-500 hover:transform hover:-translate-y-2 border border-gray-100`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.bgLight} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        aria-hidden="true"
      />

      {/* Icon */}
      <div className="relative flex justify-center mb-8">
        <div className="relative">
          <div
            className={`w-24 h-24 bg-gradient-to-br ${feature.bgGradient} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
          >
            <span className="text-4xl filter drop-shadow-sm" aria-hidden="true">
              {feature.icon}
            </span>
          </div>
          {/* Animated ring */}
          <div
            className={`absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br ${feature.bgGradient} opacity-20 scale-110 group-hover:scale-125 group-hover:opacity-30 transition-all duration-300`}
            aria-hidden="true"
          />
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
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Section Header Component
 * Displays the section title, subtitle, and decorative icon
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle
 * @returns {JSX.Element} Section header component
 */
function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-20">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6">
        <span className="text-white text-2xl" aria-hidden="true">
          ✨
        </span>
      </div>
      <h2
        id="features-heading"
        className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight"
      >
        {title}
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

/**
 * Decoration Dots Component
 * Decorative dots at the bottom of the section
 *
 * @returns {JSX.Element} Decoration dots component
 */
function DecorationDots() {
  return (
    <div className="flex justify-center mt-16">
      <div className="flex space-x-2">
        {Array.from({ length: FEATURES_ANIMATION.decorationCount }).map(
          (_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-40"
              style={{
                animationDelay: `${
                  index * FEATURES_ANIMATION.decorationDelayMultiplier
                }ms`,
              }}
              aria-hidden="true"
            />
          )
        )}
      </div>
    </div>
  );
}

/**
 * Features Section Component
 *
 * Displays key features/benefits of using Flymoon for flight bookings.
 * Features include diverse airlines, easy booking, and lowest prices.
 *
 * @returns {JSX.Element} The features section component
 */
export default function FeaturesSection() {
  const { t } = useTranslation();

  /**
   * Get translated feature data
   * Memoized to prevent recalculation on every render
   */
  const features = useMemo(() => {
    return FEATURES.map((feature) => ({
      ...feature,
      title: t(`${feature.translationKey}.title`),
      description: t(`${feature.translationKey}.description`),
    }));
  }, [t]);

  // Memoize section header content
  const headerContent = useMemo(
    () => ({
      title: t("flights.why_flymoon.title"),
      subtitle: t("flights.why_flymoon.subtitle"),
    }),
    [t]
  );

  return (
    <section
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <SectionHeader
          title={headerContent.title}
          subtitle={headerContent.subtitle}
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom decoration */}
        <DecorationDots />
      </div>
    </section>
  );
}
