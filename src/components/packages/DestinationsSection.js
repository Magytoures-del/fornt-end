"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  getDestinations,
  getOffersLength,
  getPlacesData,
} from "../../services/apiOffers";
import { IoArrowForward } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
// import ShowMore from "../../ui/ShowMore";
import Image from "next/image";
import { urlFor } from "../../services/sanity";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const DestinationsSection = ({}) => {
  const [destinations, setDestinations] = useState([]);
  const [offerCounts, setOfferCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const swiperRef = useRef(null);
  console.log(destinations);
  useEffect(() => {
    const fetchDestinations = async () => {
      const destinations = await getDestinations(i18n.language);
      setDestinations(destinations);
    };
    fetchDestinations();
  }, [i18n.language]);

  console.log(destinations);
  const swiperProps = {
    slidesPerView: 1.3,
    spaceBetween: 15,
    centeredSlides: true,
    grabCursor: true,
    freeMode: true,
    modules: [Navigation],
    className: "offer-destinations-swiper",
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
    },
    breakpoints: {
      320: {
        slidesPerView: 1.3,
        spaceBetween: 10,
        centeredSlides: true,
      },
      375: {
        slidesPerView: 1.4,
        spaceBetween: 12,
        centeredSlides: true,
      },
      414: {
        slidesPerView: 1.5,
        spaceBetween: 15,
        centeredSlides: true,
      },
      480: {
        slidesPerView: 1.6,
        spaceBetween: 18,
        centeredSlides: true,
      },
      640: {
        slidesPerView: 2.5,
        spaceBetween: 20,
        centeredSlides: false,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 25,
        centeredSlides: false,
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 30,
        centeredSlides: false,
      },
    },
  };

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  useEffect(() => {
    const fetchAllOfferCounts = async () => {
      if (destinations.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const promises = destinations.map(async (destination) => {
          try {
            const { offerLength } = await getOffersLength(destination.id);
            return { id: destination.id, count: offerLength };
          } catch (error) {
            console.warn(
              `Failed to fetch offer count for destination ${destination.id}:`,
              error
            );
            return { id: destination.id, count: 0 };
          }
        });
        const results = await Promise.allSettled(promises);
        const counts = {};
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            counts[result.value.id] = result.value.count;
          }
        });
        setOfferCounts(counts);
      } catch (error) {
        console.error("Failed to fetch offer counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOfferCounts();
  }, [destinations]);

  if (destinations.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* <HeaderSection
        titleKey="popularDestinations.title"
        brefKey="popularDestinations.bref"
      /> */}
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

      <div className="relative">
        <Swiper {...swiperProps}>
          {destinations.map((destination, index) => (
            <SwiperSlide key={destination?.id || index}>
              <DestinationCard
                destination={destination}
                offerCount={offerCounts[destination.id] || 0}
                loading={loading}
                priority={index < 4}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="hidden md:block">
          <button
            onClick={handlePrevClick}
            className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 group"
            aria-label={t("common.previous_destination", "Previous destination")}
          >
            <IoMdArrowBack className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </button>
          <button
            onClick={handleNextClick}
            className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 group"
            aria-label={t("common.next_destination", "Next destination")}
          >
            <IoArrowForward className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">{/* <ShowMore /> */}</div>
    </div>
  );
};

export default DestinationsSection;

const DestinationCard = ({
  destination,
  offerCount,
  loading,
  priority = false,
}) => {
  const { i18n, t } = useTranslation();
  const lan = i18n.language;

  const renderImage = () => {
    if (!destination?.image) {
      return (
        <div className="relative h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-sm">{t("common.no_image", "No image")}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-full overflow-hidden">
        <Image
          src={urlFor(destination.image).url()}
          alt={destination?.title || t("common.destination", "Destination")}
          width={320}
          height={300}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          className="w-[320px] h-[300px] object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
    );
  };

  return (
    <Link href={`/place/${destination?.slug?.current || ""}`} className="">
      <article className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 hover:border-gray-200">
        {renderImage()}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

        {/* Decorative Corner */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <svg
            className="w-4 h-4 text-white"
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
        </div>

        {/* Bottom Content Overlay */}
        <div
          className={`absolute bottom-0 p-5 text-white group-hover:translate-y-0 transition-transform duration-300 ${
            lan === "ar"
              ? "left-1/2 right-1/2 transform translate-x-1/2"
              : "left-1/2 right-1/2 transform -translate-x-1/2"
          }`}
          style={{
            bottom: "0px",
            width: "200px",
          }}
        >
          <div className="backdrop-blur-sm bg-white/10 rounded-lg px-4 py-3 border border-white/20 max-w-xs mx-auto text-center">
            <h3 className="font-bold text-sm md:text-lg leading-tight mb-4 text-shadow-sm">
              {destination?.title}
            </h3>
            <div className="flex items-center justify-center gap-1 text-xs opacity-90">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("packages.explore_destination", "Explore This Destination in Detail")}</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-yellow-400/30 transition-all duration-300"></div>
      </article>
    </Link>
  );
};
