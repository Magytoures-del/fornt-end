"use client";
import { getScoial } from "@/services/apiOffers";
import { urlFor } from "@/services/sanity";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from "react-icons/hi2";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-4">
              <Image
                src="/light-logo.png"
                width={120}
                height={120}
                alt={t("footer.logoAlt", "Flymoon Travel Logo")}
                className="w-32 h-32"
              />
              <p className="text-gray-300 max-w-sm">
                {t(
                  "footer.about",
                  "Experience the world with Flymoon Travel - your trusted partner for unforgettable journeys."
                )}
              </p>

              {/* Social Media */}
              {/* <SocialMedia /> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {t("footer.quickLinksTitle", "Quick Links")}
            </h3>
            <ul className="space-y-2">
              {/* <li>
                <Link
                  href="/flights"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.nav.flights", "Flights")}
                </Link>
              </li> */}
              <li>
                <Link
                  href="/packages"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.nav.packages", "Packages")}
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/hotels"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.nav.hotels", "Hotels")}
                </Link>
              </li> */}
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.nav.aboutUs", "About Us")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.nav.contact", "Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {t("footer.contactTitle", "Contact Us")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="w-4 h-4 text-blue-400" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label={t("footer.phoneLabel", "Call us")}
                >
                  {t("footer.phone", "+1234567890")}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineEnvelope className="w-4 h-4 text-blue-400" />
                <a
                  href="mailto:contact@flymoonsa.com"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label={t("footer.emailLabel", "Email us")}
                >
                  {t("footer.email", "contact@flymoonsa.com")}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineMapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  {t("footer.address", "Makkah, Saudi Arabia")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm">
              {t(
                "footer.copyright",
                "© {{year}} Flymoon Travel. All rights reserved.",
                { year: new Date().getFullYear() }
              )}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/terms-and-conditions"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.termsAndConditions", "Terms & Conditions")}
              </Link>
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.privacyPolicy", "Privacy Policy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SocialMedia = () => {
  const { t } = useTranslation();
  const [social, setSocial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const result = await getScoial();
        if (result.scoial && Array.isArray(result.scoial)) {
          setSocial(result.scoial);
        }
      } catch (error) {
        console.error("Failed to fetch social media:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSocial();
  }, []);

  if (isLoading) {
    return (
      <div className="flex gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-white/10 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (social.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-4 mt-6">
      {social.map((item, index) => {
        if (!item?.url || !item?.imgUrl?.asset) {
          return null;
        }

        return (
          <a
            key={item._id || index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={
              t("footer.socialMediaLink", "Follow us on social media") +
              ` ${index + 1}`
            }
          >
            <Image
              src={urlFor(item.imgUrl.asset).url()}
              alt={
                item.imgUrl?.alt ||
                t("footer.socialMediaIcon", "Social Media Icon")
              }
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
          </a>
        );
      })}
    </div>
  );
};
