"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import FlagImage from "@/components/FlagImage";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { LANGUAGE_FLAGS } from "./Header.constants";
import { useOutsideClick } from "@/hooks/useOutsideClick";

/**
 * Reusable Language Selector Component
 * Works for both desktop and mobile views
 * @param {Object} props
 * @param {boolean} props.isScrolled - Whether header is in scrolled state
 * @param {boolean} props.isMobile - Whether to render mobile variant
 * @param {string} props.className - Additional CSS classes
 */
export default function LanguageSelector({
  isScrolled = false,
  isMobile = false,
  className = "",
}) {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const dropdownRef = useOutsideClick(() => setIsOpen(false));

  const handleLanguageChange = (language, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    changeLanguage(language.code);
    setIsOpen(false);
  };

  // Desktop variant
  if (!isMobile) {
    return (
      <div
        ref={dropdownRef}
        className={`relative language-dropdown ${className}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
            isScrolled
              ? "text-gray-700 hover:bg-gray-100"
              : "text-white hover:bg-blue-800/50"
          }`}
          title={t("header.language_selector")}
          aria-label={t("header.language_selector")}
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {currentLanguage.toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-5 flex items-center justify-center flex-shrink-0">
                <FlagImage
                  src={LANGUAGE_FLAGS[currentLanguage]}
                  alt={`${currentLang.nativeName} flag`}
                  className="w-full h-full object-cover"
                  fallback={currentLang.flag}
                  width={24}
                  height={16}
                />
              </div>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {isOpen && (
          <div
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
              isScrolled
                ? "bg-white border border-gray-200"
                : "bg-blue-800/95 backdrop-blur-md border border-blue-700/30"
            }`}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                    isScrolled
                      ? `hover:bg-gray-50 ${
                          currentLanguage === language.code
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`
                      : `hover:bg-blue-700/50 ${
                          currentLanguage === language.code
                            ? "bg-blue-600 text-white"
                            : "text-white"
                        }`
                  }`}
                  role="menuitem"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile variant - using native select element
  return (
    <div className={`mb-6 ${className}`}>
      <label
        htmlFor="language-select-mobile"
        className="flex items-center gap-3 mb-2 px-1"
      >
        <HiOutlineGlobeAlt
          className={`w-5 h-5 flex-shrink-0 ${
            isScrolled ? "text-gray-600" : "text-white"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            isScrolled ? "text-gray-700" : "text-white"
          }`}
        >
          {t("header.language_selector", "Language")}
        </span>
      </label>
      <div className="relative">
        <select
          id="language-select-mobile"
          value={currentLanguage}
          onChange={(e) => {
            const selectedLang = languages.find(
              (lang) => lang.code === e.target.value
            );
            if (selectedLang) {
              changeLanguage(selectedLang.code);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full px-4 py-3 pr-10 rounded-xl text-base font-medium transition-all duration-200 appearance-none cursor-pointer ${
            isScrolled
              ? "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              : "bg-white/10 text-white border border-white/20 hover:border-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
          }`}
          aria-label={t("header.language_selector")}
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.flag} {language.nativeName}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-5 h-5 ${
              isScrolled ? "text-gray-500" : "text-white"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

