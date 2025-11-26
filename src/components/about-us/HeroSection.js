"use client";
import Image from "next/image";
// You can change this to any image in your assets folder or use an external URL
// Options: "@/assets/contact-us.jpg" or "@/assets/contact-us-old.jpg"
import heroImage from "@/assets/contact-us.jpg";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with better positioning */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={t("about_us.hero_heading")}
          fill
          className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-700"
          priority
          quality={90}
        />
      </div>

      {/* Enhanced Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30 z-10" />

      {/* Content with better styling */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl leading-tight">
            <span className="block mb-3">{t("about_us.hero_heading")}</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("about_us.company_name")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            {t("about_us.hero_overview")}
          </p>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20"></div>
    </section>
  );
}
