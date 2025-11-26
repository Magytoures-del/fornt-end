"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getScoial } from "@/services/apiOffers";
import { urlFor } from "@/services/sanity";

export default function ContactInfo() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage === "ar";
  const [social, setSocial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getScoial();

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.scoial && Array.isArray(result.scoial)) {
          setSocial(result.scoial);
        } else {
          setSocial([]);
        }
      } catch (err) {
        console.error("Failed to fetch social media links:", err);
        setError(err.message);
        setSocial([]);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const contactMethods = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: t("contact.info.methods.call.title"),
      value: t("footer.phone"),
      description: t("contact.info.methods.call.description"),
      action: "tel:+966920014937",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: t("contact.info.methods.email.title"),
      value: "contact@flymoonsa.com",
      description: t("contact.info.methods.email.description"),
      action: "mailto:contact@flymoonsa.com",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: t("contact.info.methods.location.title"),
      value: t("contact.info.methods.location.address"),
      description: t("contact.info.methods.location.description"),
      action:
        "https://www.google.com/maps?ll=21.410776,39.867062&z=16&t=m&hl=ar&gl=EG&mapclient=embed&cid=7439885854047348705",
    },
  ];

  const businessHours = [
    {
      day: t("contact.info.business_hours.sunday.day"),
      hours: t("contact.info.business_hours.sunday.hours"),
    },
    {
      day: t("contact.info.business_hours.monday.day"),
      hours: t("contact.info.business_hours.monday.hours"),
    },
    {
      day: t("contact.info.business_hours.tuesday.day"),
      hours: t("contact.info.business_hours.tuesday.hours"),
    },
    {
      day: t("contact.info.business_hours.wednesday.day"),
      hours: t("contact.info.business_hours.wednesday.hours"),
    },
    {
      day: t("contact.info.business_hours.thursday.day"),
      hours: t("contact.info.business_hours.thursday.hours"),
    },
    {
      day: t("contact.info.business_hours.friday.day"),
      hours: t("contact.info.business_hours.friday.hours"),
    },
    {
      day: t("contact.info.business_hours.saturday.day"),
      hours: t("contact.info.business_hours.saturday.hours"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {t("contact.info.title")}
        </h3>

        <div className="space-y-6">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 rtl:space-x-reverse"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {method.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {method.title}
                </h4>
                <a
                  href={method.action}
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg block mb-1 transition-colors"
                >
                  {method.value}
                </a>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {t("contact.info.social_media")}
        </h3>

        <p className="text-gray-600 mb-6">
          {t("contact.info.social_description")}
        </p>

        {/* <div className="flex gap-5 rtl:space-x-reverse flex-wrap justify-start">
          {isLoading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <div key={i} className=" bg-gray-200 rounded-lg animate-pulse" />
            ))
          ) : error ? (
            <div className="text-red-500 text-sm">
              {t(
                "contact.info.socialError",
                "Unable to load social media links"
              )}
            </div>
          ) : social.length === 0 ? (
            <div className="text-gray-500 text-sm">
              {t("contact.info.noSocial", "No social media links available")}
            </div>
          ) : (
            social.map((data, index) => {
              // Validate required fields
              if (!data?.url || !data?.imgUrl?.asset) {
                return null;
              }

              return (
                <motion.a
                  key={data._id || index}
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.15,
                    y: -4,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative  backdrop-blur-md bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-blue-400/50 transition-all duration-500 group"
                  aria-label={data.imgUrl?.alt || `Social Media ${index + 1}`}
                >
                  {/* Hover gradient background */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div> */}

        {/* Social media icon */}
        {/* <Image
                    className="object-cover relative z-10 group-hover:scale-110 transition-transform duration-300 w-6 h-6"
                    src={urlFor(data.imgUrl.asset).url()}
                    alt={data.imgUrl?.alt || `Social Media ${index + 1}`}
                    loading="lazy"
                    width={24}
                    height={24}
                    onError={(e) => {
                      // Fallback to a default icon if image fails to load
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }} */}
        {/* /> */}

        {/* Fallback icon if image fails to load */}
        {/* <div
                    className="hidden w-6 h-6 items-center justify-center text-white"
                    style={{ display: "none" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div> */}

        {/* Sparkle effect on hover */}
        <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Tooltip */}
        {/* <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    {data.imgUrl?.alt || `Social Media ${index + 1}`}
                  </div> */}
        {/* </motion.a>
              );
            })
          )} */}
        {/* </div> */}
      </div>
    </div>
  );
}
