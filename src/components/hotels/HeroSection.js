"use client";

import HotelSearchBar from "./HotelSearchBar";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useWebSettings } from "@/hooks/useWebSettings";

export default function HeroSection() {
  const { t } = useTranslation();


  return (
    <div className="relative min-h-[0vh] sm:min-h-[70vh] lg:min-h-[80vh] w-full flex flex-col items-center justify-center mt-16 sm:mt-20">
      {/* Background with overlay using next/image for optimization */}
      <Image
        src="/heroSection.png"
        alt={t("hotels.hero.background_alt")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center sm:object-bottom z-10"
        quality={80}
        style={{ pointerEvents: "none" }}
      />

 

    

      {/* Content */}
      <div className="relative z-30 text-center max-w-6xl px-4 sm:px-6 lg:px-8 text-gray-600 hidden lg:block">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight drop-shadow-lg">
            {t("hotels.hero.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl font-normal leading-relaxed opacity-90 drop-shadow-md max-w-4xl mx-auto">
            {t("hotels.hero.subtitle")}
          </p>
        </div>
      </div>
      <div
        className="relative z-30 w-full max-w-7xl px-4 sm:px-6 lg:px-0"
        style={{ pointerEvents: "auto" }}
      >
        <HotelSearchBar />
      </div>
    </div>
  );
}
