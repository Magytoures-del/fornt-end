"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HiCheckBadge, HiStar } from "react-icons/hi2";
import Image from "next/image";
import { AIRLINES, AIRLINE_GRID, LAYOUT } from "@/constants/flights";

/**
 * Verified Badge Component
 * Displays a verification badge for verified airlines
 *
 * @returns {JSX.Element} Verified badge component
 */
function VerifiedBadge() {
  return (
    <div className="absolute -top-2 -right-2 z-10" aria-label="Verified airline">
      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
        <HiCheckBadge className="w-4 h-4 text-white" aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * Airline Rating Component
 * Displays the airline rating with star icon
 *
 * @param {Object} props - Component props
 * @param {number} props.rating - Airline rating value
 * @returns {JSX.Element} Rating component
 */
function AirlineRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating}`}>
      <HiStar
        className="w-4 h-4 text-yellow-400 fill-current"
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-gray-600">{rating}</span>
    </div>
  );
}

/**
 * Airline Card Component
 * Individual airline card with logo, name, and rating
 *
 * @param {Object} props - Component props
 * @param {Object} props.airline - Airline data object
 * @param {number} props.index - Index for priority loading
 * @returns {JSX.Element} Airline card component
 */
function AirlineCard({ airline, index }) {
  const isPriority = index < AIRLINE_GRID.priorityCount;

  return (
    <article
      className="group relative bg-white rounded-2xl p-4 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      aria-label={`${airline.name} airline partner`}
    >
      {/* Verified badge */}
      {airline.verified && <VerifiedBadge />}

      {/* Logo container */}
      <div className="flex flex-col items-center justify-between h-full space-y-3">
        <div className="flex items-center justify-center w-full h-16 mb-2">
          <Image
            src={airline.logo}
            alt={`${airline.name} logo`}
            className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
            width={AIRLINE_GRID.logoSize.width}
            height={AIRLINE_GRID.logoSize.height}
            priority={isPriority}
          />
        </div>

        {/* Airline name */}
        <h3 className="text-sm font-medium text-gray-800 text-center line-clamp-2 mb-1">
          {airline.name}
        </h3>

        {/* Rating */}
        <AirlineRating rating={airline.rating} />
      </div>
    </article>
  );
}

/**
 * Section Header Component
 * Displays the section title, subtitle, and badge
 *
 * @param {Object} props - Component props
 * @param {string} props.badgeText - Badge text
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @returns {JSX.Element} Section header component
 */
function SectionHeader({ badgeText, title, description }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-700 text-sm font-semibold border border-green-200/50 mb-6">
        <HiCheckBadge className="w-4 h-4 text-green-500" aria-hidden="true" />
        {badgeText}
      </div>
      <h2 id="partners-heading" className="text-3xl font-bold text-gray-800 mb-4">
        {title}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
    </div>
  );
}

/**
 * Partners Section Component
 *
 * Displays partner airlines with their logos, ratings, and verification badges.
 * Showcases trusted airline partners available through the platform.
 *
 * @returns {JSX.Element} The partners section component
 */
export default function PartnersSection() {
  const { t } = useTranslation();

  // Memoize translated content to prevent unnecessary re-renders
  const sectionContent = useMemo(
    () => ({
      badgeText: t("flights.partners.title"),
      title: t("flights.partners.subtitle"),
      description: t("flights.partners.description"),
      footerText: t("flights.partners.footer_text"),
    }),
    [t]
  );

  // Build container classes
  const containerClasses = `${LAYOUT.container.maxWidth} ${LAYOUT.container.padding}`;

  return (
    <section
      className="py-16 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="partners-heading"
    >
      <div className={containerClasses}>
        {/* Header */}
        <SectionHeader
          badgeText={sectionContent.badgeText}
          title={sectionContent.title}
          description={sectionContent.description}
        />

        {/* Airlines Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 lg:gap-6"
          role="list"
          aria-label="Partner airlines"
        >
          {AIRLINES.map((airline, index) => (
            <AirlineCard
              key={airline.id}
              airline={airline}
              index={index}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-sm text-gray-600">{sectionContent.footerText}</p>
        </footer>
      </div>
    </section>
  );
}
