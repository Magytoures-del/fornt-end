"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineGift,
  HiOutlineAcademicCap,
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import ProfileDropdown from "./ProfileDropdown";
import AuthButton from "./AuthButton";
import LanguageSelector from "./LanguageSelector";

const ICON_MAP = {
  HiOutlineHome,
  HiOutlineGift,
  HiOutlineAcademicCap,
  HiOutlinePaperAirplane,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
  BiSolidPlaneAlt,
};

/**
 * Reusable Mobile Menu Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether menu is open
 * @param {function} props.onClose - Close handler
 * @param {boolean} props.isScrolled - Whether header is in scrolled state
 * @param {Array} props.navigation - Navigation items array
 * @param {function} props.onLoginClick - Handler for login button click
 * @param {string} props.className - Additional CSS classes
 */
export default function MobileMenu({
  isOpen = false,
  onClose,
  isScrolled = false,
  navigation = [],
  onLoginClick,
  className = "",
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 top-0 h-screen z-40 md:hidden animate-slide-in-top"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        className={`mobile-menu-panel ${
          isOpen ? "open" : "closed"
        } md:hidden fixed w-full  left-0 top-16 right-0 z-50 h-screen bg-white ${
          isScrolled
            ? "bg-gradient-to-b from-white via-white to-gray-50/50 border-b border-gray-200 shadow-2xl"
            : "bg-gradient-to-b from-gray-900 via-gray-900/98 to-gray-900/95 border-b border-blue-700/30 shadow-2xl backdrop-blur-xl"
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <div className="px-4 py-6 overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <nav className="flex flex-col space-y-2">
            {navigation.map((item, index) => {
              const IconComponent = ICON_MAP[item.icon] || HiOutlineGlobeAlt;

              // Check if the current path matches the item route
              const isActive =
                pathname === item.route ||
                (item.route !== "/" && pathname.startsWith(item.route));

              return (
                <Link
                  key={item.name}
                  href={item.route}
                  className={`mobile-menu-item group relative flex items-center gap-3 px-4 py-4  text-base font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isActive
                      ? isScrolled
                        ? `${
                            isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
                          } from-blue-50 to-purple-50 text-blue-700 ${
                            isRTL ? "border-r-4" : "border-l-4"
                          } border-blue-500 shadow-md`
                        : `${
                            isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
                          } from-blue-600/20 to-purple-600/20 text-white ${
                            isRTL ? "border-r-4" : "border-l-4"
                          } border-blue-400 shadow-lg`
                      : isScrolled
                      ? `text-gray-700 hover:text-blue-600 ${
                          isRTL
                            ? "hover:bg-gradient-to-l"
                            : "hover:bg-gradient-to-r"
                        } hover:from-blue-50/60 hover:to-purple-50/60 hover:shadow-lg hover:scale-[1.02]`
                      : `text-white hover:text-blue-200 ${
                          isRTL
                            ? "hover:bg-gradient-to-l"
                            : "hover:bg-gradient-to-r"
                        } hover:from-white/15 hover:to-white/5 hover:shadow-lg hover:scale-[1.02]`
                  }`}
                  onClick={onClose}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Background effects - enhanced */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${
                      isScrolled
                        ? `${
                            isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
                          } from-blue-50/90 to-purple-50/90`
                        : `${
                            isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
                          } from-white/15 to-white/8`
                    }`}
                  ></div>

                  {/* Hover glow effect - enhanced */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-md transform scale-110 ${
                      isScrolled
                        ? `${
                            isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
                          } from-blue-400/30 to-purple-400/30`
                        : `${
                            isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
                          } from-white/25 to-white/15`
                    }`}
                  ></div>

                  {/* Content */}
                  <div
                    className={`relative z-10 flex items-center gap-3 w-full ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {IconComponent && (
                      <div
                        className={`flex-shrink-0 transition-all duration-200 group-hover:scale-110 ${
                          isActive
                            ? isScrolled
                              ? "text-blue-600"
                              : "text-blue-300"
                            : isScrolled
                            ? "text-gray-600 group-hover:text-blue-600"
                            : "text-white group-hover:text-blue-200"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                    )}

                    <span
                      className={`font-semibold transition-colors duration-300 flex-1 ${
                        isActive
                          ? isScrolled
                            ? "text-blue-700"
                            : "text-white"
                          : isScrolled
                          ? "text-gray-700 group-hover:text-blue-600"
                          : "text-white group-hover:text-blue-200"
                      }`}
                      suppressHydrationWarning
                    >
                      {item.name}
                    </span>

                    {/* Arrow indicator for active */}
                    {isActive && (
                      <div
                        className={`flex-shrink-0 transition-transform duration-200 ${
                          isScrolled ? "text-blue-600" : "text-blue-300"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
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
                    )}
                  </div>

                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-150">
                    <div
                      className={`absolute inset-0 rounded-xl animate-ping ${
                        isScrolled ? "bg-blue-400/30" : "bg-white/20"
                      }`}
                    ></div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Language and Auth Section */}
          <div
            className={`mt-8 pt-8 border-t ${
              isScrolled ? "border-gray-200" : "border-blue-700/30"
            }`}
          >
            {/* Language Selector - Using LanguageSelector component for consistency */}
            <div className="mb-6">
              <LanguageSelector isScrolled={isScrolled} isMobile={true} />
            </div>

            {/* Profile and Auth Section - Matching Desktop Design */}
            <div className="space-y-3">
              <ProfileDropdown
                isScrolled={isScrolled}
                isMobile={true}
                onAction={onClose}
              />
              <AuthButton
                isScrolled={isScrolled}
                isMobile={true}
                onLoginClick={onLoginClick || onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
