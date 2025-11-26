"use client";

import { useEffect, useCallback, useMemo } from "react";
import SearchBar from "../search/SearchBar";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useWebSettings } from "@/hooks/useWebSettings";
import { useToast, ToastContainer } from "../common/Toast";
import { HERO_SECTION } from "@/constants/flights";

/**
 * Hero Content Component
 * Displays the title and subtitle for desktop view
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Hero title text
 * @param {string} props.subtitle - Hero subtitle text
 * @returns {JSX.Element} Hero content section
 */
function HeroContent({ title, subtitle }) {
  return (
    <div className="relative z-30 text-center max-w-6xl px-4 sm:px-6 lg:px-8 text-gray-600 hidden lg:block">
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-xl font-normal leading-relaxed opacity-90 drop-shadow-md max-w-4xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/**
 * Hero Section Component
 *
 * Main hero section displaying:
 * - Background image with responsive heights
 * - Title and subtitle (desktop only)
 * - Search bar for flight search
 * - Error toast notifications
 *
 * @returns {JSX.Element} The hero section component
 */
export default function HeroSection() {
  const { t } = useTranslation();
  const { error } = useWebSettings();
  const { toasts, showToast, removeToast } = useToast();

  // Memoize translated content to prevent unnecessary re-renders
  const heroContent = useMemo(
    () => ({
      title: t("flights.hero.title"),
      subtitle: t("flights.hero.subtitle"),
      backgroundAlt: t("flights.hero.background_alt"),
    }),
    [t]
  );

  /**
   * Handles error display via toast notification
   * Only shows toast when error exists
   */
  const handleError = useCallback(() => {
    if (error) {
      showToast(
        t("common.settings_error"),
        "error",
        HERO_SECTION.TOAST.duration
      );
    }
  }, [error, showToast, t]);

  useEffect(() => {
    handleError();
  }, [handleError]);

  return (
    <section
      className={`relative min-h-[${HERO_SECTION.HEIGHTS.mobile}] sm:min-h-[${HERO_SECTION.HEIGHTS.tablet}] lg:min-h-[${HERO_SECTION.HEIGHTS.desktop}] w-full flex flex-col items-center justify-center ${HERO_SECTION.MARGINS.mobile} ${HERO_SECTION.MARGINS.tablet}`}
      aria-label="Hero section with flight search"
    >
      {/* Background Image */}
      <Image
        src={HERO_SECTION.IMAGE.src}
        alt={heroContent.backgroundAlt}
        fill
        priority
        sizes={HERO_SECTION.IMAGE.sizes}
        className="object-cover object-center sm:object-bottom z-10"
        quality={HERO_SECTION.IMAGE.quality}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Hero Content - Desktop Only */}
      <HeroContent title={heroContent.title} subtitle={heroContent.subtitle} />

      {/* Search Bar Container */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-0 relative z-30">
        <SearchBar />
      </div>
    </section>
  );
}
