"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "@/services/sanity";

export default function ThumbnailNavigation({
  offers,
  activeIndex,
  onThumbnailClick,
  t,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!offers || offers.length <= 1) return null;

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return null;
  }

  return (
    <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 right-6 sm:right-8 lg:right-10 z-30">
      <div
        className="flex gap-3 p-3 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
        role="tablist"
        aria-label={t("packages.hero.thumbnailNavigation", "معرض الصور")}
      >
        {offers.map((offer, index) => (
          <button
            key={offer?.id || index}
            onClick={() => onThumbnailClick(index)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`${t("packages.hero.viewOffer", "عرض العرض")} ${
              index + 1
            }`}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 
              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group
              ${
                index === activeIndex
                  ? "border-white scale-105 shadow-xl ring-2 ring-white/40"
                  : "border-white/50 hover:border-white/80 hover:scale-105 shadow-md hover:shadow-lg"
              }`}
          >
            {offer?.poster?.asset && (
              <Image
                src={urlFor(offer?.poster)
                  .width(120)
                  .height(120)
                  .format("webp")
                  .quality(85)
                  .url()}
                alt={
                  offer?.title ||
                  t("packages.hero.offerImage", `عرض ${index + 1}`)
                }
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 64px, 80px"
                loading="lazy"
              />
            )}

            <div
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />

            {index === activeIndex && (
              <div
                className="absolute inset-0 bg-gradient-to-t from-blue-500/25 via-transparent to-blue-400/15 
                flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full shadow-md animate-pulse"></div>
              </div>
            )}

            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
              transition-opacity duration-200"
            >
              <div className="w-5 h-5 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
