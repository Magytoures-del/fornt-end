"use client";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { urlFor } from "@/services/sanity";
import { useState } from "react";

export default function HeroSection({ place }) {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Early return if no place data
  if (!place) {
    return (
      <section className="relative w-full min-h-[80vh] md:h-[100vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">{t("common.loading", "Loading...")}</p>
        </div>
      </section>
    );
  }

  const imageUrl = place?.imageBanner ? urlFor(place.imageBanner).url() : null;
  const placeName = place?.title || t("place.untitled", "Untitled Place");
  const placeDescription =
    place?.imageBanner?.title || place?.description || "";

  return (
    <section
      className="relative w-full min-h-[80vh] md:h-[100vh] flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label={t("place.hero_section_aria", "{{placeName}} hero section", {
        placeName,
      })}
    >
      {/* Background Image */}
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt={t(
            "place.destination_view_alt",
            "{{placeName}} destination view",
            { placeName }
          )}
          fill
          className={`object-cover transition-all duration-1000 ${
            imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
          priority
          quality={85}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          sizes="100vw"
        />
      ) : (
        // Fallback gradient background
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      )}

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/5 animate-pulse-subtle" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center md:items-start justify-center px-6 md:px-20 max-w-7xl mx-auto w-full">
        {/* Animated Accent Bar */}
        <div className="h-1 w-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded mb-4 md:mb-6 animate-expand-width shadow-lg shadow-blue-500/50" />

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 text-center md:text-left animate-slide-up-delayed">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-2xl">
            {placeName}
          </span>
        </h1>

        {/* Description */}
        {placeDescription && (
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl text-gray-100 text-center md:text-left leading-relaxed md:leading-relaxed mb-6 md:mb-8 animate-slide-up-more-delayed drop-shadow-lg">
            {placeDescription}
          </p>
        )}

        {/* Call to Action Button */}
        <div className="animate-slide-up-most-delayed">
          <button
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            aria-label={t("place.explore_aria", "Explore {{placeName}}", {
              placeName,
            })}
          >
            <span className="flex items-center gap-3">
              {t("place.explore_button", "Explore")}
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideUpDelayed {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUpMoreDelayed {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUpMostDelayed {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          0% {
            width: 0%;
          }
          100% {
            width: 4rem;
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes floatDelayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }

        @keyframes pulseSubtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-slide-up-delayed {
          animation: slideUpDelayed 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }

        .animate-slide-up-more-delayed {
          animation: slideUpMoreDelayed 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s
            both;
        }

        .animate-slide-up-most-delayed {
          animation: slideUpMostDelayed 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s
            both;
        }

        .animate-expand-width {
          animation: expandWidth 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }

        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 10s ease-in-out infinite 2s;
        }

        .animate-pulse-subtle {
          animation: pulseSubtle 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
