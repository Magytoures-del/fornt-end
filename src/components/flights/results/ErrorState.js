"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

/**
 * Error state component for flight results page
 */
export default function ErrorState() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-lg">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            {t("flights.results.error.title")}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
            {t("flights.results.error.message")}
          </p>
          <Link
            href="/flights"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("flights.results.error.back_to_search")}
          </Link>
        </div>
      </div>
    </div>
  );
}



