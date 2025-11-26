"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import OfferCard from "./OfferCard";
import OfferCardSkeleton from "./OfferCardSkeleton";
import { getAllOffers, getOffers } from "@/services/apiOffers";

export const OFFER_SWIPER_BREAKPOINTS = {
  // Small mobile (320px)

  320: {
    slidesPerView: 1.15,
    spaceBetween: 12,
    centeredSlides: true,
  },
  // iPhone SE (375px)
  375: {
    slidesPerView: 1.1,
    spaceBetween: 15,
    centeredSlides: true,
  },
  // iPhone 6/7/8 Plus (414px)
  414: {
    slidesPerView: 1.25,
    spaceBetween: 15,
    centeredSlides: true,
  },
  // Small tablet (480px)
  480: {
    slidesPerView: 1.3,
    spaceBetween: 50,
    centeredSlides: true,
  },
  // Tablet (640px)
  640: {
    slidesPerView: 2.2,
    spaceBetween: 20,
    centeredSlides: false,
  },
  // iPad (768px)
  768: {
    slidesPerView: 3,
    spaceBetween: 20,
    centeredSlides: false,
  },
  // Desktop (1024px)
  1024: {
    slidesPerView: 3.5,
    spaceBetween: 25,
    centeredSlides: false,
  },
  // Large desktop (1280px)
  1280: {
    slidesPerView: 3.5,
    spaceBetween: 30,
    centeredSlides: false,
  },
};

export default function PackagesGrid({ filters }) {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePackages, setVisiblePackages] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      const offers = await getOffers(i18n.language);
      console.log(offers);
      setOffers(offers);
    };
    fetchOffers();
  }, [i18n.language]);
  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setPackages(offers);
      setLoading(false);
    }, 1000);
  }, [offers]);

  useEffect(() => {
    if (!filters) {
      setFilteredPackages(packages);
      return;
    }

    let filtered = packages;

    // Filter by destination
    if (filters.destination) {
      filtered = filtered.filter(
        (pkg) => pkg.destination === filters.destination
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map((p) => {
        if (p === "2000+") return [2000, Infinity];
        return parseInt(p);
      });

      if (filters.priceRange === "2000+") {
        filtered = filtered.filter((pkg) => pkg.discountPrice >= 2000);
      } else {
        filtered = filtered.filter(
          (pkg) => pkg.discountPrice >= min && pkg.discountPrice <= max
        );
      }
    }

    // Filter by duration
    if (filters.duration) {
      filtered = filtered.filter((pkg) => {
        const duration = parseInt(pkg.duration);
        switch (filters.duration) {
          case "1-3":
            return duration >= 1 && duration <= 3;
          case "4-7":
            return duration >= 4 && duration <= 7;
          case "8-14":
            return duration >= 8 && duration <= 14;
          case "15+":
            return duration >= 15;
          default:
            return true;
        }
      });
    }

    // Filter by package type
    if (filters.packageType) {
      filtered = filtered.filter(
        (pkg) => pkg.packageType === filters.packageType
      );
    }

    // Sort packages
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "price-low":
            return a.discountPrice - b.discountPrice;
          case "price-high":
            return b.discountPrice - a.discountPrice;
          case "rating":
            return b.rating - a.rating;
          case "duration":
            return parseInt(a.duration) - parseInt(b.duration);
          default:
            return b.reviews - a.reviews; // popular
        }
      });
    }

    setFilteredPackages(filtered);
  }, [filters, packages]);

  const loadMorePackages = () => {
    setVisiblePackages((prev) => prev + 6);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-center items-center mb-8">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 text-center">
            {t("packages.featured_tours", "Our Featured Tours")}
          </h2>
          <p className="text-gray-600 text-center text-sm lg:text-base">
            {t(
              "packages.favorite_destinations",
              "Favorite destinations based on customer reviews"
            )}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="w-full" aria-busy="true">
          {/* Mobile Loading Swiper */}
          <div className="md:hidden relative">
            <Swiper
              modules={[Navigation, Pagination]}
              breakpoints={OFFER_SWIPER_BREAKPOINTS}
              navigation={false}
              pagination={false}
              className="packages-swiper"
            >
              {[...Array(6)].map((_, index) => (
                <SwiperSlide key={index}>
                  <OfferCardSkeleton />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop Loading Grid */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full gap-5">
              {[...Array(8)].map((_, index) => (
                <OfferCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      ) : filteredPackages.length === 0 ? (
        // Empty State
        <div className="flex justify-center items-center py-16">
          <span className="text-lg text-gray-500">
            {t(
              "packages.no_results",
              "No packages found matching your criteria."
            )}
          </span>
        </div>
      ) : (
        <>
          {/* Mobile Swiper View */}
          {isMobile ? (
            <div className="md:hidden relative">
              <Swiper
                modules={[Navigation, Pagination]}
                breakpoints={OFFER_SWIPER_BREAKPOINTS}
                navigation={false}
                pagination={false}
                className="packages-swiper"
              >
                {filteredPackages.map((offer, index) => (
                  <SwiperSlide key={offer.id || index}>
                    <OfferCard offer={offer} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            /* Desktop Grid View */
            <div className="hidden md:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full gap-5">
                {filteredPackages
                  .slice(0, visiblePackages)
                  .map((offer, index) => (
                    <OfferCard key={offer._id || index} offer={offer} />
                  ))}
              </div>

              {/* Load More Button - Only for Desktop */}
              {visiblePackages < filteredPackages.length && (
                <div className="text-center">
                  <button
                    onClick={loadMorePackages}
                    className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2 mx-auto"
                    aria-label={t(
                      "packages.load_more_tours",
                      "Load More Tours"
                    )}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    {t("packages.load_more_tours", "Load More Tours")}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
