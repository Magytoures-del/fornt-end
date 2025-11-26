"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import { urlFor } from "@/services/sanity";
import { useState, useCallback, useEffect } from "react";
import {
  RiMapPin2Fill,
  RiPlayFill,
  RiHeartLine,
  RiShareLine,
} from "react-icons/ri";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Thumbs,
  FreeMode,
  EffectFade,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";

// Constants
const TRANSITION_DURATION = 800;
const AUTO_ROTATE_INTERVAL = 6000;

// Enhanced Backdrop Component with Glassmorphism
const GlassmorphismCard = ({
  children,
  className = "",
  blur = "backdrop-blur-md",
}) => (
  <div className={`relative ${className}`}>
    <div
      className={`absolute inset-0 bg-white/10 ${blur} rounded-xl sm:rounded-2xl border border-white/20 shadow-xl sm:shadow-2xl`}
    />
    <div className="relative p-4 sm:p-6">{children}</div>
  </div>
);

// Animated Loading Skeleton
const LoadingFallback = ({ t }) => (
  <div className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />

    <div className="relative z-30 text-center max-w-5xl px-6">
      <GlassmorphismCard className="animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-white/20 rounded-xl mx-auto max-w-md animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg mx-auto max-w-lg animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg mx-auto max-w-sm animate-pulse"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-12 w-32 bg-white/20 rounded-xl animate-pulse"></div>
            <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  </div>
);

// Enhanced Error State
const ErrorFallback = ({ t }) => (
  <div className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-rose-900 to-pink-900">
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />

    <div className="relative z-30 text-center max-w-4xl px-6">
      <GlassmorphismCard>
        <div className="space-y-6">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {t("packages.error.title")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            {t("packages.error.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {t("packages.error.retry")}
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              {t("packages.error.back")}
            </button>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  </div>
);

// Enhanced No Offer State
const NoOfferPlaceholder = ({ t }) => (
  <div className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[100vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />

    <div className="relative z-30 text-center max-w-5xl px-6">
      <GlassmorphismCard>
        <div className="space-y-6">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {t("packages.explore")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
            {t("packages.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {t("packages.refresh")}
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              {t("packages.browse")}
            </button>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  </div>
);

// Enhanced Thumbnail Navigation with Swiper
const ThumbnailNavigation = ({
  images,
  activeIndex,
  onThumbnailClick,
  setThumbsSwiper,
  t,
}) => {
  if (!images || images.length <= 1) return null;

  return (
    <div className="absolute bottom-4 sm:bottom-6 lg:bottom-1 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 xl:right-8 2xl:right-12 z-30 w-full lg:w-auto max-w-[90vw] lg:max-w-none">
      {/* Gallery Title */}
      <div className="text-white/80 text-sm font-medium mb-3 text-center lg:text-left">
        {t("packages.hero.gallery")}
      </div>

      {/* Mobile and Tablet: Horizontal Swiper */}
      <div className="lg:hidden">
        <div className="relative px-10">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            className="thumbnail-swiper-mobile"
            breakpoints={{
              320: {
                slidesPerView: 4,
                spaceBetween: 8,
              },
              480: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 6,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 7,
                spaceBetween: 12,
              },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image._key || index}>
                <button
                  onClick={() => onThumbnailClick(index)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-white/30 ${
                    index === activeIndex
                      ? "border-white scale-110 shadow-2xl ring-4 ring-white/30"
                      : "border-white/30 hover:border-white/60 hover:scale-105"
                  }`}
                >
                  {image?.image?.asset && (
                    <Image
                      src={urlFor(image.image).width(150).height(150).url()}
                      alt={t("packages.hero.image", { index: index + 1 })}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      quality={80}
                      sizes="(max-width: 640px) 64px, 80px"
                    />
                  )}
                  {/* Active indicator */}
                  {index === activeIndex && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}
                  {/* Image counter */}
                  <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {index + 1}
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons for Mobile */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: Vertical Swiper */}
      <div className="hidden lg:block">
        <div className="relative h-[350px] xl:h-[400px] 2xl:h-[450px]">
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="vertical"
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            navigation={{
              nextEl: ".swiper-button-next-custom-desktop",
              prevEl: ".swiper-button-prev-custom-desktop",
            }}
            className="thumbnail-swiper-desktop h-full"
            breakpoints={{
              1024: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1536: {
                slidesPerView: 6,
                spaceBetween: 12,
              },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image._key || index}>
                <button
                  onClick={() => onThumbnailClick(index)}
                  className={`relative w-16 h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20 rounded-xl overflow-hidden border-2 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-white/30 ${
                    index === activeIndex
                      ? "border-white scale-110 shadow-2xl ring-4 ring-white/30"
                      : "border-white/30 hover:border-white/60 hover:scale-105"
                  }`}
                >
                  {image?.image?.asset && (
                    <Image
                      src={urlFor(image.image).width(120).height(120).url()}
                      alt={t("packages.hero.image", { index: index + 1 })}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      quality={80}
                      sizes="(max-width: 1024px) 64px, (max-width: 1280px) 72px, 80px"
                    />
                  )}
                  {/* Active indicator */}
                  {index === activeIndex && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}
                  {/* Image counter */}
                  <div className="absolute top-0.5 right-0.5 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded-full">
                    {index + 1}
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons for Desktop */}
          {images.length > 6 && (
            <>
              <button className="swiper-button-prev-custom-desktop absolute left-1/2 -translate-x-1/2 -top-10 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-1.5 rounded-full transition-all duration-300 hover:scale-110">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button className="swiper-button-next-custom-desktop absolute left-1/2 -translate-x-1/2 -bottom-10 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-1.5 rounded-full transition-all duration-300 hover:scale-110">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ t, offer, currentLanguage }) => {
  const handleShare = async () => {
    const shareData = {
      title:
        offer?.titleHeader?.[currentLanguage] ||
        t("packages.hero.title", "اكتشف باقاتنا"),
      text: `${
        offer?.titleHeader?.[currentLanguage] ||
        t("packages.hero.title", "اكتشف باقاتنا")
      } - ${offer?.duration} ليالي\n${offer?.map?.[currentLanguage] || ""}`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);

        // Show success message (you can customize this)
        alert(t("packages.hero.shareSuccess"));
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        // Fallback: Copy URL only
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert(t("packages.hero.shareSuccess"));
        } catch (clipboardError) {
          console.error("Share failed:", clipboardError);
          alert(t("packages.hero.shareError"));
        }
      }
    }
  };

  return (
    <div className="absolute top-20 sm:top-6 lg:top-8 xl:top-10 right-4 sm:right-6 lg:right-8 xl:right-10 z-30 flex gap-2 sm:gap-3">
      {/* <button
        className="group bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2.5 sm:p-3 lg:p-3 rounded-xl sm:rounded-xl transition-all duration-300 hover:scale-110 border border-white/10 hover:border-white/30"
        aria-label={t("packages.hero.favorite")}
      >
        <RiHeartLine className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 group-hover:text-red-400 transition-colors duration-300" />
      </button> */}
      <button
        onClick={handleShare}
        className="group bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2.5 sm:p-3 lg:p-3 rounded-xl sm:rounded-xl transition-all duration-300 hover:scale-110 border border-white/10 hover:border-white/30"
        aria-label={t("packages.hero.share")}
      >
        <RiShareLine className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 group-hover:text-blue-400 transition-colors duration-300" />
      </button>
    </div>
  );
};

// Progress Indicator
const ProgressIndicator = ({
  currentIndex,
  totalImages,
  isAutoRotating,
  t,
}) => (
  <div className="absolute top-20 sm:top-auto sm:bottom-6 lg:bottom-8 xl:bottom-10 left-4 sm:left-6 lg:left-8 xl:left-10 z-30">
    <div className="bg-black/60 backdrop-blur-md rounded-xl sm:rounded-xl p-2.5 sm:p-3 lg:p-3 border border-white/10">
      <div className="text-white/90 text-xs sm:text-sm lg:text-sm font-medium mb-1.5 flex items-center gap-2">
        <span>
          {currentIndex + 1} / {totalImages}
        </span>
        {isAutoRotating && (
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] sm:text-xs lg:text-xs text-white/60">
              {t("packages.hero.autoPlay")}
            </span>
          </div>
        )}
      </div>
      <div className="w-28 sm:w-32 lg:w-36 h-1 sm:h-1.5 lg:h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-full transition-all duration-1000 ${
            isAutoRotating ? "animate-shimmer" : ""
          }`}
          style={{
            width: `${((currentIndex + 1) / totalImages) * 100}%`,
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    </div>
  </div>
);

export default function HeroSection({
  offer,
  isLoading = false,
  error = false,
}) {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);

  // Get current language
  const currentLanguage = i18n.language || "ar";

  // Auto-rotate functionality with pause on hover
  useEffect(() => {
    if (
      !offer?.images ||
      offer.images.length <= 1 ||
      !isAutoRotating ||
      !mainSwiper
    )
      return;

    const interval = setInterval(() => {
      if (mainSwiper && !mainSwiper.destroyed) {
        mainSwiper.slideNext();
      }
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [offer?.images, isAutoRotating, mainSwiper]);

  // Handle thumbnail click with callback optimization
  const handleThumbnailClick = useCallback(
    (index) => {
      if (mainSwiper && !mainSwiper.destroyed) {
        mainSwiper.slideTo(index);
      }
      setActiveIndex(index);
      setIsAutoRotating(false);

      // Resume auto-rotation after 30 seconds
      setTimeout(() => setIsAutoRotating(true), 30000);
    },
    [mainSwiper]
  );

  // Handle mouse events for auto-rotation
  const handleMouseEnter = useCallback(() => setIsAutoRotating(false), []);
  const handleMouseLeave = useCallback(() => setIsAutoRotating(true), []);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingFallback t={t} />;
  }

  // Error state
  if (error) {
    return <ErrorFallback t={t} />;
  }

  // No offer state
  if (!offer) {
    return <NoOfferPlaceholder t={t} />;
  }

  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="banner"
      aria-label={t("packages.hero.section")}
    >
      {/* Enhanced Background Image with Swiper */}
      <div className="absolute inset-0 z-0">
        {offer?.images && offer.images.length > 0 && (
          <Swiper
            onSwiper={setMainSwiper}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            speed={TRANSITION_DURATION}
            effect="fade"
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[Thumbs, Navigation, Pagination, EffectFade]}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {offer.images.map((image, index) => (
              <SwiperSlide key={image._key || index}>
                <div className="relative w-full h-full">
                  {image?.image?.asset && (
                    <>
                      <Image
                        src={urlFor(image.image).width(1920).height(1080).url()}
                        alt={
                          offer?.titleHeader?.[currentLanguage] ||
                          t("packages.hero.backgroundImage")
                        }
                        fill
                        className={`object-cover transition-all duration-${TRANSITION_DURATION} ${
                          imageLoaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-110"
                        }`}
                        priority={index === 0}
                        quality={80}
                        sizes="100vw"
                        onLoad={handleImageLoad}
                      />
                      {/* Enhanced loading placeholder */}
                      {!imageLoaded && index === 0 && (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 animate-pulse" />
                      )}
                    </>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Enhanced Multi-layer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

        {/* Center focus gradient for better text readability */}
        <div
          className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-transparent"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        {/* Animated background pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons t={t} offer={offer} currentLanguage={currentLanguage} />

      {/* Progress Indicator */}
      {offer?.images && offer.images.length > 1 && (
        <ProgressIndicator
          currentIndex={activeIndex}
          totalImages={offer.images.length}
          isAutoRotating={isAutoRotating}
          t={t}
        />
      )}

      {/* Enhanced Main Content with Better Positioning */}
      <div className="relative z-30 flex items-center justify-center min-h-[70vh] sm:min-h-[80vh] lg:min-h-[100vh] w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Enhanced Main Heading with Better Background */}
            <div className="animate-fade-in">
              <div className="relative inline-block">
                {/* Background blur effect for title */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl transform scale-110" />
                <div className="relative px-4 sm:px-6 lg:px-5 xl:px-5 py-3 sm:py-4 lg:py-5 xl:py-6">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl">
                    {offer?.titleHeader?.[currentLanguage] ||
                      t("packages.hero.title")}
                    <span className="block sm:inline text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl font-semibold text-white/90 mt-2 sm:mt-0">
                      / {offer?.duration - 1} {t("packages.hero.days")}
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Enhanced Subtitle with Better Contrast */}
            <div className=" delay-300">
              <div className="relative inline-block max-w-3xl lg:max-w-4xl">
                {/* Enhanced glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60 backdrop-blur-md rounded-2xl sm:rounded-3xl" />
                <div className="relative px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                    <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl font-medium leading-relaxed text-white/95 drop-shadow-lg">
                      {offer?.map?.[currentLanguage] ||
                        t("packages.hero.subtitle")}
                    </p>
                    <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-2xl">
                      <RiMapPin2Fill className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-white drop-shadow-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Call to Action Buttons */}
            <div className=" delay-500 pt-2 sm:pt-4 lg:pt-6">
              <div className="flex  flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => {
                    const nextSection =
                      document.querySelector('section:not([role="banner"])') ||
                      document.querySelector('[data-section="next"]') ||
                      document.querySelector("main > *:nth-child(2)");
                    if (nextSection) {
                      nextSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    } else {
                      // Fallback: scroll down by viewport height
                      window.scrollTo({
                        top: window.innerHeight,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 text-sm sm:text-base lg:text-lg xl:text-lg"
                >
                  <span className="relative">
                    {t("packages.hero.learnMore")}
                  </span>
                </button>
                <a
                  href={`https://wa.me/1234567890?text=${encodeURIComponent(
                    t("packages.hero.whatsappMessage", {
                      title:
                        offer?.titleHeader?.[currentLanguage] ||
                        t("packages.hero.title"),
                    })
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg xl:text-lg inline-flex"
                >
                  {/* Button hover effect */}
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <svg
                    className="relative w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span className="relative">{t("packages.hero.bookNow")}</span>
                </a>
              </div>
            </div>

            {/* Optional: Add package highlights */}
            {offer?.highlights && (
              <div className="animate-fade-in delay-700 pt-4 sm:pt-6 lg:pt-8">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
                  {offer.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-md px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-full border border-white/20 text-white/90 text-xs sm:text-sm lg:text-sm"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Thumbnail Navigation */}
      <ThumbnailNavigation
        images={offer?.images}
        activeIndex={activeIndex}
        onThumbnailClick={handleThumbnailClick}
        setThumbsSwiper={setThumbsSwiper}
        t={t}
      />
    </section>
  );
}
