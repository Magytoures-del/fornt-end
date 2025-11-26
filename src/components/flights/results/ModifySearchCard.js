"use client";

import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import SearchBar from "@/components/search/SearchBar";

/**
 * Modify search card component
 * Shows search form when user wants to modify search
 */
export default function ModifySearchCard({
  onClose,
  onBack,
  onSubmit,
  isRTL,
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t("flights.search.modify_search")}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {isRTL ? (
              <FaLongArrowAltRight className="w-4 h-4" />
            ) : (
              <FaLongArrowAltLeft className="w-4 h-4" />
            )}
            <span>{t("flights.search.back_to_main_search")}</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
            aria-label={t("common.close")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <SearchBar onSubmit={onSubmit} />
    </div>
  );
}



